import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How TrustRespond.ai uses cookies and similar technologies, including analytics with consent and essential service cookies.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPageShell title="Cookie Policy" lastUpdated="14 April 2026">
      <p>
        This Cookie Policy explains how TrustRespond.ai (&quot;we&quot;) uses cookies and similar technologies on{" "}
        <Link href="https://www.trustrespond.ai">www.trustrespond.ai</Link>, in line with the ePrivacy Directive (implemented
        in national law) and GDPR transparency requirements.
      </p>

      <h2 id="what">1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device. Similar technologies include local storage. We distinguish
        essential (strictly necessary) technologies from non-essential ones such as audience analytics.
      </p>

      <h2 id="essential">2. Essential cookies and storage</h2>
      <p>
        These are required for the website and service to function, for example to keep you signed in, maintain security, and
        remember your cookie preference. They are used based on our legitimate interests and, where they store personal data,
        to perform our contract with you or deliver requested functionality.
      </p>
      <table>
        <thead>
          <tr>
            <th>Name / category</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Authentication session (e.g. Supabase)</td>
            <td>Maintains your logged-in session securely</td>
            <td>Session / as configured</td>
          </tr>
          <tr>
            <td>Security &amp; load balancing</td>
            <td>Protects against abuse; routes traffic</td>
            <td>Session / short-lived</td>
          </tr>
          <tr>
            <td>Cookie consent preference</td>
            <td>Stores whether you accepted essential-only or all cookies</td>
            <td>Persistent (typically 12 months)</td>
          </tr>
        </tbody>
      </table>

      <h2 id="analytics">3. Analytics (non-essential)</h2>
      <p>
        We may use Vercel Web Analytics to understand aggregate traffic and performance. This category is only loaded after you
        choose &quot;Accept all&quot; in our cookie banner. If you choose &quot;Essential only&quot;, analytics scripts are
        not activated.
      </p>

      <h2 id="choices">4. Your choices</h2>
      <p>
        You can change your mind by clearing site data for our domain and revisiting the site; the banner will appear again.
        You can also control cookies through your browser settings (blocking cookies may affect login and features).
      </p>

      <h2 id="more">5. More information</h2>
      <p>
        For how we process personal data in general, see our <Link href="/legal/privacy-policy">Privacy Policy</Link>.
      </p>
    </LegalPageShell>
  );
}
