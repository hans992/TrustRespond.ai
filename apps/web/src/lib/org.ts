import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentOrgContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase.from("users").select("org_id").eq("id", user.id).single();
  if (error || !data?.org_id) {
    throw new Error("Unable to resolve organization context");
  }

  return { supabase, userId: user.id, orgId: data.org_id as string };
}
