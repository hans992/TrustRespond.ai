import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  // pdf-parse / pdfjs worker paths break when bundled by Turbopack.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "@napi-rs/canvas"],
  async redirects() {
    return [{ source: "/signup", destination: "/auth/sign-up", permanent: true }];
  }
};

export default nextConfig;
