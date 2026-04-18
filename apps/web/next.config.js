const path = require("node:path");

const monorepoRoot = path.join(__dirname, "..", "..");

/** Hoisted workspace deps live at repo root; Vercel NFT must include pdf.worker.mjs + native canvas. */
function hoistedNodeModules(pkg) {
  return path.join("..", "..", "node_modules", pkg, "**", "*").replace(/\\/g, "/");
}

const pdfTraceIncludes = [
  hoistedNodeModules("pdfjs-dist"),
  hoistedNodeModules("@napi-rs/canvas"),
  hoistedNodeModules("pdf-parse")
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  outputFileTracingRoot: monorepoRoot,
  outputFileTracingIncludes: {
    "/api/knowledge/upload": pdfTraceIncludes,
    "**/*": pdfTraceIncludes
  },
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "@napi-rs/canvas"],
  async redirects() {
    return [{ source: "/signup", destination: "/auth/sign-up", permanent: true }];
  }
};

module.exports = nextConfig;
