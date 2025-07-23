import { useEffect, useRef, useState } from 'react';

interface UseExperienceScrollProps {
  sectionId: string;
  threshold?: number;
}

export const useExperienceScroll = ({
  sectionId,
  threshold = 0.3
}: UseExperienceScrollProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (section) {
      sectionRef.current = section;
    }

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate visibility
        const isInView = rect.top <= windowHeight * (1 - threshold) && 
                        rect.bottom >= windowHeight * threshold;
        setIsVisible(isInView);

        // Calculate scroll progress
        if (isInView) {
          const totalDistance = windowHeight + rect.height;
          const scrolled = windowHeight - rect.top;
          const progress = Math.min(Math.max(scrolled / totalDistance, 0), 1);
          setProgress(progress);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionId, threshold]);

  return {
    isVisible,
    progress,
    sectionRef
  };
};