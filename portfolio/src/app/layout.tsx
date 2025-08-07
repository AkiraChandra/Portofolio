// File: src/app/layout.tsx - REPLACE EXISTING
// Enhanced Root Layout dengan Activity Lifecycle Provider Integration

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { ActivityLifecycleProvider } from "@/contexts/ActivityLifecycleContext";
import "./globals.css";

// ===============================================================
// FONT OPTIMIZATION
// ===============================================================

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Optimized - reduced from 9 weights to 3
  variable: "--font-poppins",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

// ===============================================================
// ENHANCED METADATA FOR SEO & PERFORMANCE
// ===============================================================

export const metadata: Metadata = {
  title: {
    default: "Akira Chandra Portfolio",
    template: "%s | Akira Chandra",
  },
  description:
    "Full Stack Developer specializing in modern web technologies and creative solutions. Experienced in React, Next.js, TypeScript, and mobile development.",
  keywords: [
    "Full Stack Developer",
    "React Developer", 
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "System Analyst",
    "Akira Chandra",
    "Portfolio"
  ],
  authors: [{ name: "Akira Chandra" }],
  creator: "Akira Chandra",
  publisher: "Akira Chandra",
  
  // Performance & SEO Metadata
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://akirachandra.dev'),
  alternates: {
    canonical: "/",
  },
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Akira Chandra - Full Stack Developer Portfolio",
    description:
      "Full Stack Developer specializing in modern web technologies and creative solutions.",
    siteName: "Akira Chandra Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Akira Chandra Portfolio",
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Akira Chandra - Full Stack Developer Portfolio",
    description:
      "Full Stack Developer specializing in modern web technologies and creative solutions.",
    images: ["/og-image.png"],
    creator: "@akirachandra",
  },
  
  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
  
  // Performance Hints
  other: {
    "X-UA-Compatible": "IE=edge",
    "theme-color": "#667eea",
  },
};

// ===============================================================
// VIEWPORT CONFIGURATION
// ===============================================================

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

