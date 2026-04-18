"use client";

import { useCallback, useEffect, useState } from "react";

export type ParseResult = {
  questionnaireId: string;
  filename: string;
  detected: {
    sheetName: string;
    questionCount: number;
    questionColumn: { index: number; letter: string; header: string };
    answerColumn: { index: number; letter: string; header: string };
  };
};

export type BusyState = "idle" | "parsing" | "generating" | "exporting";

export type UseReviewWorkflowOptions = {
  /** Load mapping from a questionnaire already uploaded on the workspace (query param). */
  initialQuestionnaireId?: string | null;
};

export function useReviewWorkflow(options?: UseReviewWorkflowOptions) {
  const initialQuestionnaireId = options?.initialQuestionnaireId?.trim() || null;

  const [file, setFile] = useState<File | null>(null);
  const [prospectName, setProspectName] = useState("");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [busy, setBusy] = useState<BusyState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [generationStats, setGenerationStats] = useState<{
    total: number;
    autoAnswered: number;
    flaggedForReview: number;
  } | null>(null);

  const [bootstrapBusy, setBootstrapBusy] = useState(Boolean(initialQuestionnaireId));
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialQuestionnaireId) {
      setBootstrapBusy(false);
      return;
    }

    let cancelled = false;
    setBootstrapBusy(true);
    setBootstrapError(null);

    void (async () => {
      try {
        const res = await fetch(`/api/questionnaires/${initialQuestionnaireId}/mapping`);
        const json = (await res.json()) as { ok: boolean; error?: string } & Partial<ParseResult> & {
          prospectName?: string;
        };
        if (cancelled) return;
        if (!res.ok || !json.ok || !json.questionnaireId || !json.detected || !json.filename) {
          setBootstrapError(json.error ?? "Could not load questionnaire mapping.");
          setBootstrapBusy(false);
          return;
        }
        setParseResult({
          questionnaireId: json.questionnaireId,
          filename: json.filename,
          detected: json.detected
        });
        if (typeof json.prospectName === "string") {
          setProspectName(json.prospectName);
        }
      } catch {
        if (!cancelled) setBootstrapError("Network error — try again or upload a file below.");
      } finally {
        if (!cancelled) setBootstrapBusy(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialQuestionnaireId]);

  const busyActive = bootstrapBusy || busy !== "idle";

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      setParseResult(null);
      setDownloadUrl(null);
      setGenerationStats(null);
      setError(null);
    }
  }, []);

  const handleDryRunParse = useCallback(async () => {
    if (!file) return;
    setBusy("parsing");
    setError(null);
    setDownloadUrl(null);
    const form = new FormData();
    form.append("file", file);
    if (prospectName.trim()) form.append("prospectName", prospectName.trim());

    const res = await fetch("/api/questionnaires/parse", { method: "POST", body: form });
    const json = (await res.json()) as { ok: boolean; error?: string } & ParseResult;
    if (!json.ok) {
      setError(json.error ?? "Unable to parse questionnaire.");
      setBusy("idle");
      return;
    }
    setParseResult(json);
    setBusy("idle");
  }, [file, prospectName]);

  const handleConfirmAndGenerate = useCallback(async () => {
    if (!parseResult?.questionnaireId) return;
    setBusy("generating");
    setError(null);

    const generateRes = await fetch(`/api/questionnaires/${parseResult.questionnaireId}/generate`, {
      method: "POST"
    });
    const generateJson = (await generateRes.json()) as {
      ok: boolean;
      error?: string;
      stats?: { total: number; autoAnswered: number; flaggedForReview: number };
    };

    if (!generateJson.ok) {
      setError(generateJson.error ?? "AI generation failed.");
      setBusy("idle");
      return;
    }
    setGenerationStats(generateJson.stats ?? null);

    setBusy("exporting");
    const exportRes = await fetch(`/api/questionnaires/${parseResult.questionnaireId}/export`, { method: "POST" });
    const exportJson = (await exportRes.json()) as { ok: boolean; error?: string; url?: string };
    if (!exportJson.ok || !exportJson.url) {
      setError(exportJson.error ?? "Could not generate download link.");
      setBusy("idle");
      return;
    }
    setDownloadUrl(exportJson.url);
    setBusy("idle");
  }, [parseResult]);

  return {
    file,
    handleFileChange,
    prospectName,
    setProspectName,
    parseResult,
    busy,
    error,
    bootstrapError,
    downloadUrl,
    generationStats,
    busyActive,
    handleDryRunParse,
    handleConfirmAndGenerate,
    loadedFromWorkspace: Boolean(initialQuestionnaireId && parseResult && !file)
  };
}
