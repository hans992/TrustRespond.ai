import { createClient } from "@supabase/supabase-js";
import { ingestKnowledgeDocumentFromPdfBuffer } from "@trustrespond/ai";
import { STORAGE_BUCKETS } from "@trustrespond/db";

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

  const { data: file, error: downloadError } = await supabase.storage
    .from(STORAGE_BUCKETS.knowledgeBase)
    .download(args.storagePath);
  if (downloadError || !file) {
    throw new Error(`Failed to download document from storage: ${downloadError?.message ?? "Unknown error"}`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return ingestKnowledgeDocumentFromPdfBuffer(supabase, {
    orgId: args.orgId,
    documentId: args.documentId,
    buffer
  });
}
