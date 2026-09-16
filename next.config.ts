import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
