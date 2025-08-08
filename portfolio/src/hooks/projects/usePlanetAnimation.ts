// src/hooks/projects/usePlanetAnimation.ts - FIXED VERSION
import { useMemo } from 'react';
import { TargetAndTransition } from 'framer-motion';

// ✅ FIXED: Proper interface for Framer Motion
export interface PlanetAnimationHook {
  rotateAnimation: TargetAndTransition;
  scaleAnimation: TargetAndTransition;
}

export function usePlanetAnimation(isActive: boolean, isHovered: boolean): PlanetAnimationHook {
  // ✅ FIXED: Return proper TargetAndTransition for animate prop
  const rotateAnimation = useMemo<TargetAndTransition>(() => ({
    rotate: (isActive || isHovered) ? [0, 360] : 0,
    transition: {
      duration: 20,
      repeat: isActive || isHovered ? Infinity : 0, // ✅ FIXED: Stop repeat when inactive
      ease: "linear",
      repeatType: "loop" as const
    }
  }), [isActive, isHovered]);

  // ✅ FIXED: Return proper TargetAndTransition for whileHover prop
  const scaleAnimation = useMemo<TargetAndTransition>(() => ({
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }), []);

  return {
    rotateAnimation,
    scaleAnimation
  };
}