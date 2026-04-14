import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

const articleClass =
  "mx-auto max-w-3xl px-6 py-12 text-[15px] leading-relaxed text-slate-300 [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-neutral-100 [&_h2]:first:mt-0 [&_h3]:mt-8 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-[0.06em] [&_h3]:text-slate-500 [&_p]:mt-4 [&_p]:first:mt-0 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_li]:marker:text-slate-500 [&_strong]:font-semibold [&_strong]:text-neutral-200 [&_a]:text-accent-light [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-accent [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:text-sm [&_th]:border [&_th]:border-white/10 [&_th]:bg-surface-elevated/80 [&_th]:px-3 [&_th]:py-2 [&_td]:border [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-2";

type LegalPageShellProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalPageShell({ title, lastUpdated, children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-surface-card/40">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-accent-light"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Back to home
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-neutral-50 md:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: {lastUpdated}</p>
        </div>
      </header>
      <article className={articleClass}>{children}</article>
    </div>
  );
}
