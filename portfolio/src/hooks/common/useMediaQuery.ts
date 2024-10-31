import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
};

// Specific size hooks
export const useAstronautSize = () => {
  const [size, setSize] = useState({ width: 900, height: 900 });

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) { // mobile
        setSize({ width: 300, height: 300 });
      } else if (window.innerWidth < 768) { // small tablet
        setSize({ width: 400, height: 400 });
      } else if (window.innerWidth < 1024) { // tablet
        setSize({ width: 600, height: 600 });
      } else { // desktop
        setSize({ width: 1200, height: 1200 });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};

// Project size hook
export const useProjectSizes = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  
  // Adjusted sizes for better spacing
  if (isDesktop) {
    return {
      planetSize: 240,    // Increased from 180
      spacing: 360,      // Adjusted for larger planets
      previewWidth: 500  // Increased from 400
    };
  } else if (isTablet) {
    return {
      planetSize: 200,
      spacing: 280,
      previewWidth: 440
    };
  } else {
    return {
      planetSize: 160,
      spacing: 240,
      previewWidth: 360
    };
  }
};