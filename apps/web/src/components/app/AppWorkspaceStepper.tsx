"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

const STEPS = [
  { step: 1, href: "/app#knowledge", short: "Knowledge", detail: "Upload PDFs" },
  { step: 2, href: "/app#questionnaire", short: "Questionnaire", detail: "Vendor file" },
  { step: 3, href: "/app/review", short: "Review", detail: "Map & generate" },
  { step: 4, href: "/app/review#export", short: "Export", detail: "Download" }
] as const;

function useHash() {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const read = () => setHash(typeof window !== "undefined" ? window.location.hash : "");
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  return hash;
}

function getActiveStep(pathname: string, hash: string): number {
  if (pathname === "/app") {
    if (hash === "#questionnaire") return 2;
    return 1;
  }
  if (pathname === "/app/review") {
    if (hash === "#export") return 4;
    return 3;
  }
  return 1;
}

export function AppWorkspaceStepper() {
  const pathname = usePathname();
  const hash = useHash();
  const active = getActiveStep(pathname, hash || "#knowledge");

  return (
    <nav aria-label="Workspace progress" className="mb-10 w-full overflow-x-auto border-b border-white/10 pb-6">
      <ol className="flex min-w-[min(100%,780px)] items-start justify-between gap-1 sm:gap-3">
        {STEPS.map((s) => {
          const isActive = active === s.step;
          return (
            <li key={s.step} className="flex min-w-0 flex-1 flex-col items-center text-center">
              <Link
                href={s.href}
                className={clsx(
                  "flex w-full flex-col items-center rounded-xl px-1 py-2 transition-colors sm:px-2",
                  isActive ? "bg-emerald/10 ring-1 ring-emerald/35" : "opacity-75 hover:bg-white/[0.04] hover:opacity-100"
                )}
              >
                <span
                  className={clsx(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                    isActive ? "bg-emerald text-white shadow-glow-emerald" : "border border-white/15 bg-slate-900/50 text-slate-400"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {s.step}
                </span>
                <span
                  className={clsx(
                    "mt-2 text-[11px] font-semibold uppercase tracking-wide sm:text-xs",
                    isActive ? "text-emerald-light" : "text-slate-400"
                  )}
                >
                  {s.short}
                </span>
                <span className="mt-0.5 hidden text-[10px] text-slate-500 sm:block">{s.detail}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
