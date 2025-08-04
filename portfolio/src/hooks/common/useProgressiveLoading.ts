// File: src/hooks/common/useProgressiveLoading.ts - BUAT BARU
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface LoadedSection {
  id: string;
  component: React.ComponentType;
  timestamp: number;
}

interface UseProgressiveLoadingOptions {
  rootMargin?: string;
  threshold?: number;
  cacheSize?: number;
}

export const useProgressiveLoading = (options: UseProgressiveLoadingOptions = {}) => {
  const { rootMargin = '200px', threshold = 0.1, cacheSize = 10 } = options;
  
  // Cache system untuk komponen yang sudah di-load
  const [loadedSections, setLoadedSections] = useState<Map<string, LoadedSection>>(new Map());
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['home'])); // Home default visible
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map());
  
  // ✅ CACHE MANAGEMENT
  const addToCache = useCallback((sectionId: string, component: React.ComponentType) => {
    setLoadedSections(prev => {
      const newCache = new Map(prev);
      
      // Remove oldest if cache is full
      if (newCache.size >= cacheSize) {
        const oldestKey = Array.from(newCache.entries())
          .sort(([,a], [,b]) => a.timestamp - b.timestamp)[0][0];
        newCache.delete(oldestKey);
      }
      
      newCache.set(sectionId, {
        id: sectionId,
        component,
        timestamp: Date.now()
      });
      
      return newCache;
    });
  }, [cacheSize]);

  // ✅ CHECK IF SECTION IS CACHED
  const isCached = useCallback((sectionId: string) => {
    return loadedSections.has(sectionId);
  }, [loadedSections]);

  // ✅ GET CACHED COMPONENT
  const getCachedComponent = useCallback((sectionId: string) => {
    return loadedSections.get(sectionId)?.component;
  }, [loadedSections]);

  // ✅ OBSERVE SECTION FOR LAZY LOADING
  const observeSection = useCallback((sectionId: string, element: HTMLElement) => {
    if (observersRef.current.has(sectionId)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, sectionId]));
            
            // Stop observing once visible
            observer.disconnect();
            observersRef.current.delete(sectionId);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    observersRef.current.set(sectionId, observer);
  }, [rootMargin, threshold]);

  // ✅ CLEANUP OBSERVERS
  useEffect(() => {
    return () => {
      observersRef.current.forEach(observer => observer.disconnect());
      observersRef.current.clear();
    };
  }, []);

  return {
    visibleSections,
    loadedSections,
    addToCache,
    isCached,
    getCachedComponent,
    observeSection,
    cacheSize: loadedSections.size,
  };
};