"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionBadge } from "@/components/ui/SectionBadge";

const faqs = [
  {
    question: "Is my data secure? Do you train on my documents?",
    answer:
      "Your documents are never used to train any AI model. TrustRespond uses a private RAG (Retrieval-Augmented Generation) architecture - your policies are stored in an encrypted, tenant-isolated vector database. Only your account can query your documents. We are SOC 2 Type II compliant and all data is stored in EU-based infrastructure.",
  },
  {
    question: "Is TrustRespond GDPR compliant?",
    answer:
      "Yes. TrustRespond is built GDPR-first. All data is processed and stored in EU data centers (Frankfurt, Germany). We act as a Data Processor under GDPR Article 28, and our Data Processing Agreement (DPA) is available for all paid plans. We do not transfer personal data outside the EU/EEA.",
  },
  {
    question: "What file formats do you support?",
    answer:
      "For questionnaire upload: .xlsx (Excel), .csv, and .docx (Word). For policy documents: PDF, .docx, .txt, and plain text. Exports are always delivered in the original format of the uploaded questionnaire - so if your client sends an .xlsx file with custom formatting, macros, and dropdown validations, the exported file will be identical in structure with your answers injected.",
  },
  {
    question: "How accurate are the AI-generated answers?",
    answer:
      "In internal testing across 1,200+ questionnaire rows, TrustRespond achieves 91-97% answer accuracy when your knowledge base contains the relevant policy documentation. Every answer is displayed with a confidence score. Answers below 85% confidence are automatically flagged for human review. You always have final approval before export - the AI drafts, you decide.",
  },
  {
    question: "Can I use my own OpenAI or Anthropic API key?",
    answer:
      "Yes. The Pro and Enterprise plans support BYOK (Bring Your Own Key). This means your documents are processed using your own API key, giving you full control over data routing, cost, and model selection. Enterprise customers can also deploy TrustRespond with an on-premise LLM for complete data sovereignty.",
  },
  {
    question: "How long does onboarding take?",
    answer:
      "Most teams are fully onboarded in under 30 minutes. Upload your policy documents (step 1), upload a questionnaire (step 2), and TrustRespond handles the rest. There is no sales call required for the Free or Starter plans. Enterprise onboarding includes a dedicated setup session with our team.",
  },
];

export function FAQSection() {
  return (
    <AnimatedSection>
      <section
        id="security"
        className="scroll-mt-24 px-6 py-28 md:py-32"
        aria-label="Security and frequently asked questions"
      >
        <div className="mx-auto max-w-3xl">
          <SectionBadge color="neutral">FAQ</SectionBadge>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gradient-hero">
            Questions we get from security-conscious teams.
          </h2>

          <Accordion.Root type="single" collapsible className="mt-12 space-y-3">
            {faqs.map((faq, index) => (
              <Accordion.Item
                key={faq.question}
                value={`item-${index + 1}`}
                className="glass-card overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald/20 hover:shadow-card-hover"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between px-6 py-5 text-left text-base font-medium text-neutral-50 transition-colors hover:text-accent-light">
                    <span>{faq.question}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="px-6 pb-5 text-sm leading-relaxed text-slate-400">
                  {faq.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>
    </AnimatedSection>
  );
}
