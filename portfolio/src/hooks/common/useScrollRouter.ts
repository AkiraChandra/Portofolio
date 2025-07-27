// src/hooks/common/useScrollRouter.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Section {
  id: string;
  path: string;
  element?: HTMLElement;
}

interface UseScrollRouterOptions {
  threshold?: number;
  rootMargin?: string;
  smoothScrollDuration?: number;
}

export const useScrollRouter = (
  sections: Section[],
  options: UseScrollRouterOptions = {}
) => {
  const { 
    threshold = 0.5, 
    rootMargin = '-20% 0px -20% 0px',
    smoothScrollDuration = 1000
  } = options;
  
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isScrolling, setIsScrolling] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize sections with DOM elements
  const initializeSections = useCallback(() => {
    return sections.map(section => ({
      ...section,
      element: document.getElementById(section.id),
    })).filter(section => section.element);
  }, [sections]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string, updateUrl = true) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    setIsScrolling(true);
    
    // Update URL first for immediate feedback
    if (updateUrl) {
      const targetSection = sections.find(s => s.id === sectionId);
      if (targetSection) {
        router.push(targetSection.path, { scroll: false });
      }
    }

    // Smooth scroll to section
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset scrolling state after animation
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, smoothScrollDuration);
  }, [sections, router, smoothScrollDuration]);

  // Handle URL changes and scroll to corresponding section
  useEffect(() => {
    const currentSection = sections.find(section => section.path === pathname);
    if (currentSection && !isScrolling) {
      const sectionElement = document.getElementById(currentSection.id);
      if (sectionElement) {
        // Check if we're already in the viewport
        const rect = sectionElement.getBoundingClientRect();
        const isInView = rect.top >= -100 && rect.top <= window.innerHeight / 2;
        
        if (!isInView) {
          scrollToSection(currentSection.id, false);
        } else {
          setActiveSection(currentSection.id);
        }
      }
    }
  }, [pathname, sections, isScrolling, scrollToSection]);

  // Set up intersection observer for scroll-based URL updates
  useEffect(() => {
    if (isScrolling) return;

    const activeSections = initializeSections();
    if (activeSections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isScrolling) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const section = sections.find(s => s.id === sectionId);
            
            if (section) {
              setActiveSection(sectionId);
              
              // Update URL without scrolling
              if (pathname !== section.path) {
                router.push(section.path, { scroll: false });
              }
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    activeSections.forEach(section => {
      if (section.element) {
        observerRef.current?.observe(section.element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sections, threshold, rootMargin, isScrolling, pathname, router, initializeSections]);

  // Navigation handler for navbar clicks
  const navigateToSection = useCallback((sectionId: string) => {
    scrollToSection(sectionId, true);
  }, [scrollToSection]);

  // Get current section info
  const getCurrentSection = useCallback(() => {
    return sections.find(section => section.id === activeSection);
  }, [sections, activeSection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      observerRef.current?.disconnect();
    };
  }, []);

  return {
    activeSection,
    isScrolling,
    navigateToSection,
    getCurrentSection,
    scrollToSection,
  };
};