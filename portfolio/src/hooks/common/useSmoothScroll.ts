
// src/hooks/common/useSmoothScroll.ts (MOBILE OPTIMIZED)
import { useEffect } from 'react';
import { useMediaQuery } from './useMediaQuery';

export const useSmoothScroll = (duration: number = 0.5) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  
  useEffect(() => {
    // Skip smooth scroll setup if reduced motion is preferred
    if (prefersReducedMotion) return;
    
    // Mobile-optimized smooth scroll
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: ${isMobile ? 'auto' : 'smooth'};
      }
      
      @media (max-width: 768px) {
        .h-screen.overflow-y-auto {
          scroll-behavior: auto;
          -webkit-overflow-scrolling: touch;
        }
      }
      
      .snap-y.snap-mandatory {
        scroll-snap-type: ${isMobile ? 'y proximity' : 'y mandatory'};
      }
      
      .snap-start {
        scroll-snap-align: ${isMobile ? 'start' : 'start'};
        scroll-snap-stop: ${isMobile ? 'normal' : 'always'};
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [duration, isMobile, prefersReducedMotion]);

  return isMobile;
};