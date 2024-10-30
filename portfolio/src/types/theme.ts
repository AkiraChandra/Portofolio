// src/types/theme.ts

export type Theme = 'light' | 'dark';

export interface ThemeColors {
  primary: {
    light: string;
    DEFAULT: string;
    dark: string;
  };
  background: {
    light: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    dark: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
  };
  text: {
    light: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    dark: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
  };
  border: {
    light: {
      primary: string;
      secondary: string;
    };
    dark: {
      primary: string;
      secondary: string;
    };
  };
  glow: {
    light: {
      primary: string;
      secondary: string;
    };
    dark: {
      primary: string;
      secondary: string;
    };
  };
  effects: {
    light: {
      outer: string;
      middle: string;
      inner: string;
    };
    dark: {
      outer: string;
      middle: string;
      inner: string;
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
  transitions: {
    duration: {
      fast: string;
      DEFAULT: string;
      slow: string;
    };
    timing: {
      DEFAULT: string;
      linear: string;
      in: string;
      out: string;
      'in-out': string;
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