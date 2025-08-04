
// src/hooks/projects/useProjectTransition.ts (MOBILE OPTIMIZED)
import { useState, useEffect, useRef, useCallback } from 'react';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';

interface UseProjectTransitionProps {
  totalProjects: number;
  previewDuration?: number;
  lineDuration?: number;
}

export const useProjectTransition = ({
  totalProjects,
  previewDuration = 6000,
  lineDuration = 1000,
}: UseProjectTransitionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLineAnimating, setIsLineAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lineTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile-optimized durations
  const mobileDurations = {
    preview: isMobile ? 4000 : previewDuration,
    line: isMobile ? 600 : lineDuration,
    progressUpdate: isMobile ? 50 : 30, // Less frequent updates on mobile
  };

  const clearAllTimers = useCallback(() => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    previewTimerRef.current = null;
    lineTimerRef.current = null;
    progressIntervalRef.current = null;
  }, []);

  const startLineAnimation = useCallback(() => {
    if (prefersReducedMotion) return;
    
    setIsLineAnimating(true);
    setProgress(0);

    // Optimize progress updates for mobile
    const progressIncrement = 100 / (mobileDurations.line / mobileDurations.progressUpdate);
    
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + progressIncrement;
        if (next >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return 100;
        }
        return next;
      });
    }, mobileDurations.progressUpdate);

    lineTimerRef.current = setTimeout(() => {
      setIsLineAnimating(false);
      setProgress(100);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }, mobileDurations.line);
  }, [mobileDurations.line, mobileDurations.progressUpdate, prefersReducedMotion]);

  const goToNextProject = useCallback(() => {
    if (totalProjects <= 1) return;
    
    const nextIndex = (activeIndex + 1) % totalProjects;
    setActiveIndex(nextIndex);
    
    // Don&apos;t animate line for the last project or if reduced motion
    if (activeIndex < totalProjects - 1 && !prefersReducedMotion) {
      startLineAnimation();
    }
  }, [activeIndex, totalProjects, startLineAnimation, prefersReducedMotion]);

  const startPreviewTimer = useCallback(() => {
    if (isPaused || prefersReducedMotion) return;
    
    previewTimerRef.current = setTimeout(() => {
      goToNextProject();
    }, mobileDurations.preview);
  }, [isPaused, goToNextProject, mobileDurations.preview, prefersReducedMotion]);

  const jumpToProject = useCallback((index: number) => {
    if (index < 0 || index >= totalProjects || index === activeIndex) return;
    
    clearAllTimers();
    setActiveIndex(index);
    setProgress(0);
    setIsLineAnimating(false);
    
    // Restart auto-progression if not paused
    if (!isPaused && !prefersReducedMotion) {
      setTimeout(() => {
        startPreviewTimer();
      }, 100); // Small delay to prevent rapid transitions
    }
  }, [activeIndex, totalProjects, isPaused, clearAllTimers, startPreviewTimer, prefersReducedMotion]);

  const pausePreview = useCallback(() => {
    setIsPaused(true);
    clearAllTimers();
  }, [clearAllTimers]);

  const resumePreview = useCallback(() => {
    setIsPaused(false);
    if (!prefersReducedMotion) {
      startPreviewTimer();
    }
  }, [startPreviewTimer, prefersReducedMotion]);

  // Main effect for auto-progression
  useEffect(() => {
    if (totalProjects <= 1 || prefersReducedMotion) return;
    
    startPreviewTimer();
    
    return clearAllTimers;
  }, [activeIndex, totalProjects, startPreviewTimer, clearAllTimers, prefersReducedMotion]);

  // Cleanup on unmount
  useEffect(() => {
    return clearAllTimers;
  }, [clearAllTimers]);

  // Reset when totalProjects changes
  useEffect(() => {
    if (totalProjects > 0 && activeIndex >= totalProjects) {
      setActiveIndex(0);
    }
  }, [totalProjects, activeIndex]);

  // Pause when page is not visible (mobile optimization)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pausePreview();
      } else if (!isPaused && !prefersReducedMotion) {
        resumePreview();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused, pausePreview, resumePreview, prefersReducedMotion]);

  return {
    activeIndex,
    progress,
    isLineAnimating,
    isPaused,
    jumpToProject,
    pausePreview,
    resumePreview,
    totalProjects,
  };
};
