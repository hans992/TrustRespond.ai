import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { trustCenterPages } from "@/lib/mock-store";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return trustCenterPages.filter((page) => page.isPublished).map((page) => ({ slug: page.slug }));
}

export default async function TrustCenterPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = trustCenterPages.find((p) => p.slug === slug && p.isPublished);
  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-100">
            <ShieldCheck className="h-5 w-5 text-accent" aria-hidden />
            <span className="text-sm font-semibold">
              TrustRespond<span className="text-accent">.ai</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-6 py-16">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-emerald/10 blur-[100px]"
          aria-hidden
        />
        <article className="relative glass-card noise-overlay rounded-3xl p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-100">{page.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">{page.description}</p>
          <p className="mt-8 border-t border-white/10 pt-8 text-sm text-slate-500">
            NDA required:{" "}
            <span className="font-medium text-slate-300">{page.ndaRequired ? "Yes" : "No"}</span>
          </p>
        </article>
      </main>
    </div>
  );
}
