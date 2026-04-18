"use client";

import { useRef, useState, type FormEvent } from "react";
import { GlowButton } from "@/components/ui/GlowButton";

const dropzoneClass =
  "group relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-slate-950/30 px-6 py-8 text-center transition hover:border-emerald/35 hover:bg-slate-950/50";
const fileInputClass = "sr-only";
const textFieldClass =
  "w-full max-w-md rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50";

const alertBase = "rounded-xl border px-4 py-3 text-sm";
const successClass = `${alertBase} border-emerald-500/25 bg-emerald-500/10 text-emerald-100`;
const errorClass = `${alertBase} border-red-500/30 bg-red-950/40 text-red-100`;

const clearLinkClass =
  "shrink-0 text-sm text-red-400 underline-offset-2 transition hover:text-red-300 hover:underline";

export function QuestionnaireUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  function clearSuccess() {
    setNotice(null);
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
    } catch {
      setNotice({ kind: "error", text: "Network error — try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="mt-6 space-y-6" encType="multipart/form-data">
      <label className="grid gap-2 text-sm">
        <span className="text-slate-300">Prospect name</span>
        <input
          name="prospectName"
          type="text"
          placeholder="Prospect name"
          disabled={pending}
          className={textFieldClass}
        />
      </label>
      <label className={dropzoneClass}>
        <input
          name="file"
          type="file"
          accept=".xlsx,.csv,.docx"
          required
          disabled={pending}
          className={fileInputClass}
        />
        <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-light">
          Drop questionnaire file or click to browse
        </span>
        <span className="text-xs text-slate-500">Accepted: .xlsx, .csv, .docx</span>
      </label>
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
