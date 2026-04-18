import { KnowledgeUploadForm } from "@/components/app/KnowledgeUploadForm";
import { QuestionnaireUploadForm } from "@/components/app/QuestionnaireUploadForm";

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
        <section id="knowledge" className="glass-card noise-overlay scroll-mt-28 rounded-3xl p-8">
          <h2 className="text-lg font-semibold text-slate-100">Knowledge Base Upload (PDF)</h2>
          <p className="mt-2 text-sm text-slate-400">
            SOC 2 reports, policies, and other PDFs for your knowledge base.
          </p>
          <KnowledgeUploadForm />
        </section>

        <section id="questionnaire" className="glass-card noise-overlay scroll-mt-28 rounded-3xl p-8">
          <h2 className="text-lg font-semibold text-slate-100">Questionnaire Upload</h2>
          <p className="mt-2 text-sm text-slate-400">Vendor questionnaires as Excel, CSV, or Word.</p>
          <QuestionnaireUploadForm />
        </section>
      </div>
    </main>
  );
}
