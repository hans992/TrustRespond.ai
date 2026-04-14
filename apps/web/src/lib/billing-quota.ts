import type { SupabaseClient } from "@supabase/supabase-js";

export interface QuotaPayload {
  used: number;
  remaining: number | null;
  limit: number | null;
  yearMonth: string;
}

function parseQuotaRow(data: unknown): QuotaPayload {
  const o = data as Record<string, unknown>;
  const lim = o.limit;
  const rem = o.remaining;
  return {
    used: Number(o.used ?? 0),
    remaining: rem === null || rem === undefined ? null : Number(rem),
    limit: lim === null || lim === undefined ? null : Number(lim),
    yearMonth: String(o.yearMonth ?? "")
  };
}

/** Increments usage for the current UTC month; requires authenticated Supabase client (JWT). */
export async function reserveQuestionnaireQuota(
  supabase: SupabaseClient,
  orgId: string
): Promise<QuotaPayload> {
  const { data, error } = await supabase.rpc("reserve_questionnaire_quota", { p_org_id: orgId });
  if (error) throw new Error(error.message);
  return parseQuotaRow(data);
}

/** Current month usage without incrementing. */
export async function getQuestionnaireQuotaStatus(
  supabase: SupabaseClient,
  orgId: string
): Promise<QuotaPayload> {
  const { data, error } = await supabase.rpc("get_questionnaire_quota_status", { p_org_id: orgId });
  if (error) throw new Error(error.message);
  return parseQuotaRow(data);
}
