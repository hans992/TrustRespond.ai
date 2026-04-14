"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { LayoutGroup, motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionBadge } from "@/components/ui/SectionBadge";

type BillingCycle = "monthly" | "annual";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const starterPrice = billingCycle === "monthly" ? "$299" : "$239";
  const proPrice = billingCycle === "monthly" ? "$799" : "$639";

  return (
    <section id="pricing" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <AnimatedSection delay={0}>
            <SectionBadge color="blue">Pricing</SectionBadge>
          </AnimatedSection>
          <AnimatedSection delay={0.05}>
            <h2 className="mt-4 text-4xl font-bold text-gradient-hero md:text-5xl">Start free. Scale as you close deals.</h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="mt-4 text-neutral-400">
              Every plan includes format-preserving Excel export and GDPR-compliant data handling.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="mt-8 inline-flex items-center rounded-full border border-surface-border/60 bg-surface-elevated/50 p-1">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={
                  billingCycle === "monthly"
                    ? "rounded-full bg-accent px-4 py-1.5 text-sm text-white"
                    : "px-4 py-1.5 text-sm text-neutral-400"
                }
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={
                  billingCycle === "annual"
                    ? "rounded-full bg-accent px-4 py-1.5 text-sm text-white"
                    : "px-4 py-1.5 text-sm text-neutral-400"
                }
              >
                Annual (save 20%)
              </button>
            </div>
          </AnimatedSection>
        </div>

        <LayoutGroup>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AnimatedSection delay={0} direction="up">
              <article className="glass-card rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-neutral-50">Free</h3>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold text-neutral-50">$0</span>
                  <span className="text-sm text-neutral-500">/month</span>
                </div>
                <p className="mt-3 text-sm text-neutral-400">For founders exploring the product</p>
                <ul className="mt-5 space-y-2">
                  {[
                    "1 questionnaire per month",
                    "Up to 5 policy documents",
                    "Basic Trust Center page",
                    "Excel & CSV export",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-400">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <GlowButton variant="secondary" size="md" className="mt-6 w-full">
                  Get Started Free
                </GlowButton>
              </article>
            </AnimatedSection>

            <AnimatedSection delay={0.1} direction="up">
              <article className="glass-card rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-neutral-50">Starter</h3>
                <div className="mt-4 flex items-end gap-1">
                  <motion.span layoutId="starter-price" className="text-4xl font-bold text-neutral-50">
                    {starterPrice}
                  </motion.span>
                  <span className="text-sm text-neutral-500">/month</span>
                </div>
                <p className="mt-3 text-sm text-neutral-400">For Series A teams closing enterprise deals</p>
                <ul className="mt-5 space-y-2">
                  {[
                    "10 questionnaires per month",
                    "Up to 50 policy documents",
                    "Branded Trust Center",
                    "Excel, CSV & Word export",
                    "Email support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-400">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <GlowButton variant="secondary" size="md" className="mt-6 w-full">
                  Start Free Trial
                </GlowButton>
              </article>
            </AnimatedSection>

            <AnimatedSection delay={0.2} direction="up">
              <article className="glass-card relative rounded-3xl border-2 border-accent/60 p-6 shadow-glow-blue">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
                <h3 className="text-lg font-semibold text-accent-light">Pro</h3>
                <div className="mt-4 flex items-end gap-1">
                  <motion.span layoutId="pro-price" className="text-4xl font-bold text-neutral-50">
                    {proPrice}
                  </motion.span>
                  <span className="text-sm text-neutral-500">/month</span>
                </div>
                <p className="mt-3 text-sm text-neutral-400">For scaling teams with a dedicated sales motion</p>
                <ul className="mt-5 space-y-2">
                  {[
                    "Unlimited questionnaires",
                    "Unlimited policy documents",
                    "Advanced Trust Center (NDA-gated docs)",
                    "5 team seats",
                    "EU AI Act evidence pack",
                    "Priority AI processing",
                    "Slack & HubSpot integration",
                    "Priority support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-400">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <GlowButton variant="primary" size="md" className="mt-6 w-full">
                  Start Free Trial
                </GlowButton>
              </article>
            </AnimatedSection>

            <AnimatedSection delay={0.3} direction="up">
              <article className="glass-card rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-neutral-50">Enterprise</h3>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold text-neutral-50">Custom</span>
                </div>
                <p className="mt-3 text-sm text-neutral-400">For companies with strict compliance requirements</p>
                <ul className="mt-5 space-y-2">
                  {[
                    "Everything in Pro",
                    "SSO / SAML 2.0",
                    "BYOK (Bring Your Own LLM Key)",
                    "Salesforce & HubSpot CRM sync",
                    "Dedicated account manager",
                    "SLA guarantees",
                    "On-premise RAG option",
                    "Custom data residency (EU)",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-400">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <GlowButton variant="secondary" size="md" className="mt-6 w-full">
                  Contact Sales
                </GlowButton>
              </article>
            </AnimatedSection>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
