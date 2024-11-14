import { useState, useCallback, useEffect, useRef } from 'react';

interface UseExperienceTransitionProps {
  totalExperiences: number;
  autoPlayDuration?: number;
}

export const useExperienceTransition = ({
  totalExperiences,
  autoPlayDuration = 5000 // 5 seconds default
}: UseExperienceTransitionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearAutoPlayTimeout = () => {
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = null;
    }
  };

  const startAutoPlay = useCallback(() => {
    clearAutoPlayTimeout();
    if (isAutoPlaying) {
      autoPlayTimeoutRef.current = setTimeout(() => {
        setActiveIndex(prev => 
          prev === null ? 0 : prev < totalExperiences - 1 ? prev + 1 : null
        );
      }, autoPlayDuration);
    }
  }, [isAutoPlaying, totalExperiences, autoPlayDuration]);

  const handleExperienceClick = useCallback((index: number) => {
    setIsAutoPlaying(false);
    clearAutoPlayTimeout();
    setIsTransitioning(true);
    setActiveIndex(prev => prev === index ? null : index);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  const resumeAutoPlay = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    }
    return clearAutoPlayTimeout;
  }, [isAutoPlaying, startAutoPlay, activeIndex]);

  useEffect(() => {
    return () => {
      clearAutoPlayTimeout();
    };
  }, []);

  return {
    activeIndex,
    isTransitioning,
    isAutoPlaying,
    handleExperienceClick,
    handleTransitionComplete,
    resumeAutoPlay
  };
};