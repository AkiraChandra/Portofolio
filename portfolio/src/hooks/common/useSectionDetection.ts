// Alternative approach: Custom hook for more reliable section detection
// src/hooks/useSectionDetection.ts

'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface Section {
  id: string;
  path: string;
  element?: HTMLElement;
}

const SECTIONS = [
  { id: 'home', path: '/' },
  { id: 'projects', path: '/projects' },
  { id: 'experience', path: '/experience' },
  { id: 'certifications', path: '/certifications' },
];

export const useSectionDetection = (scrollContainerRef: React.RefObject<HTMLDivElement>) => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('home');
  const isScrollingRef = useRef(false);
  const lastUpdateRef = useRef(0);

  // Get section elements and cache them
  const getSectionElements = useCallback(() => {
    return SECTIONS.map(section => ({
      ...section,
      element: document.getElementById(section.id)
    })).filter(section => section.element);
  }, []);

  // Calculate most visible section
  const calculateActiveSection = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isScrollingRef.current) return;

    const sectionsWithElements = getSectionElements();
    if (sectionsWithElements.length === 0) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const containerTop = containerRect.top;
    const containerHeight = containerRect.height;
    const containerCenter = containerTop + containerHeight / 2;

    let closestSection = sectionsWithElements[0];
    let smallestDistance = Infinity;

    sectionsWithElements.forEach(section => {
      const element = section.element!;
      const rect = element.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(sectionCenter - containerCenter);

      // Also check if section is significantly visible
      const visibleTop = Math.max(containerTop, rect.top);
      const visibleBottom = Math.min(containerTop + containerHeight, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibilityRatio = visibleHeight / containerHeight;

      // Prefer sections that are more visible and closer to center
      const score = distanceFromCenter - (visibilityRatio * 200);

      if (score < smallestDistance && visibilityRatio > 0.1) {
        smallestDistance = score;
        closestSection = section;
      }
    });

    return closestSection.id;
  }, [scrollContainerRef, getSectionElements]);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current < 100) return; // Throttle to 100ms

    const newActiveSection = calculateActiveSection();
    if (newActiveSection && newActiveSection !== activeSection) {
      setActiveSection(newActiveSection);
      
      const newPath = SECTIONS.find(s => s.id === newActiveSection)?.path;
      if (newPath && newPath !== pathname) {
        window.history.replaceState(null, '', newPath);
      }
      
      lastUpdateRef.current = now;
    }
  }, [calculateActiveSection, activeSection, pathname]);

  // Set up scroll detection
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Initial detection
    setTimeout(() => {
      const initialSection = calculateActiveSection();
      if (initialSection) {
        setActiveSection(initialSection);
      }
    }, 100);

    // Add scroll listener
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, calculateActiveSection, scrollContainerRef]);

  // Sync active section with pathname changes (from navbar)
  useEffect(() => {
    const currentSection = SECTIONS.find(s => s.path === pathname);
    if (currentSection && currentSection.id !== activeSection) {
      setActiveSection(currentSection.id);
    }
  }, [pathname, activeSection]);

  return {
    activeSection,
    setIsScrolling: (value: boolean) => {
      isScrollingRef.current = value;
    }
  };
};