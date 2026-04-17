import { embed, embedMany, generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toPgVector, type Confidence } from "@trustrespond/db";

export interface RetrievedChunk {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
}

export interface DraftAnswer {
  questionId: string;
  answerText: string;
  confidence: Confidence;
  sourceChunks: string[];
}

export interface RAGConfig {
  embeddingModel?: string;
  generationModel?: string;
  topK?: number;
}

function defaultGenerationModelId(config: RAGConfig) {
  const fromConfig = config.generationModel?.trim();
  if (fromConfig) return fromConfig;
  const fromEnv = typeof process !== "undefined" ? process.env.GOOGLE_GENERATION_MODEL?.trim() : undefined;
  if (fromEnv) return fromEnv;
  return "gemini-2.5-flash";
}

function buildProviderModel(config: RAGConfig) {
  const id = config.embeddingModel?.trim() || "gemini-embedding-001";
  return {
    embeddingModel: google.embedding(id),
    generationModel: google(defaultGenerationModelId(config))
  };
}

function isRetriableError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return message.includes("429") || message.includes("rate") || message.includes("timeout") || message.includes("503");
}

async function withRetries<T>(fn: () => Promise<T>, retries = 3) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= retries || !isRetriableError(error)) {
        throw error;
      }
      const delay = 400 * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt += 1;
    }
  }
}

function normalizeVectorDimensions(values: number[], dimensions = 1536) {
  if (values.length === dimensions) return values;
  if (values.length > dimensions) return values.slice(0, dimensions);
  return [...values, ...new Array(dimensions - values.length).fill(0)];
}

export class RAGService {
  private readonly config: Required<RAGConfig>;

  constructor(config: RAGConfig = {}) {
    this.config = {
      embeddingModel: config.embeddingModel ?? "gemini-embedding-001",
      generationModel: config.generationModel ?? "",
      topK: config.topK ?? 5
    };
  }

  async generateEmbeddings(input: string[]) {
    const { embeddingModel } = buildProviderModel(this.config);
    const result = await withRetries(() => embedMany({ model: embeddingModel, values: input }));
    return result.embeddings.map((embedding) => normalizeVectorDimensions(embedding));
  }

  async embedQuestion(question: string) {
    const { embeddingModel } = buildProviderModel(this.config);
    const result = await withRetries(() => embed({ model: embeddingModel, value: question }));
    return normalizeVectorDimensions(result.embedding);
  }

  async retrieveChunks(
    supabase: SupabaseClient,
    question: string,
    topK = this.config.topK,
    orgIdForServiceSearch?: string
  ) {
    const vector = await this.embedQuestion(question);
    const { data, error } = orgIdForServiceSearch
      ? await supabase.rpc("match_chunks_for_org", {
          query_embedding: toPgVector(vector),
          match_count: topK,
          min_similarity: 0.2,
          p_org_id: orgIdForServiceSearch
        })
      : await supabase.rpc("match_chunks", {
          query_embedding: toPgVector(vector),
          match_count: topK,
          min_similarity: 0.2
        });
    if (error) {
      throw new Error(`Chunk retrieval failed: ${error.message}`);
    }
    return (data ?? []) as RetrievedChunk[];
  }

  async answerQuestion(
    supabase: SupabaseClient,
    questionId: string,
    questionText: string,
    orgIdForVectorSearch?: string
  ): Promise<DraftAnswer> {
    const chunks = await this.retrieveChunks(supabase, questionText, this.config.topK, orgIdForVectorSearch);
    const context = chunks.map((chunk, index) => `[#${index + 1}] ${chunk.content}`).join("\n\n");

    const { generationModel } = buildProviderModel(this.config);
    const result = await withRetries(() =>
      generateObject({
        model: generationModel,
        schema: z.object({
          answerText: z.string(),
          confidence: z.enum(["high", "medium", "low"]),
          requiresManualReview: z.boolean()
        }),
        system:
          "You are a TrustOps AI. Answer the security questionnaire strictly using the provided context. If the answer is not in the context, state that it requires manual review.",
        prompt: `Question:\n${questionText}\n\nContext:\n${context || "No relevant context found."}`
      })
    );

    const answerText = result.object.requiresManualReview
      ? `${result.object.answerText}\n\nManual review required.`
      : result.object.answerText;

    return {
      questionId,
      answerText,
      confidence: result.object.confidence,
      sourceChunks: chunks.map((chunk) => chunk.id)
    };
  }
}

export class QuestionnaireFlowService {
  private readonly rag: RAGService;

  constructor(config: RAGConfig = {}) {
    this.rag = new RAGService(config);
  }

  async generateDraftAnswer(
    supabase: SupabaseClient,
    question: { id: string; questionText: string },
    orgIdForVectorSearch?: string
  ) {
    return this.rag.answerQuestion(supabase, question.id, question.questionText, orgIdForVectorSearch);
  }
}
