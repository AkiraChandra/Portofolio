// File: src/components/layouts/PageLayout.tsx - FIXED CACHE TRACKING
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/common/navigations/Navbar";
import Hero from "@/components/sections/Hero/Hero";
import LazyComponentLoader from "@/components/common/LazyComponentLoader";

interface PageLayoutProps {
  defaultSection?: "home" | "projects" | "experience" | "certifications" | "skills";
}

const SECTIONS = [
  { id: "home", path: "/" },
  { id: "projects", path: "/projects" },
  { id: "experience", path: "/experience" },
  { id: "certifications", path: "/certifications" },
  { id: "skills", path: "/skills" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export default function PageLayout({ defaultSection = "home" }: PageLayoutProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState<SectionId>(defaultSection);
  
  // ✅ PROPER CACHE TRACKING
  const [loadedSections, setLoadedSections] = useState<Set<string>>(new Set(['home'])); // Home is always loaded
  const [cacheStats, setCacheStats] = useState({ loaded: 1, total: 5 });

  // ✅ CALLBACK TO UPDATE CACHE STATS
  const handleSectionLoaded = useCallback((sectionId: string) => {
    setLoadedSections(prev => {
      const newSet = new Set(prev);
      if (!newSet.has(sectionId)) {
        newSet.add(sectionId);
        setCacheStats({ loaded: newSet.size, total: 5 });
        
        // ✅ LOG FOR DEBUGGING
        console.log(`✅ Section loaded: ${sectionId} | Total: ${newSet.size}/5`);
      }
      return newSet;
    });
  }, []);

  // ✅ NAVIGATION FUNCTION
  const navigateToSection = useCallback((sectionId: SectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      const sectionConfig = SECTIONS.find((s) => s.id === sectionId);
      if (sectionConfig) {
        window.history.replaceState(null, "", sectionConfig.path);
        setCurrentSection(sectionId);
      }
    }
  }, []);

  // ✅ INITIALIZE
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // ✅ HANDLE INITIAL NAVIGATION
  useEffect(() => {
    if (defaultSection === "home") return;

    const timer = setTimeout(() => {
      navigateToSection(defaultSection);
    }, 100);

    return () => clearTimeout(timer);
  }, [defaultSection, navigateToSection]);

  // ✅ SCROLL TRACKING
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

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
  }, [currentSection]);

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

      {/* ✅ ENHANCED CACHE INDICATOR */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 z-50 bg-black/90 text-white p-3 rounded-lg text-xs font-mono shadow-lg border border-gray-600">
          <div className="space-y-1">
            <div className="text-green-400 font-semibold">
              Cache: {cacheStats.loaded}/{cacheStats.total}
            </div>
            <div className="text-gray-300">
              Current: <span className="text-yellow-400">{currentSection}</span>
            </div>
            <div className="space-y-0.5">
              {SECTIONS.map(section => (
                <div key={section.id} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    loadedSections.has(section.id) 
                      ? 'bg-green-400' 
                      : 'bg-gray-600'
                  }`} />
                  <span className={`text-xs ${
                    section.id === currentSection 
                      ? 'text-yellow-400 font-semibold' 
                      : loadedSections.has(section.id)
                        ? 'text-green-400'
                        : 'text-gray-500'
                  }`}>
                    {section.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="h-screen overflow-y-auto"
        style={{
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* HOME SECTION */}
        <motion.section
          id="home"
          className="flex-shrink-0 h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <Hero />
        </motion.section>

        {/* PROJECTS SECTION */}
        <motion.section
          id="projects"
          className="flex-shrink-0 h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <LazyComponentLoader
            sectionId="projects"
            onLoaded={() => handleSectionLoaded('projects')}
          />
        </motion.section>

        {/* EXPERIENCE SECTION */}
        <motion.section
          id="experience"
          className="flex-shrink-0 relative h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            contain: "layout style paint",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="h-full overflow-y-auto scroll-smooth">
              <LazyComponentLoader
                sectionId="experience"
                onLoaded={() => handleSectionLoaded('experience')}
              />
            </div>
          </div>
        </motion.section>

        {/* CERTIFICATIONS SECTION */}
        <motion.section
          id="certifications"
          className="flex-shrink-0 relative h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            contain: "layout style paint",
          }}
        >
          <div className="absolute inset-0 overflow-hidden bg-black">
            <div className="h-full overflow-y-auto scroll-smooth">
              <LazyComponentLoader
                sectionId="certifications"
                onLoaded={() => handleSectionLoaded('certifications')}
              />
            </div>
          </div>
        </motion.section>

        {/* SKILLS SECTION */}
        <motion.section
          id="skills"
          className="flex-shrink-0 relative h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            contain: "layout style paint",
            zIndex: 1,
          }}
        >
          <div className="absolute inset-0 overflow-hidden bg-black">
            <div className="h-full overflow-y-auto scroll-smooth">
              <LazyComponentLoader
                sectionId="skills"
                onLoaded={() => handleSectionLoaded('skills')}
              />
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}