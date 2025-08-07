// src/hooks/projects/useProjectTransition.ts - ENHANCED WITH ACTIVITY SUPPORT
// Modifikasi untuk mendukung pause/resume berdasarkan activity state

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseProjectTransitionProps {
  totalProjects: number;
  previewDuration?: number;
  lineDuration?: number;
  isActive?: boolean; // ✅ TAMBAH: Activity state prop
}

interface UseProjectTransitionReturn {
  activeIndex: number;
  progress: number;
  isLineAnimating: boolean;
  jumpToProject: (index: number) => void;
  pausePreview: () => void;
  resumePreview: () => void;
  resetProgress: () => void;
}

export const useProjectTransition = ({
  totalProjects,
  previewDuration = 6000,
  lineDuration = 1200,
  isActive = true, // ✅ TAMBAH: Default true untuk backward compatibility
}: UseProjectTransitionProps): UseProjectTransitionReturn => {
  // Core states
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLineAnimating, setIsLineAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Refs untuk timer management
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lineTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Refs untuk tracking time
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const totalPausedTimeRef = useRef<number>(0);

  // ✅ TAMBAH: Activity-aware timer management
  const clearAllTimers = useCallback(() => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
    if (lineTimerRef.current) {
      clearTimeout(lineTimerRef.current);
      lineTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // ✅ TAMBAH: Pause functionality
  const pausePreview = useCallback(() => {
    if (!isPaused) {
      pausedTimeRef.current = Date.now();
      setIsPaused(true);
      clearAllTimers();
      console.log('⏸️ ProjectTransition: Paused');
    }
  }, [isPaused, clearAllTimers]);

  // ✅ TAMBAH: Resume functionality
  const resumePreview = useCallback(() => {
    if (isPaused) {
      totalPausedTimeRef.current += Date.now() - pausedTimeRef.current;
      setIsPaused(false);
      console.log('▶️ ProjectTransition: Resumed');
    }
  }, [isPaused]);

  // ✅ TAMBAH: Reset progress
  const resetProgress = useCallback(() => {
    setProgress(0);
    startTimeRef.current = Date.now();
    totalPausedTimeRef.current = 0;
  }, []);

  // ✅ MODIFIKASI: Activity-aware progress tracking
  const updateProgress = useCallback(() => {
    if (!isActive || isPaused) return;

    const currentTime = Date.now();
    const elapsedTime = currentTime - startTimeRef.current - totalPausedTimeRef.current;
    const newProgress = Math.min((elapsedTime / previewDuration) * 100, 100);
    
    setProgress(newProgress);

    if (newProgress >= 100) {
      // Start line animation
      setIsLineAnimating(true);
      
      lineTimerRef.current = setTimeout(() => {
        // Move to next project
        setActiveIndex((prev) => (prev + 1) % totalProjects);
        setIsLineAnimating(false);
        resetProgress();
      }, lineDuration);
    }
  }, [isActive, isPaused, previewDuration, lineDuration, totalProjects, resetProgress]);

  // ✅ MODIFIKASI: Activity-aware automatic progression
  useEffect(() => {
    if (!isActive || isPaused || totalProjects <= 1) {
      clearAllTimers();
      return;
    }

    // Start progress tracking
    resetProgress();
    
    progressIntervalRef.current = setInterval(updateProgress, 50);

    return clearAllTimers;
  }, [activeIndex, isActive, isPaused, totalProjects, updateProgress, resetProgress, clearAllTimers]);

  // ✅ TAMBAH: Auto-pause/resume based on activity
  useEffect(() => {
    if (!isActive) {
      pausePreview();
    } else if (isActive && isPaused) {
      resumePreview();
    }
  }, [isActive, pausePreview, resumePreview, isPaused]);

  // ✅ MODIFIKASI: Enhanced jumpToProject dengan activity check
  const jumpToProject = useCallback((index: number) => {
    if (!isActive || index < 0 || index >= totalProjects) return;
    
    clearAllTimers();
    setActiveIndex(index);
    setIsLineAnimating(false);
    resetProgress();
    
    console.log(`🎯 ProjectTransition: Jumped to project ${index + 1}`);
  }, [isActive, totalProjects, clearAllTimers, resetProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return clearAllTimers;
  }, [clearAllTimers]);

  return {
    activeIndex,
    progress,
    isLineAnimating,
    jumpToProject,
    pausePreview,
    resumePreview,
    resetProgress,
  };
};