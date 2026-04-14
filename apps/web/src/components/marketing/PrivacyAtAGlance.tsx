import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionBadge } from "@/components/ui/SectionBadge";

const items = [
  {
    title: "Controller",
    body: (
      <>
        The operator of TrustRespond.ai. Contact:{" "}
        <a href="mailto:privacy@trustrespond.ai" className="text-accent-light hover:underline">
          privacy@trustrespond.ai
        </a>
        .
      </>
    ),
  },
  {
    title: "Purposes & legal bases",
    body: "Providing the product (contract), securing the site (legitimate interests), optional analytics (consent). Details in our Privacy Policy.",
  },
  {
    title: "Retention & rights",
    body: "Data is kept only as long as needed for the purposes above. You have GDPR rights including access, erasure, and portability.",
  },
  {
    title: "AI & oversight",
    body: "Suggestions are assistive; you review before export. See AI system information for EU AI Act transparency.",
  },
];

export function PrivacyAtAGlance() {
  return (
    <section id="privacy-notice" className="scroll-mt-24 border-t border-white/10 bg-surface-card/15 px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection delay={0} direction="up">
          <SectionBadge color="blue">Privacy &amp; compliance</SectionBadge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gradient-hero md:text-4xl">Privacy at a glance</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Key GDPR (Article 13) information is summarised here. The full notice is in our legal pages linked below.
          </p>
        </AnimatedSection>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <AnimatedSection key={item.title} delay={0.06} direction="up">
              <div className="rounded-2xl border border-white/10 bg-surface-elevated/40 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.12} direction="up" className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/legal/privacy-policy"
            className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent-light transition-colors hover:bg-accent/15"
          >
            Full Privacy Policy
          </Link>
          <Link
            href="/legal/cookies"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:bg-white/5"
          >
            Cookie Policy
          </Link>
          <Link
            href="/legal/ai-system-information"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:bg-white/5"
          >
            AI system information
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
