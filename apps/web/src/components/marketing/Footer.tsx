import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { GlowButton } from "../ui/GlowButton";

const footerLinkClass =
  "mt-2 block text-sm text-neutral-400 transition-all duration-200 ease-out hover:text-slate-100 hover:-translate-y-px";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-card/30">
      <div className="relative overflow-hidden border-b border-white/10 px-6 py-20 text-center md:py-28">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(480px,90vw)] w-[min(480px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-[10%] bottom-0 h-64 w-64 rounded-full bg-emerald-900/20 blur-3xl"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/[0.07] to-accent/5" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gradient-hero md:text-4xl">
            Ready to close your next enterprise deal faster?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-400">
            Join EU SaaS teams who have stopped losing deals to slow security reviews.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <GlowButton variant="primary" size="lg" href="/signup">
              Start Free Trial
            </GlowButton>
            <GlowButton variant="secondary" size="lg" href="/demo">
              Book a Demo
            </GlowButton>
          </div>
          <p className="mt-5 text-sm text-slate-500">No credit card required · Cancel anytime</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 py-14 md:grid-cols-4 md:gap-12">
        <div>
          <div className="inline-flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-neutral-50">
              TrustRespond<span className="text-accent">.ai</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Automating enterprise trust, one questionnaire at a time.
          </p>
          <span className="mt-4 inline-block rounded-full border border-white/10 bg-surface-elevated/80 px-3 py-1.5 text-xs text-slate-500">
            🇪🇺 EU Data Residency · GDPR Compliant
          </span>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Product</h3>
          <ul className="mt-2">
            <li>
              <Link href="/#features" className={footerLinkClass}>
                Features
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className={footerLinkClass}>
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className={footerLinkClass}>
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/#features" className={footerLinkClass}>
                Trust Center
              </Link>
            </li>
            <li>
              <Link href="/#security" className={footerLinkClass}>
                Security
              </Link>
            </li>
            <li>
              <Link href="/changelog" className={footerLinkClass}>
                Changelog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Company</h3>
          <ul className="mt-2">
            <li>
              <Link href="/about" className={footerLinkClass}>
                About
              </Link>
            </li>
            <li>
              <Link href="/blog" className={footerLinkClass}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="/careers" className={footerLinkClass}>
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className={footerLinkClass}>
                Contact
              </Link>
            </li>
            <li>
              <a
                href="https://andrijanic.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={footerLinkClass}
              >
                andrijanic.dev
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Legal</h3>
          <ul className="mt-2">
            <li>
              <Link href="/#privacy-notice" className={footerLinkClass}>
                Privacy summary (homepage)
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy-policy" className={footerLinkClass}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms-of-service" className={footerLinkClass}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/legal/dpa" className={footerLinkClass}>
                Data Processing Agreement
              </Link>
            </li>
            <li>
              <Link href="/legal/cookies" className={footerLinkClass}>
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/impressum" className={footerLinkClass}>
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/legal/ai-system-information" className={footerLinkClass}>
                AI system information
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 px-6 py-8 md:flex-row">
        <p className="text-xs text-slate-600">© 2026 TrustRespond.ai. All rights reserved.</p>
        <p className="text-xs text-slate-600">
          Built by{" "}
          <a
            href="https://andrijanic.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-light transition-colors duration-200 hover:text-accent hover:underline"
          >
            andrijanic.dev
          </a>
        </p>
      </div>
    </footer>
  );
}
