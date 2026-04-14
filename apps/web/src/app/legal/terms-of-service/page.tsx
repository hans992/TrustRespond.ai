import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the TrustRespond.ai website and service.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated="14 April 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern access to and use of the TrustRespond.ai website and services
        (&quot;Service&quot;) offered by the operator of TrustRespond.ai (&quot;we&quot;, &quot;us&quot;). By using the
        Service you agree to these Terms.
      </p>

      <h2 id="service">1. The Service</h2>
      <p>
        TrustRespond provides tools to ingest your security documentation, assist with questionnaire completion using
        AI-supported workflows, and publish optional Trust Center pages. Features depend on your plan and product configuration.
      </p>

      <h2 id="account">2. Accounts</h2>
      <p>
        You must provide accurate registration information and safeguard your credentials. You are responsible for activity
        under your account. Notify us promptly of unauthorised use at <a href="mailto:legal@trustrespond.ai">legal@trustrespond.ai</a>.
      </p>

      <h2 id="customer-data">3. Your content</h2>
      <p>
        You retain rights to materials you upload. You grant us a licence to host, process, and display your content solely to
        provide and improve the Service as described in our <Link href="/legal/privacy-policy">Privacy Policy</Link> and any
        executed <Link href="/legal/dpa">Data Processing Agreement</Link>.
      </p>

      <h2 id="acceptable">4. Acceptable use</h2>
      <p>You agree not to misuse the Service, including by attempting to access others&apos; data, probing for vulnerabilities
        beyond coordinated disclosure, or using the Service to violate law or third-party rights.</p>

      <h2 id="ai">5. AI outputs</h2>
      <p>
        Outputs are assistive and may contain errors. You are responsible for verifying accuracy before reliance or
        disclosure. See <Link href="/legal/ai-system-information">AI system information</Link>.
      </p>

      <h2 id="fees">6. Fees</h2>
      <p>
        Paid plans, billing cycles, and taxes are as stated at checkout or in an order form. Unless stated otherwise,
        subscriptions renew until cancelled in accordance with the process we provide.
      </p>

      <h2 id="sla">7. Availability</h2>
      <p>
        We aim for high availability but do not guarantee uninterrupted access. Maintenance and events outside our control may
        affect the Service.
      </p>

      <h2 id="liability">8. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by applicable law, our aggregate liability arising out of these Terms is limited to
        amounts you paid us in the twelve months before the claim (or, if free tier, fifty euros). We are not liable for
        indirect or consequential damages except where such exclusion is prohibited by law.
      </p>

      <h2 id="law">9. Governing law</h2>
      <p>
        These Terms are governed by the laws applicable to consumers in your country of residence where mandatory consumer
        protections apply; otherwise the laws of the Republic of Croatia, without regard to conflict-of-law rules, subject
        to mandatory provisions.
      </p>

      <h2 id="changes">10. Changes</h2>
      <p>
        We may update these Terms. We will post the revised Terms with an updated date. Continued use after notice may
        constitute acceptance where permitted by law.
      </p>

      <h2 id="contact">11. Contact</h2>
      <p>
        <a href="mailto:legal@trustrespond.ai">legal@trustrespond.ai</a>
      </p>
    </LegalPageShell>
  );
}
