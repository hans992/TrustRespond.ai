import { defineConfig, devices } from "@playwright/test";

const { loadTrustRespondEnv } = require("./playwright.env.cjs") as { loadTrustRespondEnv: () => void };
loadTrustRespondEnv();

/**
 * E2E: E2E_USER_EMAIL / E2E_USER_PASSWORD — see playwright.env.cjs for load order (repo + apps/web .env files).
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 300_000,
  globalSetup: "./tests/global-setup.cjs",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    actionTimeout: 60_000,
    navigationTimeout: 60_000
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
