import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Allow the MCP SDK to work in Next.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Mark API routes as Node.js runtime
  experimental: {
    serverComponentsExternalPackages: ['@modelcontextprotocol/sdk'],
  },
};

export default nextConfig;
