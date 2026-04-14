import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100">
            <span className="inline-flex rounded-md border border-emerald-300/25 bg-emerald-500/15 p-1 text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
            </span>
            TrustRespond.ai
          </div>
          <p className="mt-3 text-sm text-slate-400">Automating Enterprise Trust.</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-200">Product</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <Link href="/#security" className="transition hover:text-slate-200">
                Security
              </Link>
            </li>
            <li>
              <Link href="/#features" className="transition hover:text-slate-200">
                Features
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="transition hover:text-slate-200">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-200">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <Link href="/legal/impressum" className="transition hover:text-slate-200">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy-policy" className="transition hover:text-slate-200">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms-of-service" className="transition hover:text-slate-200">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-5 text-xs text-slate-500 sm:px-8">
          © 2026 TrustRespond.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
