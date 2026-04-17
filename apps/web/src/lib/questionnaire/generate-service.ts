import type { SupabaseClient } from "@supabase/supabase-js";
import { QuestionnaireFlowService } from "@trustrespond/ai";
import { injectAnswersIntoXlsxBuffer, parseQuestionnaireXlsxBuffer } from "@trustrespond/parsers";
import { fetchQuestionnaireForOrg, replaceQuestionnaireQuestions, STORAGE_BUCKETS } from "@trustrespond/db";
import { publicErrorMessage } from "@/lib/safe-error";

class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export type QuestionnaireGenerateSuccess = {
  questionnaireId: string;
  completedKey: string;
  stats: { total: number; autoAnswered: number; flaggedForReview: number };
};

function isHttpError(e: unknown): e is HttpError {
  return e instanceof HttpError;
}

export function getHttpErrorResponse(e: unknown): { status: number; message: string } | null {
  if (isHttpError(e)) {
    return { status: e.status, message: e.message };
  }
  return null;
}

export async function runQuestionnaireGeneratePipeline(
  db: SupabaseClient,
  args: { orgId: string; questionnaireId: string }
): Promise<QuestionnaireGenerateSuccess> {
  const { orgId, questionnaireId } = args;

  const { data: questionnaire, error: qError } = await fetchQuestionnaireForOrg(db, questionnaireId, orgId);

  if (qError || !questionnaire) {
    throw new HttpError("Questionnaire not found", 404);
  }
  if (questionnaire.file_type !== "xlsx") {
    throw new HttpError("Phase 3 export currently supports .xlsx only.", 400);
  }

  const { data: originalFile, error: downloadError } = await db.storage
    .from(STORAGE_BUCKETS.questionnaires)
    .download(questionnaire.s3_key_original);
  if (downloadError || !originalFile) {
    throw new HttpError(
      publicErrorMessage(downloadError ?? new Error("missing"), "Unable to download questionnaire file"),
      400
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
    throw new HttpError(publicErrorMessage(uploadError), 400);
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

  await replaceQuestionnaireQuestions(db, {
    orgId,
    questionnaireId,
    rows: parsedSheet.questions.map((question, index) => ({
      question_text: question.questionText,
      answer_text: drafts[index]?.answerText ?? null,
      confidence: drafts[index]?.confidence ?? "low",
      status: "generated" as const,
      source_chunks: drafts[index]?.sourceChunks ?? [],
      cell_reference: question.answerCell
    }))
  });

  return {
    questionnaireId,
    completedKey,
    stats: { total: drafts.length, autoAnswered, flaggedForReview }
  };
}
