// File: src/components/common/LazyComponentLoader.tsx - BUAT BARU
'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useProgressiveLoading } from '@/hooks/common/useProgressiveLoading';

interface LazyComponentLoaderProps {
  sectionId: string;
  importPath: string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

// ✅ DYNAMIC IMPORTS WITH CACHING
const componentImporters = {
  projects: () => import('@/components/sections/Projects/Projects'),
  experience: () => import('@/components/sections/Experience/Experience'),
  skills: () => import('@/components/sections/Skills/Skills'),
  certifications: () => import('@/components/sections/Certifications/Certifications'),
};

const LazyComponentLoader: React.FC<LazyComponentLoaderProps> = ({
  sectionId,
  importPath,
  fallback,
  children,
  className = '',
}) => {
  const { visibleSections, isCached, getCachedComponent, addToCache, observeSection } = useProgressiveLoading();
  const [DynamicComponent, setDynamicComponent] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // ✅ SETUP INTERSECTION OBSERVER
  useEffect(() => {
    const element = sectionRef.current;
    if (!element || visibleSections.has(sectionId)) return;

    observeSection(sectionId, element);
  }, [sectionId, observeSection, visibleSections]);

  // ✅ LOAD COMPONENT WHEN VISIBLE
  useEffect(() => {
    if (!visibleSections.has(sectionId)) return;

    // Check cache first
    if (isCached(sectionId)) {
      const CachedComponent = getCachedComponent(sectionId);
      if (CachedComponent) {
        setDynamicComponent(() => CachedComponent);
        return;
      }
    }

    // Load component dynamically
    if (!DynamicComponent && !isLoading) {
      setIsLoading(true);
      
      const importer = componentImporters[sectionId as keyof typeof componentImporters];
      if (importer) {
        importer()
          .then((module) => {
            const Component = module.default;
            setDynamicComponent(() => Component);
            addToCache(sectionId, Component);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(`Failed to load ${sectionId} component:`, error);
            setIsLoading(false);
          });
      }
    }
  }, [visibleSections, sectionId, isCached, getCachedComponent, addToCache, DynamicComponent, isLoading]);

  // ✅ RENDER SKELETON WHILE LOADING
  const renderContent = () => {
    if (sectionId === 'home') {
      // Home always loads immediately
      return children;
    }

    if (!visibleSections.has(sectionId)) {
      // Not visible yet - render placeholder
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              Scroll to load {sectionId}...
            </p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      // Loading state
      return fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-text-primary dark:text-text-primary-dark">
              Loading {sectionId}...
            </p>
          </div>
        </div>
      );
    }

    if (DynamicComponent) {
      // Component loaded - render with Suspense
      return (
        <Suspense fallback={fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        )}>
          <DynamicComponent />
        </Suspense>
      );
    }
    return children;
  };

  return (
    <div ref={sectionRef} className={className}>
      {renderContent()}
    </div>
  );
};

export default LazyComponentLoader;