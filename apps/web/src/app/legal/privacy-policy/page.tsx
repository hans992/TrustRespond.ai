import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "GDPR Article 13 information: data controller, purposes, legal bases, retention, your rights, and TrustRespond.ai processing details.",
};

const CONTACT_PRIVACY = "privacy@trustrespond.ai";
const CONTACT_LEGAL = "legal@trustrespond.ai";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="14 April 2026">
      <p>
        This Privacy Policy provides the information required by Articles 13 and 14 of the UK and EU General Data Protection
        Regulation (&quot;GDPR&quot;) when we process personal data relating to visitors to{" "}
        <Link href="https://www.trustrespond.ai">trustrespond.ai</Link> and users of the TrustRespond service.
      </p>

      <h2 id="controller">1. Who is responsible (data controller)?</h2>
      <p>
        The data controller for personal data processed in connection with this website and the TrustRespond service is the
        operator of TrustRespond.ai. For privacy requests, contact us at{" "}
        <a href={`mailto:${CONTACT_PRIVACY}`}>{CONTACT_PRIVACY}</a>. For contractual and regulatory correspondence, contact{" "}
        <a href={`mailto:${CONTACT_LEGAL}`}>{CONTACT_LEGAL}</a>.
      </p>
      <p>
        We have not appointed a Data Protection Officer (DPO) where not required by Article 37 GDPR; you may address all
        privacy enquiries to <a href={`mailto:${CONTACT_PRIVACY}`}>{CONTACT_PRIVACY}</a>. Postal address for formal notices is
        provided on request to <a href={`mailto:${CONTACT_LEGAL}`}>{CONTACT_LEGAL}</a>.
      </p>

      <h2 id="purposes">2. What we process, why, and legal bases</h2>
      <p>We process personal data only for specific purposes and on a lawful basis under Article 6 GDPR.</p>
      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Categories of data</th>
            <th>Legal basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Providing the TrustRespond product (accounts, questionnaires, exports, Trust Center)</td>
            <td>Account and profile data; customer content you upload; usage and technical logs tied to your workspace</td>
            <td>Performance of a contract (Art. 6(1)(b)); occasionally legitimate interests in securing the service (Art. 6(1)(f))</td>
          </tr>
          <tr>
            <td>Website delivery, security, fraud prevention</td>
            <td>IP address, device and browser data, security logs</td>
            <td>Legitimate interests (Art. 6(1)(f)) and, where applicable, legal obligation (Art. 6(1)(c))</td>
          </tr>
          <tr>
            <td>Product analytics (if you accept non-essential cookies)</td>
            <td>Pseudonymous usage metrics as described in our Cookie Policy</td>
            <td>Consent (Art. 6(1)(a))</td>
          </tr>
          <tr>
            <td>Marketing communications (if you opt in)</td>
            <td>Contact details, preferences</td>
            <td>Consent (Art. 6(1)(a))</td>
          </tr>
          <tr>
            <td>Compliance, disputes, record-keeping</td>
            <td>Relevant account and communications data</td>
            <td>Legitimate interests and legal obligations (Art. 6(1)(c) and (f))</td>
          </tr>
        </tbody>
      </table>

      <h2 id="ai">3. AI-assisted processing</h2>
      <p>
        TrustRespond uses AI to suggest answers to security questionnaire cells based on your uploaded policies and similar
        context you provide. This is assistive: it does not replace your review. You remain responsible for approving content
        before export or sharing. We do not use personal data in this pipeline for decisions that produce legal or similarly
        significant effects solely by automated means without human involvement. See also our{" "}
        <Link href="/legal/ai-system-information">AI system information</Link> page for transparency under the EU AI Act.
      </p>

      <h2 id="recipients">4. Recipients and subprocessors</h2>
      <p>
        We use trusted infrastructure and service providers (for example hosting, database, authentication, and email). They
        process data only on our instructions and under appropriate data processing terms. A current list of categories is
        available on request; key providers include cloud hosting and database services (data may be processed in the EEA and,
        where disclosed, other regions with appropriate safeguards).
      </p>

      <h2 id="transfers">5. Transfers outside the EEA</h2>
      <p>
        Where personal data is transferred to countries not covered by an adequacy decision, we use appropriate safeguards
        such as the EU Standard Contractual Clauses (SCCs) and supplementary measures where required. You may request a copy of
        relevant safeguards by contacting <a href={`mailto:${CONTACT_PRIVACY}`}>{CONTACT_PRIVACY}</a>.
      </p>

      <h2 id="retention">6. How long we keep data</h2>
      <p>
        We retain personal data only as long as necessary for the purposes above: for example, for the lifetime of your
        account plus a limited period for backups, legal claims, and accounting unless a longer period is required by law.
        Specific retention periods can be provided on request for your use case.
      </p>

      <h2 id="rights">7. Your rights</h2>
      <p>Under GDPR you have the right to:</p>
      <ul>
        <li>Access your personal data (Art. 15)</li>
        <li>Rectification (Art. 16)</li>
        <li>Erasure in certain cases (Art. 17)</li>
        <li>Restriction of processing (Art. 18)</li>
        <li>Data portability, where applicable (Art. 20)</li>
        <li>Object to processing based on legitimate interests (Art. 21)</li>
        <li>Withdraw consent at any time, without affecting prior lawful processing (Art. 7(3))</li>
      </ul>
      <p>
        To exercise your rights, email <a href={`mailto:${CONTACT_PRIVACY}`}>{CONTACT_PRIVACY}</a>. You may also lodge a
        complaint with your local supervisory authority.
      </p>

      <h2 id="obligation">8. Whether you must provide data</h2>
      <p>
        Where processing is necessary to perform our contract with you, failure to provide required account or billing data may
        mean we cannot provide the service. Other fields may be voluntary as indicated in the product.
      </p>

      <h2 id="cookies">9. Cookies and similar technologies</h2>
      <p>
        We use cookies and similar technologies as described in our{" "}
        <Link href="/legal/cookies">Cookie Policy</Link>. Non-essential analytics are only activated after you consent via our
        cookie banner.
      </p>

      <h2 id="changes">10. Changes</h2>
      <p>
        We may update this policy and will adjust the &quot;Last updated&quot; date. Material changes will be communicated as
        appropriate (for example by email or in-product notice).
      </p>
    </LegalPageShell>
  );
}
