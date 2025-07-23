"use client";

// src/contexts/AnimationContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AnimationContextType {
  isTransitioning: boolean;
  setIsTransitioning: (value: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <AnimationContext.Provider value={{ isTransitioning, setIsTransitioning }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
};