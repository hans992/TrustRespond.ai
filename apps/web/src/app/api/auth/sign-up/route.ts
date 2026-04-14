import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const orgName = String(form.get("orgName") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error || !data.user) {
    return NextResponse.redirect(new URL(`/auth/sign-up?error=${encodeURIComponent(error?.message ?? "Sign up failed")}`, request.url));
  }

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({ name: orgName || "New Organization", plan: "free" })
    .select("id")
    .single();

  if (orgError || !org?.id) {
    return NextResponse.redirect(new URL(`/auth/sign-up?error=${encodeURIComponent(orgError?.message ?? "Org setup failed")}`, request.url));
  }

  const { error: userError } = await supabase.from("users").insert({
    id: data.user.id,
    org_id: org.id,
    email,
    role: "owner",
    auth_provider: "email"
  });

  if (userError) {
    return NextResponse.redirect(new URL(`/auth/sign-up?error=${encodeURIComponent(userError.message)}`, request.url));
  }

  return NextResponse.redirect(new URL("/app", request.url));
}
