const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function loadEnvForCli() {
  const { loadTrustRespondEnv } = require(path.join(__dirname, "..", "..", "playwright.env.cjs"));
  loadTrustRespondEnv();
}

/**
 * Paginated lookup — Admin API has no stable get-by-email in all versions.
 */
async function findAuthUserByEmail(adminAuth, email) {
  const want = email.toLowerCase();
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await adminAuth.listUsers({ page, perPage });
    if (error) throw error;
    const users = data.users ?? [];
    const found = users.find((u) => (u.email ?? "").toLowerCase() === want);
    if (found) return found;
    if (users.length < perPage) return null;
    page += 1;
  }
}

/**
 * Ensures the E2E email exists in auth and has a public.users row with org_id → organizations.
 * Requires SUPABASE_SERVICE_ROLE_KEY (+ NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL).
 */
async function seedE2eUser() {
  const email = process.env.E2E_USER_EMAIL?.trim();
  const password = process.env.E2E_USER_PASSWORD?.trim();
  if (!email || !password) {
    console.warn("[seed-e2e-user] Skip: E2E_USER_EMAIL / E2E_USER_PASSWORD not set.");
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "[seed-e2e-user] Missing NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY — cannot seed org for E2E."
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  let authUser = await findAuthUserByEmail(supabase.auth.admin, email);

  if (!authUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (error) {
      throw new Error(`[seed-e2e-user] auth.admin.createUser failed: ${error.message}`);
    }
    authUser = data.user;
    console.log("[seed-e2e-user] Created auth user:", email);
  } else {
    console.log("[seed-e2e-user] Auth user already exists:", email);
  }

  const userId = authUser.id;

  const { data: profile, error: profileErr } = await supabase.from("users").select("id, org_id").eq("id", userId).maybeSingle();
  if (profileErr) {
    throw new Error(`[seed-e2e-user] users select: ${profileErr.message}`);
  }

  let orgId = profile?.org_id ?? null;

  if (orgId) {
    const { data: orgRow, error: orgErr } = await supabase.from("organizations").select("id").eq("id", orgId).maybeSingle();
    if (!orgErr && orgRow?.id) {
      console.log("[seed-e2e-user] OK — user linked to org:", orgId);
      return;
    }
    console.warn("[seed-e2e-user] org_id missing or invalid on disk, re-linking…");
  }

  const orgName = process.env.E2E_ORG_NAME?.trim() || "E2E Golden Path Org";
  const { data: newOrg, error: insertOrgErr } = await supabase
    .from("organizations")
    .insert({ name: orgName, plan: "free" })
    .select("id")
    .single();

  if (insertOrgErr || !newOrg?.id) {
    throw new Error(`[seed-e2e-user] organizations insert failed: ${insertOrgErr?.message ?? "no id"}`);
  }

  orgId = newOrg.id;

  const { error: upsertErr } = await supabase.from("users").upsert(
    {
      id: userId,
      org_id: orgId,
      email,
      role: "owner",
      auth_provider: "email"
    },
    { onConflict: "id" }
  );

  if (upsertErr) {
    throw new Error(`[seed-e2e-user] users upsert failed: ${upsertErr.message}`);
  }

  console.log("[seed-e2e-user] Linked", email, "→ org", orgId);
}

module.exports = { seedE2eUser };

if (require.main === module) {
  loadEnvForCli();
  seedE2eUser().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
