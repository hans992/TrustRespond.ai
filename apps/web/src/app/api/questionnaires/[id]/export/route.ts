import { NextResponse } from "next/server";
import { getCurrentOrgContext } from "@/lib/org";
import { STORAGE_BUCKETS } from "@trustrespond/db";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { supabase, orgId } = await getCurrentOrgContext();

    const { data: questionnaire, error } = await supabase
      .from("questionnaires")
      .select("id,org_id,s3_key_completed,status")
      .eq("id", id)
      .eq("org_id", orgId)
      .single();

    if (error || !questionnaire) {
      return NextResponse.json({ ok: false, error: error?.message ?? "Questionnaire not found" }, { status: 404 });
    }
    if (!questionnaire.s3_key_completed) {
      return NextResponse.json({ ok: false, error: "Completed export is not available yet." }, { status: 400 });
    }

    const { data: signed, error: signedError } = await supabase.storage
      .from(STORAGE_BUCKETS.questionnaires)
      .createSignedUrl(questionnaire.s3_key_completed, 60 * 5);

    if (signedError || !signed?.signedUrl) {
      return NextResponse.json({ ok: false, error: signedError?.message ?? "Failed to create download URL" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, url: signed.signedUrl, expiresInSeconds: 300 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Export failed" }, { status: 500 });
  }
}
