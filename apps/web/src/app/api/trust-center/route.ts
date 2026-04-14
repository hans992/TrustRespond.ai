import { NextResponse } from "next/server";
import { trustCenterPages } from "@/lib/mock-store";

export async function GET() {
  return NextResponse.json({ ok: true, pages: trustCenterPages });
}
