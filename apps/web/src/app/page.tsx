"use client";

import { motion } from "framer-motion";
import { Database, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { StatsBar } from "@/components/marketing/StatsBar";
import { GlowButton } from "@/components/ui/GlowButton";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const steps = [
  {
    title: "Upload your brain",
    description: "Securely upload your SOC2, ISO27001, and past questionnaires.",
    icon: Database
  },
  {
    title: "Upload the chaotic Excel",
    description: "Drop your client’s blank 200-row .xlsx file. We read it without breaking formulas.",
    icon: FileSpreadsheet
  },
  {
    title: "Review & Export",
    description: "AI generates answers with confidence scores. Review, click export, and ship the final file.",
    icon: ShieldCheck
  }
];

const metrics = [
  { label: "Time Saved per Questionnaire", value: "80%" },
  { label: "Formatting Broken", value: "Zero" },
  { label: "Data Sovereignty", value: "100% (BYOK supported)" }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-emerald/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-6">
          <AnimatedSection delay={0}>
            <SectionBadge color="blue">AI-Powered Security Automation</SectionBadge>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              <span className="text-gradient-hero">Close Enterprise Deals</span>
              <br />
              <span className="text-gradient-blue">14 Days Faster.</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed">
              TrustRespond reads your SOC 2 reports and security policies, then auto-completes your client&apos;s 200-row
              Excel questionnaire in under 2 hours - without breaking a single formula or cell format.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <GlowButton variant="primary" size="lg" href="/signup">
                Start Free Trial
              </GlowButton>
              <GlowButton variant="secondary" size="lg" href="/demo">
                Book a Demo
              </GlowButton>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <p className="text-sm text-neutral-600 mt-2">No credit card required · GDPR compliant · SOC 2 Type II in progress</p>
          </AnimatedSection>

          <AnimatedSection delay={0.5} className="w-full mt-8">
            <div className="glass-card rounded-3xl p-1 w-full max-w-3xl mx-auto shadow-glow-blue/20">
              <div className="rounded-[22px] bg-surface-card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-border/50">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="flex-1 mx-4 bg-surface-elevated rounded-md px-3 py-1 text-xs text-neutral-600 text-center">
                    questionnaire_review.xlsx - TrustRespond
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  {[
                    {
                      q: "Do you have a SOC 2 Type II report?",
                      a: "Yes - issued March 2026 by Prescient Assurance",
                      confidence: 99,
                      status: "auto",
                    },
                    {
                      q: "What encryption standard is used for data at rest?",
                      a: "AES-256 encryption via AWS KMS",
                      confidence: 97,
                      status: "auto",
                    },
                    {
                      q: "Describe your incident response process.",
                      a: "Documented IRP with 4-hour RTO, tested quarterly...",
                      confidence: 91,
                      status: "auto",
                    },
                    {
                      q: "Do you support SSO/SAML 2.0?",
                      a: "Yes - Okta, Azure AD, Google Workspace",
                      confidence: 95,
                      status: "auto",
                    },
                    {
                      q: "What is your data retention policy?",
                      a: null,
                      confidence: 0,
                      status: "review",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 px-3 py-2.5 rounded-xl text-xs ${
                        row.status === "review" ? "bg-yellow-500/5 border border-yellow-500/20" : "bg-surface-elevated/50"
                      }`}
                    >
                      <span className="text-neutral-600 w-4 shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-neutral-300 flex-1 leading-relaxed">{row.q}</span>
                      {row.a ? (
                        <span className="text-emerald-light flex-1 leading-relaxed">{row.a}</span>
                      ) : (
                        <span className="text-yellow-400/70 flex-1 italic">Needs review</span>
                      )}
                      {row.confidence > 0 && <span className="text-emerald/70 font-mono shrink-0">{row.confidence}%</span>}
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2.5 border-t border-surface-border/50 flex items-center justify-between text-xs text-neutral-600">
                  <span>
                    247 questions - <span className="text-emerald-light">94% auto-completed</span> - 14 need review
                  </span>
                  <span className="text-accent-light cursor-pointer hover:underline">Export .xlsx -&gt;</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <StatsBar />

      <section id="features" className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">How It Works</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-400">
          A premium, deterministic workflow that keeps your client&apos;s original spreadsheet intact.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_0_32px_-18px_rgba(16,185,129,0.35)]"
              >
                <div className="inline-flex rounded-lg border border-emerald-300/20 bg-emerald-500/10 p-2 text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="security" className="border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">ROI You Can Defend in the Boardroom</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 text-center"
              >
                <p className="text-3xl font-semibold text-emerald-300">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-400">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
