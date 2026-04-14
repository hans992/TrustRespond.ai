"use client";

import { AlertTriangle, Clock, TrendingDown } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { GlowButton } from "@/components/ui/GlowButton";

export function PainSection() {
  return (
    <section id="problem" className="relative overflow-hidden bg-surface-card/30 px-6 py-24">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-surface-border to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-surface-border to-transparent" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <AnimatedSection delay={0} direction="up">
          <div>
            <SectionBadge color="neutral">The Real Cost</SectionBadge>
            <h2 className="mt-4 text-4xl font-bold text-gradient-hero">
              Your CTO is spending 40 hours on a spreadsheet instead of your product.
            </h2>
            <p className="mt-4 leading-relaxed text-neutral-400">
              Every enterprise deal comes with a security questionnaire. The average is 200+ rows. Your team manually
              researches each answer, copy-pastes from old documents, and prays the formatting survives. It takes 2 weeks.
              It pulls your best engineers off the roadmap. And one formatting error can kill the deal.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                <p className="text-neutral-300">2 weeks average completion time per questionnaire</p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                <p className="text-neutral-300">1-3 engineering days lost per review cycle</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
                <p className="text-neutral-300">Deals delayed or lost due to slow security responses</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15} direction="up">
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-lg font-semibold text-neutral-50">Cost of Doing Nothing</h3>
            <p className="mt-1 text-sm text-neutral-500">Per enterprise deal, per quarter</p>

            <div className="mt-6">
              <div className="flex justify-between border-b border-surface-border/50 py-3 text-sm">
                <span className="text-neutral-400">CTO time (40 hrs x $200/hr)</span>
                <span className="text-neutral-200">$8,000</span>
              </div>
              <div className="flex justify-between border-b border-surface-border/50 py-3 text-sm">
                <span className="text-neutral-400">Delayed deal close (avg 14 days)</span>
                <span className="text-neutral-200">$47,000 at risk</span>
              </div>
              <div className="flex justify-between border-b border-surface-border/50 py-3 text-sm">
                <span className="text-neutral-400">Opportunity cost (features not shipped)</span>
                <span className="text-neutral-200">Immeasurable</span>
              </div>
              <div className="flex justify-between border-b border-surface-border/50 py-3 text-sm">
                <span className="text-neutral-400">Deals lost to faster competitors</span>
                <span className="text-neutral-200">1-2 per quarter</span>
              </div>

              <div className="mt-2 flex justify-between pt-2">
                <span className="text-neutral-300">Total quarterly exposure</span>
                <span className="text-xl font-bold text-red-400">$55,000+</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-neutral-500">TrustRespond pays for itself on the first questionnaire.</p>
              <div className="mt-3">
                <GlowButton variant="primary" size="md" href="/signup">
                  Start Free Trial - No Credit Card
                </GlowButton>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
