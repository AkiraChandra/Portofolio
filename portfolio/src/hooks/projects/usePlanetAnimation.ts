import { useMemo } from 'react';
import { AnimationConfig, PlanetAnimation, PlanetAnimationHook } from '@/types/projects';

export function usePlanetAnimation(isActive: boolean, isHovered: boolean): PlanetAnimationHook {
  const rotateAnimation = useMemo<AnimationConfig>(() => ({
    rotate: (isActive || isHovered) ? [0, 360] : 0,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop"
    }
  }), [isActive, isHovered]);

  const scaleAnimation = useMemo<PlanetAnimation>(() => ({
    scale: isActive || isHovered ? 1.1 : 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }), [isActive, isHovered]);

  return {
    rotateAnimation,
    scaleAnimation
  };
}