import type { NextConfig } from "next";

const wordpressHost = (() => {
  try {
    const raw = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://cms.thesportsrivalry.com";
    return new URL(raw).hostname;
  } catch {
    return "cms.thesportsrivalry.com";
  }
})();

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
        hostname: wordpressHost,
      },
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
