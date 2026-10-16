// next.config.ts
import type { NextConfig } from "next";

// ============================================
// Force IPv4 for ALL server-side network requests
// (Fixes IPv6 ENETUNREACH / fetch failed errors)
// ============================================
if (typeof process !== "undefined") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dns = require("dns");
    if (dns && typeof dns.setDefaultResultOrder === "function") {
      dns.setDefaultResultOrder("ipv4first");
    }
  } catch (err) {
    // Ignore — runs in edge runtime sometimes
  }
}

const nextConfig: NextConfig = {
  // 👇 Allow 127.0.0.1 for dev (Next.js 16 blocks cross-origin by default)
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "127.0.0.1:3000",
    "localhost:3000",
    "0.0.0.0",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.sanishtech.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
      	protocol: "https",
      	hostname: "i.postimg.cc",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;