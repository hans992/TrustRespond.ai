"use client";

import { useState } from "react";
import { AppShell, ConfidenceBadge } from "@trustrespond/ui";

type ParseResult = {
  questionnaireId: string;
  filename: string;
  detected: {
    sheetName: string;
    questionCount: number;
    questionColumn: { index: number; letter: string; header: string };
    answerColumn: { index: number; letter: string; header: string };
  };
};

export default function ReviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [prospectName, setProspectName] = useState("");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [busy, setBusy] = useState<"idle" | "parsing" | "generating" | "exporting">("idle");
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [generationStats, setGenerationStats] = useState<{ total: number; autoAnswered: number; flaggedForReview: number } | null>(null);

  async function handleDryRunParse() {
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
  }

  async function handleConfirmAndGenerate() {
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
  }

  return (
    <AppShell>
      <main style={{ maxWidth: 880, margin: "0 auto", padding: 24 }}>
        <h1 style={{ marginBottom: 8 }}>Mapping Confirmation</h1>
        <p style={{ color: "#64748b", marginTop: 0 }}>
          Upload your Excel questionnaire, confirm our mapping, then start AI generation.
        </p>

        <section style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 8px rgba(15,23,42,0.08)", padding: 20, marginTop: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>Prospect Name (optional)</label>
          <input
            value={prospectName}
            onChange={(e) => setProspectName(e.target.value)}
            placeholder="Fortune 500 Prospect"
            style={{ width: "100%", maxWidth: 380, marginBottom: 12, padding: 10, border: "1px solid #dbe3ee", borderRadius: 8 }}
          />
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <button
              onClick={handleDryRunParse}
              disabled={!file || busy !== "idle"}
              style={{ background: "#0a1628", color: "white", border: 0, borderRadius: 8, padding: "10px 14px", cursor: "pointer" }}
            >
              {busy === "parsing" ? "Analyzing..." : "Run Dry-Run Parse"}
            </button>
          </div>
        </section>

        {parseResult && (
          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 8px rgba(15,23,42,0.08)", padding: 20, marginTop: 16 }}>
            <h2 style={{ marginTop: 0 }}>Detected Mapping</h2>
            <p style={{ marginBottom: 8 }}>
              We detected <strong>{parseResult.detected.questionCount}</strong> questions in sheet <strong>{parseResult.detected.sheetName}</strong>.
            </p>
            <p style={{ marginTop: 0 }}>
              Questions are in column <strong>{parseResult.detected.questionColumn.header}</strong> ({parseResult.detected.questionColumn.letter},
              index {parseResult.detected.questionColumn.index}). Answers will be written to <strong>{parseResult.detected.answerColumn.header}</strong> (
              {parseResult.detected.answerColumn.letter}, index {parseResult.detected.answerColumn.index}).
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
              <span>Confidence</span>
              <ConfidenceBadge level="high" />
            </div>
            <button
              onClick={handleConfirmAndGenerate}
              disabled={busy !== "idle"}
              style={{ marginTop: 16, background: "#10b981", color: "white", border: 0, borderRadius: 8, padding: "10px 14px", cursor: "pointer" }}
            >
              {busy === "generating" ? "Generating Answers..." : busy === "exporting" ? "Preparing Download..." : "Confirm & Start AI Generation"}
            </button>
          </section>
        )}

        {generationStats && (
          <section style={{ background: "#f8fafc", borderRadius: 12, border: "1px solid #dbe3ee", padding: 20, marginTop: 16 }}>
            <h2 style={{ marginTop: 0 }}>Generation Complete</h2>
            <p style={{ margin: 0 }}>
              Total: {generationStats.total} | Auto-answered: {generationStats.autoAnswered} | Flagged for review:{" "}
              {generationStats.flaggedForReview}
            </p>
          </section>
        )}

        {downloadUrl && (
          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 8px rgba(15,23,42,0.08)", padding: 20, marginTop: 16 }}>
            <h2 style={{ marginTop: 0 }}>Your Completed File Is Ready</h2>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-block", background: "#3b82f6", color: "white", padding: "10px 14px", borderRadius: 8 }}
            >
              Download Completed Excel
            </a>
          </section>
        )}

        {error && (
          <p style={{ color: "#ef4444", marginTop: 16 }}>
            {error}
          </p>
        )}
      </main>
    </AppShell>
  );
}
