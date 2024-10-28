// hooks/useIntersection.ts
import { useState, useEffect, useRef } from 'react';

export const useIntersection = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!element) return;

    // Get all potential elements that could intersect with navbar
    const contentElements = document.querySelectorAll('.hero-content');
    if (!contentElements.length) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Check if any content element is intersecting
        const isAnyIntersecting = entries.some(entry => entry.isIntersecting);
        setIsIntersecting(isAnyIntersecting);
      },
      {
        root: null,
        rootMargin: '-20% 0px 0px 0px', // Adjust these values to control when the intersection triggers
        threshold: 0
      }
    );

    // Observe all content elements
    contentElements.forEach(content => {
      observerRef.current?.observe(content);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [element]);

  return [setElement, isIntersecting] as const;
};