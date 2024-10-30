// src/hooks/theme/useTheme.ts

import { useState, useEffect, createContext, useContext } from 'react';
import { Theme } from '@/types/theme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeSetup = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Check system preference if no stored theme
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
    
    // Set initial theme
    const initialTheme = storedTheme || systemPreference;
    setTheme(initialTheme);
    
    // Apply theme to document
    applyTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    // Update document class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Store theme preference
    localStorage.setItem('theme', newTheme);

    // Update CSS custom properties
    const root = document.documentElement;
    const colors = newTheme === 'dark' 
      ? {
          '--color-background-primary': '23 8 47',
          '--color-background-secondary': '11 11 31',
          '--color-background-tertiary': '31 31 61',
        }
      : {
          '--color-background-primary': '255 255 255',
          '--color-background-secondary': '249 250 251',
          '--color-background-tertiary': '243 244 246',
        };

    Object.entries(colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return { 
    theme, 
    setTheme, 
    toggleTheme,
    mounted // Add mounted state to prevent hydration mismatch
  };
};

export const useThemeValue = () => {
  const { theme } = useTheme();
  return theme;
};