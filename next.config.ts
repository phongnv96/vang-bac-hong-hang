import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["chart.js"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
