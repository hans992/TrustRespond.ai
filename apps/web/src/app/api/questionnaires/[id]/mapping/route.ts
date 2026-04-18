import { NextResponse } from "next/server";
import { fetchQuestionnaireForOrg, STORAGE_BUCKETS } from "@trustrespond/db";
import { parseQuestionnaireXlsxBuffer } from "@trustrespond/parsers";
import { getCurrentOrgContext } from "@/lib/org";
import { publicErrorMessage } from "@/lib/safe-error";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

/**
 * Returns column mapping preview for a questionnaire already uploaded to the workspace
 * (no second file upload required on the review page).
 */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: questionnaireId } = await context.params;
    const { orgId } = await getCurrentOrgContext();

    const db = createServiceRoleSupabaseClient();
    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Server misconfigured: SUPABASE_SERVICE_ROLE_KEY is required" },
        { status: 500 }
      );
    }

    const { data: questionnaire, error: qError } = await fetchQuestionnaireForOrg(db, questionnaireId, orgId);
    if (qError || !questionnaire) {
      return NextResponse.json({ ok: false, error: "Questionnaire not found" }, { status: 404 });
    }

    if (questionnaire.file_type !== "xlsx") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Mapping preview on this page supports Excel (.xlsx) only. Open the review page and upload an .xlsx file to analyze, or export your sheet to .xlsx."
        },
        { status: 400 }
      );
    }

    const { data: originalFile, error: downloadError } = await db.storage
      .from(STORAGE_BUCKETS.questionnaires)
      .download(questionnaire.s3_key_original);

    if (downloadError || !originalFile) {
      return NextResponse.json(
        { ok: false, error: publicErrorMessage(downloadError ?? new Error("missing"), "Unable to download file") },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await originalFile.arrayBuffer());
    const parsed = await parseQuestionnaireXlsxBuffer(fileBuffer);

    return NextResponse.json({
      ok: true,
      questionnaireId: questionnaire.id,
      filename: questionnaire.filename,
      prospectName: questionnaire.prospect_name ?? "",
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
    const message = error instanceof Error && error.message === "Unauthorized" ? "Unauthorized" : publicErrorMessage(error, "Failed to load mapping");
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
