'use client';

import React, { ReactNode } from 'react';
import { ThemeContext, useThemeSetup } from '@/hooks/theme/useTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeContext = useThemeSetup();

  // Prevent hydration mismatch by not rendering until mounted
  if (!themeContext.mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={themeContext}>
      <div className={`${themeContext.theme} transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};