// src/features/theme/theme.utils.ts

import { Theme } from '@/types/theme';
import themeConfig from '@/config/theme.config';

export const getThemeColor = (
  colorPath: string,
  theme: Theme = 'light'
): string => {
  const paths = colorPath.split('.');
  let value: any = themeConfig.colors;

  for (const path of paths) {
    if (value[path]?.[theme]) {
      value = value[path][theme];
    } else if (value[path]) {
      value = value[path];
    } else {
      console.warn(`Color path "${colorPath}" not found in theme config`);
      return '';
    }
  }

  return value;
};

export const getThemeValue = (
  path: string,
  defaultValue: string = ''
): string => {
  const paths = path.split('.');
  let value: any = themeConfig;

  for (const segment of paths) {
    if (value[segment]) {
      value = value[segment];
    } else {
      console.warn(`Path "${path}" not found in theme config`);
      return defaultValue;
    }
  }

  return value;
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