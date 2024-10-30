import { useState, useEffect, createContext, useContext } from 'react';
import { Theme } from '@/types/theme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  mounted: false,
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
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
    
    const initialTheme = storedTheme || systemPreference;
    setTheme(initialTheme);
    applyTheme(initialTheme);

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
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);

    const root = document.documentElement;
    const colors = newTheme === 'dark' 
      ? {
          '--color-background-primary': '23 8 47',
          '--color-background-secondary': '23 8 47',
          '--color-background-tertiary': '31 31 61',
          
          '--color-text-primary': '237 237 237',
          '--color-text-secondary': '209 213 219',
          '--color-text-tertiary': '156 163 175',
          
          '--color-border-primary': '55 65 81',
          '--color-border-secondary': '75 85 99',
          
          '--color-primary': '246 176 13',
          '--color-primary-dark': '229 160 12',
          
          '--color-glow-primary': '246 176 13',
          '--color-glow-secondary': '124 58 237',
          
          '--color-effects-outer': '2 50 126',
          '--color-effects-middle': '59 130 246',
          '--color-effects-inner': '96 165 250',
          
          '--glow-opacity-outer': '0.3',
          '--glow-opacity-middle': '0.4',
          '--glow-opacity-inner': '0.5',
          
          '--moon-glow-color': '246 176 13',
          '--moon-glow-opacity': '0.8'
        }
      : {
          '--color-background-primary': '255 255 255',
          '--color-background-secondary': '249 250 251',
          '--color-background-tertiary': '243 244 246',
          
          '--color-text-primary': '23 23 23',
          '--color-text-secondary': '55 65 81',
          '--color-text-tertiary': '107 114 128',
          
          '--color-border-primary': '229 231 235',
          '--color-border-secondary': '209 213 219',
          
          '--color-primary': '243 235 0',
          '--color-primary-dark': '246 176 13',
          
          '--color-glow-primary': '243 235 0',
          '--color-glow-secondary': '147 51 234',
          
          '--color-effects-outer': '2 50 126',
          '--color-effects-middle': '59 130 246',
          '--color-effects-inner': '96 165 250',
          
          '--glow-opacity-outer': '0.05',
          '--glow-opacity-middle': '0.08',
          '--glow-opacity-inner': '0.1',
          
          '--moon-glow-color': '246 176 13',
          '--moon-glow-opacity': '0.5'
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
    mounted
  };
};

export const useThemeValue = () => {
  const { theme } = useTheme();
  return theme;
};