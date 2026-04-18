"use client";

import { useCallback, useState } from "react";

export type BillingCycle = "monthly" | "annual";

export function useStripeCheckout() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const startCheckout = useCallback(async (planId: "starter" | "pro") => {
    setLoadingPlanId(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, billingCycle })
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        window.alert(data.error ?? "Unable to start checkout. Sign in and try again.");
        return;
      }
      window.location.href = data.url;
    } finally {
      setLoadingPlanId(null);
    }
  }, [billingCycle]);

  return { billingCycle, setBillingCycle, loadingPlanId, startCheckout };
}
