import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Supabase client with the service role key (bypasses RLS). Callers must enforce tenancy:
 * resolve the authenticated user and org (e.g. `getCurrentOrgContext`), then scope every
 * query and storage path with that `orgId`, or use helpers such as `fetchQuestionnaireForOrg`.
 * Trusted server-only paths (e.g. Stripe webhooks) must validate the event before writing.
 */
export function createServiceRoleSupabaseClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return null;
  }

  return createClient(supabaseEnv.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
