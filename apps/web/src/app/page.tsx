"use client";

import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { StatsBar } from "@/components/marketing/StatsBar";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { PainSection } from "@/components/marketing/PainSection";
import { TrustCenterShowcase } from "@/components/marketing/TrustCenterShowcase";
import { PricingSection } from "@/components/marketing/PricingSection";
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { FAQSection } from "@/components/marketing/FAQSection";
import { GlowButton } from "@/components/ui/GlowButton";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="relative z-10">
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
              <p className="text-sm text-neutral-600 mt-2">
                No credit card required · GDPR compliant · SOC 2 Type II in progress
              </p>
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
        <HowItWorks />
        <PainSection />
        <TrustCenterShowcase />
        <PricingSection />
        <ComparisonTable />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
