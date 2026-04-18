import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(__dirname, "..", "..");

/** Hoisted workspace deps live at repo root; Vercel NFT must include pdf.worker.mjs + native canvas. */
const hoistedNodeModules = (pkg: string) =>
  path.join("..", "..", "node_modules", pkg, "**", "*").replace(/\\/g, "/");

const pdfTraceIncludes = [
  hoistedNodeModules("pdfjs-dist"),
  hoistedNodeModules("@napi-rs/canvas"),
  hoistedNodeModules("pdf-parse")
];

const nextConfig: NextConfig = {
  typedRoutes: true,
  outputFileTracingRoot: monorepoRoot,
  outputFileTracingIncludes: {
    // App Router route for knowledge upload (normalizeAppPath → /api/knowledge/upload)
    "/api/knowledge/upload": pdfTraceIncludes,
    // Fallback if route matching differs between bundlers
    "**/*": pdfTraceIncludes
  },
  // pdf-parse / pdfjs worker paths break when bundled by Turbopack.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "@napi-rs/canvas"],
  async redirects() {
    return [{ source: "/signup", destination: "/auth/sign-up", permanent: true }];
  }
};

export default nextConfig;
