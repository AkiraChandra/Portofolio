// File: src/components/layouts/PageLayout.tsx - PROGRESSIVE VERSION
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/common/navigations/Navbar";
import Hero from "@/components/sections/Hero/Hero"; // Always load immediately
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
  const [cacheStats, setCacheStats] = useState({ loaded: 1, total: 5 }); // Home is pre-loaded

  // ✅ NAVIGATION FUNCTION
  const navigateToSection = (sectionId: SectionId) => {
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
  };

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
    }, 100); // Small delay to ensure components are mounted

    return () => clearTimeout(timer);
  }, [defaultSection]);

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
      {/* ✅ NAVBAR WITH CACHE INDICATOR */}
      <Navbar
        onNavigate={(path) => {
          const section = SECTIONS.find((s) => s.path === path);
          if (section) {
            navigateToSection(section.id);
          }
        }}
      />

      {/* ✅ CACHE INDICATOR (Dev Mode Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-20 right-4 z-50 bg-black/80 text-white p-2 rounded text-xs">
          Cache: {cacheStats.loaded}/{cacheStats.total}
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
        {/* ✅ HOME SECTION - IMMEDIATE LOAD */}
        <motion.section
          id="home"
          className="flex-shrink-0 h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Hero />
        </motion.section>

        {/* ✅ PROJECTS SECTION - LAZY LOAD */}
        <motion.section
          id="projects"
          className="flex-shrink-0 h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <LazyComponentLoader
            sectionId="projects"
            importPath="@/components/sections/Projects/Projects"
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-background-primary dark:bg-background-primary-dark">
                <div className="text-center space-y-4">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                  <p className="text-text-primary dark:text-text-primary-dark">Loading Projects...</p>
                </div>
              </div>
            }
          />
        </motion.section>

        {/* ✅ EXPERIENCE SECTION - LAZY LOAD */}
        <motion.section
          id="experience"
          className="flex-shrink-0 relative h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            contain: "layout style paint",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <LazyComponentLoader
                sectionId="experience"
                importPath="@/components/sections/Experience/Experience"
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                      <p className="text-text-primary dark:text-text-primary-dark">Loading Experience...</p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </motion.section>

        {/* ✅ CERTIFICATIONS SECTION - LAZY LOAD */}
        <motion.section
          id="certifications"
          className="flex-shrink-0 relative h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            contain: "layout style paint",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <div className="absolute inset-0 overflow-hidden bg-black">
            <div className="h-full overflow-y-auto">
              <LazyComponentLoader
                sectionId="certifications"
                importPath="@/components/sections/Certifications/Certifications"
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                      <p className="text-text-primary dark:text-text-primary-dark">Loading Certifications...</p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </motion.section>

        {/* ✅ SKILLS SECTION - LAZY LOAD */}
        <motion.section
          id="skills"
          className="flex-shrink-0 relative h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            contain: "layout style paint",
            zIndex: 1,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <div className="absolute inset-0 overflow-hidden bg-black">
            <div className="h-full overflow-y-auto">
              <LazyComponentLoader
                sectionId="skills"
                importPath="@/components/sections/Skills/Skills"
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                      <p className="text-text-primary dark:text-text-primary-dark">Loading Skills...</p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}