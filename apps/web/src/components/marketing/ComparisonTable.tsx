"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { COMPARISON_ROWS } from "@/data/marketing/comparison-table";

function renderCell(value: string) {
  if (value.includes("✅")) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald" />
        <span>{value.replace("✅", "").trim() || "Included"}</span>
      </span>
    );
  }

  if (value.includes("❌")) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <XCircle className="h-4 w-4 shrink-0 text-neutral-600" />
        <span>{value.replace("❌", "").trim() || "Not available"}</span>
      </span>
    );
  }

  if (value.includes("⚠")) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <AlertCircle className="h-4 w-4 shrink-0 text-yellow-500" />
        <span>{value.replace("⚠", "").trim() || "Limited"}</span>
      </span>
    );
  }

  return value;
}

export function ComparisonTable() {
  return (
    <section id="comparison" className="relative scroll-mt-24 bg-surface-card/20 px-6 py-28 md:py-32">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection delay={0}>
          <SectionBadge color="neutral">Comparison</SectionBadge>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gradient-hero">
            Built for the deal you can&apos;t afford to lose.
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={0.16}>
          <p className="mt-4 max-w-2xl text-slate-400">
            TrustRespond is the only tool purpose-built for SMB SaaS teams who need enterprise-grade security reviews
            without enterprise-grade pricing.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.24} className="mt-12">
          <div className="overflow-x-auto rounded-2xl p-1 transition-all duration-300 hover:shadow-card-hover">
            <div className="glass-card overflow-hidden rounded-[14px] border border-white/10">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-surface-elevated/40">
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">Feature</th>
                    <th className="border-x border-t-2 border-emerald/40 bg-emerald/10 px-4 py-4 text-left text-sm font-semibold text-emerald-light">
                      TrustRespond
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-500">Conveyor</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-500">Vanta</th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-slate-500">TrustCloud</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, index) => (
                    <tr
                      key={row.feature}
                      className={
                        index % 2 === 0
                          ? "border-b border-white/[0.06] bg-surface-elevated/15"
                          : "border-b border-white/[0.06]"
                      }
                    >
                      <td className="px-4 py-4 text-sm text-slate-300">{row.feature}</td>
                      <td className="bg-emerald/5 px-4 py-4 text-sm text-slate-200">{renderCell(row.trustRespond)}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">{renderCell(row.conveyor)}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">{renderCell(row.vanta)}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">{renderCell(row.trustCloud)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>

        <p className="mt-6 text-center text-xs text-slate-600">
          Pricing data sourced from public pricing pages as of April 2026.
        </p>
      </div>
    </section>
  );
}
