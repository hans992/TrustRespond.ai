import { NextResponse } from "next/server";
import { getCurrentOrgContext } from "@/lib/org";
import { parsePdfToChunks } from "@trustrespond/parsers";
import { RAGService } from "@trustrespond/ai";
import { STORAGE_BUCKETS } from "@trustrespond/db";

function toPgVector(values: number[]) {
  return `[${values.join(",")}]`;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ ok: false, error: "Only PDF uploads are allowed for knowledge base" }, { status: 400 });
    }

    const { supabase, userId, orgId } = await getCurrentOrgContext();
    const objectPath = `${orgId}/${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKETS.knowledgeBase).upload(objectPath, file, {
      upsert: false,
      contentType: file.type || "application/pdf"
    });

    if (uploadError) {
      return NextResponse.json({ ok: false, error: uploadError.message }, { status: 400 });
    }

    const { data: doc, error: docError } = await supabase
      .from("documents")
      .insert({
        org_id: orgId,
        uploaded_by: userId,
        filename: file.name,
        file_type: "pdf",
        s3_key: objectPath,
        status: "processing"
      })
      .select("id,filename,status")
      .single();

    if (docError) {
      return NextResponse.json({ ok: false, error: docError.message }, { status: 400 });
    }

    const { data: downloaded, error: downloadError } = await supabase.storage
      .from(STORAGE_BUCKETS.knowledgeBase)
      .download(objectPath);
    if (downloadError || !downloaded) {
      await supabase.from("documents").update({ status: "error" }).eq("id", doc.id);
      return NextResponse.json({ ok: false, error: downloadError?.message ?? "Unable to download uploaded file" }, { status: 400 });
    }

    const parsed = await parsePdfToChunks(Buffer.from(await downloaded.arrayBuffer()));
    if (parsed.chunks.length === 0) {
      await supabase.from("documents").update({ status: "error" }).eq("id", doc.id);
      return NextResponse.json({ ok: false, error: "No text extracted from PDF" }, { status: 400 });
    }

    const rag = new RAGService();
    const embeddings = await rag.generateEmbeddings(parsed.chunks.map((chunk) => chunk.content));
    const chunkRows = parsed.chunks.map((chunk, index) => ({
      org_id: orgId,
      document_id: doc.id,
      content: chunk.content,
      metadata: chunk.metadata,
      embedding: toPgVector(embeddings[index] ?? [])
    }));
    const { error: chunksError } = await supabase.from("document_chunks").insert(chunkRows);
    if (chunksError) {
      await supabase.from("documents").update({ status: "error" }).eq("id", doc.id);
      return NextResponse.json({ ok: false, error: chunksError.message }, { status: 400 });
    }

    await supabase.from("documents").update({ status: "ready", page_count: parsed.chunks.length }).eq("id", doc.id);

    return NextResponse.json({ ok: true, document: doc, chunksInserted: parsed.chunks.length });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
