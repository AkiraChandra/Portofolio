// src/components/layouts/PageLayout.tsx - SIMPLE DIRECT IMPORTS VERSION
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';

// ✅ DIRECT STATIC IMPORTS - Most Compatible
import Hero from '@/components/sections/Hero/Hero';
import Projects from '@/components/sections/Projects/Projects';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills/Skills';
import Certifications from '@/components/sections/Certifications/Certifications';

// ✅ CONDITIONAL IMPORTS WITH TRY-CATCH
let NavbarComponent: React.ComponentType<any>;
let ContactComponent: React.ComponentType<any>;

try {
  // Try primary navbar path
  NavbarComponent = require('@/components/common/navigations/Navbar').default;
} catch {
  try {
    // Try alternative navbar path
    NavbarComponent = require('@/features/navigation/Navbar').default;
  } catch {
    // Fallback navbar component
    NavbarComponent = ({ onNavigate }: { onNavigate?: (path: string) => void }) => (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background-primary/95 dark:bg-background-primary-dark/95 backdrop-blur-sm border-b border-border-primary/20 dark:border-border-primary-dark/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
                Portfolio
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Projects', path: '/projects' },
                  { name: 'Experience', path: '/experience' },
                  { name: 'Certifications', path: '/certifications' },
                  { name: 'Skills', path: '/skills' },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onNavigate?.(item.path)}
                    className="text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

try {
  // Try to import contact component
  ContactComponent = require('@/components/sections/Contact/Contact').default;
} catch {
  // Fallback contact component
  ContactComponent = () => (
    <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-background-primary-dark">
      <div className="text-center max-w-md mx-auto px-4">
        <h2 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
          Get In Touch
        </h2>
        <p className="text-text-secondary dark:text-text-secondary-dark mb-8">
          Contact section coming soon!
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="mailto:contact@example.com"
            className="px-6 py-3 bg-primary dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Send Email
          </a>
          <a 
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-primary dark:border-primary-dark text-primary dark:text-primary-dark rounded-lg hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

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
  
  // Mobile-specific states
  const [isScrolling, setIsScrolling] = useState(false);
  const [canAutoNavigate, setCanAutoNavigate] = useState(true);
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

        // Regular section detection for URL updates
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

          // Update URL only when section changes
          if (activeSection !== currentSection && !isScrolling) {
            setCurrentSection(activeSection);
            const section = SECTIONS.find((s) => s.id === activeSection);
            if (section) {
              window.history.replaceState(null, '', section.path);
            }
          }
        }

        lastScrollTop.current = currentScrollTop;
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
      {/* Direct Navbar Component */}
      <NavbarComponent
        onNavigate={(path: string) => {
          const section = SECTIONS.find((s) => s.path === path);
          if (section) {
            navigateToSection(section.id);
          }
        }}
      />

      <div
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto mobile-optimized-scroll"
        style={{
          // Mobile-optimized scroll behavior
          scrollSnapType: isMobile ? 'none' : 'y proximity',
          scrollBehavior: isMobile ? 'auto' : 'smooth',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
      >
        {/* Hero Section */}
        <motion.section
          id="home"
          className="min-h-screen snap-start mobile-section scroll-performance-optimized relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
        </motion.section>

        {/* Projects Section */}
        <motion.section
          id="projects"
          className="min-h-screen snap-start mobile-section scroll-performance-optimized relative"
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
          className="min-h-screen snap-start mobile-section scroll-performance-optimized relative"
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
          className="min-h-screen snap-start mobile-section scroll-performance-optimized relative"
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
          className="min-h-screen snap-start mobile-section scroll-performance-optimized relative"
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
          className="min-h-screen snap-start mobile-section scroll-performance-optimized relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5 }}
        >
          <ContactComponent />
        </motion.section>
      </div>
    </main>
  );
};

export default PageLayout;