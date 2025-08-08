// File: src/components/layouts/PageLayout.tsx - UPDATE MINIMAL TANPA UBAH STYLE
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion"; // Removed AnimatePresence - causing issues
import Navbar from "@/components/common/navigations/Navbar";
import Hero from "@/components/sections/Hero/Hero"; // Always load immediately
import LazyComponentLoader from "@/components/common/LazyComponentLoader";
import { SectionActivityProvider, useSectionActivity } from '@/contexts/SectionActivityContext';

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

type SectionId = (typeof SECTIONS)[number]["id"];

// ✅ BUAT INNER COMPONENT UNTUK GUNAKAN CONTEXT
function PageLayoutInner({ defaultSection = "home" }: PageLayoutProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState<SectionId>(defaultSection);
  const [cacheStats, setCacheStats] = useState({ loaded: 1, total: 5 }); // Home is pre-loaded

  // ✅ TAMBAHAN BARU - GUNAKAN CONTEXT
  const { setActiveSection } = useSectionActivity();

  // ✅ NAVIGATION FUNCTION - TAMBAH 1 LINE SAJA
  const navigateToSection = (sectionId: SectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Update URL without page reload
      const sectionConfig = SECTIONS.find((s) => s.id === targetSectionId);
      if (sectionConfig) {
        window.history.replaceState(null, "", sectionConfig.path);
        setCurrentSection(sectionId);
        setActiveSection(sectionId); // ✅ TAMBAHAN 1 LINE INI
      }
    }
  };

  // ✅ INITIALIZE - TETAP SAMA
  useEffect(() => {
    if (!isMounted) return;

    // Disable scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // ✅ HANDLE INITIAL NAVIGATION - TETAP SAMA
  useEffect(() => {
    if (defaultSection === "home") return;

    const timer = setTimeout(() => {
      navigateToSection(defaultSection);
    }, 100); // Small delay to ensure components are mounted

      return () => clearTimeout(timer);
    }
  }, [defaultSection, navigateToSection, isMounted]);

  // ✅ SCROLL TRACKING - TAMBAH 1 LINE SAJA
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollTop = container.scrollTop;
        const viewportHeight = container.clientHeight;
        const scrollCenter = scrollTop + viewportHeight * 0.5;

        let activeSection: SectionId = "home";

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

        if (activeSection !== currentSection) {
          setCurrentSection(activeSection);
          setActiveSection(activeSection); // ✅ TAMBAHAN 1 LINE INI
          const section = SECTIONS.find((s) => s.id === activeSection);
          if (section) {
            window.history.replaceState(null, "", section.path);
          }
        }
      }, 100);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        container.removeEventListener("scroll", handleScroll);
        if (scrollTimer) clearTimeout(scrollTimer);
      };
    }
  }, [currentSection, setActiveSection]); // ✅ TAMBAH setActiveSection DI DEPENDENCY

  // ✅ SYNC INITIAL SECTION - TAMBAHAN BARU
  useEffect(() => {
    setActiveSection(defaultSection);
  }, [defaultSection, setActiveSection]);

  // ✅ SEMUA RETURN STATEMENT TETAP SAMA PERSIS
  return (
    <div className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark">
      {/* Navigation */}
      <Navbar 
        // activeSection={activeSectionId}
        onNavigate={navigateToSection}
      />

      {/* ✅ CACHE INDICATOR (Dev Mode Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 z-50 bg-black/80 text-white p-2 rounded text-xs">
          Cache: {cacheStats.loaded}/{cacheStats.total}
          <br />
          Section: {currentSection} {/* ✅ TAMBAHAN DEBUG INFO */}
        </div>
      )}

      <div
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
}
// ✅ EXPORT DENGAN PROVIDER WRAPPER - INI SAJA YANG BERUBAH
export default function PageLayout({ defaultSection = "home" }: PageLayoutProps) {
  return (
    <SectionActivityProvider initialSection={defaultSection}>
      <PageLayoutInner defaultSection={defaultSection} />
    </SectionActivityProvider>
  );
}