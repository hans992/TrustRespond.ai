"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { FileDropZone } from "@/components/ui/FileDropZone";
import { GlowButton } from "@/components/ui/GlowButton";

const alertBase = "rounded-xl border px-4 py-3 text-sm";
const successClass = `${alertBase} border-emerald-500/25 bg-emerald-500/10 text-emerald-100`;
const errorClass = `${alertBase} border-red-500/30 bg-red-950/40 text-red-100`;

const clearLinkClass =
  "shrink-0 text-sm text-red-400 underline-offset-2 transition hover:text-red-300 hover:underline";

export function KnowledgeUploadForm() {
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
      setSelectedFileName(null);
    } catch {
      setNotice({ kind: "error", text: "Network error — try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="mt-6 space-y-6" encType="multipart/form-data">
      <FileDropZone
        name="file"
        accept=".pdf,application/pdf"
        required
        disabled={pending}
        title="Drop PDF here or click to browse"
        hint="Accepted: PDF · Max size per your plan"
        fileName={selectedFileName}
        onChange={onFileChange}
      />
      <GlowButton type="submit" size="md" disabled={pending}>
        {pending ? "Uploading…" : "Upload PDF"}
      </GlowButton>
      {notice?.kind === "success" ? (
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
      ) : notice?.kind === "error" ? (
        <p role="alert" className={errorClass}>
          {notice.text}
        </p>
      ) : null}
    </form>
  );
}
