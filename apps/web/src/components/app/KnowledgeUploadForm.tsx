"use client";

import { useState, type FormEvent } from "react";
import { GlowButton } from "@/components/ui/GlowButton";

const dropzoneClass =
  "group relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-slate-950/30 px-6 py-8 text-center transition hover:border-emerald/35 hover:bg-slate-950/50";
const fileInputClass = "sr-only";

const alertBase = "rounded-xl border px-4 py-3 text-sm";
const successClass = `${alertBase} border-emerald-500/25 bg-emerald-500/10 text-emerald-100`;
const errorClass = `${alertBase} border-red-500/30 bg-red-950/40 text-red-100`;

export function KnowledgeUploadForm() {
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = new FormData(form).get("file");
    if (!(file instanceof File) || file.size === 0) {
      setNotice({ kind: "error", text: "Choose a PDF file." });
      return;
    }

    setPending(true);
    setNotice(null);
    try {
      const res = await fetch("/api/knowledge/upload", {
        method: "POST",
        body: new FormData(form)
      });
      const data: { ok?: boolean; error?: string; document?: { filename?: string }; chunksInserted?: number } =
        await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setNotice({
          kind: "error",
          text: typeof data.error === "string" ? data.error : `Upload failed (${res.status})`
        });
        return;
      }
      const name = data.document?.filename ?? file.name;
      const n = data.chunksInserted ?? 0;
      setNotice({
        kind: "success",
        text: `Uploaded “${name}” — ${n} chunk${n === 1 ? "" : "s"} indexed.`
      });
      form.reset();
    } catch {
      setNotice({ kind: "error", text: "Network error — try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-6" encType="multipart/form-data">
      <label className={dropzoneClass}>
        <input
          name="file"
          type="file"
          accept=".pdf,application/pdf"
          required
          disabled={pending}
          className={fileInputClass}
        />
        <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-light">
          Drop PDF here or click to browse
        </span>
        <span className="text-xs text-slate-500">Accepted: PDF · Max size per your plan</span>
      </label>
      <GlowButton type="submit" size="md" disabled={pending}>
        {pending ? "Uploading…" : "Upload PDF"}
      </GlowButton>
      {notice ? (
        <p role="alert" className={notice.kind === "success" ? successClass : errorClass}>
          {notice.text}
        </p>
      ) : null}
    </form>
  );
}
