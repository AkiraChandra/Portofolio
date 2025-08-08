'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';

type SectionId = "home" | "projects" | "experience" | "certifications" | "skills";

interface SectionActivityContextType {
  activeSection: SectionId;
  setActiveSection: (sectionId: SectionId) => void;
  isActive: (sectionId: SectionId) => boolean;
}

const SectionActivityContext = createContext<SectionActivityContextType | null>(null);

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

// Hook untuk menggunakan context
export const useSectionActivity = () => {
  const context = useContext(SectionActivityContext);
  if (!context) {
    throw new Error('useSectionActivity must be used within SectionActivityProvider');
  }
  return context;
};

// Simplified Active Timeout Hook
export const useActiveTimeout = (
  callback: () => void,
  delay: number | null,
  sectionId: SectionId
) => {
  const { isActive } = useSectionActivity();
  const intervalRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // Update callback ref
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || !isActive(sectionId)) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      callbackRef.current();
    }, delay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive(sectionId), delay, sectionId]);
};