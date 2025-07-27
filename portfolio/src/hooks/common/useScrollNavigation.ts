// src/hooks/useScrollNavigation.ts

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const SECTIONS = [
  { id: 'home', path: '/' },
  { id: 'projects', path: '/projects' },
  { id: 'experience', path: '/experience' },
  { id: 'certifications', path: '/certifications' },
];

export const useScrollNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isNavigating = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const getCurrentSectionIndex = useCallback(() => {
    return SECTIONS.findIndex(section => section.path === pathname);
  }, [pathname]);

  const navigateToSection = useCallback((direction: 'up' | 'down') => {
    if (isNavigating.current) return;
    
    const currentIndex = getCurrentSectionIndex();
    let targetIndex = currentIndex;
    
    if (direction === 'down' && currentIndex < SECTIONS.length - 1) {
      targetIndex = currentIndex + 1;
    } else if (direction === 'up' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    }
    
    if (targetIndex !== currentIndex) {
      isNavigating.current = true;
      router.push(SECTIONS[targetIndex].path);
      
      // Reset navigation lock after transition
      setTimeout(() => {
        isNavigating.current = false;
      }, 1000);
    }
  }, [getCurrentSectionIndex, router]);

  useEffect(() => {
    let accumulatedDelta = 0;
    const SCROLL_THRESHOLD = 100; // Adjust sensitivity

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isNavigating.current) return;
      
      accumulatedDelta += Math.abs(e.deltaY);
      
      if (accumulatedDelta >= SCROLL_THRESHOLD) {
        if (e.deltaY > 0) {
          navigateToSection('down');
        } else {
          navigateToSection('up');
        }
        accumulatedDelta = 0;
      }
      
      // Reset accumulated delta after a delay
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        accumulatedDelta = 0;
      }, 150);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNavigating.current) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        navigateToSection('down');
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        navigateToSection('up');
      }
    };

    // Add event listeners with passive: false for preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [navigateToSection]);

  return { getCurrentSectionIndex, navigateToSection };
};