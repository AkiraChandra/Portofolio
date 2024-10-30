// tailwind.config.js

const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'rgb(var(--color-primary) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        },
        background: {
          primary: {
            DEFAULT: 'rgb(var(--color-background-primary) / <alpha-value>)',
            dark: 'rgb(var(--color-background-primary) / <alpha-value>)',
          },
          secondary: {
            DEFAULT: 'rgb(var(--color-background-secondary) / <alpha-value>)',
            dark: 'rgb(var(--color-background-secondary) / <alpha-value>)',
          },
          tertiary: {
            DEFAULT: 'rgb(var(--color-background-tertiary) / <alpha-value>)',
            dark: 'rgb(var(--color-background-tertiary) / <alpha-value>)',
          },
        },
        text: {
          primary: {
            DEFAULT: 'rgb(var(--color-text-primary) / <alpha-value>)',
            dark: 'rgb(var(--color-text-primary) / <alpha-value>)',
          },
          secondary: {
            DEFAULT: 'rgb(var(--color-text-secondary) / <alpha-value>)',
            dark: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          },
          tertiary: {
            DEFAULT: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
            dark: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
          },
        },
        border: {
          primary: {
            DEFAULT: 'rgb(var(--color-border-primary) / <alpha-value>)',
            dark: 'rgb(var(--color-border-primary) / <alpha-value>)',
          },
          secondary: {
            DEFAULT: 'rgb(var(--color-border-secondary) / <alpha-value>)',
            dark: 'rgb(var(--color-border-secondary) / <alpha-value>)',
          },
        },
        effects: {
          outer: {
            DEFAULT: 'rgb(var(--color-effects-outer) / <alpha-value>)',
            dark: 'rgb(var(--color-effects-outer) / <alpha-value>)',
          },
          middle: {
            DEFAULT: 'rgb(var(--color-effects-middle) / <alpha-value>)',
            dark: 'rgb(var(--color-effects-middle) / <alpha-value>)',
          },
          inner: {
            DEFAULT: 'rgb(var(--color-effects-inner) / <alpha-value>)',
            dark: 'rgb(var(--color-effects-inner) / <alpha-value>)',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-out': 'slide-out 0.3s ease-in',
      },
    },
  },
  plugins: [],
};