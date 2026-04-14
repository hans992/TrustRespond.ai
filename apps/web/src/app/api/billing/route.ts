import { NextResponse } from "next/server";
import { getQuestionnaireQuotaStatus } from "@/lib/billing-quota";
import { getCurrentOrgContext } from "@/lib/org";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicErrorMessage } from "@/lib/safe-error";

/**
 * Current questionnaire quota for the signed-in user's org (UTC month).
 * Does not modify usage — reservation happens when generating AI answers.
 */
export async function GET() {
  try {
    const { orgId } = await getCurrentOrgContext();
    const supabase = await createSupabaseServerClient();
    const usage = await getQuestionnaireQuotaStatus(supabase, orgId);
    return NextResponse.json({ ok: true, usage });
  } catch (error) {
    const message = publicErrorMessage(error, "Unable to load billing usage");
    const status = message === "Unauthorized" || message.includes("not authenticated") ? 401 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
