'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ✅ HERO - Critical section (load immediately but optimized)
export const LazyHero = dynamic(
  () => import('./sections/Hero/Hero'),
  { 
    ssr: true,  // Keep SSR for SEO
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-background-primary-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* ✅ Skeleton for text content */}
            <div className="space-y-6">
              <div className="h-12 lg:h-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 lg:h-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
              <div className="flex gap-4">
                <div className="h-12 w-32 bg-yellow-400/50 rounded animate-pulse"></div>
                <div className="h-12 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            {/* ✅ Skeleton for image */}
            <div className="flex justify-center">
              <div className="w-full max-w-md aspect-square bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
);

// ✅ PROJECTS - Heavy component (lazy load)
export const LazyProjects = dynamic(
  () => import('./sections/Projects/Projects'),
  { 
    ssr: true,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="h-12 bg-gray-700 rounded animate-pulse w-64 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-6 space-y-4 animate-pulse">
                  <div className="h-40 bg-gray-700 rounded"></div>
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-700 rounded"></div>
                    <div className="h-6 w-20 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
);

// ✅ SKILLS - Medium weight (lazy load)
export const LazySkills = dynamic(
  () => import('./sections/Skills/Skills'),
  { 
    ssr: true,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <div className="h-12 bg-gray-700 rounded animate-pulse w-48 mx-auto"></div>
              <div className="h-6 bg-gray-700 rounded animate-pulse w-96 mx-auto"></div>
            </div>
            
            {/* ✅ Skills categories skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {['Frontend', 'Backend', 'Tools'].map((category) => (
                <div key={category} className="space-y-6">
                  <div className="h-8 bg-gray-700 rounded animate-pulse w-32 mx-auto"></div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-700 rounded animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-700 rounded animate-pulse w-24 mb-2"></div>
                          <div className="h-2 bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
);

// ✅ EXPERIENCE - Medium weight (lazy load)
export const LazyExperience = dynamic(
  () => import('./sections/Experience/Experience'),
  { 
    ssr: true,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-background-primary-dark">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-64 mx-auto"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-96 mx-auto"></div>
            </div>
            
            {/* ✅ Experience timeline skeleton */}
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-yellow-400/50 rounded-full animate-pulse"></div>
                    <div className="w-0.5 h-24 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-48"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
);

// ✅ CERTIFICATIONS - Light weight (lazy load)
export const LazyCertifications = dynamic(
  () => import('./sections/Certifications/Certifications'),
  { 
    ssr: true,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <div className="h-12 bg-gray-700 rounded animate-pulse w-72 mx-auto"></div>
              <div className="h-6 bg-gray-700 rounded animate-pulse w-96 mx-auto"></div>
            </div>
            
            {/* ✅ Certifications grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-6 space-y-4 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                    <div className="h-8 w-20 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
);

// ✅ FRAMER MOTION - Heavy library (async only)
export const LazyFramerMotion = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.div })),
  { 
    ssr: false,
    loading: () => <div className="min-h-[50px] animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
  }
);

// ✅ WRAPPER WITH SUSPENSE
export function LazySection({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    }>
      {children}
    </Suspense>
  );
}

// ✅ VIEWPORT-BASED LAZY LOADING
export function LazyViewportSection({ 
  children, 
  rootMargin = "100px",
  threshold = 0.1 
}: { 
  children: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
}