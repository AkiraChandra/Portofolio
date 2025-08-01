// src/components/layouts/PageLayout.tsx (FIXED VERSION)
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/navigations/Navbar';
import Hero from '@/components/sections/Hero/Hero';
import Projects from '@/components/sections/Projects/Projects';
import Experience from '@/components/sections/Experience';
import Certifications from '@/components/sections/Certifications/Certifications';
import Skills from '@/components/sections/Skills/Skills';
import { useSmoothScroll } from '@/hooks/common/useSmoothScroll';

interface PageLayoutProps {
  defaultSection?: 'home' | 'projects' | 'experience' | 'certifications' | 'skills';
}

const SECTIONS = [
  { id: 'home', path: '/' },
  { id: 'projects', path: '/projects' },
  { id: 'experience', path: '/experience' },
  { id: 'certifications', path: '/certifications' },
  { id: 'skills', path: '/skills' },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

export default function PageLayout({ defaultSection = 'home' }: PageLayoutProps) {
  const isScrolling = useSmoothScroll(0.3);
  const [isInitialized, setIsInitialized] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isManualScrolling = useRef(false);

  // SOLUTION 1: Disable browser scroll restoration and handle manually
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Force reset scroll to top on mount, then initialize
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = 0;
      
      // Initialize after a short delay
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // SOLUTION 2: Enhanced scroll to section with snap-friendly behavior
  useEffect(() => {
    if (!isInitialized || defaultSection === 'home') return;

    const scrollToSection = (attempt = 0) => {
      const container = scrollContainerRef.current;
      const targetSection = document.getElementById(defaultSection);
      
      if (container && targetSection) {
        isManualScrolling.current = true;
        
        // Calculate exact scroll position
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetSection.getBoundingClientRect();
        const currentScrollTop = container.scrollTop;
        
        // Get accurate offset position
        const offsetTop = targetSection.offsetTop;
        
        // Use direct scroll positioning for better snap compatibility
        container.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Clear manual scrolling flag after animation
        setTimeout(() => {
          isManualScrolling.current = false;
        }, 1000);
        
      } else if (attempt < 3) {
        // Retry if elements not ready
        setTimeout(() => scrollToSection(attempt + 1), 200);
      }
    };

    scrollToSection();
  }, [defaultSection, isInitialized]);

  // SOLUTION 3: Improved intersection observer with manual scroll detection
  useEffect(() => {
    if (!isInitialized) return;

    let currentActiveSection: SectionId = defaultSection;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Skip updates during manual scrolling
        if (isManualScrolling.current) return;
        
        // Find the section that's most in view
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0.5)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          
        if (visibleEntries.length > 0) {
          const mostVisibleEntry = visibleEntries[0];
          const sectionId = mostVisibleEntry.target.id as SectionId;
          const section = SECTIONS.find(s => s.id === sectionId);
          
          if (section && section.id !== currentActiveSection) {
            currentActiveSection = section.id;
            window.history.replaceState(null, '', section.path);
          }
        }
      },
      {
        root: scrollContainerRef.current,
        // More precise thresholds for better detection
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0],
        // Adjusted margin to avoid conflicts with overflow sections
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    // Start observing after a delay to avoid conflicts
    const timer = setTimeout(() => {
      SECTIONS.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.observe(element);
        }
      });
      observerRef.current = observer;
    }, 300);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [defaultSection, isInitialized]);

  // SOLUTION 4: Simplified backup scroll handler  
  useEffect(() => {
    if (!isInitialized) return;

    let scrollTimer: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Skip during manual scrolling
      if (isManualScrolling.current) return;
      
      // Clear previous timer
      if (scrollTimer) clearTimeout(scrollTimer);
      
      // Debounce the scroll handler
      scrollTimer = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const containerHeight = container.clientHeight;
        const scrollTop = container.scrollTop;
        
        // Find which section is most visible
        let mostVisibleSection: typeof SECTIONS[number] = SECTIONS[0];
        let maxVisibleArea = 0;

        SECTIONS.forEach(section => {
          const element = document.getElementById(section.id);
          if (!element) return;
          
          const elementTop = element.offsetTop;
          const elementHeight = element.offsetHeight;
          
          // Calculate visible area
          const visibleTop = Math.max(scrollTop, elementTop);
          const visibleBottom = Math.min(scrollTop + containerHeight, elementTop + elementHeight);
          const visibleArea = Math.max(0, visibleBottom - visibleTop);
          
          if (visibleArea > maxVisibleArea) {
            maxVisibleArea = visibleArea;
            mostVisibleSection = section;
          }
        });

        // Update URL if significant portion is visible (lower threshold)
        if (maxVisibleArea > containerHeight * 0.2) { // Reduced from 0.3 to 0.2
          const currentPath = window.location.pathname;
          if (mostVisibleSection.path !== currentPath) {
            window.history.replaceState(null, '', mostVisibleSection.path);
          }
        }
      }, 50); // Reduced debounce delay from 150 to 50
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        if (scrollTimer) clearTimeout(scrollTimer);
      };
    }
  }, [isInitialized]);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      <div 
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory"
        style={{
          // SOLUTION 5: Enhanced CSS for better snap behavior
          scrollBehavior: 'smooth',
          scrollPaddingTop: '0px',
        }}
      >
        
        {/* Hero Section */}
        <section 
          id="home" 
          className="snap-start h-screen w-full"
          style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
        >
          <Hero />
        </section>
        
        {/* Projects Section */}
        <motion.section 
          id="projects"
          className="snap-start h-screen w-full"
          style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Projects />
        </motion.section>
        
        {/* Experience Section - Better overflow handling */}
        <motion.section 
          id="experience"
          className="snap-start min-h-screen w-full"
          style={{
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            // Force exact positioning for overflow content
            scrollMarginTop: '0px',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Experience />
        </motion.section>
        
        {/* Certifications Section - Better overflow handling */}
        <motion.section 
          id="certifications"
          className="snap-start min-h-screen w-full"
          style={{
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            // Ensure proper positioning even with overflow
            scrollMarginTop: '0px',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Certifications />
        </motion.section>
        
        {/* Skills Section */}
        <motion.section 
          id="skills"
          className="snap-start min-h-screen w-full"
          style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Skills />
        </motion.section>
      </div>
    </main>
  );
}