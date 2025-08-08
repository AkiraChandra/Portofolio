// src/hooks/experience/useExperienceVisibility.ts - ENHANCED WITH ACTIVITY SUPPORT
// Modifikasi untuk mendukung activity tracking seperti di Hero dan Projects

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track visibility and activity of Experience section
 * Uses Intersection Observer to efficiently detect when section is in viewport
 * Enhanced with activity tracking for pause/resume functionality
 */
export const useExperienceVisibility = () => {
  const [isExperienceVisible, setIsExperienceVisible] = useState(false);
  const [isExperienceActive, setIsExperienceActive] = useState(false); // ✅ TAMBAH: Activity state
  const experienceSectionRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // ✅ ENHANCED: Configure Intersection Observer with activity support
    const observerOptions = {
      // Multiple thresholds for better activity detection
      threshold: [0, 0.1, 0.2, 0.5, 0.8],
      // Add margin to observation area
      rootMargin: '-10% 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const intersectionRatio = entry.intersectionRatio;
        
        // ✅ TAMBAH: Basic visibility (20% threshold like before)
        const isVisible = intersectionRatio >= 0.2;
        setIsExperienceVisible(isVisible);
        
        // ✅ TAMBAH: Activity state (50% threshold for active state)
        const isActive = intersectionRatio >= 0.5;
        setIsExperienceActive((prevIsActive) => {
          if (isActive !== prevIsActive) {
            console.log(`🏢 Experience: ${isActive ? 'ACTIVE' : 'INACTIVE'} (${(intersectionRatio * 100).toFixed(1)}% visible)`);
          }
          return isActive;
        });
      });
    }, observerOptions);

    // Start observing when component mounts
    if (experienceSectionRef.current) {
      observerRef.current.observe(experienceSectionRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // ✅ TAMBAH: Manual observer setup function (for dynamic refs)
  const observeElement = (element: HTMLElement) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element);
      experienceSectionRef.current = element;
    }
  };

  return { 
    isExperienceVisible, 
    isExperienceActive, // ✅ TAMBAH: Return activity state
    experienceSectionRef,
    observeElement // ✅ TAMBAH: Return observer function
  };
};