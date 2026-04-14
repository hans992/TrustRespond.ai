import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/4 h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[280px] w-[280px] rounded-full bg-emerald/12 blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 h-[320px] w-[320px] rounded-full bg-emerald-900/15 blur-[100px]" />
      </div>

      <header className="relative z-10 border-b border-white/[0.06] bg-slate-950/65 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-100 transition hover:text-white">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold">
              TrustRespond<span className="text-accent">.ai</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-400 transition hover:text-emerald-light"
          >
            Back to site
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
