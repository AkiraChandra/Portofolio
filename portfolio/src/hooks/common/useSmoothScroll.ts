// src/hooks/common/useSmothScroll.ts
import { useEffect, useRef, useState } from 'react';

export const useSmoothScroll = (threshold = 0.5) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let lastScrollTop = 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking && !isScrolling) {
        window.requestAnimationFrame(() => {
          const currentScrollTop = window.scrollY;
          const windowHeight = window.innerHeight;
          const scrollDirection = currentScrollTop > lastScrollTop ? 'down' : 'up';
          
          // Calculate how far through the current section we've scrolled
          const currentSection = Math.floor(currentScrollTop / windowHeight);
          const sectionProgress = (currentScrollTop % windowHeight) / windowHeight;

          // If we've scrolled past the threshold, scroll to the next/previous section
          if (sectionProgress > threshold && scrollDirection === 'down') {
            setIsScrolling(true);
            window.scrollTo({
              top: (currentSection + 1) * windowHeight,
              behavior: 'smooth'
            });
            
            // Clear any existing timeout
            if (scrollTimeout.current) {
              clearTimeout(scrollTimeout.current);
            }
            
            // Set a timeout to prevent scroll hijacking during the animation
            scrollTimeout.current = setTimeout(() => {
              setIsScrolling(false);
            }, 50);
          } else if (sectionProgress < (1 - threshold) && scrollDirection === 'up') {
            setIsScrolling(true);
            window.scrollTo({
              top: currentSection * windowHeight,
              behavior: 'smooth'
            });
            
            if (scrollTimeout.current) {
              clearTimeout(scrollTimeout.current);
            }
            
            scrollTimeout.current = setTimeout(() => {
              setIsScrolling(false);
            }, 50);
          }

          lastScrollTop = currentScrollTop;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [threshold, isScrolling]);

  return isScrolling;
};