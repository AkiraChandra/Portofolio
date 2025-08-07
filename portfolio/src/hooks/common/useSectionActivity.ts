// File: src/hooks/common/useSectionActivity.ts - REUSABLE PATTERN HERO.TX
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSectionActivity as useGlobalContext } from '@/contexts/SectionActivityContext';

type SectionId = "home" | "projects" | "experience" | "certifications" | "skills";

interface SectionActivityOptions {
  threshold?: number[];
  rootMargin?: string;
  syncToGlobal?: boolean;
  onActiveChange?: (isActive: boolean) => void;
}

/**
 * Reusable hook berdasarkan pattern Hero.tsx
 * Clean, simple, dan reliable untuk semua section
 */
export const useSectionActivity = (
  sectionId: SectionId,
  options: SectionActivityOptions = {}
) => {
  const {
    threshold = [0, 0.5, 1.0],
    rootMargin = '-10% 0px',
    syncToGlobal = true,
    onActiveChange
  } = options;

  // ✅ PATTERN HERO.TX: Local activity state
  const [isActive, setIsActive] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // ✅ Global context untuk sync (optional)
  const globalContext = syncToGlobal ? useGlobalContext() : null;

  useEffect(() => {
    // ✅ EXACT SAME PATTERN AS HERO.TX
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === sectionId) {
            const newIsActive = entry.intersectionRatio > 0.5;
            
            setIsActive((prevIsActive) => {
              if (newIsActive !== prevIsActive) {
                console.log(`🎯 ${sectionId}: ${newIsActive ? 'ACTIVE' : 'SUSPENDED'}`);
                
                // ✅ FIXED: Sync to global context via useEffect to avoid setState during render
                // We'll handle this outside the intersection callback
                
                // ✅ Custom callback
                onActiveChange?.(newIsActive);
              }
              return newIsActive;
            });
          }
        });
      },
      { threshold, rootMargin }
    );

    // ✅ EXACT SAME PATTERN AS HERO.TX: Immediate observation
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement && observerRef.current) {
      observerRef.current.observe(sectionElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []); // ✅ EXACT SAME AS HERO.TX: Empty dependency array

  // ✅ FIXED: Separate useEffect untuk global context sync (avoid setState during render)
  useEffect(() => {
    if (syncToGlobal && globalContext && isActive) {
      globalContext.setActiveSection(sectionId);
    }
  }, [isActive, sectionId, syncToGlobal, globalContext]);

  return { 
    isActive,
    sectionId,
    // ✅ BONUS: Animation utilities
    shouldPause: !isActive,
    animationPlayState: isActive ? 'running' : 'paused'
  };
};

/**
 * Specialized hooks untuk masing-masing section
 * Pattern yang sama persis dengan Hero.tsx
 */
export const useHeroActivity = (options?: SectionActivityOptions) => 
  useSectionActivity('home', options);

export const useProjectsActivity = (options?: SectionActivityOptions) => 
  useSectionActivity('projects', options);

export const useExperienceActivity = (options?: SectionActivityOptions) => 
  useSectionActivity('experience', options);

export const useCertificationsActivity = (options?: SectionActivityOptions) => 
  useSectionActivity('certifications', options);

export const useSkillsActivity = (options?: SectionActivityOptions) => 
  useSectionActivity('skills', options);

/**
 * Hook dengan built-in animation helpers
 */
export const useSectionWithAnimations = (
  sectionId: SectionId,
  options?: SectionActivityOptions
) => {
  const { isActive, shouldPause, animationPlayState } = useSectionActivity(sectionId, options);
  
  const getMotionProps = () => ({
    animate: { 
      opacity: isActive ? 1 : 0.8,
      scale: isActive ? 1 : 0.98
    },
    transition: { duration: 0.3 }
  });
  
  const getCSSProps = () => ({
    style: { animationPlayState }
  });

  return {
    isActive,
    shouldPause,
    animationPlayState,
    getMotionProps,
    getCSSProps,
    sectionId
  };
};