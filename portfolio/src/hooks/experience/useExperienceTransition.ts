// src/hooks/experience/useExperienceTransition.ts - ENHANCED WITH ACTIVITY SUPPORT
// Modifikasi untuk mendukung pause/resume berdasarkan activity state

import { useState, useCallback, useEffect, useRef } from 'react';

interface UseExperienceTransitionProps {
  totalExperiences: number;
  autoPlayDuration?: number;
  isActive?: boolean; // ✅ TAMBAH: Activity state prop
}

interface UseExperienceTransitionReturn {
  activeIndex: number | null;
  isTransitioning: boolean;
  isAutoPlaying: boolean;
  handleExperienceClick: (index: number) => void;
  handleTransitionComplete: () => void;
  resumeAutoPlay: () => void;
  pausePreview: () => void;
  resumePreview: () => void;
}

export const useExperienceTransition = ({
  totalExperiences,
  autoPlayDuration = 5000,
  isActive = true, // ✅ TAMBAH: Default true untuk backward compatibility
}: UseExperienceTransitionProps): UseExperienceTransitionReturn => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Refs untuk timer management
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Refs untuk tracking time
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const totalPausedTimeRef = useRef<number>(0);

  // ✅ TAMBAH: Activity-aware timer management
  const clearAutoPlayTimeout = useCallback(() => {
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = null;
    }
  }, []);

  // ✅ TAMBAH: Pause functionality
  const pausePreview = useCallback(() => {
    if (!isPaused) {
      pausedTimeRef.current = Date.now();
      setIsPaused(true);
      clearAutoPlayTimeout();
      console.log('⏸️ ExperienceTransition: Paused');
    }
  }, [isPaused, clearAutoPlayTimeout]);

  // ✅ TAMBAH: Resume functionality
  const resumePreview = useCallback(() => {
    if (isPaused) {
      totalPausedTimeRef.current += Date.now() - pausedTimeRef.current;
      setIsPaused(false);
      console.log('▶️ ExperienceTransition: Resumed');
    }
  }, [isPaused]);

  // ✅ MODIFIKASI: Activity-aware auto play with pause support
  const startAutoPlay = useCallback(() => {
    clearAutoPlayTimeout();
    
    if (!isActive || isPaused || !isAutoPlaying) {
      return;
    }

    // Calculate remaining time if resuming from pause
    let remainingTime = autoPlayDuration;
    if (pausedTimeRef.current > 0) {
      const elapsedBeforePause = pausedTimeRef.current - startTimeRef.current - totalPausedTimeRef.current;
      remainingTime = Math.max(autoPlayDuration - elapsedBeforePause, 0);
    } else {
      startTimeRef.current = Date.now();
      totalPausedTimeRef.current = 0;
    }

    autoPlayTimeoutRef.current = setTimeout(() => {
      setActiveIndex(prev => 
        prev === null ? 0 : prev < totalExperiences - 1 ? prev + 1 : null
      );
      // Reset timing references for next cycle
      startTimeRef.current = Date.now();
      totalPausedTimeRef.current = 0;
      pausedTimeRef.current = 0;
    }, remainingTime);
  }, [isActive, isPaused, isAutoPlaying, totalExperiences, autoPlayDuration, clearAutoPlayTimeout]);

  const handleExperienceClick = useCallback((index: number) => {
    if (!isActive) return;
    
    setIsAutoPlaying(false);
    clearAutoPlayTimeout();
    setIsTransitioning(true);
    setActiveIndex(prev => prev === index ? null : index);
    
    // Reset timing references when manually clicking
    startTimeRef.current = Date.now();
    totalPausedTimeRef.current = 0;
    pausedTimeRef.current = 0;
  }, [isActive, clearAutoPlayTimeout]);

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  const resumeAutoPlay = useCallback(() => {
    setIsAutoPlaying(true);
    // Reset timing when resuming auto play
    startTimeRef.current = Date.now();
    totalPausedTimeRef.current = 0;
    pausedTimeRef.current = 0;
  }, []);

  // ✅ MODIFIKASI: Activity-aware auto play management
  useEffect(() => {
    if (isActive && isAutoPlaying && !isPaused) {
      startAutoPlay();
    } else {
      clearAutoPlayTimeout();
    }
    
    return clearAutoPlayTimeout;
  }, [isActive, isAutoPlaying, isPaused, startAutoPlay, activeIndex, clearAutoPlayTimeout]);

  // ✅ TAMBAH: Auto-pause/resume based on activity
  useEffect(() => {
    if (!isActive) {
      pausePreview();
    } else if (isActive && isPaused && isAutoPlaying) {
      resumePreview();
    }
  }, [isActive, pausePreview, resumePreview, isPaused, isAutoPlaying]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAutoPlayTimeout();
    };
  }, [clearAutoPlayTimeout]);

  return {
    activeIndex,
    isTransitioning,
    isAutoPlaying,
    handleExperienceClick,
    handleTransitionComplete,
    resumeAutoPlay,
    pausePreview,
    resumePreview,
  };
};