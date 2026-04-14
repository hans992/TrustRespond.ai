import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Default Vitest patterns include **/*.spec.ts — exclude Playwright E2E specs in tests/e2e/.
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/tests/e2e/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*"
    ]
  }
});
