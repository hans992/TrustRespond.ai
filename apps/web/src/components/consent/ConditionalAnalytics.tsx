"use client";

import { Analytics } from "@vercel/analytics/next";
import { useSyncExternalStore } from "react";
import {
  CONSENT_CHANGED_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  type CookieConsentChoice,
} from "@/lib/cookie-consent";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CONSENT_CHANGED_EVENT, onStoreChange);
  return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onStoreChange);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) === ("all" satisfies CookieConsentChoice);
}

function getServerSnapshot(): boolean {
  return false;
}

export function ConditionalAnalytics() {
  const allow = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!allow) return null;
  return <Analytics />;
}
