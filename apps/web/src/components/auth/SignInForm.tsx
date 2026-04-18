"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { z } from "zod";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  email: z.email({ error: "Enter a valid email address" }),
  password: z.string().min(1, "Password is required")
});

type FieldErrors = Partial<Record<"email" | "password", string>>;

export function SignInForm({ serverError }: { serverError: string | null }) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? "")
    });
    if (!parsed.success) {
      e.preventDefault();
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "email" || key === "password") {
          next[key] = issue.message;
        }
      }
      setFieldErrors(next);
      return;
    }
    setFieldErrors({});
  }

  return (
    <main className="w-full max-w-md">
      <div className="glass-card noise-overlay rounded-3xl p-8 shadow-card">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-slate-300">Access your TrustRespond workspace.</p>

        {serverError ? (
          <div
            className="mt-6 rounded-xl border border-red-500/25 bg-red-950/30 px-4 py-3 text-sm text-red-200"
            role="alert"
            aria-live="polite"
          >
            {serverError}
          </div>
        ) : null}

        <form action="/api/auth/sign-in" method="post" className="mt-8 grid gap-5" onSubmit={onSubmit} noValidate>
          <label className="grid gap-2 text-sm">
            <span className="text-slate-300" id="signin-email-label">
              Email
            </span>
            <Input
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              autoComplete="email"
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={fieldErrors.email ? "signin-email-error" : undefined}
              aria-labelledby="signin-email-label"
            />
            {fieldErrors.email ? (
              <span id="signin-email-error" className="text-xs text-red-400" role="alert">
                {fieldErrors.email}
              </span>
            ) : null}
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-slate-300" id="signin-password-label">
              Password
            </span>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
              autoComplete="current-password"
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={fieldErrors.password ? "signin-password-error" : undefined}
              aria-labelledby="signin-password-label"
            />
            {fieldErrors.password ? (
              <span id="signin-password-error" className="text-xs text-red-400" role="alert">
                {fieldErrors.password}
              </span>
            ) : null}
          </label>
          <GlowButton type="submit" size="lg" className="mt-2 w-full">
            Sign in
          </GlowButton>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Need an account?{" "}
          <Link href="/auth/sign-up" className="font-medium text-emerald-light underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
