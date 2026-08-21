import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Vercel Image Optimization returns 402 on this project.
    // Serve /public images directly so the portfolio renders without it.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "a.storyblok.com",
      },
    ],
  },
};

export default nextConfig;
