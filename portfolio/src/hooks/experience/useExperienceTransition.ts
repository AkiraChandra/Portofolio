// src/hooks/experience/useExperienceTransition.ts

import { useState } from 'react';
import { ExperienceTransitionHook } from '@/types/experience';

export const useExperienceTransition = (): ExperienceTransitionHook => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  return {
    activeIndex,
    setActiveIndex,
    isTransitioning
  };
};