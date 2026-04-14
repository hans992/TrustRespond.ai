/**
 * Golden-path E2E: needs a real Supabase-backed user and server env (GOOGLE_GENERATIVE_AI_API_KEY, etc.).
 * Credentials: E2E_USER_EMAIL / E2E_USER_PASSWORD — loaded in playwright.config via playwright.env.cjs (repo + apps/web).
 */
import path from "node:path";
import { test, expect, type TestInfo } from "@playwright/test";
import { FIXTURE_NAMES } from "../fixtures/fixture-names";

function fixtureDir(info: TestInfo) {
  const configFile = info.config.configFile;
  if (configFile) {
    return path.join(path.dirname(configFile), "tests", "fixtures", "generated");
  }
  return path.join(process.cwd(), "tests", "fixtures", "generated");
}

test.describe("golden path", () => {
  test("auth → PDF → Excel dry-run → AI generation → download", async ({ page }, testInfo) => {
    const email = process.env.E2E_USER_EMAIL?.trim();
    const password = process.env.E2E_USER_PASSWORD?.trim();
    if (!email || !password) {
      if (process.env.DEBUG_E2E_ENV) {
        console.log("[e2e-env] E2E_USER_EMAIL set:", Boolean(process.env.E2E_USER_EMAIL));
        console.log("[e2e-env] E2E_USER_PASSWORD set:", Boolean(process.env.E2E_USER_PASSWORD));
      }
      throw new Error(
        "Missing E2E_USER_EMAIL and/or E2E_USER_PASSWORD after loading .env files. " +
          "Add them to TrustRespond.ai/.env.local or apps/web/.env.local (see playwright.env.cjs). " +
          "Shell-only: set vars in the same terminal before playwright, or use DEBUG_E2E_ENV=1 to log."
      );
    }

    const fixturesDir = fixtureDir(testInfo);
    const pdfPath = path.join(fixturesDir, FIXTURE_NAMES.pdf);
    const xlsxPath = path.join(fixturesDir, FIXTURE_NAMES.xlsx);

    await page.goto("/auth/sign-in");
    await page.getByPlaceholder("you@company.com").fill(email!);
    await page.getByPlaceholder("Password").fill(password!);
    await Promise.all([page.waitForURL("**/app", { timeout: 30_000 }), page.getByRole("button", { name: "Sign in" }).click()]);

    const me = await page.request.get("/api/me");
    const meJson = (await me.json()) as { ok?: boolean; orgId?: string; error?: string };
    if (!me.ok() || !meJson.ok || !meJson.orgId) {
      throw new Error(
        `[e2e-preflight] Organization context not available after login. GET /api/me → ${me.status()} ${JSON.stringify(meJson)}. ` +
          "Run `npm run seed:e2e-user -w @trustrespond/web` with SUPABASE_SERVICE_ROLE_KEY and E2E_* set, or sign up once via /auth/sign-up."
      );
    }

    await page.goto("/app");
    const kbSection = page.locator("section").filter({ has: page.getByRole("heading", { name: "Knowledge Base Upload (PDF)" }) });
    await kbSection.locator('input[type="file"]').setInputFiles(pdfPath);
    const [uploadRes] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/knowledge/upload") && r.request().method() === "POST",
        { timeout: 180_000 }
      ),
      kbSection.getByRole("button", { name: "Upload PDF" }).click()
    ]);
    const uploadBody = await uploadRes.text();
    expect(uploadRes.ok(), `knowledge upload HTTP ${uploadRes.status()}: ${uploadBody.slice(0, 800)}`).toBeTruthy();

    await page.goto("/app/review");
    await page.locator('input[type="file"][accept=".xlsx"]').setInputFiles(xlsxPath);
    const [parseRes] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/questionnaires/parse") && r.request().method() === "POST",
        { timeout: 120_000 }
      ),
      page.getByRole("button", { name: "Run Dry-Run Parse" }).click()
    ]);
    const parseBody = await parseRes.text();
    expect(parseRes.ok(), `parse HTTP ${parseRes.status()}: ${parseBody.slice(0, 800)}`).toBeTruthy();

    await expect(page.getByRole("heading", { name: "Mapping Confirmation" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Detected Mapping" })).toBeVisible();
    await expect(page.getByText(/Questions are in column/)).toBeVisible();
    await expect(page.getByText(/Answers will be written to/)).toBeVisible();

    await page.getByRole("button", { name: "Confirm & Start AI Generation" }).click();
    const generateRes = await page.waitForResponse(
      (r) => r.url().includes("/generate") && r.request().method() === "POST",
      { timeout: 240_000 }
    );
    const generateText = await generateRes.text();
    expect(generateRes.ok(), `generate HTTP ${generateRes.status()}: ${generateText.slice(0, 800)}`).toBeTruthy();
    const generateJson = JSON.parse(generateText) as { ok?: boolean };
    expect(generateJson.ok, `generate failed: ${generateText.slice(0, 800)}`).toBeTruthy();

    await page.waitForResponse(
      (r) => r.url().includes("/export") && r.request().method() === "POST",
      { timeout: 120_000 }
    );

    const downloadLink = page.getByRole("link", { name: "Download Completed Excel" });
    await expect(downloadLink).toBeVisible({ timeout: 60_000 });
    await expect(downloadLink).toBeEnabled();
  });
});
