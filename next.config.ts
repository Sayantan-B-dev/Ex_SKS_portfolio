import type { NextConfig } from "next";

/**
 * Studio-added gallery photos are served from the account's own ImageKit URL
 * endpoint, so `next/image` needs that exact endpoint whitelisted : host and the
 * endpoint's path, nothing else on the shared ImageKit domain.
 */
function imageKitPattern() {
  const endpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim();
  if (!endpoint) return [];
  try {
    const url = new URL(endpoint);
    return [
      {
        protocol: "https" as const,
        hostname: url.hostname,
        pathname: `${url.pathname.replace(/\/+$/, "")}/**`,
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Studio image uploads travel as Server Action bodies. Next caps those at
      // 1MB by default, which surfaced as a raw 500 on /blog/admin. `lib/image-limits.ts`
      // keeps the client-side cap just under this so an oversized file is reported
      // in the form instead of failing here.
      bodySizeLimit: "3mb",
    },
  },
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      ...imageKitPattern(),
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ],
    },
    {
      source: "/images/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};

export default nextConfig;
