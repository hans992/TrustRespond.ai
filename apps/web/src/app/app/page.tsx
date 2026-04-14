import { GlowButton } from "@/components/ui/GlowButton";

const dropzoneClass =
  "group relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-slate-950/30 px-6 py-8 text-center transition hover:border-emerald/35 hover:bg-slate-950/50";
const fileInputClass = "sr-only";
const textFieldClass =
  "w-full max-w-md rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50";

export default function WorkspacePage() {
  return (
    <main>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
          TrustRespond Workspace
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Upload source security docs, process questionnaires, and publish a trust center.
        </p>
        <ul className="mt-6 grid gap-2 text-sm text-slate-400 md:max-w-xl">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
            Knowledge base ingestion queue and status
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
            Questionnaire processing and confidence review
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
            Billing usage and quota controls
          </li>
        </ul>
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        <section className="glass-card noise-overlay rounded-3xl p-8">
          <h2 className="text-lg font-semibold text-slate-100">
            Knowledge Base Upload (PDF)
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            SOC 2 reports, policies, and other PDFs for your knowledge base.
          </p>
          <form
            action="/api/knowledge/upload"
            method="post"
            encType="multipart/form-data"
            className="mt-6 space-y-6"
          >
            <label className={dropzoneClass}>
              <input
                name="file"
                type="file"
                accept=".pdf,application/pdf"
                required
                className={fileInputClass}
              />
              <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-light">
                Drop PDF here or click to browse
              </span>
              <span className="text-xs text-slate-500">
                Accepted: PDF · Max size per your plan
              </span>
            </label>
            <GlowButton type="submit" size="md">
              Upload PDF
            </GlowButton>
          </form>
        </section>

        <section className="glass-card noise-overlay rounded-3xl p-8">
          <h2 className="text-lg font-semibold text-slate-100">
            Questionnaire Upload
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Vendor questionnaires as Excel, CSV, or Word.
          </p>
          <form
            action="/api/questionnaires/upload"
            method="post"
            encType="multipart/form-data"
            className="mt-6 space-y-6"
          >
            <label className="grid gap-2 text-sm">
              <span className="text-slate-300">Prospect name</span>
              <input
                name="prospectName"
                type="text"
                placeholder="Prospect name"
                className={textFieldClass}
              />
            </label>
            <label className={dropzoneClass}>
              <input
                name="file"
                type="file"
                accept=".xlsx,.csv,.docx"
                required
                className={fileInputClass}
              />
              <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-light">
                Drop questionnaire file or click to browse
              </span>
              <span className="text-xs text-slate-500">
                Accepted: .xlsx, .csv, .docx
              </span>
            </label>
            <GlowButton type="submit" size="md">
              Upload Questionnaire
            </GlowButton>
          </form>
        </section>
      </div>
    </main>
  );
}
