// src/components/layouts/PageLayout.tsx (FIXED VERSION)
'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/navigations/Navbar';
import Hero from '@/components/sections/Hero/Hero';
import Projects from '@/components/sections/Projects/Projects';
import Experience from '@/components/sections/Experience';
import Certifications from '@/components/sections/Certifications/Certifications';
import { useSmoothScroll } from '@/hooks/common/useSmoothScroll';

interface PageLayoutProps {
  defaultSection?: 'home' | 'projects' | 'experience' | 'certifications';
}

const SECTIONS = [
  { id: 'home', path: '/' },
  { id: 'projects', path: '/projects' },
  { id: 'experience', path: '/experience' },
  { id: 'certifications', path: '/certifications' },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

export default function PageLayout({ defaultSection = 'home' }: PageLayoutProps) {
  const isScrolling = useSmoothScroll(0.3);

  // Enhanced auto scroll logic with multiple attempts
  useEffect(() => {
    if (defaultSection !== 'home') {
      const scrollToSection = (attempt = 0) => {
        const targetSection = document.getElementById(defaultSection);
        if (targetSection) {
          // For experience section with overflow content, use different scroll behavior
          if (defaultSection === 'experience') {
            // Get the scroll container
            const scrollContainer = document.querySelector('.h-screen.overflow-y-auto') as HTMLElement;
            if (scrollContainer) {
              // Calculate the exact scroll position for experience section
              const rect = targetSection.getBoundingClientRect();
              const containerRect = scrollContainer.getBoundingClientRect();
              const currentScrollTop = scrollContainer.scrollTop;
              
              // Calculate target scroll position (top of experience section)
              const targetScrollTop = currentScrollTop + rect.top - containerRect.top;
              
              // Smooth scroll to the calculated position
              scrollContainer.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth'
              });
            }
          } else {
            // For other sections, use normal scroll behavior
            targetSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        } else if (attempt < 5) {
          // Retry if element not found (DOM might not be ready)
          setTimeout(() => scrollToSection(attempt + 1), 100 * (attempt + 1));
        }
      };

      // Initial attempt with delay
      const timer = setTimeout(() => scrollToSection(), 100);
      return () => clearTimeout(timer);
    }
  }, [defaultSection]);

  // FIXED: More robust URL updates with better viewport detection
  useEffect(() => {
    let currentActiveSection: SectionId = defaultSection;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Sort entries by intersection ratio to get the most visible section
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          
        if (visibleEntries.length > 0) {
          const mostVisibleEntry = visibleEntries[0];
          const sectionId = mostVisibleEntry.target.id as SectionId;
          const section = SECTIONS.find(s => s.id === sectionId);
          
          // Only update if it's actually a different section and has significant visibility
          if (section && 
              section.id !== currentActiveSection && 
              mostVisibleEntry.intersectionRatio > 0.1) {
            currentActiveSection = section.id;
            window.history.replaceState(null, '', section.path);
          }
        }
      },
      {
        // FIXED: Better threshold and margin settings
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0], // Multiple thresholds for better detection
        rootMargin: '-20px 0px -20px 0px', // Smaller margin to avoid conflicts
      }
    );

    // FIXED: Add a small delay to ensure DOM is ready
    const initializeObserver = setTimeout(() => {
      SECTIONS.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 200); // Increased delay

    return () => {
      clearTimeout(initializeObserver);
      observer.disconnect();
    };
  }, [defaultSection]);

  // FIXED: Additional viewport-based detection as fallback
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.h-screen.overflow-y-auto') as HTMLElement;
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;
      const windowHeight = scrollContainer.clientHeight;
      
      const sectionElements = SECTIONS.map(section => ({
        ...section,
        element: document.getElementById(section.id),
      })).filter(s => s.element);

      let mostVisibleSection = sectionElements[0];
      let maxVisibleArea = 0;

      sectionElements.forEach(section => {
        if (!section.element) return;
        
        const rect = section.element.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        
        const top = Math.max(0, rect.top - containerRect.top);
        const bottom = Math.min(windowHeight, rect.bottom - containerRect.top);
        const visibleHeight = Math.max(0, bottom - top);
        
        if (visibleHeight > maxVisibleArea) {
          maxVisibleArea = visibleHeight;
          mostVisibleSection = section;
        }
      });

      const currentPath = window.location.pathname;
      if (mostVisibleSection.path !== currentPath && maxVisibleArea > windowHeight * 0.3) {
        window.history.replaceState(null, '', mostVisibleSection.path);
      }
    };

    const scrollContainer = document.querySelector('.h-screen.overflow-y-auto');
    if (scrollContainer) {
      // Throttle scroll handler
      let scrollTimeout: NodeJS.Timeout;
      const throttledScrollHandler = () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 100);
      };
      
      scrollContainer.addEventListener('scroll', throttledScrollHandler, { passive: true });
      
      return () => {
        scrollContainer.removeEventListener('scroll', throttledScrollHandler);
        if (scrollTimeout) clearTimeout(scrollTimeout);
      };
    }
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      <div className="h-screen overflow-y-auto snap-y snap-mandatory">
        
        {/* Hero Section */}
        <section id="home" className="snap-start h-screen w-full">
          <Hero />
        </section>
        
        {/* Projects Section */}
        <motion.section 
          id="projects"
          className="snap-start h-screen w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Projects />
        </motion.section>
        
        {/* Experience Section - Enhanced snap behavior for overflow content */}
        {/* <motion.section 
          id="experience"
          className="snap-start min-h-screen w-full"
          style={{
            // Add specific scroll margin for better positioning on reload
            scrollMarginTop: '0px',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always'
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Experience />
        </motion.section>
         */}
        {/* Certifications Section */}
        {/* <motion.section 
          id="certifications"
          className="snap-start min-h-screen w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Certifications />
        </motion.section> */}
        
      </div>
    </main>
  );
}