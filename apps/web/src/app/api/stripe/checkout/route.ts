import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentOrgContext } from "@/lib/org";
import { publicErrorMessage } from "@/lib/safe-error";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const bodySchema = z.object({
  plan: z.enum(["starter", "pro"]),
  billingCycle: z.enum(["monthly", "annual"])
});

function resolvePriceId(plan: "starter" | "pro", billingCycle: "monthly" | "annual"): string | undefined {
  const envMap = {
    starter: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER_MONTHLY,
      annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER_ANNUAL
    },
    pro: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
      annual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_ANNUAL
    }
  } as const;
  return envMap[plan][billingCycle];
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
    }
    const { plan, billingCycle } = parsed.data;

    const priceId = resolvePriceId(plan, billingCycle);
    if (!priceId?.startsWith("price_")) {
      return NextResponse.json(
        { ok: false, error: "Stripe price is not configured for this plan and billing cycle" },
        { status: 400 }
      );
    }

    const ctx = await getCurrentOrgContext();
    const {
      data: { user },
      error: userErr
    } = await ctx.supabase.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const origin = new URL(request.url).origin;
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: ctx.orgId,
      customer_email: user.email ?? undefined,
      metadata: {
        org_id: ctx.orgId,
        plan_tier: plan
      },
      subscription_data: {
        metadata: {
          org_id: ctx.orgId,
          plan_tier: plan
        }
      },
      success_url: `${origin}/app?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancel#pricing`
    });

    if (!session.url) {
      return NextResponse.json({ ok: false, error: "Unable to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (error) {
    const message = publicErrorMessage(error, "Unable to start checkout");
    const status =
      message === "Unauthorized" || message.includes("Unable to resolve organization") ? 401 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
