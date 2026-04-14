"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONSENT_CHANGED_EVENT,
  getStoredCookieConsent,
  setCookieConsent,
} from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    const sync = () => {
      setShow(getStoredCookieConsent() === null);
    };
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  if (show !== true) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-surface-card/95 p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md md:p-5"
    >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 id="cookie-consent-title" className="text-sm font-semibold text-neutral-50">
              Cookies and similar technologies
            </h2>
            <p id="cookie-consent-desc" className="mt-2 text-sm leading-relaxed text-slate-400">
              We use essential cookies to run the service (for example authentication and security). With your permission, we
              also use analytics to understand how the site is used. See our{" "}
              <Link href="/legal/cookies" className="text-accent-light underline underline-offset-2 hover:text-accent">
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/privacy-policy"
                className="text-accent-light underline underline-offset-2 hover:text-accent"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              className="rounded-lg border border-white/15 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/25 hover:bg-white/5"
              onClick={() => {
                setCookieConsent("essential");
              }}
            >
              Essential only
            </button>
            <button
              type="button"
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
              onClick={() => {
                setCookieConsent("all");
              }}
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
  );
}
