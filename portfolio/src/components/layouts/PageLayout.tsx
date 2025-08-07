// File: src/components/layouts/PageLayout.tsx - FIXED ANIMATEPRESENCE
// Enhanced PageLayout dengan Activity Lifecycle Management

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion"; // Removed AnimatePresence - causing issues
import Navbar from "@/components/common/navigations/Navbar";
import Hero from "@/components/sections/Hero/Hero";
import { ActivityLifecycleProvider, useActivityLifecycle } from "@/contexts/ActivityLifecycleContext";
import ActiveSection from "@/components/common/ActiveSection";

// ===============================================================
// INTERFACES & TYPES
// ===============================================================

interface PageLayoutProps {
  defaultSection?: "home" | "projects" | "experience" | "certifications" | "skills";
}

interface SectionConfig {
  id: string;
  path: string;
  component: React.ComponentType;
  preload?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

// ===============================================================
// DYNAMIC IMPORTS - Lazy loaded components
// ===============================================================

const Projects = React.lazy(() => import("@/components/sections/Projects/Projects"));
const Experience = React.lazy(() => import("@/components/sections/Experience/Experience"));
const Skills = React.lazy(() => import("@/components/sections/Skills/Skills"));
const Certifications = React.lazy(() => import("@/components/sections/Certifications/Certifications"));

// ===============================================================
// SECTION CONFIGURATION
// ===============================================================

const SECTIONS: SectionConfig[] = [
  { 
    id: "home", 
    path: "/", 
    component: Hero, 
    preload: true, 
    priority: 'high' 
  },
  { 
    id: "projects", 
    path: "/projects", 
    component: Projects, 
    priority: 'high' 
  },
  { 
    id: "experience", 
    path: "/experience", 
    component: Experience, 
    priority: 'medium' 
  },
  { 
    id: "certifications", 
    path: "/certifications", 
    component: Certifications, 
    priority: 'low' 
  },
  { 
    id: "skills", 
    path: "/skills", 
    component: Skills, 
    priority: 'medium' 
  },
];

type SectionId = typeof SECTIONS[number]["id"];

// ===============================================================
// LOADING FALLBACK COMPONENT
// ===============================================================

const SectionLoadingFallback: React.FC<{ sectionId: string }> = ({ sectionId }) => (
  <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-background-primary-dark">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary dark:border-t-primary-dark rounded-full animate-spin mx-auto"></div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-text-primary dark:text-text-primary-dark">
          Loading {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
        </h3>
        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
          Preparing amazing content...
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
        <div className="h-full bg-primary dark:bg-primary-dark rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// ===============================================================
// ENHANCED SECTION WRAPPER - SIMPLIFIED
// ===============================================================

interface EnhancedSectionProps {
  sectionConfig: SectionConfig;
  isVisible: boolean;
  isActive: boolean;
}

const EnhancedSection: React.FC<EnhancedSectionProps> = ({ 
  sectionConfig, 
  isVisible, 
  isActive 
}) => {
  const Component = sectionConfig.component;

  // Always render high priority sections, lazy load others
  const shouldRender = sectionConfig.priority === 'high' || isVisible;

  return (
    <section 
      id={sectionConfig.id}
      className="flex-shrink-0 h-screen"
      style={{
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        contain: "layout style paint",
        zIndex: isActive ? 10 : 1,
      }}
      data-section={sectionConfig.id}
      data-active={isActive}
      data-visible={isVisible}
    >
      {shouldRender ? (
        <ActiveSection
          sectionId={sectionConfig.id}
          className="h-full w-full"
          fallback={<SectionLoadingFallback sectionId={sectionConfig.id} />}
          priority={sectionConfig.priority}
        >
          <motion.div
            className="h-full relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0.3 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut" 
            }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="h-full overflow-y-auto scroll-smooth">
                <React.Suspense fallback={<SectionLoadingFallback sectionId={sectionConfig.id} />}>
                  <Component />
                </React.Suspense>
              </div>
            </div>
          </motion.div>
        </ActiveSection>
      ) : (
        <SectionLoadingFallback sectionId={sectionConfig.id} />
      )}
    </section>
  );
};

// ===============================================================
// MAIN LAYOUT CONTENT COMPONENT
// ===============================================================

const PageLayoutContent: React.FC<PageLayoutProps> = ({ defaultSection = "home" }) => {
  const { 
    activeSectionId, 
    visibleSections, 
    setActiveSection, 
    performanceMetrics 
  } = useActivityLifecycle();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const [isMounted, setIsMounted] = useState(false);

  // ===============================================================
  // MOUNT TRACKING
  // ===============================================================

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // ===============================================================
  // NAVIGATION FUNCTION
  // ===============================================================

  const navigateToSection = useCallback((sectionIdOrPath: string) => {
    if (!isMounted) return;

    // Handle both section ID and path navigation
    let targetSectionId: string;
    
    if (sectionIdOrPath.startsWith('/')) {
      const sectionConfig = SECTIONS.find((s) => s.path === sectionIdOrPath);
      targetSectionId = sectionConfig?.id || 'home';
    } else {
      targetSectionId = sectionIdOrPath;
    }

    const section = document.getElementById(targetSectionId);
    if (section && scrollContainerRef.current) {
      // Smooth scroll to section
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Update URL without page reload
      const sectionConfig = SECTIONS.find((s) => s.id === targetSectionId);
      if (sectionConfig) {
        window.history.replaceState(null, "", sectionConfig.path);
      }

      // Set as active section
      setActiveSection(targetSectionId);
    }
  }, [setActiveSection, isMounted]);

  // ===============================================================
  // SCROLL HANDLING
  // ===============================================================

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isMounted) return;

    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMounted]);

  // ===============================================================
  // INITIAL NAVIGATION SETUP
  // ===============================================================

  useEffect(() => {
    if (!isMounted) return;

    // Disable scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Navigate to default section if not home
    if (defaultSection !== "home") {
      const timer = setTimeout(() => {
        navigateToSection(defaultSection);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [defaultSection, navigateToSection, isMounted]);

  // ===============================================================
  // KEYBOARD NAVIGATION
  // ===============================================================

  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) return;

      const currentIndex = SECTIONS.findIndex(s => s.id === activeSectionId);
      
      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault();
          if (currentIndex < SECTIONS.length - 1) {
            navigateToSection(SECTIONS[currentIndex + 1].id);
          }
          break;
          
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          if (currentIndex > 0) {
            navigateToSection(SECTIONS[currentIndex - 1].id);
          }
          break;
          
        case 'Home':
          event.preventDefault();
          navigateToSection('home');
          break;
          
        case 'End':
          event.preventDefault();
          navigateToSection(SECTIONS[SECTIONS.length - 1].id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectionId, navigateToSection, isMounted]);

  // ===============================================================
  // RENDER - SIMPLIFIED WITHOUT ANIMATEPRESENCE
  // ===============================================================

  if (!isMounted) {
    return (
      <div className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark">
        <SectionLoadingFallback sectionId="loading" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark">
      {/* Navigation */}
      <Navbar 
        // activeSection={activeSectionId}
        onNavigate={navigateToSection}
      />

      {/* Main Content - NO ANIMATEPRESENCE TO PREVENT MULTIPLE CHILDREN ISSUE */}
      <main
        ref={scrollContainerRef}
        className={`
          h-screen overflow-y-auto overflow-x-hidden
          scroll-smooth
          ${isScrolling ? 'scrolling' : ''}
        `}
        style={{
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
        id="main-content"
      >
        {/* FIXED: Render sections directly without AnimatePresence */}
        {SECTIONS.map((sectionConfig) => {
          const isVisible = visibleSections.has(sectionConfig.id);
          const isActive = activeSectionId === sectionConfig.id;
          
          return (
            <EnhancedSection
              key={sectionConfig.id}
              sectionConfig={sectionConfig}
              isVisible={isVisible}
              isActive={isActive}
            />
          );
        })}
      </main>

      {/* Performance Monitor (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor metrics={performanceMetrics} activeSectionId={activeSectionId} />
      )}

      {/* Scroll Progress Indicator */}
      <ScrollProgressIndicator 
        activeSectionId={activeSectionId}
        totalSections={SECTIONS.length}
        onSectionClick={navigateToSection}
      />
    </div>
  );
};

// ===============================================================
// PERFORMANCE MONITOR COMPONENT
// ===============================================================

interface PerformanceMonitorProps {
  metrics: {
    activeTimers: number;
    activeIntervals: number;
    activeObservers: number;
    memoryUsage: number;
  };
  activeSectionId: string;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ metrics, activeSectionId }) => (
  <motion.div
    initial={{ opacity: 0, x: -100 }}
    animate={{ opacity: 1, x: 0 }}
    className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 shadow-lg border border-white/10"
  >
    <div className="space-y-2">
      <div className="text-yellow-400 font-bold border-b border-white/20 pb-1 mb-2">
        🚀 Activity Performance Monitor
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-green-400">Active Section:</div>
          <div className="font-bold">{activeSectionId}</div>
        </div>
        
        <div>
          <div className="text-blue-400">Memory:</div>
          <div className={`font-bold ${metrics.memoryUsage > 100 ? 'text-red-400' : 'text-green-400'}`}>
            {metrics.memoryUsage}MB
          </div>
        </div>
        
        <div>
          <div className="text-purple-400">Timers:</div>
          <div className={`font-bold ${metrics.activeTimers > 10 ? 'text-red-400' : 'text-green-400'}`}>
            {metrics.activeTimers}
          </div>
        </div>
        
        <div>
          <div className="text-orange-400">Intervals:</div>
          <div className={`font-bold ${metrics.activeIntervals > 5 ? 'text-red-400' : 'text-green-400'}`}>
            {metrics.activeIntervals}
          </div>
        </div>
        
        <div>
          <div className="text-cyan-400">Observers:</div>
          <div className={`font-bold ${metrics.activeObservers > 10 ? 'text-red-400' : 'text-green-400'}`}>
            {metrics.activeObservers}
          </div>
        </div>
        
        <div>
          <div className="text-pink-400">Status:</div>
          <div className="font-bold text-green-400">✅ Optimized</div>
        </div>
      </div>
    </div>
  </motion.div>
);

// ===============================================================
// SCROLL PROGRESS INDICATOR
// ===============================================================

interface ScrollProgressIndicatorProps {
  activeSectionId: string;
  totalSections: number;
  onSectionClick: (sectionId: string) => void;
}

const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({
  activeSectionId,
  totalSections,
  onSectionClick
}) => {
  const activeIndex = SECTIONS.findIndex(s => s.id === activeSectionId);
  const progress = ((activeIndex + 1) / totalSections) * 100;

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30">
      <div className="flex flex-col items-center space-y-3">
        {SECTIONS.map((section, index) => (
          <motion.button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={`
              w-3 h-3 rounded-full border-2 transition-all duration-300
              ${index <= activeIndex 
                ? 'bg-primary dark:bg-primary-dark border-primary dark:border-primary-dark' 
                : 'bg-transparent border-gray-400 dark:border-gray-600'
              }
              hover:scale-125 hover:border-primary dark:hover:border-primary-dark
            `}
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            aria-label={`Navigate to ${section.id} section`}
          />
        ))}
        
        {/* Progress line */}
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-300 dark:bg-gray-700 transform -translate-x-1/2 -z-10">
          <motion.div
            className="w-full bg-primary dark:bg-primary-dark origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: progress / 100 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

// ===============================================================
// MAIN PAGE LAYOUT COMPONENT
// ===============================================================

const PageLayout: React.FC<PageLayoutProps> = (props) => {
  return (
    <ActivityLifecycleProvider debugMode={process.env.NODE_ENV === 'development'}>
      <PageLayoutContent {...props} />
    </ActivityLifecycleProvider>
  );
};

export default PageLayout;