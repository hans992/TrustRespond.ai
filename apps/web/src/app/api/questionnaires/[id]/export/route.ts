import { NextResponse } from "next/server";
import { getCurrentOrgContext } from "@/lib/org";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import { STORAGE_BUCKETS } from "@trustrespond/db";
import { publicErrorMessage } from "@/lib/safe-error";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { orgId } = await getCurrentOrgContext();

    const db = createServiceRoleSupabaseClient();
    if (!db) {
      return NextResponse.json(
        { ok: false, error: "Server misconfigured: SUPABASE_SERVICE_ROLE_KEY is required for export" },
        { status: 500 }
      );
    }

    const { data: questionnaire, error } = await db
      .from("questionnaires")
      .select("id,org_id,s3_key_completed,status")
      .eq("id", id)
      .eq("org_id", orgId)
      .single();

    if (error || !questionnaire) {
      return NextResponse.json(
        { ok: false, error: publicErrorMessage(error ?? new Error("missing"), "Questionnaire not found") },
        { status: 404 }
      );
    }
    if (!questionnaire.s3_key_completed) {
      return NextResponse.json({ ok: false, error: "Completed export is not available yet." }, { status: 400 });
    }

    const { data: signed, error: signedError } = await db.storage
      .from(STORAGE_BUCKETS.questionnaires)
      .createSignedUrl(questionnaire.s3_key_completed, 60 * 5);

    if (signedError || !signed?.signedUrl) {
      return NextResponse.json(
        { ok: false, error: publicErrorMessage(signedError ?? new Error("signed"), "Failed to create download URL") },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, url: signed.signedUrl, expiresInSeconds: 300 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: publicErrorMessage(error, "Export failed") }, { status: 500 });
  }
}
