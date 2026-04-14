import Link from "next/link";
import { GlowButton } from "@/components/ui/GlowButton";

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50";

export default function SignUpPage() {
  return (
    <main className="w-full max-w-md">
      <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-card backdrop-blur-xl">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Create account
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Start your organization workspace on TrustRespond.
        </p>

        <form
          action="/api/auth/sign-up"
          method="post"
          className="mt-8 grid gap-5"
        >
          <label className="grid gap-2 text-sm">
            <span className="text-slate-300">Company name</span>
            <input
              name="orgName"
              type="text"
              placeholder="Company name"
              required
              autoComplete="organization"
              className={fieldClass}
            />
          </label>
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
              minLength={8}
              required
              autoComplete="new-password"
              className={fieldClass}
            />
          </label>
          <GlowButton type="submit" size="lg" className="mt-2 w-full">
            Sign up
          </GlowButton>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-emerald-light underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
