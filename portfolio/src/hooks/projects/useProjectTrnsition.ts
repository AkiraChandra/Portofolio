// src/components/sections/Projects/hooks/useProjectTransition.ts
import { useState, useEffect, useCallback } from 'react';

export const useProjectTransition = (totalProjects: number) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const PREVIEW_DURATION = 4000; // 4 seconds
  const TRANSITION_DURATION = 800; // 0.8 seconds

  const progressToNextPlanet = useCallback(() => {
    setIsTransitioning(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setActiveIndex((current) => (current + 1) % totalProjects);
          return 0;
        }
        return prev + 1;
      });
    }, TRANSITION_DURATION / 100);

    return () => clearInterval(interval);
  }, [totalProjects]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        progressToNextPlanet();
      }, PREVIEW_DURATION);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning, progressToNextPlanet]);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return {
    activeIndex,
    progress,
    isTransitioning,
    handleTransitionEnd
  };
};