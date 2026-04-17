import { APICallError } from "ai";
import { NextResponse } from "next/server";
import { getCurrentOrgContext } from "@/lib/org";
import { reserveQuestionnaireQuota } from "@/lib/billing-quota";
import { publicErrorMessage } from "@/lib/safe-error";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getHttpErrorResponse, runQuestionnaireGeneratePipeline } from "@/lib/questionnaire/generate-service";

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

    try {
      const result = await runQuestionnaireGeneratePipeline(db, { orgId, questionnaireId });
      return NextResponse.json({
        ok: true,
        questionnaireId: result.questionnaireId,
        completedKey: result.completedKey,
        stats: result.stats
      });
    } catch (err) {
      const http = getHttpErrorResponse(err);
      if (http) {
        return NextResponse.json(
          { ok: false, error: publicErrorMessage(err, http.message) },
          { status: http.status }
        );
      }
      throw err;
    }
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
