import { NextResponse } from "next/server";
import { getCurrentOrgContext } from "@/lib/org";

function resolveQuestionnaireType(filename: string): "xlsx" | "csv" | "docx" | null {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".xlsx")) return "xlsx";
  if (lower.endsWith(".csv")) return "csv";
  if (lower.endsWith(".docx")) return "docx";
  return null;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const prospectName = String(form.get("prospectName") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }

    const fileType = resolveQuestionnaireType(file.name);
    if (!fileType) {
      return NextResponse.json({ ok: false, error: "Supported formats: .xlsx, .csv, .docx" }, { status: 400 });
    }

    const { supabase, userId, orgId } = await getCurrentOrgContext();
    const objectPath = `${orgId}/${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from("questionnaires").upload(objectPath, file, {
      upsert: false,
      contentType: file.type || "application/octet-stream"
    });
    if (uploadError) {
      return NextResponse.json({ ok: false, error: uploadError.message }, { status: 400 });
    }

    const { data: questionnaire, error: dbError } = await supabase
      .from("questionnaires")
      .insert({
        org_id: orgId,
        uploaded_by: userId,
        prospect_name: prospectName || null,
        filename: file.name,
        file_type: fileType,
        s3_key_original: objectPath,
        status: "uploaded"
      })
      .select("id,filename,status,file_type")
      .single();

    if (dbError) {
      return NextResponse.json({ ok: false, error: dbError.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, questionnaire });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
