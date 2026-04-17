"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { LayoutGroup, motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PRICING_PLANS, type PricingPlanConfig } from "@/data/marketing/pricing-plans";

type BillingCycle = "monthly" | "annual";

const cardHover = {
  rest: { y: 0 },
  hover: { y: -5 }
};

function PlanCard({
  plan,
  billingCycle,
  loadingPlanId,
  onStartCheckout
}: {
  plan: PricingPlanConfig;
  billingCycle: BillingCycle;
  loadingPlanId: string | null;
  onStartCheckout?: (planId: "starter" | "pro") => void | Promise<void>;
}) {
  const baseArticle =
    "glass-card h-full rounded-3xl p-6 transition-shadow duration-300 hover:border-emerald/20 hover:shadow-card-hover";

  const articleClass = plan.highlight
    ? "glass-card relative h-full rounded-3xl border-2 border-emerald/50 p-6 shadow-glow-emerald"
    : `${baseArticle} border border-white/10`;

  const titleClass = plan.highlight ? "text-lg font-semibold text-emerald-light" : "text-lg font-semibold text-neutral-50";

  const checkoutEnabled = (plan.id === "starter" || plan.id === "pro") && Boolean(onStartCheckout);
  const loading = checkoutEnabled && loadingPlanId === plan.id;

  const priceBlock =
    plan.price.kind === "static" ? (
      <div className="mt-4 flex items-end gap-1">
        <span className="text-4xl font-bold text-neutral-50">{plan.price.display}</span>
        {plan.price.suffix ? <span className="text-sm text-slate-500">{plan.price.suffix}</span> : null}
      </div>
    ) : (
      <div className="mt-4 flex items-end gap-1">
        <motion.span layoutId={plan.price.layoutId} className="text-4xl font-bold text-neutral-50">
          {billingCycle === "monthly" ? plan.price.monthly : plan.price.annual}
        </motion.span>
        <span className="text-sm text-slate-500">{plan.price.suffix}</span>
      </div>
    );

  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardHover}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={articleClass}
    >
      {plan.highlight ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald px-4 py-1 text-xs font-semibold text-white shadow-glow-emerald">
          Most Popular
        </span>
      ) : null}
      <h3 className={titleClass}>{plan.title}</h3>
      {priceBlock}
      <p className="mt-3 text-sm text-slate-400">{plan.description}</p>
      <ul className="mt-5 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-400">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <GlowButton
        variant={plan.cta.variant}
        size="md"
        className="mt-6 w-full"
        disabled={loading}
        onClick={
          checkoutEnabled && onStartCheckout
            ? () => {
                void onStartCheckout(plan.id);
              }
            : undefined
        }
      >
        {loading ? "Redirecting…" : plan.cta.label}
      </GlowButton>
    </motion.article>
  );
}

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  async function startCheckout(planId: "starter" | "pro") {
    setLoadingPlanId(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, billingCycle })
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        window.alert(data.error ?? "Unable to start checkout. Sign in and try again.");
        return;
      }
      window.location.href = data.url;
    } finally {
      setLoadingPlanId(null);
    }
  }

  return (
    <section id="pricing" className="relative px-6 py-28 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <AnimatedSection delay={0}>
            <SectionBadge color="blue">Pricing</SectionBadge>
          </AnimatedSection>
          <AnimatedSection delay={0.05}>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-gradient-hero md:text-5xl">
              Start free. Scale as you close deals.
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="mt-4 text-slate-400">
              Every plan includes format-preserving Excel export and GDPR-compliant data handling.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="mt-8 inline-flex items-center rounded-full border border-white/10 bg-surface-elevated/50 p-1">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={
                  billingCycle === "monthly"
                    ? "rounded-full bg-emerald px-4 py-1.5 text-sm font-medium text-white shadow-glow-emerald"
                    : "rounded-full px-4 py-1.5 text-sm text-slate-400 transition-colors hover:text-slate-200"
                }
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={
                  billingCycle === "annual"
                    ? "rounded-full bg-emerald px-4 py-1.5 text-sm font-medium text-white shadow-glow-emerald"
                    : "rounded-full px-4 py-1.5 text-sm text-slate-400 transition-colors hover:text-slate-200"
                }
              >
                Annual (save 20%)
              </button>
            </div>
          </AnimatedSection>
        </div>

        <LayoutGroup>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PRICING_PLANS.map((plan) => (
              <AnimatedSection key={plan.id} delay={plan.animatedDelay} direction="up">
                <PlanCard
                  plan={plan}
                  billingCycle={billingCycle}
                  loadingPlanId={loadingPlanId}
                  onStartCheckout={plan.id === "starter" || plan.id === "pro" ? startCheckout : undefined}
                />
              </AnimatedSection>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
