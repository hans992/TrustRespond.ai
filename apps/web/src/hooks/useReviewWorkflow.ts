"use client";

import { useCallback, useState } from "react";

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

export function useReviewWorkflow() {
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

  const busyActive = busy !== "idle";

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
    setFile,
    prospectName,
    setProspectName,
    parseResult,
    busy,
    error,
    downloadUrl,
    generationStats,
    busyActive,
    handleDryRunParse,
    handleConfirmAndGenerate
  };
}
