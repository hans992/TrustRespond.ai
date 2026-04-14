/**
 * Rows per Supabase `.insert()` for `document_chunks` (payload / parameter limits).
 * Ingestion uses the service role so RLS does not apply; large batches are OK—tune if Postgres still complains.
 */
export const DOCUMENT_CHUNKS_INSERT_BATCH_SIZE = 75;

/** Strings per `embedMany()` call when embedding PDF chunk text (keeps AI + memory sane). */
export const EMBEDDING_TEXT_BATCH_SIZE = 40;

export function chunkArray<T>(items: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error("chunk size must be a positive integer");
  }
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}
