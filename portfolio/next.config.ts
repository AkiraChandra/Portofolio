// File: next.config.ts - FIXED TO REMOVE POLYFILLS
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xzuzvdjronzjybrbgsct.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  webpack: (config, { dev, isServer }) => {
    // ✅ CRITICAL: Disable Node.js polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        process: false,  // ✅ Remove process polyfill
        buffer: false,   // ✅ Remove buffer polyfill
        stream: false,
        util: false,
        url: false,
        querystring: false,
        assert: false,
        http: false,
        https: false,
        zlib: false,
      };
    }

    // ✅ OPTIMIZED: Better chunk splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 10,        // Increase from 3
        maxAsyncRequests: 30,
        minSize: 20000,                // Increase min size
        maxSize: 100000,               // Decrease max size
        cacheGroups: {
          // ✅ React Core (smallest possible)
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-core',
            chunks: 'all',
            priority: 50,
            enforce: true,
            maxSize: 40000,  // Keep React small
          },
          
          // ✅ React Scheduler (separate)
          scheduler: {
            test: /[\\/]node_modules[\\/]scheduler[\\/]/,
            name: 'react-scheduler',
            chunks: 'all',
            priority: 45,
            enforce: true,
          },
          
          // ✅ JSX Runtime (separate)
          jsx: {
            test: /[\\/]node_modules[\\/]react[\\/]jsx-runtime/,
            name: 'jsx-runtime',
            chunks: 'all',
            priority: 44,
            enforce: true,
          },
          
          // ✅ Next.js runtime
          next: {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: 'next-runtime',
            chunks: 'all',
            priority: 40,
            maxSize: 60000,
          },
          
          // ✅ Framer Motion (async only)
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'async',  // Never in initial bundle
            priority: 35,
            enforce: true,
          },
          
          // ✅ UI Libraries
          ui: {
            test: /[\\/]node_modules[\\/](lucide-react)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 30,
            maxSize: 50000,
          },
          
          // ✅ Small vendors
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 10,
            maxSize: 50000,
            minChunks: 2,
          }
        }
      };
      
      // ✅ Tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.moduleIds = 'deterministic';
    }
    
    return config;
  },
};

export default nextConfig;