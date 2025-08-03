// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import "./globals.css";
import { AnimationProvider } from "@/contexts/AnimationContext";
// Initialize Poppins with subset latin and weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Akira Chandra - Full Stack Developer Portfolio",
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
      <body className={`${poppins.variable} font-poppins antialiased`}>
        <AnimationProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AnimationProvider>
      </body>
    </html>
  );
}
