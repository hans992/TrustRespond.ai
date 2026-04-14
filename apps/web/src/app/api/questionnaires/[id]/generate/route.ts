import { NextResponse } from "next/server";
import { QuestionnaireFlowService } from "@trustrespond/ai";
import { getCurrentOrgContext } from "@/lib/org";
import { injectAnswersIntoXlsxBuffer, parseQuestionnaireXlsxBuffer } from "@trustrespond/parsers";
import { STORAGE_BUCKETS } from "@trustrespond/db";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: questionnaireId } = await context.params;
    const { supabase, orgId } = await getCurrentOrgContext();
    const { data: questionnaire, error: qError } = await supabase
      .from("questionnaires")
      .select("id,filename,file_type,s3_key_original")
      .eq("id", questionnaireId)
      .eq("org_id", orgId)
      .single();

    if (qError || !questionnaire) {
      return NextResponse.json({ ok: false, error: qError?.message ?? "Questionnaire not found" }, { status: 404 });
    }
    if (questionnaire.file_type !== "xlsx") {
      return NextResponse.json({ ok: false, error: "Phase 3 export currently supports .xlsx only." }, { status: 400 });
    }

    const { data: originalFile, error: downloadError } = await supabase.storage
      .from(STORAGE_BUCKETS.questionnaires)
      .download(questionnaire.s3_key_original);
    if (downloadError || !originalFile) {
      return NextResponse.json({ ok: false, error: downloadError?.message ?? "Unable to download questionnaire file" }, { status: 400 });
    }

    const originalBuffer = Buffer.from(await originalFile.arrayBuffer());
    const parsedSheet = await parseQuestionnaireXlsxBuffer(originalBuffer);
    const flow = new QuestionnaireFlowService();

    const drafts = await Promise.all(parsedSheet.questions.map((q) => flow.generateDraftAnswer(supabase, { id: q.answerCell, questionText: q.questionText })));

    const injections = parsedSheet.questions.map((question, index) => ({
      sheetName: question.sheetName,
      answerCell: question.answerCell,
      answerText: drafts[index]?.answerText ?? "Manual review required."
    }));
    const completedBuffer = await injectAnswersIntoXlsxBuffer(originalBuffer, injections);
    const completedKey = `${orgId}/completed/${questionnaireId}-${Date.now()}.xlsx`;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.questionnaires)
      .upload(completedKey, completedBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: true
      });
    if (uploadError) {
      return NextResponse.json({ ok: false, error: uploadError.message }, { status: 400 });
    }

    const autoAnswered = drafts.filter((d) => d.confidence === "high").length;
    const flaggedForReview = drafts.filter((d) => d.confidence !== "high").length;
    await supabase
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

    await supabase.from("questionnaire_questions").delete().eq("questionnaire_id", questionnaireId).eq("org_id", orgId);
    await supabase.from("questionnaire_questions").insert(
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
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Generation failed" }, { status: 500 });
  }
}
