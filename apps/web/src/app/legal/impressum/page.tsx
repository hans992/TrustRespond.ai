import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Legal disclosure and service provider information for TrustRespond.ai.",
};

export default function ImpressumPage() {
  return (
    <LegalPageShell title="Legal Notice (Impressum)" lastUpdated="17 April 2026">
      <p>Information according to § 5 DDG</p>

      <p>
        <strong>Damir Andrijanic</strong>
        <br />
        c/o Postflex PFX-202-985
        <br />
        Emsdettener Str. 10
        <br />
        48268 Greven
        <br />
        Germany
      </p>

      <p>
        TrustRespond.ai is a brand and Software-as-a-Service offering operated by Damir Andrijanic as a sole proprietor
        (Kleingewerbe).
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Email: <a href="mailto:damir@andrijanic.com">damir@andrijanic.com</a>
        <br />
        Phone: <a href="tel:+4916096465890">+49 160 96465890</a>
      </p>

      <p>
        VAT ID (USt-IdNr.): <span className="tabular-nums">DE461042625</span>
      </p>

      <h2 id="dispute">EU Dispute Resolution</h2>
      <p>
        The European Commission provides a platform for online dispute resolution (ODR):{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr/
        </a>
        .
      </p>
      <p>Our email address can be found above in the site notice.</p>

      <h2 id="b2b">B2B Notice &amp; Section 36 VSBG</h2>
      <p>
        TrustRespond.ai is offered exclusively to businesses (B2B), legal entities under public law, or special funds under
        public law within the meaning of Section 14 BGB. We do not conclude contracts with consumers (Section 13 BGB). For
        this reason, we are neither obliged nor willing to participate in dispute resolution proceedings before a consumer
        arbitration board under the VSBG.
      </p>
    </LegalPageShell>
  );
}
