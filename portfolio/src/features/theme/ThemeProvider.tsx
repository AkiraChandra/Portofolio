// src/features/theme/ThemeProvider.tsx

'use client';

import { ReactNode } from 'react';
import { ThemeContext, useThemeSetup } from '@/hooks/theme/useTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const themeContext = useThemeSetup();

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};