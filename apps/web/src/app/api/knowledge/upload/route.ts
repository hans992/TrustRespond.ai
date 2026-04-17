import { NextResponse } from "next/server";
import { getCurrentOrgContext } from "@/lib/org";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import { ingestKnowledgeDocumentFromPdfBuffer, KnowledgeEmbeddingError } from "@trustrespond/ai";
import { STORAGE_BUCKETS } from "@trustrespond/db";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-limits";
import { publicErrorMessage } from "@/lib/safe-error";

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

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { ok: false, error: `File too large (max ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))} MB)` },
        { status: 413 }
      );
    }

    const { userId, orgId } = await getCurrentOrgContext();

    const db = createServiceRoleSupabaseClient();
    if (!db) {
      return NextResponse.json({ ok: false, error: "Server misconfigured: SUPABASE_SERVICE_ROLE_KEY is required for ingestion" }, { status: 500 });
    }

    const objectPath = `${orgId}/${crypto.randomUUID()}-${file.name}`;

    // Storage `objects` rows use policies that reference `current_org_id()`; bulk metadata writes can hit DB limits.
    // Service role bypasses RLS — we only write under `${orgId}/...` for the authenticated user resolved above.
    const { error: uploadError } = await db.storage.from(STORAGE_BUCKETS.knowledgeBase).upload(objectPath, file, {
      upsert: false,
      contentType: file.type || "application/pdf"
    });

    if (uploadError) {
      return NextResponse.json({ ok: false, error: `storage upload: ${publicErrorMessage(uploadError)}` }, { status: 400 });
    }

    const { data: doc, error: docError } = await db
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
      return NextResponse.json({ ok: false, error: `document insert: ${publicErrorMessage(docError)}` }, { status: 400 });
    }

    const { data: downloaded, error: downloadError } = await db.storage.from(STORAGE_BUCKETS.knowledgeBase).download(objectPath);
    if (downloadError || !downloaded) {
      await db.from("documents").update({ status: "error" }).eq("id", doc.id);
      return NextResponse.json(
        { ok: false, error: publicErrorMessage(downloadError ?? new Error("download"), "Unable to download uploaded file") },
        { status: 400 }
      );
    }

    try {
      const buffer = Buffer.from(await downloaded.arrayBuffer());
      const { chunksInserted } = await ingestKnowledgeDocumentFromPdfBuffer(db, {
        orgId,
        documentId: doc.id,
        buffer
      });
      return NextResponse.json({ ok: true, document: doc, chunksInserted });
    } catch (ingestErr) {
      if (ingestErr instanceof KnowledgeEmbeddingError) {
        const msg = publicErrorMessage(ingestErr, "Embedding generation failed");
        return NextResponse.json(
          {
            ok: false,
            error:
              process.env.NODE_ENV === "development"
                ? `embedding generation failed (check GOOGLE_GENERATIVE_AI_API_KEY / model access): ${msg}`
                : msg
          },
          { status: 502 }
        );
      }
      const msg = publicErrorMessage(ingestErr, "Ingestion failed");
      if (String((ingestErr as Error)?.message ?? "").includes("No text extracted from PDF")) {
        return NextResponse.json({ ok: false, error: "No text extracted from PDF" }, { status: 400 });
      }
      if (String((ingestErr as Error)?.message ?? "").includes("PDF parse failed")) {
        return NextResponse.json({ ok: false, error: `pdf parse: ${msg}` }, { status: 400 });
      }
      if (String((ingestErr as Error)?.message ?? "").includes("Failed inserting embedding batch")) {
        return NextResponse.json({ ok: false, error: msg }, { status: 400 });
      }
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
  } catch (error) {
    const msg = publicErrorMessage(error, "Upload failed");
    return NextResponse.json({ ok: false, error: `upload handler: ${msg}` }, { status: 500 });
  }
}
