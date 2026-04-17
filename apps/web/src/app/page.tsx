import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { StatsBar } from "@/components/marketing/StatsBar";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { PainSection } from "@/components/marketing/PainSection";
import { TrustCenterShowcase } from "@/components/marketing/TrustCenterShowcase";
import { PricingSection } from "@/components/marketing/PricingSection";
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { FAQSection } from "@/components/marketing/FAQSection";
import { PrivacyAtAGlance } from "@/components/marketing/PrivacyAtAGlance";
import { GlowButton } from "@/components/ui/GlowButton";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="relative z-10">
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-28">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
          <div className="pointer-events-none absolute left-1/2 top-1/4 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-emerald/10 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-1/3 left-1/4 h-[360px] w-[360px] rounded-full bg-emerald-900/20 blur-[100px]" />

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">
            <AnimatedSection delay={0} priority>
              <SectionBadge color="blue">AI-Powered Security Automation</SectionBadge>
            </AnimatedSection>

            <AnimatedSection delay={0.08} priority>
              <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.02em] md:text-7xl">
                <span className="text-gradient-hero">Close Enterprise Deals</span>
                <br />
                <span className="text-gradient-hero-accent">14 Days Faster.</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.16} priority>
              <p className="max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
                TrustRespond reads your SOC 2 reports and security policies, then auto-completes your client&apos;s 200-row
                Excel questionnaire in under 2 hours - without breaking a single formula or cell format.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.24} priority>
              <div className="mt-1 flex flex-col gap-3 sm:flex-row">
                <GlowButton variant="primary" size="lg" href="/auth/sign-up">
                  Start Free Trial
                </GlowButton>
                <GlowButton variant="secondary" size="lg" href="/demo">
                  Book a Demo
                </GlowButton>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.32} priority>
              <p className="mt-1 text-sm text-slate-500">
                No credit card required · GDPR compliant · SOC 2 Type II in progress
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.4} priority className="mt-2 w-full">
              <div className="group mx-auto w-full max-w-3xl rounded-3xl p-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
                <div className="glass-card rounded-[22px] p-1 shadow-none">
                  <div className="overflow-hidden rounded-[20px] bg-surface-card">
                    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                      <div className="h-3 w-3 rounded-full bg-red-500/60" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                      <div className="h-3 w-3 rounded-full bg-green-500/60" />
                      <div className="mx-4 flex-1 rounded-md bg-surface-elevated px-3 py-1 text-center text-xs text-slate-500">
                        questionnaire_review.xlsx - TrustRespond
                      </div>
                    </div>

                    <div className="space-y-1.5 p-4">
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
                          className={`flex items-start gap-3 rounded-xl px-3 py-2.5 text-xs ${
                            row.status === "review"
                              ? "border border-yellow-500/20 bg-yellow-500/5"
                              : "bg-surface-elevated/50"
                          }`}
                        >
                          <span className="mt-0.5 w-4 shrink-0 text-slate-500">{i + 1}</span>
                          <span className="flex-1 leading-relaxed text-slate-300">{row.q}</span>
                          {row.a ? (
                            <span className="flex-1 leading-relaxed text-emerald-light">{row.a}</span>
                          ) : (
                            <span className="flex-1 italic text-yellow-400/70">Needs review</span>
                          )}
                          {row.confidence > 0 && (
                            <span className="shrink-0 font-mono text-emerald/70">{row.confidence}%</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-xs text-slate-500">
                      <span>
                        200+ questions - <span className="text-emerald-light">94% auto-completed</span> - 14 need review
                      </span>
                      <span className="cursor-pointer text-accent-light transition-colors hover:text-accent hover:underline">
                        Export .xlsx -&gt;
                      </span>
                    </div>
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
        <PrivacyAtAGlance />
      </main>
      <Footer />
    </div>
  );
}
