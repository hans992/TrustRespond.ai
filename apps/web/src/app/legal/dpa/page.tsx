import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Data Processing Agreement",
  description: "Processor terms for TrustRespond.ai customers under GDPR Article 28.",
};

export default function DpaPage() {
  return (
    <LegalPageShell title="Data Processing Agreement (summary)" lastUpdated="14 April 2026">
      <p>
        This page summarises the data processing terms that apply when we process personal data on behalf of customers as a
        processor under GDPR Article 28. Enterprise customers may execute a separate DPA or order form; where none is signed,
        these terms supplement the <Link href="/legal/terms-of-service">Terms of Service</Link> for processing of customer
        personal data in the Service.
      </p>

      <h2 id="roles">1. Roles</h2>
      <p>
        You (the customer organisation) are the controller of personal data you upload or instruct us to process in the
        Service. We are the processor, acting on your instructions documented by use of the product and these terms.
      </p>

      <h2 id="instructions">2. Instructions</h2>
      <p>
        We process personal data only to provide the Service, support, security, and compliance with law. We will not use
        customer personal data to train public foundation models without a separate agreement.
      </p>

      <h2 id="subprocessors">3. Subprocessors</h2>
      <p>
        We may engage subprocessors (for example cloud infrastructure) subject to written agreements that meet GDPR
        requirements. We remain responsible for their performance. Current categories include hosting, database, email
        delivery, and observability. You may request a list and object to changes where your agreement provides a right to
        object.
      </p>

      <h2 id="security">4. Security</h2>
      <p>
        We implement appropriate technical and organisational measures, including access controls, encryption in transit where
        applicable, and resilience practices appropriate to risk.
      </p>

      <h2 id="breach">5. Breach notification</h2>
      <p>
        We will notify you without undue delay after becoming aware of a personal data breach affecting your data where
        required by law, and assist with your regulatory communications where applicable.
      </p>

      <h2 id="deletion">6. Deletion and return</h2>
      <p>
        On termination or upon request, we will delete or return personal data as described in the Terms and product
        capabilities, subject to legal retention needs.
      </p>

      <h2 id="assistance">7. Assistance</h2>
      <p>
        We will assist you with responding to data subject requests and assessments, taking into account the nature of
        processing and information available to us.
      </p>

      <h2 id="transfers">8. International transfers</h2>
      <p>
        Where personal data is transferred outside the EEA, we use appropriate safeguards such as the EU Standard Contractual
        Clauses.
      </p>

      <h2 id="audit">9. Audit</h2>
      <p>
        We make available information necessary to demonstrate compliance and allow audits mandated by law or, for enterprise
        customers, as set out in an executed agreement.
      </p>

      <h2 id="contact">10. Contact</h2>
      <p>
        Data processing questions: <a href="mailto:privacy@trustrespond.ai">privacy@trustrespond.ai</a>
      </p>
    </LegalPageShell>
  );
}
