"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Database, FileSpreadsheet, Hexagon, ShieldCheck, Triangle } from "lucide-react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

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
      <section className="relative overflow-hidden border-b border-white/10 bg-grid-white/[0.02] pt-16">
        <div className="pointer-events-none absolute left-1/2 top-28 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]" />
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-24 text-center sm:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
          >
            Close Enterprise Deals 14 Days Faster.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-3xl text-pretty text-lg text-slate-300"
          >
            Automate your 200-row security questionnaires in hours, not weeks. TrustRespond.ai reads your SOC2/policies and
            flawlessly injects answers directly into your client&apos;s exact Excel templates.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
            className="mt-10"
          >
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center rounded-xl border border-emerald-300/30 bg-gradient-to-r from-emerald-500 to-emerald-400 px-7 py-3 text-sm font-medium text-slate-950 transition hover:from-emerald-400 hover:to-emerald-300 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.45)]"
            >
              Start Automating Questionnaires
            </Link>
          </motion.div>
          <div className="mt-10 flex flex-col items-center gap-4 text-sm text-slate-400">
            <p>Trusted by fast-growing EU SaaS teams</p>
            <div className="flex items-center gap-6 text-slate-500">
              <Hexagon className="h-5 w-5" />
              <Triangle className="h-5 w-5" />
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

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
