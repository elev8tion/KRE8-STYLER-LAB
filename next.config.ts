import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // KRE8-Styler Lab dedicated port configuration
  // This app always runs on port 3009
  env: {
    PORT: '3009',
    NEXT_PUBLIC_PORT: '3009',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3009'
  },
  
  // Suppress workspace root warning
  outputFileTracingRoot: process.cwd(),
  
  // Additional config options
  reactStrictMode: true
};

export default nextConfig;
