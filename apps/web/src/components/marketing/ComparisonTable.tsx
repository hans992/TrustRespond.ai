"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionBadge } from "@/components/ui/SectionBadge";

type ComparisonValue = string;

type ComparisonRow = {
  feature: string;
  trustRespond: ComparisonValue;
  conveyor: ComparisonValue;
  vanta: ComparisonValue;
  trustCloud: ComparisonValue;
};

const rows: ComparisonRow[] = [
  {
    feature: "Starting Price",
    trustRespond: "$0 (Free tier)",
    conveyor: "$9,600/year",
    vanta: "~$10,000/year",
    trustCloud: "$2,999/year",
  },
  {
    feature: "AI Questionnaire Auto-fill",
    trustRespond: "✅ Included",
    conveyor: "✅ Included",
    vanta: "⚠ Add-on",
    trustCloud: "⚠ Basic",
  },
  {
    feature: "Format-preserving Excel Export",
    trustRespond: "✅",
    conveyor: "❌",
    vanta: "❌",
    trustCloud: "❌",
  },
  {
    feature: "GDPR-native (EU data residency)",
    trustRespond: "✅",
    conveyor: "❌",
    vanta: "❌",
    trustCloud: "❌",
  },
  {
    feature: "EU AI Act Evidence Pack",
    trustRespond: "✅",
    conveyor: "❌",
    vanta: "❌",
    trustCloud: "❌",
  },
  {
    feature: "Public Trust Center",
    trustRespond: "✅",
    conveyor: "✅",
    vanta: "✅",
    trustCloud: "✅",
  },
  {
    feature: "NDA-gated Documents",
    trustRespond: "✅ Pro+",
    conveyor: "✅",
    vanta: "✅",
    trustCloud: "❌",
  },
  {
    feature: "Self-serve Onboarding",
    trustRespond: "✅",
    conveyor: "❌ (sales call)",
    vanta: "❌ (sales call)",
    trustCloud: "✅",
  },
  {
    feature: "Free Tier Available",
    trustRespond: "✅",
    conveyor: "❌",
    vanta: "❌",
    trustCloud: "❌",
  },
  {
    feature: "BYOK (Bring Your Own LLM Key)",
    trustRespond: "✅",
    conveyor: "❌",
    vanta: "❌",
    trustCloud: "❌",
  },
];

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
    <section id="comparison" className="relative bg-surface-card/20 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection delay={0}>
          <SectionBadge color="neutral">Comparison</SectionBadge>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <h2 className="mt-4 text-4xl font-bold text-gradient-hero">Built for the deal you can&apos;t afford to lose.</h2>
        </AnimatedSection>
        <AnimatedSection delay={0.16}>
          <p className="mt-4 max-w-2xl text-neutral-400">
            TrustRespond is the only tool purpose-built for SMB SaaS teams who need enterprise-grade security reviews
            without enterprise-grade pricing.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.24} className="mt-10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse overflow-hidden rounded-2xl">
              <thead>
                <tr className="border-b border-surface-border/50 bg-surface-elevated/30">
                  <th className="px-4 py-4 text-left text-sm font-semibold text-neutral-300">Feature</th>
                  <th className="border-t-2 border-accent bg-accent/10 px-4 py-4 text-left text-sm font-semibold text-accent-light">
                    TrustRespond
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-neutral-500">Conveyor</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-neutral-500">Vanta</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-neutral-500">TrustCloud</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.feature}
                    className={index % 2 === 0 ? "border-b border-surface-border/40 bg-surface-elevated/20" : "border-b border-surface-border/40"}
                  >
                    <td className="px-4 py-4 text-sm text-neutral-300">{row.feature}</td>
                    <td className="bg-accent/5 px-4 py-4 text-sm text-neutral-200">{renderCell(row.trustRespond)}</td>
                    <td className="px-4 py-4 text-sm text-neutral-300">{renderCell(row.conveyor)}</td>
                    <td className="px-4 py-4 text-sm text-neutral-300">{renderCell(row.vanta)}</td>
                    <td className="px-4 py-4 text-sm text-neutral-300">{renderCell(row.trustCloud)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>

        <p className="mt-4 text-center text-xs text-neutral-600">
          Pricing data sourced from public pricing pages as of April 2026.
        </p>
      </div>
    </section>
  );
}
