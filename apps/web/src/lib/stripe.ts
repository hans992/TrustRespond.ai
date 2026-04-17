import Stripe from "stripe";

/** Pinned to the API version shipped with the installed `stripe` package. */
const API_VERSION = "2026-03-25.dahlia" as const;

let client: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!client) {
    client = new Stripe(key, { apiVersion: API_VERSION });
  }
  return client;
}
