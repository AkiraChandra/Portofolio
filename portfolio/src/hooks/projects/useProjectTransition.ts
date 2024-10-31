import { useState, useEffect, useCallback, useRef } from 'react';

interface UseProjectTransitionProps {
  totalProjects: number;
  autoPlayInterval?: number;
  progressDuration?: number;
}

interface UseProjectTransitionReturn {
  activeIndex: number;
  progress: number;
  isTransitioning: boolean;
  isPaused: boolean;
  setActiveIndex: (index: number) => void;
  pauseAutoPlay: () => void;
  resumeAutoPlay: () => void;
  handleTransitionEnd: () => void;
}

export const useProjectTransition = ({
  totalProjects,
  autoPlayInterval = 5000,
  progressDuration = 5000
}: UseProjectTransitionProps): UseProjectTransitionReturn => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
  }, []);

  const startProgress = useCallback(() => {
    setProgress(0);
    const startTime = Date.now();
    
    progressIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = (elapsedTime / progressDuration) * 100;
      
      if (newProgress >= 100) {
        clearInterval(progressIntervalRef.current!);
        setProgress(100);
        setIsTransitioning(true);
      } else {
        setProgress(newProgress);
      }
    }, 16); // ~60fps
  }, [progressDuration]);

  const startAutoPlay = useCallback(() => {
    if (isPaused) return;
    
    startProgress();
    autoPlayTimeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % totalProjects);
    }, autoPlayInterval);
  }, [autoPlayInterval, isPaused, startProgress, totalProjects]);

  useEffect(() => {
    if (!isPaused) {
      startAutoPlay();
    }
    return clearTimers;
  }, [activeIndex, isPaused, startAutoPlay, clearTimers]);

  const pauseAutoPlay = useCallback(() => {
    setIsPaused(true);
    clearTimers();
  }, [clearTimers]);

  const resumeAutoPlay = useCallback(() => {
    setIsPaused(false);
    startAutoPlay();
  }, [startAutoPlay]);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
    if (!isPaused) {
      startAutoPlay();
    }
  }, [isPaused, startAutoPlay]);

  return {
    activeIndex,
    progress,
    isTransitioning,
    isPaused,
    setActiveIndex,
    pauseAutoPlay,
    resumeAutoPlay,
    handleTransitionEnd
  };
};