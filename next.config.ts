import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/?$/, "");
    return [
      {
        source: "/proxy/:path*",
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
