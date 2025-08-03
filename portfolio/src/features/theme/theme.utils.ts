// src/features/theme/theme.utils.ts

import { Theme } from '@/types/theme';
import themeConfig from '@/config/theme.config';


export const getThemeColor = (
  colorPath: string,
  theme: Theme = 'light'
): string => {
  const paths = colorPath.split('.');
  let value: unknown = themeConfig.colors; // ✅ FIXED: Use unknown instead of any

  for (const path of paths) {
    if (typeof value === 'object' && value !== null && path in value) {
      const currentValue = (value as Record<string, unknown>)[path];
      
      // Check if it's a theme-specific object
      if (typeof currentValue === 'object' && currentValue !== null && theme in currentValue) {
        value = (currentValue as Record<string, unknown>)[theme];
      } else {
        value = currentValue;
      }
    } else {
      console.warn(`Color path "${colorPath}" not found in theme config`);
      return '';
    }
  }

  // ✅ FIXED: Type guard for return value
  if (typeof value === 'string') {
    return value;
  }
  
  console.warn(`Color path "${colorPath}" does not resolve to a string`);
  return '';
};

export const getThemeValue = (
  path: string,
  defaultValue: string = ''
): string => {
  const paths = path.split('.');
  let value: unknown = themeConfig; // ✅ FIXED: Use unknown instead of any

  for (const segment of paths) {
    if (typeof value === 'object' && value !== null && segment in value) {
      value = (value as Record<string, unknown>)[segment];
    } else {
      console.warn(`Path "${path}" not found in theme config`);
      return defaultValue;
    }
  }

  // ✅ FIXED: Type guard for return value
  if (typeof value === 'string') {
    return value;
  } else if (typeof value === 'number') {
    return value.toString();
  }
  
  console.warn(`Path "${path}" does not resolve to a string or number`);
  return defaultValue;
};

// CSS Variable utilities
export const getCssVar = (name: string): string => {
  return `var(--${name})`;
};

export const rgb = (r: number, g: number, b: number): string => {
  return `${r} ${g} ${b}`;
};

export const rgba = (r: number, g: number, b: number, a: number): string => {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// ✅ BONUS: Additional type-safe utilities
export const getThemeColorSafe = (
  colorPath: string,
  theme: Theme = 'light',
  fallback: string = '#000000'
): string => {
  try {
    const result = getThemeColor(colorPath, theme);
    return result || fallback;
  } catch (error) {
    console.error(`Error getting theme color for path "${colorPath}":`, error);
    return fallback;
  }
};

export const isValidThemeColor = (color: string): boolean => {
  // Simple validation for hex, rgb, rgba, hsl colors
  const colorRegex = /^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|var\()/;
  return colorRegex.test(color);
};