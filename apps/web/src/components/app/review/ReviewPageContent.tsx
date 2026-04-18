"use client";

import { HelpCircle, Loader2 } from "lucide-react";
import { ConfidenceBadge } from "@trustrespond/ui";
import { FileDropZone } from "@/components/ui/FileDropZone";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { useReviewWorkflow } from "@/hooks/useReviewWorkflow";

export function ReviewPageContent() {
  const {
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
  } = useReviewWorkflow();

  return (
    <main className="max-w-4xl">
      {busyActive ? (
        <div
          className="mb-8 h-1 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuetext={busy}
          aria-live="polite"
        >
          <div className="h-full w-1/3 animate-indeterminate-bar rounded-full bg-gradient-to-r from-transparent via-emerald to-transparent" />
        </div>
      ) : null}

      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100">
          Mapping Confirmation
        </h1>
        <p className="mt-2 text-slate-300">
          Upload your Excel questionnaire, confirm our mapping, then start AI generation.
        </p>
      </div>

      <section className="glass-card noise-overlay mb-6 rounded-3xl p-8">
        <label className="mb-4 block text-sm font-medium text-slate-300" htmlFor="review-prospect">
          Prospect Name (optional)
        </label>
        <Input
          id="review-prospect"
          value={prospectName}
          onChange={(e) => setProspectName(e.target.value)}
          placeholder="Fortune 500 Prospect"
          className="mb-6 max-w-md"
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap">
          <FileDropZone
            title="Excel workbook (.xlsx)"
            hint="Accepted: .xlsx · Max size per your plan"
            accept=".xlsx"
            fileName={file ? file.name : "Choose a file"}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="min-w-[200px] flex-1"
            minHeightClass="min-h-[100px]"
            aria-label="Upload Excel questionnaire workbook"
          />
          <div className="flex shrink-0 flex-col gap-1">
            <GlowButton
              variant="secondary"
              onClick={handleDryRunParse}
              disabled={!file || busy !== "idle"}
              className="shrink-0"
              aria-describedby="analyze-workbook-hint"
            >
              {busy === "parsing" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-emerald" aria-hidden />
                  Analyzing…
                </>
              ) : (
                "Analyze Workbook"
              )}
            </GlowButton>
            <p id="analyze-workbook-hint" className="max-w-[220px] text-xs leading-snug text-slate-400">
              <HelpCircle className="mr-1 inline h-3.5 w-3.5 shrink-0 text-slate-500" aria-hidden />
              Detects question and answer columns only — no AI answers yet.
            </p>
          </div>
        </div>
      </section>

      {parseResult ? (
        <section className="glass-card noise-overlay mb-6 rounded-3xl p-8">
          <h2 className="text-lg font-semibold text-slate-100">Detected Mapping</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Questions detected
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-emerald-light">
                {parseResult.detected.questionCount}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Sheet
              </p>
              <p className="mt-2 font-mono text-lg text-slate-100">{parseResult.detected.sheetName}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Column mapping
              </p>
              <div className="mt-3 grid gap-3 font-mono text-sm text-slate-300 sm:grid-cols-2">
                <div>
                  <span className="text-slate-500">Q column · </span>
                  <span className="text-emerald-light/90">{parseResult.detected.questionColumn.letter}</span>
                  <span className="text-slate-500"> · idx {parseResult.detected.questionColumn.index}</span>
                </div>
                <div>
                  <span className="text-slate-500">A column · </span>
                  <span className="text-emerald-light/90">{parseResult.detected.answerColumn.letter}</span>
                  <span className="text-slate-500"> · idx {parseResult.detected.answerColumn.index}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-slate-300">
            We detected <strong className="text-slate-100">{parseResult.detected.questionCount}</strong> questions in sheet{" "}
            <strong className="text-slate-100">{parseResult.detected.sheetName}</strong>.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Questions are in column <strong className="text-slate-100">{parseResult.detected.questionColumn.header}</strong> (
            {parseResult.detected.questionColumn.letter}, index {parseResult.detected.questionColumn.index}). Answers will be written to{" "}
            <strong className="text-slate-100">{parseResult.detected.answerColumn.header}</strong> ({parseResult.detected.answerColumn.letter}, index{" "}
            {parseResult.detected.answerColumn.index}).
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-400">Confidence</span>
            <ConfidenceBadge level="high" />
          </div>

          <div className="mt-8">
            <GlowButton onClick={handleConfirmAndGenerate} disabled={busy !== "idle"} size="lg">
              {busy === "generating" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Generating Answers...
                </>
              ) : busy === "exporting" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-emerald" aria-hidden />
                  Preparing Download...
                </>
              ) : (
                "Confirm & Start AI Generation"
              )}
            </GlowButton>
          </div>
        </section>
      ) : null}

      {generationStats ? (
        <section className="mb-6 rounded-3xl border border-emerald/25 bg-emerald/[0.06] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <h2 className="text-lg font-semibold text-emerald-light">Generation Complete</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-100">{generationStats.total}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Auto-answered</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-light">{generationStats.autoAnswered}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Flagged for review</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-amber-200">{generationStats.flaggedForReview}</p>
            </div>
          </div>
        </section>
      ) : null}

      {downloadUrl ? (
        <section id="export" className="glass-card noise-overlay scroll-mt-28 rounded-3xl p-8">
          <h2 className="text-lg font-semibold text-slate-100">Your Completed File Is Ready</h2>
          <div className="mt-6">
            <GlowButton href={downloadUrl} target="_blank" rel="noreferrer" size="lg">
              Download Completed Excel
            </GlowButton>
          </div>
        </section>
      ) : null}

      {error ? (
        <div
          className="mt-6 rounded-2xl border border-red-500/30 bg-red-950/25 px-5 py-4 text-sm text-red-200"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      ) : null}
    </main>
  );
}
