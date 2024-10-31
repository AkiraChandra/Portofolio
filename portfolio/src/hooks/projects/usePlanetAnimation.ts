// src/hooks/projects/usePlanetAnimation.ts
import { useMemo } from 'react';
import { AnimationConfig, PlanetAnimation, PlanetAnimationHook } from '@/types/projects';

export function usePlanetAnimation(isActive: boolean): PlanetAnimationHook {
  const rotateAnimation = useMemo<AnimationConfig>(() => ({
    rotate: isActive ? [0, 360] : 0,
    transition: {
      duration: isActive ? 20 : 0,
      repeat: Infinity,
      ease: "linear"
    }
  }), [isActive]);

  const scaleAnimation = useMemo<PlanetAnimation>(() => ({
    rotate: 0,
    scale: isActive ? 1.25 : 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }), [isActive]);

  return {
    rotateAnimation,
    scaleAnimation
  };
}
