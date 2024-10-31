// src/hooks/projects/usePlanetAnimation.ts
import { useEffect, useMemo } from 'react';

export const usePlanetAnimation = (isActive: boolean) => {
  const rotateAnimation = useMemo(() => ({
    rotate: isActive ? [0, 360] : 0,
    transition: {
      duration: isActive ? 20 : 0,
      repeat: Infinity,
      ease: "linear"
    }
  }), [isActive]);

  const scaleAnimation = useMemo(() => ({
    scale: isActive ? 1.1 : 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }), [isActive]);

  const glowAnimation = useMemo(() => ({
    opacity: isActive ? [0.2, 0.4] : 0,
    scale: isActive ? [1, 1.1] : 1,
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }), [isActive]);

  return {
    rotateAnimation,
    scaleAnimation,
    glowAnimation
  };
};