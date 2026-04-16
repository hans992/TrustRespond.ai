import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export async function getCurrentOrgContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const admin = createServiceRoleSupabaseClient();
  if (admin) {
    const { data, error } = await admin.from("users").select("org_id").eq("id", user.id).maybeSingle();
    if (!error && data?.org_id) {
      return { supabase, userId: user.id, orgId: data.org_id as string };
    }
  }

  const { data, error } = await supabase.from("users").select("org_id").eq("id", user.id).single();
  if (error || !data?.org_id) {
    throw new Error("Unable to resolve organization context");
  }

  return { supabase, userId: user.id, orgId: data.org_id as string };
}
