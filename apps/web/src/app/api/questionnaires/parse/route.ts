import { NextResponse } from "next/server";
import { getCurrentOrgContext } from "@/lib/org";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import { parseQuestionnaireXlsxBuffer } from "@trustrespond/parsers";
import { STORAGE_BUCKETS } from "@trustrespond/db";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-limits";
import { publicErrorMessage } from "@/lib/safe-error";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const prospectName = String(form.get("prospectName") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      return NextResponse.json({ ok: false, error: "Dry-run parse currently supports .xlsx only." }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { ok: false, error: `File too large (max ${Math.floor(MAX_UPLOAD_BYTES / (1024 * 1024))} MB)` },
        { status: 413 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const parsed = await parseQuestionnaireXlsxBuffer(fileBuffer);
    const { userId, orgId } = await getCurrentOrgContext();

    const db = createServiceRoleSupabaseClient();
    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Server misconfigured: SUPABASE_SERVICE_ROLE_KEY is required for questionnaire ingest" },
        { status: 500 }
      );
    }

    const objectPath = `${orgId}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await db.storage.from(STORAGE_BUCKETS.questionnaires).upload(objectPath, fileBuffer, {
      upsert: false,
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    if (uploadError) {
      return NextResponse.json({ ok: false, error: publicErrorMessage(uploadError) }, { status: 400 });
    }

    const { data: questionnaire, error: dbError } = await db
      .from("questionnaires")
      .insert({
        org_id: orgId,
        uploaded_by: userId,
        prospect_name: prospectName || null,
        filename: file.name,
        file_type: "xlsx",
        s3_key_original: objectPath,
        status: "uploaded"
      })
      .select("id,filename,status")
      .single();

    if (dbError || !questionnaire) {
      return NextResponse.json(
        { ok: false, error: publicErrorMessage(dbError ?? new Error("missing"), "Unable to create questionnaire record") },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      questionnaireId: questionnaire.id,
      filename: questionnaire.filename,
      detected: {
        sheetName: parsed.sheetName,
        questionCount: parsed.questions.length,
        questionColumn: {
          index: parsed.questionColumn,
          letter: parsed.questionColumnLetter,
          header: parsed.questionHeader
        },
        answerColumn: {
          index: parsed.answerColumn,
          letter: parsed.answerColumnLetter,
          header: parsed.answerHeader
        }
      }
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: publicErrorMessage(error, "Parse failed") }, { status: 500 });
  }
}
