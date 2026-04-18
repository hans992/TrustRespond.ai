"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { FileDropZone } from "@/components/ui/FileDropZone";
import { Input } from "@/components/ui/Input";
import { GlowButton } from "@/components/ui/GlowButton";

const alertBase = "rounded-xl border px-4 py-3 text-sm";
const successClass = `${alertBase} border-emerald-500/25 bg-emerald-500/10 text-emerald-100`;
const errorClass = `${alertBase} border-red-500/30 bg-red-950/40 text-red-100`;

const clearLinkClass =
  "shrink-0 text-sm text-red-400 underline-offset-2 transition hover:text-red-300 hover:underline";

export function QuestionnaireUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setSelectedFileName(f ? f.name : null);
  }

  function clearSuccess() {
    setNotice(null);
    setSelectedFileName(null);
    formRef.current?.reset();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = new FormData(form).get("file");
    if (!(file instanceof File) || file.size === 0) {
      setNotice({ kind: "error", text: "Choose a questionnaire file." });
      return;
    }

    setPending(true);
    setNotice(null);
    try {
      const res = await fetch("/api/questionnaires/upload", {
        method: "POST",
        body: new FormData(form)
      });
      const data: {
        ok?: boolean;
        error?: string;
        questionnaire?: { filename?: string; file_type?: string; status?: string };
      } = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setNotice({
          kind: "error",
          text: typeof data.error === "string" ? data.error : `Upload failed (${res.status})`
        });
        return;
      }
      const q = data.questionnaire;
      const name = q?.filename ?? file.name;
      const type = q?.file_type ? ` (${q.file_type})` : "";
      setNotice({
        kind: "success",
        text: `Uploaded “${name}”${type} — saved to your workspace.`
      });
      form.reset();
      setSelectedFileName(null);
    } catch {
      setNotice({ kind: "error", text: "Network error — try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="mt-6 space-y-6" encType="multipart/form-data">
      <label className="grid max-w-md gap-2 text-sm">
        <span className="text-slate-300">Prospect name</span>
        <Input name="prospectName" type="text" placeholder="Prospect name" disabled={pending} />
      </label>
      <FileDropZone
        name="file"
        accept=".xlsx,.csv,.docx"
        required
        disabled={pending}
        title="Drop questionnaire file or click to browse"
        hint="Accepted: .xlsx, .csv, .docx · Max size per your plan"
        fileName={selectedFileName}
        onChange={onFileChange}
      />
      <GlowButton type="submit" size="md" disabled={pending}>
        {pending ? "Uploading…" : "Upload Questionnaire"}
      </GlowButton>
      {notice?.kind === "success" ? (
        <>
          <div className={successClass}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <p role="alert" className="min-w-0 flex-1">
                {notice.text}
              </p>
              <button type="button" onClick={clearSuccess} className={clearLinkClass}>
                Clear
              </button>
            </div>
          </div>
          <GlowButton href="/app/review" variant="primary" size="md" className="w-full sm:w-auto">
            Proceed to AI Review & Generation
          </GlowButton>
        </>
      ) : notice?.kind === "error" ? (
        <p role="alert" className={errorClass}>
          {notice.text}
        </p>
      ) : null}
    </form>
  );
}
