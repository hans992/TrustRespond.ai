"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CONSENT_CHANGED_EVENT,
  getStoredCookieConsent,
  setCookieConsent,
} from "@/lib/cookie-consent";

const SCROLL_THRESHOLD_PX = 560;

export function CookieConsentBanner() {
  const [needsConsent, setNeedsConsent] = useState<boolean | null>(null);
  const [scrollPastHero, setScrollPastHero] = useState(false);
  const [fabOpened, setFabOpened] = useState(false);

  useEffect(() => {
    const sync = () => {
      setNeedsConsent(getStoredCookieConsent() === null);
    };
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (needsConsent !== true) return;

    const onScroll = () => {
      setScrollPastHero(window.scrollY >= SCROLL_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [needsConsent]);

  if (needsConsent !== true) return null;

  const showFullBanner = scrollPastHero || fabOpened;

  if (!showFullBanner) {
    return (
      <div className="fixed bottom-4 left-4 z-[100] md:bottom-6 md:left-6">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-label="Cookie preferences"
          onClick={() => setFabOpened(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-surface-card/95 text-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:border-emerald/35 hover:text-emerald-light"
        >
          <Cookie className="h-5 w-5" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-surface-card/95 p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md md:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 id="cookie-consent-title" className="text-sm font-semibold text-neutral-50">
            Cookies and similar technologies
          </h2>
          <p id="cookie-consent-desc" className="mt-2 text-sm leading-relaxed text-slate-300">
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
