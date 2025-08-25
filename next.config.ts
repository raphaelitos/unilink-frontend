import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'unilink-backend-production.up.railway.app', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '8080', pathname: '/**' },
      { protocol: 'https', hostname: 'pub-2e1bb053d83a443db1e437521d180ac5.r2.dev', pathname: '/**' }
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
