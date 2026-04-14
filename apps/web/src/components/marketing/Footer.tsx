import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { GlowButton } from "../ui/GlowButton";

export function Footer() {
  return (
    <footer className="border-t border-surface-border/50 bg-surface-card/30">
      <div className="relative overflow-hidden border-b border-surface-border/50 px-6 py-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-gradient-hero md:text-4xl">Ready to close your next enterprise deal faster?</h2>
          <p className="mt-4 text-lg text-neutral-400">
            Join EU SaaS teams who have stopped losing deals to slow security reviews.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <GlowButton variant="primary" size="lg" href="/signup">
              Start Free Trial
            </GlowButton>
            <GlowButton variant="secondary" size="lg" href="/demo">
              Book a Demo
            </GlowButton>
          </div>
          <p className="mt-4 text-sm text-neutral-600">No credit card required · Cancel anytime</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="inline-flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-neutral-50">
              TrustRespond<span className="text-accent">.ai</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Automating enterprise trust, one questionnaire at a time.
          </p>
          <span className="mt-4 inline-block rounded-full bg-surface-elevated px-3 py-1.5 text-xs text-neutral-600">
            🇪🇺 EU Data Residency · GDPR Compliant
          </span>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Product</h3>
          <ul className="mt-2">
            <li>
              <Link href="/#features" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/#features" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                Trust Center
              </Link>
            </li>
            <li>
              <Link href="/#security" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                Security
              </Link>
            </li>
            <li>
              <Link href="/changelog" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                Changelog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Company</h3>
          <ul className="mt-2">
            <li>
              <Link href="/about" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                About
              </Link>
            </li>
            <li>
              <Link href="/blog" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/careers" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                Contact
              </Link>
            </li>
            <li>
              <a
                href="https://andrijanic.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50"
              >
                andrijanic.dev
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Legal</h3>
          <ul className="mt-2">
            <li>
              <Link
                href="/legal/privacy-policy"
                className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms-of-service"
                className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/legal/dpa" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                Data Processing Agreement
              </Link>
            </li>
            <li>
              <Link href="/legal/cookies" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/impressum" className="mt-2 block text-sm text-neutral-400 transition-colors hover:text-neutral-50">
                Impressum
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-surface-border/50 px-6 py-6 md:flex-row">
        <p className="text-xs text-neutral-600">© 2026 TrustRespond.ai. All rights reserved.</p>
        <p className="text-xs text-neutral-600">
          Built by{" "}
          <a href="https://andrijanic.dev" target="_blank" rel="noopener noreferrer" className="text-accent-light hover:underline">
            andrijanic.dev
          </a>
        </p>
      </div>
    </footer>
  );
}
