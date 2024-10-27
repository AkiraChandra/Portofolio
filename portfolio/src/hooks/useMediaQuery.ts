'use client'

import { useState, useEffect } from "react";

export const useAstronautSize = () => {
  const [size, setSize] = useState({ width: 900, height: 900 });

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) { 
        setSize({ width: 400, height: 400 });
      } else if (window.innerWidth < 1024) { 
        setSize({ width: 600, height: 600 });
      } else { 
        setSize({ width: 900, height: 900 });
      }
    };

    
    updateSize();

    
    window.addEventListener('resize', updateSize);

    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};