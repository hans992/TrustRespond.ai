"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FileSpreadsheet, Upload } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionBadge } from "@/components/ui/SectionBadge";

const cardMotion = {
  rest: { y: 0 },
  hover: { y: -6 },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-28 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <AnimatedSection delay={0}>
            <SectionBadge color="emerald">How It Works</SectionBadge>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-gradient-hero md:text-5xl">
              A deterministic workflow that never breaks your client&apos;s file.
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.16}>
            <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-slate-400">
              Three steps. No manual copy-paste. No formatting errors. Just a completed questionnaire, ready to send.
            </p>
          </AnimatedSection>
        </div>

        <div className="relative mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="absolute left-1/3 right-1/3 top-1/2 z-0 hidden h-px -translate-y-1/2 bg-gradient-to-r from-accent/30 via-accent/60 to-accent/30 md:block" />

          <AnimatedSection delay={0} direction="up">
            <motion.article
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={cardMotion}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="glass-card group relative z-10 rounded-3xl border border-white/10 p-8 transition-shadow duration-300 hover:border-emerald/25 hover:shadow-card-hover"
            >
              <span className="absolute right-5 top-4 text-6xl font-black text-white/5">01</span>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                <Upload className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-50">Upload Your Knowledge Base</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Drag and drop your SOC 2 report, ISO 27001 certification, security policies, and previous questionnaires.
                TrustRespond builds a private, encrypted knowledge base from your documents.
              </p>
              <span className="mt-4 inline-block rounded-full bg-surface-elevated px-3 py-1 text-xs text-slate-500">
                PDF · DOCX · TXT · Previous .xlsx
              </span>
            </motion.article>
          </AnimatedSection>

          <AnimatedSection delay={0.15} direction="up">
            <motion.article
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={cardMotion}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="glass-card group relative z-10 rounded-3xl border border-white/10 p-8 transition-shadow duration-300 hover:border-emerald/25 hover:shadow-card-hover"
            >
              <span className="absolute right-5 top-4 text-6xl font-black text-white/5">02</span>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald/10">
                <FileSpreadsheet className="h-8 w-8 text-emerald" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-50">Upload the Client&apos;s Questionnaire</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Drop your client&apos;s blank Excel file - even if it has 200+ rows, merged cells, dropdown validations, and
                custom formatting. TrustRespond reads the structure without touching the formulas.
              </p>
              <span className="mt-4 inline-block rounded-full bg-surface-elevated px-3 py-1 text-xs text-slate-500">
                .xlsx · .csv · .docx
              </span>
            </motion.article>
          </AnimatedSection>

          <AnimatedSection delay={0.3} direction="up">
            <motion.article
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={cardMotion}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="glass-card group relative z-10 rounded-3xl border border-white/10 p-8 transition-shadow duration-300 hover:border-emerald/25 hover:shadow-card-hover"
            >
              <span className="absolute right-5 top-4 text-6xl font-black text-white/5">03</span>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
                <CheckCircle2 className="h-8 w-8 text-accent-light" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-50">Review, Approve &amp; Export</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Every AI-generated answer is shown with a confidence score. Review flagged items, approve the rest in one
                click, and export the original file - with your answers injected, formatting 100% intact.
              </p>
              <span className="mt-4 inline-block rounded-full bg-surface-elevated px-3 py-1 text-xs text-slate-500">
                Exports in original .xlsx format
              </span>
            </motion.article>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
