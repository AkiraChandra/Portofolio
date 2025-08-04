// src/app/layout.tsx - COMPLETE OPTIMIZED FOR PERFORMANCE
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import "./globals.css";
import { AnimationProvider } from "@/contexts/AnimationContext";

// OPTIMIZATION 1: Reduce font weights from 9 to 3 (saves ~150KB)
// Only load weights that are actually used in the project
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Removed: 100,200,300,700,800,900
  variable: "--font-poppins",
  display: "swap", // Already optimal
  preload: true, // Ensure font is preloaded
  fallback: ["system-ui", "arial"], // Add fallback fonts
});

// OPTIMIZATION 2: Enhanced metadata for SEO and performance
export const metadata: Metadata = {
  title: {
    default: "Akira Chandra Portfolio",
    template: "%s | Akira Chandra",
  },
  description:
    "Full Stack Developer specializing in modern web technologies and creative solutions. Experienced in React, Next.js, TypeScript, and mobile development.",
  keywords: [
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "JavaScript",
    "Portfolio",
    "Akira Chandra",
  ],
  authors: [{ name: "Akira Chandra" }],
  creator: "Akira Chandra",
  publisher: "Akira Chandra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.akirachandra.my.id"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.akirachandra.my.id",
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
  twitter: {
    card: "summary_large_image",
    title: "Akira Chandra - Full Stack Developer Portfolio",
    description:
      "Full Stack Developer specializing in modern web technologies and creative solutions.",
    images: ["/og-image.png"],
    creator: "@akirachandra",
  },
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
  verification: {
    google: "your-google-verification-code", // Replace with actual code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* OPTIMIZATION 3: Critical resource hints */}
        <link
          rel="preconnect"
          href="https://xzuzvdjronzjybrbgsct.supabase.co"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://xzuzvdjronzjybrbgsct.supabase.co"
        />
        <link
          rel="preconnect"
          href="https://cdnjs.cloudflare.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />


        {/* CRITICAL CSS INLINE */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body{margin:0;overflow-x:hidden;min-height:100vh;background:#0a0a0a}
            .hero-section{min-height:100vh;position:relative;display:flex;align-items:center}
            .astronaut-container{position:relative;z-index:20;width:100%;max-width:400px;margin:0 auto}
            .gradient-bg{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)}
          `
        }} />
        
        <noscript>
          <link rel="stylesheet" href="/_next/static/css/app/layout.css" />
        </noscript>

        {/* OPTIMIZATION 6: Critical CSS inline - Simplified */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS - Above the fold styles */
            *,*::before,*::after{box-sizing:border-box}
            *{margin:0}
            html,body{height:100%}
            body{line-height:1.5;-webkit-font-smoothing:antialiased;min-height:100vh;overflow-x:hidden}
            img,picture,video,canvas,svg{display:block;max-width:100%}
            input,button,textarea,select{font:inherit}
            p,h1,h2,h3,h4,h5,h6{overflow-wrap:break-word}
            #root,#__next{isolation:isolate}
            .hero-section{min-height:100vh;display:flex;align-items:center}
          `,
          }}
        />

        {/* OPTIMIZATION 7: Viewport optimization for mobile */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />

        {/* OPTIMIZATION 8: Theme colors for browser UI */}
        <meta
          name="theme-color"
          content="#1a1a2e"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta name="color-scheme" content="dark light" />

        {/* OPTIMIZATION 9: Apple-specific optimizations */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Akira Chandra" />

        {/* OPTIMIZATION 10: Prevent zoom on input focus (iOS) */}
        <meta name="format-detection" content="telephone=no" />

        <link rel="manifest" href="/manifest.json" />

        {/* OPTIMIZATION 12: Favicon optimizations */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* OPTIMIZATION 13: Structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Akira Chandra",
              url: "https://www.akirachandra.my.id",
              sameAs: [
                "https://github.com/akirachandra",
                "https://linkedin.com/in/akirachandra",
                "https://www.instagram.com/akira_chd",
              ],
              jobTitle: "Full Stack Developer",
              worksFor: {
                "@type": "Organization",
                name: "Bina Nusantara IT Division",
              },
              alumniOf: {
                "@type": "Organization",
                name: "Bina Nusantara University",
              },
              knowsAbout: [
                "Web Development",
                "React",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Mobile Development",
                "UI/UX Design",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${poppins.variable} font-poppins antialiased`}
        // OPTIMIZATION 14: Prevent layout shifts and optimize scrolling
        style={{
          minHeight: "100vh",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          // Hardware acceleration
          willChange: "scroll-position",
          transform: "translateZ(0)",
        }}
      >
        {/* OPTIMIZATION 15 & 16: Simplified app container without hydration issues */}
        <AnimationProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AnimationProvider>

        {/* OPTIMIZATION 17: Simplified client-side optimizations */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // CSS loading optimization
              (function() {
                var preloadedCSS = document.querySelectorAll('link[rel="preload"][as="style"]');
                preloadedCSS.forEach(function(link) {
                  link.addEventListener('load', function() {
                    this.rel = 'stylesheet';
                  });
                });
              })();
              
              // Prevent FOUC (Flash of Unstyled Content)
              document.documentElement.style.visibility = 'visible';
            `,
          }}
        />
      </body>
    </html>
  );
}
