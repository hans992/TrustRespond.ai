import { NextResponse } from "next/server";
import { BillingService } from "@trustrespond/db";

const billing = new BillingService();

export async function POST(request: Request) {
  const body = (await request.json()) as { orgId: string; tier: "free" | "starter" | "pro" | "enterprise" };
  const usage = billing.reserveQuestionnaireUsage(body.orgId, body.tier);
  return NextResponse.json({ ok: true, usage });
}
