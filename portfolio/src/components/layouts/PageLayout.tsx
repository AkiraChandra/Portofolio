// src/components/layouts/PageLayout.tsx - FINAL ROBUST VERSION
'use client';

import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';

// ✅ ROBUST COMPONENT IMPORTS WITH ERROR HANDLING
const importComponent = (path: string, fallbackName: string) => {
  return React.lazy(() => 
    import(path).catch((error) => {
      console.warn(`Failed to import ${fallbackName} from ${path}:`, error);
      return {
        default: () => (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
                {fallbackName}
              </h2>
              <p className="text-text-secondary dark:text-text-secondary-dark">
                Component loading...
              </p>
            </div>
          </div>
        )
      };
    })
  );
};

// Safe component imports
const SafeNavbar = importComponent('@/components/common/navigations/Navbar', 'Navigation');
const SafeHero = importComponent('@/components/sections/Hero/Hero', 'Hero Section');
const SafeProjects = importComponent('@/components/sections/Projects/Projects', 'Projects Section');
const SafeExperience = importComponent('@/components/sections/Experience', 'Experience Section');
const SafeSkills = importComponent('@/components/sections/Skills/Skills', 'Skills Section');
const SafeCertifications = importComponent('@/components/sections/Certifications/Certifications', 'Certifications Section');
const SafeContact = importComponent('@/components/sections/Contact/Contact', 'Contact Section');

// Loading fallback component
const SectionLoader = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-primary-dark mx-auto mb-4"></div>
      <p className="text-text-secondary dark:text-text-secondary-dark">Loading {title}...</p>
    </div>
  </div>
);

// Navigation fallback component
const NavbarFallback = ({ onNavigate }: { onNavigate?: (path: string) => void }) => (
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

const SECTIONS = [
  { id: 'home', path: '/', component: SafeHero, title: 'Hero' },
  { id: 'projects', path: '/projects', component: SafeProjects, title: 'Projects' },
  { id: 'experience', path: '/experience', component: SafeExperience, title: 'Experience' },
  { id: 'certifications', path: '/certifications', component: SafeCertifications, title: 'Certifications' },
  { id: 'skills', path: '/skills', component: SafeSkills, title: 'Skills' },
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
      {/* Safe Navbar with Fallback */}
      <Suspense fallback={<NavbarFallback />}>
        <SafeNavbar
          onNavigate={(path: string) => {
            const section = SECTIONS.find((s) => s.path === path);
            if (section) {
              navigateToSection(section.id);
            }
          }}
        />
      </Suspense>

      <div
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto mobile-optimized-scroll"
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
        {/* Render Sections Dynamically */}
        {SECTIONS.map((section) => {
          const Component = section.component;
          return (
            <motion.section
              key={section.id}
              id={section.id}
              className="min-h-screen snap-start mobile-section scroll-performance-optimized relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ duration: 0.5 }}
            >
              <Suspense fallback={<SectionLoader title={section.title} />}>
                <Component />
              </Suspense>
            </motion.section>
          );
        })}

        {/* Contact Section - Optional */}
        <motion.section
          id="contact"
          className="min-h-screen snap-start mobile-section scroll-performance-optimized relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={<SectionLoader title="Contact" />}>
            <SafeContact />
          </Suspense>
        </motion.section>
      </div>
    </main>
  );
};

export default PageLayout;