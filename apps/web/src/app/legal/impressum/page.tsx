import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Legal disclosure and service provider information for TrustRespond.ai.",
};

export default function ImpressumPage() {
  return (
    <LegalPageShell title="Impressum" lastUpdated="14 April 2026">
      <p>
        Information in accordance with § 5 TMG / EU Directive 2000/31/EC (eCommerce) and general transparency for visitors to{" "}
        <Link href="https://www.trustrespond.ai">www.trustrespond.ai</Link>.
      </p>

      <h2 id="provider">Service provider</h2>
      <p>
        <strong>TrustRespond.ai</strong>
        <br />
        Operated by: Andrijanic Development (&quot;we&quot;)
        <br />
        Web: <a href="https://andrijanic.dev">andrijanic.dev</a>
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Email: <a href="mailto:legal@trustrespond.ai">legal@trustrespond.ai</a>
        <br />
        Privacy: <a href="mailto:privacy@trustrespond.ai">privacy@trustrespond.ai</a>
      </p>

      <h2 id="address">Postal address</h2>
      <p>
        A full postal address for formal notices and regulatory correspondence is provided on written request to{" "}
        <a href="mailto:legal@trustrespond.ai">legal@trustrespond.ai</a>. We respond to legitimate requests without undue
        delay.
      </p>

      <h2 id="dispute">Dispute resolution</h2>
      <p>
        The European Commission provides a platform for online dispute resolution (ODR):{" "}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>
        . We are not obliged or willing to participate in consumer arbitration proceedings before a consumer arbitration board,
        except where mandatory law requires otherwise.
      </p>

      <h2 id="liability">Liability for content</h2>
      <p>
        We are responsible for our own content on these pages under general law. We are not obligated to monitor third-party
        information transmitted or stored unless required by law.
      </p>
    </LegalPageShell>
  );
}
