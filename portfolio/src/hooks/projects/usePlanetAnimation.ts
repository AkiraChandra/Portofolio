// src/hooks/projects/usePlanetAnimation.ts
import { useMemo } from 'react';
import { Transition, TargetAndTransition } from 'framer-motion';

interface PlanetAnimation {
  rotate: number[] | number;
  scale: number;
  transition: Transition;
}

export const usePlanetAnimation = (isActive: boolean) => {
  const rotateAnimation = useMemo<PlanetAnimation>(() => ({
    rotate: isActive ? [0, 360] : 0,
    scale: 1,
    transition: {
      duration: isActive ? 20 : 0,
      repeat: Infinity,
      ease: "linear"
    }
  }), [isActive]);

  const scaleAnimation = useMemo<PlanetAnimation>(() => ({
    rotate: 0,
    scale: isActive ? 1.1 : 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }), [isActive]);

  return {
    rotateAnimation,
    scaleAnimation
  };
};