import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend-lamipak.webtesting.pw',
      },
      {
        protocol: 'http',
        hostname: 'backend-lamipak.webtesting.pw',
      },
      {
        protocol: 'https',
        hostname: 'lamipak.webtesting.pw',
      },
      {
        protocol: 'http',
        hostname: 'lamipak.webtesting.pw',
      },
    ],
  },
};

export default nextConfig;
