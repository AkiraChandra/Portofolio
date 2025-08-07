// File: src/contexts/SectionActivityContext.tsx - SIMPLIFIED VERSION
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ===============================================================
// TYPES - SUPER SIMPLE
// ===============================================================

type SectionId = "home" | "projects" | "experience" | "certifications" | "skills";

interface SectionActivityContextType {
  activeSection: SectionId;
  setActiveSection: (sectionId: SectionId) => void;
  isActive: (sectionId: SectionId) => boolean;
}

// ===============================================================
// CONTEXT
// ===============================================================

const SectionActivityContext = createContext<SectionActivityContextType | null>(null);

// ===============================================================
// PROVIDER - MINIMAL VERSION
// ===============================================================

interface SectionActivityProviderProps {
  children: ReactNode;
  initialSection?: SectionId;
}

export const SectionActivityProvider: React.FC<SectionActivityProviderProps> = ({
  children,
  initialSection = "home"
}) => {
  const [activeSection, setActiveSection] = useState<SectionId>(initialSection);

  // Debug logging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 Active section changed to: ${activeSection}`);
    }
  }, [activeSection]);

  const isActive = (sectionId: SectionId): boolean => {
    return activeSection === sectionId;
  };

  const contextValue: SectionActivityContextType = {
    activeSection,
    setActiveSection,
    isActive
  };

  return (
    <SectionActivityContext.Provider value={contextValue}>
      {children}
    </SectionActivityContext.Provider>
  );
};

// ===============================================================
// HOOK
// ===============================================================

export const useSectionActivity = (): SectionActivityContextType => {
  const context = useContext(SectionActivityContext);
  if (!context) {
    throw new Error('useSectionActivity must be used within SectionActivityProvider');
  }
  return context;
};

// ===============================================================
// UTILITY HOOKS - ANIMATION AWARE
// ===============================================================

/**
 * Hook untuk timeout yang otomatis pause/resume berdasarkan section aktif
 */
export const useActiveTimeout = (
  callback: () => void,
  delay: number | null,
  sectionId: SectionId
) => {
  const { isActive } = useSectionActivity();
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const startTimeRef = React.useRef<number>();
  const remainingTimeRef = React.useRef<number>(delay || 0);

  React.useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay === null || !isActive(sectionId)) {
      return;
    }

    // Start or resume timeout
    const timeToWait = remainingTimeRef.current;
    startTimeRef.current = Date.now();

    timeoutRef.current = setTimeout(() => {
      callback();
      remainingTimeRef.current = delay; // Reset for next time
    }, timeToWait);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        
        // Calculate remaining time when paused
        if (startTimeRef.current) {
          const elapsed = Date.now() - startTimeRef.current;
          remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
        }
      }
    };
  }, [isActive(sectionId), callback, delay, sectionId]);
};

/**
 * Hook untuk interval yang otomatis pause/resume berdasarkan section aktif
 */
export const useActiveInterval = (
  callback: () => void,
  delay: number | null,
  sectionId: SectionId
) => {
  const { isActive } = useSectionActivity();
  const intervalRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (delay === null || !isActive(sectionId)) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(callback, delay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive(sectionId), callback, delay, sectionId]);
};

/**
 * Hook untuk cek apakah animations harus di-pause
 */
export const useAnimationState = (sectionId: SectionId) => {
  const { isActive } = useSectionActivity();
  
  return {
    isActive: isActive(sectionId),
    shouldPause: !isActive(sectionId),
    animationPlayState: isActive(sectionId) ? 'running' : 'paused'
  };
};

export default SectionActivityProvider;