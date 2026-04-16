import { APICallError } from "ai";
import { NextResponse } from "next/server";
import { QuestionnaireFlowService } from "@trustrespond/ai";
import { getCurrentOrgContext } from "@/lib/org";
import { reserveQuestionnaireQuota } from "@/lib/billing-quota";
import { publicErrorMessage } from "@/lib/safe-error";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { injectAnswersIntoXlsxBuffer, parseQuestionnaireXlsxBuffer } from "@trustrespond/parsers";
import { STORAGE_BUCKETS } from "@trustrespond/db";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: questionnaireId } = await context.params;
    const { orgId } = await getCurrentOrgContext();

    const userSupabase = await createSupabaseServerClient();
    try {
      await reserveQuestionnaireQuota(userSupabase, orgId);
    } catch (quotaErr) {
      const msg = quotaErr instanceof Error ? quotaErr.message : String(quotaErr);
      if (
        msg.toLowerCase().includes("quota") ||
        msg.includes("Monthly questionnaire quota exceeded")
      ) {
        return NextResponse.json(
          { ok: false, error: publicErrorMessage(quotaErr, "Monthly questionnaire quota exceeded") },
          { status: 429 }
        );
      }
      return NextResponse.json({ ok: false, error: publicErrorMessage(quotaErr) }, { status: 400 });
    }

    const db = createServiceRoleSupabaseClient();
    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Server misconfigured: SUPABASE_SERVICE_ROLE_KEY is required for AI generation" },
        { status: 500 }
      );
    }

    const { data: questionnaire, error: qError } = await db
      .from("questionnaires")
      .select("id,filename,file_type,s3_key_original")
      .eq("id", questionnaireId)
      .eq("org_id", orgId)
      .single();

    if (qError || !questionnaire) {
      return NextResponse.json(
        { ok: false, error: publicErrorMessage(qError ?? new Error("missing"), "Questionnaire not found") },
        { status: 404 }
      );
    }
    if (questionnaire.file_type !== "xlsx") {
      return NextResponse.json({ ok: false, error: "Phase 3 export currently supports .xlsx only." }, { status: 400 });
    }

    const { data: originalFile, error: downloadError } = await db.storage
      .from(STORAGE_BUCKETS.questionnaires)
      .download(questionnaire.s3_key_original);
    if (downloadError || !originalFile) {
      return NextResponse.json(
        { ok: false, error: publicErrorMessage(downloadError ?? new Error("missing"), "Unable to download questionnaire file") },
        { status: 400 }
      );
    }

    const originalBuffer = Buffer.from(await originalFile.arrayBuffer());
    const parsedSheet = await parseQuestionnaireXlsxBuffer(originalBuffer);
    const flow = new QuestionnaireFlowService();

    const drafts = await Promise.all(
      parsedSheet.questions.map((q) =>
        flow.generateDraftAnswer(db, { id: q.answerCell, questionText: q.questionText }, orgId)
      )
    );

    const injections = parsedSheet.questions.map((question, index) => ({
      sheetName: question.sheetName,
      answerCell: question.answerCell,
      answerText: drafts[index]?.answerText ?? "Manual review required."
    }));
    const completedBuffer = await injectAnswersIntoXlsxBuffer(originalBuffer, injections);
    const completedKey = `${orgId}/completed/${questionnaireId}-${Date.now()}.xlsx`;
    const { error: uploadError } = await db.storage
      .from(STORAGE_BUCKETS.questionnaires)
      .upload(completedKey, completedBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: true
      });
    if (uploadError) {
      return NextResponse.json({ ok: false, error: publicErrorMessage(uploadError) }, { status: 400 });
    }

    const autoAnswered = drafts.filter((d) => d.confidence === "high").length;
    const flaggedForReview = drafts.filter((d) => d.confidence !== "high").length;
    await db
      .from("questionnaires")
      .update({
        status: "exported",
        s3_key_completed: completedKey,
        total_questions: drafts.length,
        auto_answered: autoAnswered,
        flagged_for_review: flaggedForReview,
        completed_at: new Date().toISOString()
      })
      .eq("id", questionnaireId)
      .eq("org_id", orgId);

    await db.from("questionnaire_questions").delete().eq("questionnaire_id", questionnaireId).eq("org_id", orgId);
    await db.from("questionnaire_questions").insert(
      parsedSheet.questions.map((question, index) => ({
        org_id: orgId,
        questionnaire_id: questionnaireId,
        question_text: question.questionText,
        answer_text: drafts[index]?.answerText ?? null,
        confidence: drafts[index]?.confidence ?? "low",
        status: "generated",
        source_chunks: drafts[index]?.sourceChunks ?? [],
        cell_reference: question.answerCell
      }))
    );

    return NextResponse.json({
      ok: true,
      questionnaireId,
      completedKey,
      stats: { total: drafts.length, autoAnswered, flaggedForReview }
    });
  } catch (error) {
    const message = formatGenerateError(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

function formatGenerateError(error: unknown): string {
  if (process.env.NODE_ENV !== "development") {
    return publicErrorMessage(error, "Generation failed");
  }
  if (APICallError.isInstance(error)) {
    const bits = [error.message];
    if (error.statusCode !== undefined) bits.push(`HTTP ${error.statusCode}`);
    if (error.responseBody) bits.push(error.responseBody.slice(0, 2_000));
    if (error.url) bits.push(error.url);
    return bits.join(" | ");
  }
  if (error instanceof Error) return error.message;
  return "Generation failed";
}