// ===============================================================
// ROOT LAYOUT COMPONENT
// ===============================================================

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={poppins.variable}
    >
      <head>
        {/* =============================================================== */}
        {/* CRITICAL RESOURCE HINTS FOR PERFORMANCE */}
        {/* =============================================================== */}
        
        {/* Preconnect to external domains */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        
        {/* DNS Prefetch for faster lookups */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/poppins-v20-latin-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* =============================================================== */}
        {/* CRITICAL CSS INLINE FOR PERFORMANCE */}
        {/* =============================================================== */}
        
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for immediate rendering */
            *,*::before,*::after{box-sizing:border-box}
            html{scroll-behavior:smooth;overflow-x:hidden}
            body{
              margin:0;
              padding:0;
              font-family:var(--font-poppins),system-ui,sans-serif;
              background:#0a0a0a;
              color:#ffffff;
              overflow-x:hidden;
              min-height:100vh;
              line-height:1.6;
            }
            
            /* Activity Lifecycle Critical Styles */
            .section-active{
              z-index:10;
              will-change:contents;
            }
            .section-inactive{
              z-index:1;
              will-change:auto;
            }
            .section-visible{
              opacity:1;
              pointer-events:auto;
            }
            .section-hidden{
              opacity:0.3;
              pointer-events:none;
            }
            
            /* Performance optimizations */
            .active-section{
              contain:layout style paint;
              content-visibility:auto;
              contain-intrinsic-size:100vh;
            }
            
            /* Loading states */
            .typewriter-container{
              display:inline-block;
              min-height:1.2em;
            }
            .typewriter-cursor{
              animation:blink 1s infinite;
            }
            @keyframes blink{0%,50%{opacity:1}51%,100%{opacity:0}}
            
            /* Scroll optimizations */
            .scroll-smooth{
              scroll-behavior:smooth;
              -webkit-overflow-scrolling:touch;
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion:reduce){
              *,*::before,*::after{
                animation-duration:0.01ms!important;
                animation-iteration-count:1!important;
                transition-duration:0.01ms!important;
              }
              html{scroll-behavior:auto}
            }
            
            /* High contrast mode support */
            @media (prefers-contrast:high){
              .text-primary{color:#ffffff!important}
              .bg-primary{background:#000000!important}
            }
          `
        }} />

        {/* =============================================================== */}
        {/* PERFORMANCE MONITORING (Development Only) */}
        {/* =============================================================== */}
        
        {process.env.NODE_ENV === 'development' && (
          <script dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring for development
              window.addEventListener('load', () => {
                if ('performance' in window) {
                  const perfData = performance.getEntriesByType('navigation')[0];
                  console.log('🚀 Page Load Performance:', {
                    DOMContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    LoadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                    TotalLoadTime: perfData.loadEventEnd - perfData.fetchStart
                  });
                }
              });
              
              // Monitor memory usage
              if ('memory' in performance) {
                setInterval(() => {
                  const memory = performance.memory;
                  if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB threshold
                    console.warn('⚠️ High memory usage:', Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB');
                  }
                }, 10000);
              }
            `
          }} />
        )}

        {/* =============================================================== */}
        {/* STRUCTURED DATA FOR SEO */}
        {/* =============================================================== */}
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Akira Chandra",
              "jobTitle": "Full Stack Developer",
              "description": "Full Stack Developer specializing in modern web technologies and creative solutions",
              "url": process.env.NEXT_PUBLIC_BASE_URL || "https://akirachandra.dev",
              "sameAs": [
                "https://github.com/akirachandra",
                "https://linkedin.com/in/akirachandra",
                "https://twitter.com/akirachandra"
              ],
              "knowsAbout": [
                "React",
                "Next.js", 
                "TypeScript",
                "JavaScript",
                "Node.js",
                "Web Development",
                "Mobile Development",
                "UI/UX Design"
              ],
              "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "Bina Nusantara University"
              },
              "worksFor": {
                "@type": "Organization",
                "name": "Bina Nusantara IT Division"
              }
            })
          }}
        />
      </head>

      <body className={`
        ${poppins.className}
        bg-background-primary dark:bg-background-primary-dark
        text-text-primary dark:text-text-primary-dark
        antialiased
        selection:bg-primary/20 selection:text-primary
        dark:selection:bg-primary-dark/20 dark:selection:text-primary-dark
      `}>
        {/* =============================================================== */}
        {/* PROVIDER HIERARCHY - Order matters for performance */}
        {/* =============================================================== */}
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <ActivityLifecycleProvider 
            debugMode={process.env.NODE_ENV === 'development'}
          >
            {/* Main Application Content */}
            <div id="__next" className="relative">
              {children}
            </div>

            {/* =============================================================== */}
            {/* GLOBAL OVERLAYS & MODALS */}
            {/* =============================================================== */}
            
            {/* Portal for modals, toasts, etc. */}
            <div id="modal-root" />
            <div id="toast-root" />
            
            {/* =============================================================== */}
            {/* ACCESSIBILITY ENHANCEMENTS */}
            {/* =============================================================== */}
            
            {/* Skip to main content link */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-white rounded-lg font-medium transition-all duration-200"
            >
              Skip to main content
            </a>

            {/* Focus visible styles */}
            <style jsx global>{`
              .focus-visible {
                outline: 2px solid var(--color-primary);
                outline-offset: 2px;
              }
            `}</style>
          </ActivityLifecycleProvider>
        </ThemeProvider>

        {/* =============================================================== */}
        {/* PERFORMANCE ANALYTICS (Production) */}
        {/* =============================================================== */}
        
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                  
                  // Track Core Web Vitals
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    custom_map: {
                      'custom_parameter_1': 'CLS',
                      'custom_parameter_2': 'FID', 
                      'custom_parameter_3': 'FCP',
                      'custom_parameter_4': 'LCP',
                      'custom_parameter_5': 'TTFB'
                    }
                  });
                `
              }}
            />
          </>
        )}

        {/* =============================================================== */}
        {/* SERVICE WORKER REGISTRATION */}
        {/* =============================================================== */}
        
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                      .then(registration => {
                        console.log('✅ SW registered:', registration);
                      })
                      .catch(error => {
                        console.log('❌ SW registration failed:', error);
                      });
                  });
                }
              `
            }}
          />
        )}
      </body>
    </html>
  );
}