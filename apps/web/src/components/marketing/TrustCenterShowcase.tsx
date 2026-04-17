"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { GlowButton } from "@/components/ui/GlowButton";

const trustCenterFeatures = [
  {
    title: "Always Up-to-Date",
    description: "Automatically reflects your latest uploaded policies and certifications.",
  },
  {
    title: "NDA-Gated Documents",
    description: "Require prospects to sign an NDA before accessing your full security documentation.",
  },
  {
    title: "Custom Domain",
    description: "Host at security.yourcompany.com for a professional, branded experience.",
  },
  {
    title: "One-Click Sharing",
    description: "Send a single link to your prospect instead of email attachments.",
  },
];

export function TrustCenterShowcase() {
  return (
    <section id="features" className="relative bg-surface-card/20 px-6 py-28 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <AnimatedSection delay={0} direction="up">
          <div>
            <SectionBadge color="blue">Trust Center</SectionBadge>
            <h2 className="mt-4 text-4xl font-bold text-gradient-hero">Your public compliance page. Built automatically.</h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              Every TrustRespond account includes a hosted Trust Center - a public-facing compliance page where prospects can
              verify your security posture, request documents, and sign NDAs before accessing sensitive policies.
            </p>

            <div className="mt-8 space-y-4">
              {trustCenterFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-100">{feature.title}</h3>
                    <p className="mt-1 text-sm text-neutral-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <GlowButton variant="primary" size="md" href="/auth/sign-up" className="mt-8">
              See a Live Example →
            </GlowButton>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15} direction="up">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="glass-card overflow-hidden rounded-3xl border border-white/10 transition-[box-shadow,border-color] duration-300 hover:border-emerald/25 hover:shadow-card-hover"
          >
            <div className="flex items-center justify-between bg-surface-elevated px-6 py-4">
              <span className="text-xs text-neutral-400">🔒 security.acmesaas.com</span>
              <span className="rounded-full bg-emerald/10 px-2 py-1 text-xs text-emerald">Verified by TrustRespond</span>
            </div>

            <div className="px-6 py-6">
              <h3 className="text-xl font-semibold text-neutral-50">AcmeSaaS Security &amp; Compliance</h3>
              <p className="mt-1 text-xs text-neutral-500">Last updated: April 2026</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs text-emerald-light">
                  SOC 2 Type II ✓
                </span>
                <span className="rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs text-emerald-light">
                  ISO 27001 ✓
                </span>
                <span className="rounded-full border border-emerald/20 bg-emerald/10 px-3 py-1 text-xs text-emerald-light">
                  GDPR Compliant ✓
                </span>
                <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-accent-light">
                  EU AI Act Ready ✓
                </span>
              </div>
              <p className="mt-3 text-[11px] leading-snug text-neutral-600">
                &quot;EU AI Act Ready&quot; reflects our transparency docs and human review workflow — not a government
                certification.{" "}
                <Link href="/legal/ai-system-information" className="text-accent-light/80 hover:text-accent-light hover:underline">
                  Details
                </Link>
              </p>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between border-b border-surface-border/30 py-2.5">
                  <span className="text-sm text-neutral-300">Security Policy</span>
                  <button type="button" className="text-xs text-accent-light">
                    Download PDF
                  </button>
                </div>
                <div className="flex items-center justify-between border-b border-surface-border/30 py-2.5">
                  <span className="text-sm text-neutral-300">Privacy Policy</span>
                  <button type="button" className="text-xs text-accent-light">
                    Download PDF
                  </button>
                </div>
                <div className="flex items-center justify-between border-b border-surface-border/30 py-2.5">
                  <span className="text-sm text-neutral-300">Penetration Test Report 2025</span>
                  <button type="button" className="text-xs text-yellow-400/70">
                    Request Access (NDA required)
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                  <div
                    className="h-full w-full animate-shimmer bg-[linear-gradient(90deg,rgba(10,132,255,0)_0%,rgba(10,132,255,0.9)_50%,rgba(10,132,255,0)_100%)] bg-[length:200%_100%]"
                    aria-hidden
                  />
                </div>
                <p className="mt-4 text-xs text-neutral-600">AI monitoring for compliance changes...</p>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
