// src/components/layouts/PageLayout.tsx (NATIVE SCROLL SNAP APPROACH)
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/navigations/Navbar';
import Hero from '@/components/sections/Hero/Hero';
import Projects from '@/components/sections/Projects/Projects';
import Experience from '@/components/sections/Experience';
import Certifications from '@/components/sections/Certifications/Certifications';
import Skills from '@/components/sections/Skills/Skills';

interface PageLayoutProps {
  defaultSection?: 'home' | 'projects' | 'experience' | 'certifications' | 'skills';
}

const SECTIONS = [
  { id: 'home', path: '/', index: 0 },
  { id: 'projects', path: '/projects', index: 1 },
  { id: 'experience', path: '/experience', index: 2 },
  { id: 'certifications', path: '/certifications', index: 3 },
  { id: 'skills', path: '/skills', index: 4 },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

export default function PageLayout({ defaultSection = 'home' }: PageLayoutProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState<SectionId>(defaultSection);
  const isInitialized = useRef(false);

  // SOLUTION 1: Use CSS scroll-snap-type ONLY for navigation
  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    isInitialized.current = true;
  }, []);

  // SOLUTION 2: Use scrollIntoView with scroll snap behavior
  useEffect(() => {
    if (!isInitialized.current || defaultSection === 'home') return;

    // Wait for DOM to be fully ready
    const timer = setTimeout(() => {
      const targetElement = document.getElementById(defaultSection);
      
      if (targetElement) {
        // Let scroll snap handle the positioning naturally
        targetElement.scrollIntoView({
          behavior: 'auto', // Use 'auto' to work with scroll snap
          block: 'start',
          inline: 'nearest'
        });

        // Update URL and state
        const section = SECTIONS.find(s => s.id === defaultSection);
        if (section) {
          window.history.replaceState(null, '', section.path);
          setCurrentSection(defaultSection);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [defaultSection]);

  // SOLUTION 3: Simple, reliable scroll tracking
  useEffect(() => {
    if (!isInitialized.current) return;

    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      
      scrollTimer = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollTop = container.scrollTop;
        const viewportHeight = container.clientHeight;
        const scrollCenter = scrollTop + (viewportHeight / 2);
        
        // Find which section contains the scroll center
        let newActiveSection: SectionId = 'home';
        
        SECTIONS.forEach(section => {
          const element = document.getElementById(section.id);
          if (!element) return;
          
          const sectionTop = element.offsetTop;
          const sectionHeight = element.offsetHeight;
          const sectionBottom = sectionTop + sectionHeight;
          
          if (scrollCenter >= sectionTop && scrollCenter < sectionBottom) {
            newActiveSection = section.id;
          }
        });

        // Update URL only when section changes
        if (newActiveSection !== currentSection) {
          setCurrentSection(newActiveSection);
          const section = SECTIONS.find(s => s.id === newActiveSection);
          if (section) {
            window.history.replaceState(null, '', section.path);
          }
        }
      }, 100);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        if (scrollTimer) clearTimeout(scrollTimer);
      };
    }
  }, [currentSection]);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      <div 
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto"
        style={{
          // CRITICAL: Let CSS handle all scroll behavior
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          // Prevent any scroll interference
          overscrollBehavior: 'contain',
        }}
      >
        
        {/* Hero Section */}
        <section 
          id="home" 
          className="flex-shrink-0"
          style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
          }}
        >
          <Hero />
        </section>
        
        {/* Projects Section */}
        <motion.section 
          id="projects"
          className="flex-shrink-0"
          style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Projects />
        </motion.section>
        
        {/* Experience Section - Contained Overflow */}
        <motion.section 
          id="experience"
          className="flex-shrink-0 relative"
          style={{
            height: '100vh',
            maxHeight: '100vh', // Critical: prevent expansion
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            contain: 'strict', // Strict containment
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          {/* Overflow isolation wrapper */}
          <div className="absolute inset-0 overflow-hidden bg-background-primary dark:bg-background-primary-dark">
            <div className="h-full w-full overflow-y-auto">
              <Experience />
            </div>
          </div>
        </motion.section>
        
        {/* Certifications Section - Contained Overflow */}
        <motion.section 
          id="certifications"
          className="flex-shrink-0 relative"
          style={{
            height: '100vh',
            maxHeight: '100vh', // Critical: prevent expansion
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            contain: 'strict', // Strict containment
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          {/* Overflow isolation wrapper with visual boundary */}
          <div className="absolute inset-0 overflow-hidden bg-black">
            <div className="h-full w-full overflow-y-auto">
              <Certifications />
            </div>
          </div>
        </motion.section>
        
        {/* Skills Section - Clean Isolation */}
        <motion.section 
          id="skills"
          className="flex-shrink-0 relative"
          style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            contain: 'strict',
            zIndex: 10, // Higher z-index for clean separation
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          {/* Overflow isolation wrapper with visual boundary */}
          <div className="absolute inset-0 overflow-hidden bg-black">
            <div className="h-full w-full overflow-y-auto">
              <Skills />
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}