import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xzuzvdjronzjybrbgsct.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ]
  },
}

module.exports = nextConfig

export default nextConfig;
