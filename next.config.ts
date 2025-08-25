import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'unilink-backend-production.up.railway.app', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '8080', pathname: '/**' },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
