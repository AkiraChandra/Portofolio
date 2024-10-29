'use client'

import { useState, useEffect } from "react";

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