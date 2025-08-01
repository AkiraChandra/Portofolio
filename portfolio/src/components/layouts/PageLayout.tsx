// src/components/layouts/PageLayout.tsx (MOBILE OPTIMIZED)
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
  const [isMobile, setIsMobile] = useState(false);
  const isInitialized = useRef(false);
  const lastScrollTime = useRef(0);

  // Detect mobile for performance optimizations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize with mobile considerations
  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    isInitialized.current = true;
  }, []);

  // Mobile-optimized navigation
  useEffect(() => {
    if (!isInitialized.current || defaultSection === 'home') return;

    const navigateToSection = () => {
      const targetElement = document.getElementById(defaultSection);
      
      if (targetElement) {
        // Use different approach for mobile vs desktop
        if (isMobile) {
          // Mobile: Use immediate positioning to avoid lag
          targetElement.scrollIntoView({
            behavior: 'auto', // Instant on mobile
            block: 'start',
          });
        } else {
          // Desktop: Use smooth scroll
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }

        // Update URL and state
        const section = SECTIONS.find(s => s.id === defaultSection);
        if (section) {
          window.history.replaceState(null, '', section.path);
          setCurrentSection(defaultSection);
        }
      }
    };

    // Delay slightly longer on mobile for DOM readiness
    const timer = setTimeout(navigateToSection, isMobile ? 150 : 100);
    return () => clearTimeout(timer);
  }, [defaultSection, isMobile]);

  // Optimized scroll tracking with performance considerations
  useEffect(() => {
    if (!isInitialized.current) return;

    let scrollTimer: NodeJS.Timeout;
    const throttleDelay = isMobile ? 150 : 100; // Longer throttle on mobile

    const handleScroll = () => {
      const now = Date.now();
      
      // Additional throttling for mobile
      if (isMobile && now - lastScrollTime.current < 100) {
        return;
      }
      lastScrollTime.current = now;

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
      }, throttleDelay);
    };

    const container = scrollContainerRef.current;
    if (container) {
      // Use passive listeners for better mobile performance
      container.addEventListener('scroll', handleScroll, { 
        passive: true,
        capture: false 
      });
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        if (scrollTimer) clearTimeout(scrollTimer);
      };
    }
  }, [currentSection, isMobile]);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      <div 
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto"
        style={{
          // Mobile-optimized scroll settings
          scrollSnapType: isMobile ? 'y proximity' : 'y mandatory', // Less strict on mobile
          scrollBehavior: isMobile ? 'auto' : 'smooth', // Instant scroll on mobile for better performance
          overscrollBehavior: 'contain',
          // Mobile-specific optimizations
          WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
          touchAction: 'pan-y', // Optimize touch interactions
        }}
      >
        
        {/* Hero Section */}
        <section 
          id="home" 
          className="flex-shrink-0"
          style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: isMobile ? 'normal' : 'always', // Less aggressive snapping on mobile
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
            scrollSnapStop: isMobile ? 'normal' : 'always',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: isMobile ? 0.3 : 0.6 }} // Faster on mobile
          viewport={{ once: true }}
        >
          <Projects />
        </motion.section>
        
        {/* Experience Section - Mobile Optimized */}
        <motion.section 
          id="experience"
          className="flex-shrink-0 relative"
          style={{
            height: '100vh',
            maxHeight: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: isMobile ? 'normal' : 'always',
            // Lighter containment on mobile for better performance
            contain: isMobile ? 'layout style' : 'strict',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: isMobile ? 0.3 : 0.6 }}
          viewport={{ once: true }}
        >
          <div 
            className="absolute inset-0 overflow-hidden bg-background-primary dark:bg-background-primary-dark"
            style={{
              // Mobile-optimized rendering
              willChange: isMobile ? 'auto' : 'scroll-position',
            }}
          >
            <div className="h-full w-full overflow-y-auto">
              <Experience />
            </div>
          </div>
        </motion.section>
        
        {/* Certifications Section - Mobile Optimized */}
        <motion.section 
          id="certifications"
          className="flex-shrink-0 relative"
          style={{
            height: '100vh',
            maxHeight: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: isMobile ? 'normal' : 'always',
            contain: isMobile ? 'layout style' : 'strict',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: isMobile ? 0.3 : 0.6 }}
          viewport={{ once: true }}
        >
          <div 
            className="absolute inset-0 overflow-hidden bg-black"
            style={{
              willChange: isMobile ? 'auto' : 'scroll-position',
            }}
          >
            <div className="h-full w-full overflow-y-auto">
              <Certifications />
            </div>
            {/* Stronger visual barrier on mobile */}
            <div className={`absolute bottom-0 left-0 right-0 ${isMobile ? 'h-2' : 'h-1'} bg-black z-50`} />
          </div>
        </motion.section>
        
        {/* Skills Section - Mobile Optimized */}
        <motion.section 
          id="skills"
          className="flex-shrink-0 relative"
          style={{
            height: '100vh',
            scrollSnapAlign: 'start',
            scrollSnapStop: isMobile ? 'normal' : 'always',
            contain: isMobile ? 'layout style' : 'strict',
            zIndex: 10,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: isMobile ? 0.3 : 0.6 }}
          viewport={{ once: true }}
        >
          <div 
            className="h-full w-full overflow-hidden bg-background-primary dark:bg-background-primary-dark"
            style={{
              willChange: isMobile ? 'auto' : 'scroll-position',
            }}
          >
            <Skills />
          </div>
        </motion.section>
      </div>
    </main>
  );
}