import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "Request a TrustRespond.ai demo via email.",
};

export default function DemoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-50">Book a demo</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Send us a message and we&apos;ll follow up with next steps.
        </p>
        <a
          href="mailto:legal@trustrespond.ai?subject=Book%20a%20demo"
          className="mt-8 inline-flex rounded-2xl border border-emerald/35 bg-emerald/10 px-6 py-3 text-sm font-medium text-emerald-light transition-colors hover:bg-emerald/15"
        >
          Email legal@trustrespond.ai
        </a>
        <p className="mt-8 text-xs text-slate-500">
          <Link href="/" className="text-accent-light hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
