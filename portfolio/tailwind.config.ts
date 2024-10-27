import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'star': 'star 6s linear infinite',
        'pulse': 'pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        star: {
          '0%': {
            transform: 'translateX(-100px) translateY(100px) rotate(-45deg)',
            opacity: '0'
          },
          '15%': {
            opacity: '0.75'
          },
          '85%': {
            opacity: '0.75'
          },
          '100%': {
            transform: 'translateX(200px) translateY(-200px) rotate(-45deg)',
            opacity: '0'
          }
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;