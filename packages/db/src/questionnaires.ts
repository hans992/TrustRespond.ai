import type { SupabaseClient } from "@supabase/supabase-js";

type QuestionnaireRow = {
  id: string;
  filename: string;
  file_type: string;
  s3_key_original: string;
  prospect_name: string | null;
};

export async function fetchQuestionnaireForOrg(
  db: SupabaseClient,
  questionnaireId: string,
  orgId: string
): Promise<{ data: QuestionnaireRow | null; error: Error | null }> {
  const { data, error } = await db
    .from("questionnaires")
    .select("id,filename,file_type,s3_key_original,prospect_name")
    .eq("id", questionnaireId)
    .eq("org_id", orgId)
    .single();

  return { data: data as QuestionnaireRow | null, error };
}

export async function replaceQuestionnaireQuestions(
  db: SupabaseClient,
  args: {
    orgId: string;
    questionnaireId: string;
    rows: Array<{
      question_text: string;
      answer_text: string | null;
      confidence: "high" | "medium" | "low";
      status: "generated";
      source_chunks: string[];
      cell_reference: string;
    }>;
  }
) {
  await db.from("questionnaire_questions").delete().eq("questionnaire_id", args.questionnaireId).eq("org_id", args.orgId);
  if (args.rows.length === 0) return;
  await db.from("questionnaire_questions").insert(
    args.rows.map((row) => ({
      org_id: args.orgId,
      questionnaire_id: args.questionnaireId,
      question_text: row.question_text,
      answer_text: row.answer_text,
      confidence: row.confidence,
      status: row.status,
      source_chunks: row.source_chunks,
      cell_reference: row.cell_reference
    }))
  );
}
