import { NextResponse } from "next/server";
import { getCurrentOrgContext } from "@/lib/org";

/**
 * Session + org linkage check (used by E2E preflight). Returns 401 if unauthenticated or no org row.
 */
export async function GET() {
  try {
    const ctx = await getCurrentOrgContext();
    return NextResponse.json({ ok: true, userId: ctx.userId, orgId: ctx.orgId });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unauthorized";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
