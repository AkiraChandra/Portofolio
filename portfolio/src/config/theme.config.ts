// src/config/theme.config.ts

export const themeConfig = {
    colors: {
      // Base Colors
      primary: {
        light: '#F3EB00',
        DEFAULT: '#F6B00D',
        dark: '#E5A00C'
      },
      secondary: {
        light: '#9333EA',
        DEFAULT: '#7C3AED',
        dark: '#6D28D9'
      },
      
      // Background Colors
      background: {
        light: {
          primary: '#FFFFFF',
          secondary: '#F9FAFB',
          tertiary: '#F3F4F6'
        },
        dark: {
          primary: '#0B0B1F',    // Deep purple/blue - Main background
          secondary: '#17082F',  // Slightly lighter for cards
          tertiary: '#1F1F3D'    // Accent background
        }
      },
      
      // Text Colors
      text: {
        light: {
          primary: '#171717',
          secondary: '#374151',
          tertiary: '#6B7280'
        },
        dark: {
          primary: '#EDEDED',
          secondary: '#D1D5DB',
          tertiary: '#9CA3AF'
        }
      },
      
      // Border Colors
      border: {
        light: {
          primary: '#E5E7EB',
          secondary: '#D1D5DB'
        },
        dark: {
          primary: '#374151',
          secondary: '#4B5563'
        }
      },
      
      // Glow Effects
      glow: {
        light: {
          primary: 'rgba(243, 235, 0, 0.7)',
          secondary: 'rgba(147, 51, 234, 0.7)'
        },
        dark: {
          primary: 'rgba(246, 176, 13, 0.7)',
          secondary: 'rgba(124, 58, 237, 0.7)'
        }
      },
      effects: {
        light: {
          outer: 'rgba(2, 50, 126, 0.05)',
          middle: 'rgba(132, 0, 255, 0.08)',
          inner: 'rgba(96, 165, 250, 0.1)'
        },
        dark: {
          outer: 'rgba(2, 50, 126, 0.15)',
          middle: 'rgba(132, 0, 255, 0.18)',
          inner: 'rgba(96, 165, 250, 0.2)'
        }
      }
    },
    
    // Rest of the configuration remains the same
    typography: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)']
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    },
    
    spacing: {
      container: {
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem'
        },
        maxWidth: '1280px'
      }
    },
    
    transitions: {
      duration: {
        fast: '150ms',
        DEFAULT: '300ms',
        slow: '500ms'
      },
      timing: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    },
    
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  } as const;
  
  export type ThemeConfig = typeof themeConfig;
  export default themeConfig;