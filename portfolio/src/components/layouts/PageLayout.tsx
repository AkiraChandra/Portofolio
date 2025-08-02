// src/components/layouts/PageLayout.tsx - MOBILE SCROLL OPTIMIZED
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';
import Navbar from '@/features/navigation/Navbar';
import Hero from '@/components/sections/Hero/Hero';
import About from '@/components/sections/About/About';
import Projects from '@/components/sections/Projects/Projects';
import Experience from '@/components/sections/Experience/Experience';
import Skills from '@/components/sections/Skills/Skills';
import Certifications from '@/components/sections/Certifications/Certifications';
import Contact from '@/components/sections/Contact/Contact';

const SECTIONS = [
  { id: 'home', path: '/', component: Hero },
  { id: 'projects', path: '/projects', component: Projects },
  { id: 'experience', path: '/experience', component: Experience },
  { id: 'certifications', path: '/certifications', component: Certifications },
  { id: 'skills', path: '/skills', component: Skills },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

interface PageLayoutProps {
  defaultSection?: SectionId;
}

const PageLayout: React.FC<PageLayoutProps> = ({ defaultSection = 'home' }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState<SectionId>(defaultSection);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // Mobile-specific states
  const [isScrolling, setIsScrolling] = useState(false);
  const [canAutoNavigate, setCanAutoNavigate] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollTime = useRef<number>(0);
  const lastScrollTop = useRef<number>(0);

  // Optimized navigation function for mobile
  const navigateToSection = useCallback((sectionId: SectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Immediate URL update for responsiveness
    const sectionConfig = SECTIONS.find((s) => s.id === sectionId);
    if (sectionConfig) {
      window.history.replaceState(null, '', sectionConfig.path);
      setCurrentSection(sectionId);
    }

    // Use different scroll behavior for mobile vs desktop
    section.scrollIntoView({
      behavior: isMobile ? 'auto' : 'smooth', // Instant scroll on mobile for better UX
      block: 'start',
    });
  }, [isMobile]);

  // Enhanced mobile scroll detection with auto-navigation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrame: number;
    
    const handleScroll = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        if (!container || isScrolling) return;

        const now = Date.now();
        const currentScrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const scrollDirection = currentScrollTop > lastScrollTop.current ? 'down' : 'up';
        
        // Mobile-specific scroll handling
        if (isMobile && canAutoNavigate) {
          // Check if we've reached the end of current section
          const sections = Array.from(container.children) as HTMLElement[];
          let targetSection: SectionId | null = null;

          sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            // Calculate relative position within container
            const sectionTop = rect.top - containerRect.top + container.scrollTop;
            const sectionBottom = sectionTop + rect.height;
            const scrollBottom = currentScrollTop + containerHeight;
            
            // If scrolled to bottom of section and user is still scrolling down
            if (scrollDirection === 'down' && 
                scrollBottom >= sectionBottom - 50 && // 50px threshold
                currentScrollTop > lastScrollTop.current) {
              
              const nextSectionIndex = index + 1;
              if (nextSectionIndex < SECTIONS.length) {
                targetSection = SECTIONS[nextSectionIndex].id;
              }
            }
            
            // If scrolled to top of section and user is still scrolling up
            else if (scrollDirection === 'up' && 
                     currentScrollTop <= sectionTop + 50 && // 50px threshold
                     currentScrollTop < lastScrollTop.current) {
              
              const prevSectionIndex = index - 1;
              if (prevSectionIndex >= 0) {
                targetSection = SECTIONS[prevSectionIndex].id;
              }
            }
          });

          // Auto-navigate if target section found
          if (targetSection && targetSection !== currentSection) {
            setIsScrolling(true);
            setCanAutoNavigate(false);
            
            // Brief delay to prevent rapid section changes
            setTimeout(() => {
              navigateToSection(targetSection);
              
              setTimeout(() => {
                setIsScrolling(false);
                setCanAutoNavigate(true);
              }, 300); // Shorter delay for mobile
            }, 50);
          }
        }

        // Regular section detection for URL updates (desktop behavior)
        if (!isMobile || !isScrolling) {
          const scrollCenter = currentScrollTop + containerHeight * 0.5;
          let activeSection: SectionId = 'home';

          for (const section of SECTIONS) {
            const element = document.getElementById(section.id);
            if (!element) continue;

            const sectionTop = element.offsetTop;
            const sectionBottom = sectionTop + element.offsetHeight;

            if (scrollCenter >= sectionTop && scrollCenter < sectionBottom) {
              activeSection = section.id;
              break;
            }
          }

          // Update URL only when section changes (reduce unnecessary updates)
          if (activeSection !== currentSection && !isScrolling) {
            setCurrentSection(activeSection);
            const section = SECTIONS.find((s) => s.id === activeSection);
            if (section) {
              window.history.replaceState(null, '', section.path);
            }
          }
        }

        lastScrollTop.current = currentScrollTop;
        lastScrollTime.current = now;
      });
    };

    // Use passive listener for better performance
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      container.removeEventListener('scroll', handleScroll);
    };
  }, [currentSection, isMobile, isScrolling, canAutoNavigate, navigateToSection]);

  // Initialize section on mount
  useEffect(() => {
    if (defaultSection === 'home') return;

    const timer = setTimeout(() => {
      navigateToSection(defaultSection);
    }, 100);

    return () => clearTimeout(timer);
  }, [defaultSection, navigateToSection]);

  // Disable browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar
        onNavigate={(path) => {
          const section = SECTIONS.find((s) => s.path === path);
          if (section) {
            navigateToSection(section.id);
          }
        }}
      />

      <div
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto"
        style={{
          // Mobile-optimized scroll behavior
          scrollSnapType: isMobile ? 'none' : 'y proximity', // Disable snap on mobile
          scrollBehavior: isMobile ? 'auto' : 'smooth', // Instant scroll on mobile
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          // Better mobile scrolling
          touchAction: 'pan-y',
        }}
      >
        {/* Hero Section */}
        <motion.section
          id="home"
          className="min-h-screen snap-start relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
        </motion.section>

        {/* Projects Section */}
        <motion.section
          id="projects"
          className="min-h-screen snap-start relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5 }}
        >
          <Projects />
        </motion.section>

        {/* Experience Section */}
        <motion.section
          id="experience"
          className="min-h-screen snap-start relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5 }}
        >
          <Experience />
        </motion.section>

        {/* Certifications Section */}
        <motion.section
          id="certifications"
          className="min-h-screen snap-start relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5 }}
        >
          <Certifications />
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          className="min-h-screen snap-start relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5 }}
        >
          <Skills />
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          className="min-h-screen snap-start relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5 }}
        >
          <Contact />
        </motion.section>
      </div>
    </main>
  );
};

export default PageLayout;