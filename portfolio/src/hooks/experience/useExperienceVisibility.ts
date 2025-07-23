// src/hooks/experience/useExperienceVisibility.ts
import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track visibility of Experience section
 * Uses Intersection Observer to efficiently detect when section is in viewport
 */
export const useExperienceVisibility = () => {
  const [isExperienceVisible, setIsExperienceVisible] = useState(false);
  const experienceSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Configure Intersection Observer
    const observerOptions = {
      // Section needs to be 20% visible to trigger
      threshold: 0.2,
      // Add margin to observation area
      rootMargin: '-20% 0px'
    };

    const observer = new IntersectionObserver(([entry]) => {
      setIsExperienceVisible(entry.isIntersecting);
    }, observerOptions);

    // Start observing when component mounts
    if (experienceSectionRef.current) {
      observer.observe(experienceSectionRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (experienceSectionRef.current) {
        observer.unobserve(experienceSectionRef.current);
      }
    };
  }, []);

  return { isExperienceVisible, experienceSectionRef };
};