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

  webpack: (config: any, { dev, isServer }: any) => {
    // ✅ CRITICAL FIX: Disable Node.js polyfills
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        process: false,
        buffer: false,
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

    if (!dev && !isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 15,
        maxAsyncRequests: 30,
        minSize: 20000,        
        maxSize: 80000,
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-core',
            chunks: 'all',
            priority: 50,
            enforce: true,
            maxSize: 50000,
          },
          scheduler: {
            test: /[\\/]node_modules[\\/]scheduler[\\/]/,
            name: 'react-scheduler',
            chunks: 'all',
            priority: 45,
            enforce: true,
          },
          jsx: {
            test: /[\\/]node_modules[\\/]react[\\/]jsx-runtime/,
            name: 'jsx-runtime',
            chunks: 'all',
            priority: 44,
            enforce: true,
          },
          next: {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: 'next-runtime',
            chunks: 'all',
            priority: 40,
            maxSize: 60000,
          },
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'async',
            priority: 35,
            enforce: true,
          },
          ui: {
            test: /[\\/]node_modules[\\/](lucide-react)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 30,
            maxSize: 50000,
          },
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
      
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.moduleIds = 'deterministic';
    }
    
    return config;
  },
};

export default nextConfig;