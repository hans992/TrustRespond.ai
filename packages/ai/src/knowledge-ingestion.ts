import type { SupabaseClient } from "@supabase/supabase-js";
import { parsePdfToChunks } from "@trustrespond/parsers";
import {
  chunkArray,
  DOCUMENT_CHUNKS_INSERT_BATCH_SIZE,
  EMBEDDING_TEXT_BATCH_SIZE,
  toPgVector
} from "@trustrespond/db";
import { RAGService } from "./rag";

/** Thrown when embedding batches fail; callers may map to HTTP 502. */
export class KnowledgeEmbeddingError extends Error {
  constructor(cause: unknown) {
    const message = cause instanceof Error ? cause.message : "Embedding generation failed";
    super(message, { cause });
    this.name = "KnowledgeEmbeddingError";
  }
}

/**
 * Parses a PDF buffer, embeds chunks, inserts rows, and marks the document ready.
 * On failure, sets `documents.status` to `error` when applicable.
 */
export async function ingestKnowledgeDocumentFromPdfBuffer(
  supabase: SupabaseClient,
  args: { orgId: string; documentId: string; buffer: Buffer }
): Promise<{ chunksInserted: number }> {
  const { orgId, documentId, buffer } = args;

  async function markDocumentError() {
    await supabase.from("documents").update({ status: "error" }).eq("id", documentId).eq("org_id", orgId);
  }

  let parsed;
  try {
    parsed = await parsePdfToChunks(buffer);
  } catch (err) {
    await markDocumentError();
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`PDF parse failed: ${detail}`, { cause: err instanceof Error ? err : undefined });
  }

  if (parsed.chunks.length === 0) {
    await markDocumentError();
    throw new Error("No text extracted from PDF");
  }

  const rag = new RAGService();
  const allEmbeddings: number[][] = [];
  try {
    for (let i = 0; i < parsed.chunks.length; i += EMBEDDING_TEXT_BATCH_SIZE) {
      const slice = parsed.chunks.slice(i, i + EMBEDDING_TEXT_BATCH_SIZE);
      const batchEmb = await rag.generateEmbeddings(slice.map((chunk) => chunk.content));
      allEmbeddings.push(...batchEmb);
    }
  } catch (embedErr) {
    await markDocumentError();
    throw new KnowledgeEmbeddingError(embedErr);
  }

  const chunkRows = parsed.chunks.map((chunk, index) => ({
    org_id: orgId,
    document_id: documentId,
    content: chunk.content,
    metadata: chunk.metadata,
    embedding: toPgVector(allEmbeddings[index] ?? [])
  }));

  const batches = chunkArray(chunkRows, DOCUMENT_CHUNKS_INSERT_BATCH_SIZE);
  for (let b = 0; b < batches.length; b++) {
    const { error: chunksError } = await supabase.from("document_chunks").insert(batches[b]);
    if (chunksError) {
      await markDocumentError();
      throw new Error(
        `Failed inserting embedding batch ${b + 1}/${batches.length} (${batches[b].length} rows): ${chunksError.message}`
      );
    }
  }

  await supabase
    .from("documents")
    .update({ status: "ready", page_count: parsed.chunks.length })
    .eq("id", documentId)
    .eq("org_id", orgId);

  return { chunksInserted: parsed.chunks.length };
}
