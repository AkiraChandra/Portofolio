import { useState, useEffect, useCallback, useRef } from 'react';
import _ from 'lodash';

interface UseProjectTransitionProps {
  totalProjects: number;
  previewDuration?: number;
  lineDuration?: number;
}

export const useProjectTransition = ({
  totalProjects,
  previewDuration = 6000,
  lineDuration = 1000
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
  }, [lineDuration, totalProjects]);

  const startPreviewTimer = useCallback(() => {
    if (!isPaused) {
      previewTimeoutRef.current = setTimeout(() => {
        animateLine();
      }, previewDuration);
    }
  }, [isPaused, previewDuration, animateLine]);

  useEffect(() => {
    clearTimers();
    startPreviewTimer();

    return clearTimers;
  }, [activeIndex, isPaused, clearTimers, startPreviewTimer]);

  // Debounced version of the core jump logic
  const debouncedJumpCore = useCallback(
    _.debounce((index: number) => {
      clearTimers();
      setProgress(0);
      setIsLineAnimating(false);
      setActiveIndex(index);
    }, 150),
    [clearTimers]
  );

  // Main jumpToProject function that validates input before calling debounced version
  const jumpToProject = useCallback((index: number) => {
    if (index === activeIndex || index < 0 || index >= totalProjects) return;
    debouncedJumpCore(index);
  }, [activeIndex, totalProjects, debouncedJumpCore]);

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