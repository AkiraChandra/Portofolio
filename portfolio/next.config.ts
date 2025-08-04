import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // ✅ STATIC FILES OPTIMIZATION
  poweredByHeader: false,
  compress: true,
  
  // ✅ IMAGES CONFIGURATION
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
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
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // ✅ EXPERIMENTAL FEATURES - CSS FIX (Fixed for Next.js 15)
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    turbo: {},
    cssChunking: 'strict', // ✅ FIX CSS Build Issues
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'TTFB'],
    serverMinification: true,
    // ✅ REMOVED: optimizeCss (deprecated in Next.js 15)
    // ✅ REMOVED: optimizeServerReact (deprecated)
    // ✅ REMOVED: gzipSize (deprecated)
  },

  // ✅ COMPILER OPTIMIZATIONS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // ✅ HEADERS FOR PERFORMANCE
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Static assets caching
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ✅ FIXED REDIRECTS (Removed invalid 'missing' type)
  async redirects() {
    return [
      // ✅ REMOVED invalid 'missing' configuration
      // Handle 404s through 404.tsx instead
    ];
  },

  // ✅ WEBPACK OPTIMIZATION
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

    // ✅ PRODUCTION OPTIMIZATIONS
    if (!dev && !isServer) {
      config.optimization = config.optimization || {};
      
      // ✅ ENHANCED SPLIT CHUNKS
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 20,
        maxAsyncRequests: 35,
        minSize: 15000,
        maxSize: 60000,
        cacheGroups: {
          // ✅ CRITICAL: React Core (highest priority)
          'react-core': {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react-core',
            chunks: 'all',
            priority: 60,
            enforce: true,
            maxSize: 45000,
          },
          
          // ✅ React Scheduler (separate for better caching)
          'react-scheduler': {
            test: /[\\/]node_modules[\\/]scheduler[\\/]/,
            name: 'react-scheduler',
            chunks: 'all',
            priority: 55,
            enforce: true,
            maxSize: 25000,
          },
          
          // ✅ JSX Runtime (separate chunk)
          'jsx-runtime': {
            test: /[\\/]node_modules[\\/]react[\\/]jsx-runtime/,
            name: 'jsx-runtime',
            chunks: 'all',
            priority: 54,
            enforce: true,
            maxSize: 20000,
          },
          
          // ✅ Next.js Runtime
          'next-runtime': {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: 'next-runtime',
            chunks: 'all',
            priority: 50,
            maxSize: 55000,
          },
          
          // ✅ Framer Motion (async only - don't block initial)
          'framer-motion': {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'async',
            priority: 45,
            enforce: true,
            maxSize: 70000,
          },
          
          // ✅ UI Libraries (icons, etc.)
          'ui-libs': {
            test: /[\\/]node_modules[\\/](lucide-react|react-icons)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 40,
            maxSize: 40000,
          },
          
          // ✅ Small vendor libraries
          'vendor-small': {
            test: /[\\/]node_modules[\\/]/,
            name(module: any) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
              return `vendor-${packageName?.replace('@', '')}`;
            },
            chunks: 'all',
            priority: 25,
            maxSize: 35000,
            minChunks: 1,
            minSize: 10000,
          },
          
          // ✅ Page-specific chunks
          'page-chunks': {
            test: /[\\/]src[\\/](components|app)[\\/]/,
            name: 'page-chunks',
            chunks: 'all',
            priority: 20,
            maxSize: 30000,
            minChunks: 2,
          },
          
          // ✅ Common utilities
          'utils': {
            test: /[\\/]src[\\/](utils|hooks|lib)[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 15,
            maxSize: 25000,
            minChunks: 2,
          },
          
          // ✅ Default vendor chunk (lowest priority)
          'default-vendor': {
            test: /[\\/]node_modules[\\/]/,
            name: 'default-vendor',
            chunks: 'all',
            priority: 10,
            maxSize: 40000,
            minChunks: 2,
          },
        }
      };
      
      // ✅ ADDITIONAL OPTIMIZATIONS
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
      config.optimization.mangleExports = true;
      config.optimization.innerGraph = true;
      
      // ✅ PERFORMANCE BUDGETS
      config.performance = {
        maxAssetSize: 200000,
        maxEntrypointSize: 250000,
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
        assetFilter: function(assetFilename: string) {
          return /\.(js|css)$/.test(assetFilename);
        },
      };
    }
    
    // ✅ DEVELOPMENT OPTIMIZATIONS
    if (dev) {
      config.optimization = config.optimization || {};
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
    }
    
    return config;
  },

  // ✅ OUTPUT CONFIGURATION
  output: 'standalone',
  
  // ✅ TYPESCRIPT CONFIGURATION
  typescript: {
    ignoreBuildErrors: false,
  },

  // ✅ REMOVED: swcMinify (deprecated in Next.js 15 - enabled by default)
  
  // ✅ ENVIRONMENT VARIABLES
  env: {
    CUSTOM_KEY: 'portfolio-app',
  },
};

export default nextConfig;