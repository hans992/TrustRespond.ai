import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function planTierToDb(tier: string | undefined): "starter" | "pro" | null {
  if (tier === "starter" || tier === "pro") return tier;
  return null;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ ok: false, error: "Webhook not configured" }, { status: 500 });
  }
  if (!sig) {
    return NextResponse.json({ ok: false, error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const admin = createServiceRoleSupabaseClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Service role not configured" }, { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const orgId = session.metadata?.org_id ?? session.client_reference_id ?? undefined;
        const planTier = planTierToDb(session.metadata?.plan_tier);
        if (!orgId || !planTier) {
          console.error("checkout.session.completed missing org_id or plan_tier", session.id);
          break;
        }

        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

        const { error } = await admin
          .from("organizations")
          .update({
            plan: planTier,
            ...(customerId ? { stripe_customer_id: customerId } : {}),
            updated_at: new Date().toISOString()
          })
          .eq("id", orgId);

        if (error) {
          console.error("Failed to update organization after checkout", error);
          return NextResponse.json({ ok: false, error: "Database update failed" }, { status: 500 });
        }
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const parent = invoice.parent;
        if (parent?.type !== "subscription_details" || !parent.subscription_details) {
          break;
        }

        const snap = parent.subscription_details;
        let orgId = snap.metadata?.org_id;
        let planTier = planTierToDb(snap.metadata?.plan_tier);
        let customerId: string | null =
          typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id ?? null;

        const subField = snap.subscription;
        const subscriptionId =
          typeof subField === "string" ? subField : typeof subField === "object" && subField ? subField.id : null;

        if ((!orgId || !planTier) && subscriptionId) {
          const sub = await getStripe().subscriptions.retrieve(subscriptionId);
          orgId = sub.metadata?.org_id ?? orgId;
          planTier = planTierToDb(sub.metadata?.plan_tier) ?? planTier;
          if (!customerId) {
            customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;
          }
        }

        if (!orgId || !planTier) break;

        const { error } = await admin
          .from("organizations")
          .update({
            plan: planTier,
            ...(customerId ? { stripe_customer_id: customerId } : {}),
            updated_at: new Date().toISOString()
          })
          .eq("id", orgId);

        if (error) {
          console.error("Failed to update organization on invoice payment", error);
          return NextResponse.json({ ok: false, error: "Database update failed" }, { status: 500 });
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("Webhook handler error", e);
    return NextResponse.json({ ok: false, error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
