// src/app/layout.tsx - OPTIMIZED FOR PERFORMANCE
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
  fallback: ['system-ui', 'arial'], // Add fallback fonts
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* OPTIMIZATION 3: Critical resource hints */}
        <link rel="preconnect" href="https://xzuzvdjronzjybrbgsct.supabase.co" />
        <link rel="dns-prefetch" href="https://xzuzvdjronzjybrbgsct.supabase.co" />
        
        {/* OPTIMIZATION 4: Preload critical images for hero section */}
        <link 
          rel="preload" 
          as="image" 
          href="/astronaut.png"
          media="(min-width: 769px)"
          fetchPriority="high"
        />
        <link 
          rel="preload" 
          as="image" 
          href="/profile.jpg"
          fetchPriority="high"
        />
        
        {/* OPTIMIZATION 5: Viewport optimization for mobile */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
        
        {/* OPTIMIZATION 6: Theme color for browser UI */}
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body 
        className={`${poppins.variable} font-poppins antialiased`}
        // OPTIMIZATION 7: Prevent layout shifts
        style={{ minHeight: '100vh', overflowX: 'hidden' }}
      >
        <AnimationProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AnimationProvider>
      </body>
    </html>
  );
}