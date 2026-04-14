const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

/**
 * Load `.env` / `.env.local` from the monorepo root and from `apps/web`.
 * Uses __dirname (this file always lives in `apps/web/`) — not `process.cwd()`.
 *
 * When `npm -w @trustrespond/web` runs Playwright, cwd is `apps/web`, so only
 * `path.resolve(cwd, ".env.local")` was reading `apps/web/.env.local` — variables
 * placed only in the repo root `.env.local` were never loaded (classic monorepo gotcha).
 */
function loadTrustRespondEnv() {
  const appsWebRoot = __dirname;
  const repoRoot = path.resolve(appsWebRoot, "..", "..");

  const files = [
    path.join(repoRoot, ".env"),
    path.join(repoRoot, ".env.local"),
    path.join(appsWebRoot, ".env"),
    path.join(appsWebRoot, ".env.local")
  ];

  for (const file of files) {
    if (fs.existsSync(file)) {
      dotenv.config({ path: file, override: true });
    }
  }
}

module.exports = { loadTrustRespondEnv };
