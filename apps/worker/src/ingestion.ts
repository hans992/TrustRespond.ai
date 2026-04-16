import { createClient } from "@supabase/supabase-js";
import { RAGService } from "@trustrespond/ai";
import { parsePdfToChunks } from "@trustrespond/parsers";
import {
  chunkArray,
  DOCUMENT_CHUNKS_INSERT_BATCH_SIZE,
  EMBEDDING_TEXT_BATCH_SIZE,
  STORAGE_BUCKETS,
  toPgVector
} from "@trustrespond/db";

interface IngestionArgs {
  documentId: string;
  orgId: string;
  storagePath: string;
}

export async function processKnowledgeDocumentIngestion(args: IngestionArgs) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service env vars");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const rag = new RAGService();

  const { data: file, error: downloadError } = await supabase.storage
    .from(STORAGE_BUCKETS.knowledgeBase)
    .download(args.storagePath);
  if (downloadError || !file) {
    throw new Error(`Failed to download document from storage: ${downloadError?.message ?? "Unknown error"}`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { chunks } = await parsePdfToChunks(buffer);
  if (chunks.length === 0) {
    await supabase.from("documents").update({ status: "error" }).eq("id", args.documentId).eq("org_id", args.orgId);
    throw new Error("No text content extracted from PDF.");
  }

  const allEmbeddings: number[][] = [];
  for (let i = 0; i < chunks.length; i += EMBEDDING_TEXT_BATCH_SIZE) {
    const slice = chunks.slice(i, i + EMBEDDING_TEXT_BATCH_SIZE);
    const batchEmb = await rag.generateEmbeddings(slice.map((chunk) => chunk.content));
    allEmbeddings.push(...batchEmb);
  }
  const rows = chunks.map((chunk, index) => ({
    org_id: args.orgId,
    document_id: args.documentId,
    content: chunk.content,
    metadata: chunk.metadata,
    embedding: toPgVector(allEmbeddings[index] ?? [])
  }));

  const batches = chunkArray(rows, DOCUMENT_CHUNKS_INSERT_BATCH_SIZE);
  for (let b = 0; b < batches.length; b++) {
    const { error: insertError } = await supabase.from("document_chunks").insert(batches[b]);
    if (insertError) {
      await supabase.from("documents").update({ status: "error" }).eq("id", args.documentId).eq("org_id", args.orgId);
      throw new Error(
        `Failed to insert document chunks (batch ${b + 1}/${batches.length}, ${batches[b].length} rows): ${insertError.message}`
      );
    }
  }

  await supabase
    .from("documents")
    .update({ status: "ready", page_count: chunks.length })
    .eq("id", args.documentId)
    .eq("org_id", args.orgId);

  return { chunksInserted: rows.length };
}
