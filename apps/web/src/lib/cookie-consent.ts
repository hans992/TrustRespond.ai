export const COOKIE_CONSENT_STORAGE_KEY = "trustrespond_cookie_consent";

export type CookieConsentChoice = "essential" | "all";

export const CONSENT_CHANGED_EVENT = "trustrespond-consent-changed";

export function getStoredCookieConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (raw === "essential" || raw === "all") return raw;
  return null;
}

export function setCookieConsent(choice: CookieConsentChoice): void {
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT));
}
