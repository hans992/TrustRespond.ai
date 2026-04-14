import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "AI system information",
  description:
    "Transparency about TrustRespond.ai AI assistance, human oversight, and classification under the EU AI Act and Annex III.",
};

export default function AISystemInformationPage() {
  return (
    <LegalPageShell title="AI system information" lastUpdated="14 April 2026">
      <p>
        TrustRespond.ai is designed for transparency and human oversight. This page summarises how our AI features work in
        relation to Regulation (EU) 2024/1689 (the EU AI Act) and describes the role of humans in the loop.
      </p>

      <h2 id="purpose">1. Purpose and capabilities</h2>
      <p>
        The system assists B2B users in completing security and compliance questionnaires by suggesting cell-level answers derived
        from customer-uploaded documents (for example policies, SOC 2 reports) and configured context. Outputs may include
        confidence indicators to support review. The service does not autonomously submit questionnaires to third parties or
        make contractual commitments on your behalf.
      </p>

      <h2 id="classification">2. Classification (EU AI Act)</h2>
      <p>
        We assess the product as an AI-assisted productivity tool with meaningful human oversight prior to export or external
        sharing. It is not listed as a prohibited practice under Title II of the EU AI Act. For many customer deployments,
        use cases fall outside high-risk obligations in Annex III (for example where the output is not used for recruitment,
        creditworthiness, or other Annex III high-risk scenarios as defined in context). Customers remain responsible for
        determining whether their specific deployment triggers additional obligations.
      </p>
      <p>
        The &quot;EU AI Act Ready&quot; messaging on our marketing materials refers to our commitment to documentation,
        transparency, and human review workflows—not a certification by a regulator. We maintain internal controls appropriate
        to our role as a provider of general-purpose business software.
      </p>

      <h2 id="oversight">3. Human oversight</h2>
      <p>
        Users must review, amend, and explicitly approve content before it is relied upon externally. We design workflows so
        that teams can reject or edit model suggestions and retain an audit trail consistent with product features.
      </p>

      <h2 id="limitations">4. Limitations and monitoring</h2>
      <p>
        AI-generated text may be incomplete or incorrect. Users should verify answers against authoritative sources. We
        monitor model behaviour and security as part of our product operations and incident response processes.
      </p>

      <h2 id="contact">5. Contact</h2>
      <p>
        Questions about this page: <a href="mailto:legal@trustrespond.ai">legal@trustrespond.ai</a>. For data protection,
        see our <Link href="/legal/privacy-policy">Privacy Policy</Link>.
      </p>
    </LegalPageShell>
  );
}
