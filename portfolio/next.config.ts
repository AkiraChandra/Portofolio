import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Existing configurations
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimasi Gambar
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xzuzvdjronzjybrbgsct.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Optimasi Experimental
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    
    // Tambahan optimasi
    webpackBuildWorker: true,
    optimisticClientCache: true,
  },

  // Compiler Optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    
    // Tambahan reactRemoveProperties untuk produksi
    reactRemoveProperties: process.env.NODE_ENV === 'production' 
      ? { properties: ['^data-testid$'] } 
      : {},
  },

  // Optimasi Performa
  productionBrowserSourceMaps: false,
  compress: true,

  // Webpack Configuration
  webpack: (config, { dev, isServer }) => {
    // Alias untuk optimasi
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'framer-motion': 'framer-motion',
      }
    }
    
    // Konfigurasi Split Chunks yang Lebih Agresif
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 3,
        maxAsyncRequests: 5,
        minSize: 10000,  // Turunkan dari 20000
        maxSize: 200000, // Batasi ukuran maksimal
        minChunks: 1,
        
        // Cache Groups yang Lebih Spesifik
        cacheGroups: {
          // Vendor untuk library eksternal
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
            enforce: true,
            name(module: { context: string }): string {
              // Nama chunk berdasarkan modul utama
              const packageName: string = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1] || '';
              return `npm.${packageName.replace('@', '')}`;
            },
          },
          
          // Common chunks untuk kode internal
          common: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            test: /[\\/]src[\\/]/,
          },
          
          // Chunk untuk styles
          styles: {
            name: 'styles',
            test: /\.(css|scss)$/,
            chunks: 'all',
            enforce: true,
            priority: 10,
          },
        },
      };

      // Optimasi tambahan
      config.optimization.moduleIds = 'deterministic';
      config.optimization.runtimeChunk = 'single';
      
      // Aktifkan tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = true;
    }
    
    return config;
  },
};

export default nextConfig;