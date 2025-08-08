// src/hooks/projects/useProjectTransition.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseProjectTransitionProps {
  totalProjects: number;
  previewDuration?: number;
  lineDuration?: number;
  isActive?: boolean;
}

export const useProjectTransition = ({
  totalProjects,
  previewDuration = 6000,
  lineDuration = 1000,
  isActive
}: UseProjectTransitionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLineAnimating, setIsLineAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lineIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    if (lineIntervalRef.current) {
      clearInterval(lineIntervalRef.current);
      lineIntervalRef.current = null;
    }
  }, []);

  const animateLine = useCallback(() => {
    if (!isActive) return; 
    setIsLineAnimating(true);
    setProgress(0);

    const startTime = Date.now();
    lineIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / lineDuration) * 100;

      if (newProgress >= 100) {
        clearInterval(lineIntervalRef.current!);
        setProgress(100);
        setIsLineAnimating(false);
        setActiveIndex((prev) => (prev + 1) % totalProjects);
      } else {
        setProgress(newProgress);
      }
    }, 16);
  }, [lineDuration, totalProjects, isActive]);

  const startPreviewTimer = useCallback(() => {
  if (!isPaused && isActive) { 
    previewTimeoutRef.current = setTimeout(() => {
      animateLine();
    }, previewDuration);
  }
}, [isPaused, isActive, previewDuration, animateLine]); 

  useEffect(() => {
    clearTimers();
    startPreviewTimer();

    return clearTimers;
  }, [activeIndex, isPaused, clearTimers, startPreviewTimer]);

  const jumpToProject = useCallback((index: number) => {
    if (index === activeIndex) return;
    
    clearTimers();
    setProgress(0);
    setIsLineAnimating(false);
    setActiveIndex(index);
  }, [activeIndex, clearTimers]);

  const pausePreview = useCallback(() => {
    setIsPaused(true);
    clearTimers();
  }, [clearTimers]);

  const resumePreview = useCallback(() => {
    setIsPaused(false);
  }, []);

  return {
    activeIndex,
    progress,
    isLineAnimating,
    isPaused,
    jumpToProject,
    pausePreview,
    resumePreview
  };
};