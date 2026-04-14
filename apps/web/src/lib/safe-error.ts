/**
 * Message safe to return to API clients in production (avoid DB/driver internals).
 */
export function publicErrorMessage(error: unknown, fallback = "Request failed"): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (process.env.NODE_ENV === "development") {
    return msg;
  }
  if (msg.length > 320) {
    return fallback;
  }
  const lower = msg.toLowerCase();
  if (
    lower.includes("postgres") ||
    lower.includes("relation ") ||
    lower.includes("duplicate key") ||
    lower.includes("violates") ||
    lower.includes("supabase") ||
    /rpc.*not found/i.test(msg)
  ) {
    return fallback;
  }
  return msg;
}
