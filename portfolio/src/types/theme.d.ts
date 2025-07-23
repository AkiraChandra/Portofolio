// src/types/theme.d.ts

export type ThemeMode = 'light' | 'dark';

export interface ColorConfig {
  light: string;
  DEFAULT: string;
  dark: string;
}

export interface ThemeColors {
  primary: ColorConfig;
  background: {
    primary: {
      DEFAULT: string;
      dark: string;
    };
    secondary: {
      DEFAULT: string;
      dark: string;
    };
    tertiary: {
      DEFAULT: string;
      dark: string;
    };
  };
  text: {
    primary: {
      DEFAULT: string;
      dark: string;
    };
    secondary: {
      DEFAULT: string;
      dark: string;
    };
    tertiary: {
      DEFAULT: string;
      dark: string;
    };
  };
  border: {
    primary: {
      DEFAULT: string;
      dark: string;
    };
    secondary: {
      DEFAULT: string;
      dark: string;
    };
  };
  effects: {
    outer: {
      DEFAULT: string;
      dark: string;
    };
    middle: {
      DEFAULT: string;
      dark: string;
    };
    inner: {
      DEFAULT: string;
      dark: string;
    };
  };
}

export interface ThemeConfig {
  colors: ThemeColors;
  typography: {
    fontFamily: {
      sans: string[];
      mono: string[];
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
  };
  spacing: {
    container: {
      padding: {
        DEFAULT: string;
        sm: string;
        lg: string;
        xl: string;
      };
      maxWidth: string;
    };
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

declare module 'react' {
  interface CSSProperties {
    '--color-primary'?: string;
    '--color-primary-dark'?: string;
    '--color-background-primary'?: string;
    '--color-background-secondary'?: string;
    '--color-background-tertiary'?: string;
    '--color-text-primary'?: string;
    '--color-text-secondary'?: string;
    '--color-text-tertiary'?: string;
    '--color-border-primary'?: string;
    '--color-border-secondary'?: string;
    '--color-effects-outer'?: string;
    '--color-effects-middle'?: string;
    '--color-effects-inner'?: string;
  }
}