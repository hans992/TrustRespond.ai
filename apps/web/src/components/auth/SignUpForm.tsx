"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { z } from "zod";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  orgName: z.string().min(1, "Company name is required").max(200),
  email: z.email({ error: "Enter a valid email address" }),
  password: z.string().min(8, "Use at least 8 characters")
});

type FieldErrors = Partial<Record<"orgName" | "email" | "password", string>>;

export function SignUpForm() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse({
      orgName: String(fd.get("orgName") ?? ""),
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? "")
    });
    if (!parsed.success) {
      e.preventDefault();
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === "orgName" || key === "email" || key === "password") {
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
          Create account
        </h1>
        <p className="mt-2 text-sm text-slate-300">Start your organization workspace on TrustRespond.</p>

        <form action="/api/auth/sign-up" method="post" className="mt-8 grid gap-5" onSubmit={onSubmit} noValidate>
          <label className="grid gap-2 text-sm">
            <span className="text-slate-300" id="signup-org-label">
              Company name
            </span>
            <Input
              name="orgName"
              type="text"
              placeholder="Company name"
              required
              autoComplete="organization"
              aria-invalid={fieldErrors.orgName ? true : undefined}
              aria-describedby={fieldErrors.orgName ? "signup-org-error" : undefined}
              aria-labelledby="signup-org-label"
            />
            {fieldErrors.orgName ? (
              <span id="signup-org-error" className="text-xs text-red-400" role="alert">
                {fieldErrors.orgName}
              </span>
            ) : null}
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-slate-300" id="signup-email-label">
              Email
            </span>
            <Input
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              autoComplete="email"
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={fieldErrors.email ? "signup-email-error" : undefined}
              aria-labelledby="signup-email-label"
            />
            {fieldErrors.email ? (
              <span id="signup-email-error" className="text-xs text-red-400" role="alert">
                {fieldErrors.email}
              </span>
            ) : null}
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-slate-300" id="signup-password-label">
              Password
            </span>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              minLength={8}
              required
              autoComplete="new-password"
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={fieldErrors.password ? "signup-password-error" : undefined}
              aria-labelledby="signup-password-label"
            />
            {fieldErrors.password ? (
              <span id="signup-password-error" className="text-xs text-red-400" role="alert">
                {fieldErrors.password}
              </span>
            ) : null}
          </label>
          <GlowButton type="submit" size="lg" className="mt-2 w-full">
            Sign up
          </GlowButton>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="font-medium text-emerald-light underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
