import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export interface QuotaPayload {
  used: number;
  remaining: number | null;
  limit: number | null;
  yearMonth: string;
}

const quotaRowSchema = z
  .object({
    used: z.coerce.number(),
    remaining: z.coerce.number().nullable(),
    limit: z.coerce.number().nullable(),
    yearMonth: z.coerce.string()
  })
  .passthrough();

function parseQuotaRow(data: unknown): QuotaPayload {
  const o = quotaRowSchema.parse(data);
  return {
    used: o.used,
    remaining: o.remaining,
    limit: o.limit,
    yearMonth: o.yearMonth
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
