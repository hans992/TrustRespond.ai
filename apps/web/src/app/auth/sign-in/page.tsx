import Link from "next/link";
import { GlowButton } from "@/components/ui/GlowButton";

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50";

type SearchParams = { error?: string };

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? decodeURIComponent(error) : null;

  return (
    <main className="w-full max-w-md">
      <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-card backdrop-blur-xl">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Access your TrustRespond workspace.
        </p>

        {errorMessage ? (
          <div
            className="mt-6 rounded-xl border border-red-500/25 bg-red-950/30 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        <form
          action="/api/auth/sign-in"
          method="post"
          className="mt-8 grid gap-5"
        >
          <label className="grid gap-2 text-sm">
            <span className="text-slate-300">Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              autoComplete="email"
              className={fieldClass}
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-slate-300">Password</span>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              autoComplete="current-password"
              className={fieldClass}
            />
          </label>
          <GlowButton type="submit" size="lg" className="mt-2 w-full">
            Sign in
          </GlowButton>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Need an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-medium text-emerald-light underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
