// File: src/components/layouts/PageLayout.tsx - UPDATE MINIMAL TANPA UBAH STYLE
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/common/navigations/Navbar";
import Hero from "@/components/sections/Hero/Hero"; // Always load immediately
import LazyComponentLoader from "@/components/common/LazyComponentLoader";
import { SectionActivityProvider, useSectionActivity } from '@/contexts/SectionActivityContext';

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

      const sectionConfig = SECTIONS.find((s) => s.id === sectionId);
      if (sectionConfig) {
        window.history.replaceState(null, "", sectionConfig.path);
        setCurrentSection(sectionId);
        setActiveSection(sectionId); // ✅ TAMBAHAN 1 LINE INI
      }
    }
  };

  // ✅ INITIALIZE - TETAP SAMA
  useEffect(() => {
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
  }, [defaultSection]);

  // ✅ SCROLL TRACKING - TAMBAH 1 LINE SAJA
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
          <br />
          Section: {currentSection} {/* ✅ TAMBAHAN DEBUG INFO */}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
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

        {/* EXPERIENCE SECTION */}
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
          {/* ✅ RESTORED NESTED SCROLL - But with better handling */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="h-full overflow-y-auto scroll-smooth">
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

        {/* CERTIFICATIONS SECTION */}
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
            <div className="h-full overflow-y-auto scroll-smooth">
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <div className="absolute inset-0 overflow-hidden bg-black">
            <div className="h-full overflow-y-auto scroll-smooth">
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
// ✅ EXPORT DENGAN PROVIDER WRAPPER - INI SAJA YANG BERUBAH
export default function PageLayout({ defaultSection = "home" }: PageLayoutProps) {
  return (
    <SectionActivityProvider initialSection={defaultSection}>
      <PageLayoutInner defaultSection={defaultSection} />
    </SectionActivityProvider>
  );
}