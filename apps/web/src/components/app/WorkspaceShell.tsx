import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 shadow-[0_8px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-6">
          <Link href="/app" className="inline-flex items-center gap-2 shrink-0">
            <ShieldCheck className="h-5 w-5 text-accent" aria-hidden />
            <span className="text-sm font-semibold text-neutral-50">
              TrustRespond<span className="text-accent">.ai</span>
            </span>
          </Link>

          <nav
            className="flex flex-1 items-center justify-end gap-1 sm:justify-center sm:gap-2"
            aria-label="Workspace"
          >
            <Link
              href="/app"
              className="rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-100"
            >
              Workspace
            </Link>
            <Link
              href="/app/review"
              className="rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-100"
            >
              Questionnaire review
            </Link>
          </nav>

          <Link
            href="/"
            className="hidden text-sm text-slate-500 transition hover:text-emerald-light sm:inline"
          >
            Marketing site
          </Link>
        </div>
      </header>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-90"
          aria-hidden
        >
          <div className="absolute left-[10%] top-0 h-[320px] w-[480px] rounded-full bg-accent/[0.07] blur-[100px]" />
          <div className="absolute bottom-0 right-[15%] h-[260px] w-[360px] rounded-full bg-emerald/[0.08] blur-[90px]" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
