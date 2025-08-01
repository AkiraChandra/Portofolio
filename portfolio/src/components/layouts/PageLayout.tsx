// src/components/layouts/PageLayout.tsx (V2 - UNIFIED NAVIGATION SYSTEM)
// THIS IS V2 - THE RECOMMENDED VERSION! 🏆
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/common/navigations/Navbar";
import Hero from "@/components/sections/Hero/Hero";
import Projects from "@/components/sections/Projects/Projects";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications/Certifications";
import Skills from "@/components/sections/Skills/Skills";

interface PageLayoutProps {
  defaultSection?:
    | "home"
    | "projects"
    | "experience"
    | "certifications"
    | "skills";
}

const SECTIONS = [
  { id: "home", path: "/" },
  { id: "projects", path: "/projects" },
  { id: "experience", path: "/experience" },
  { id: "certifications", path: "/certifications" },
  { id: "skills", path: "/skills" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export default function PageLayout({
  defaultSection = "home",
}: PageLayoutProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] =
    useState<SectionId>(defaultSection);

  // SOLUTION 1: Unified navigation function (same as navbar!)
  const navigateToSection = (sectionId: SectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      // EXACT same approach as navbar - this is why it's smooth!
      section.scrollIntoView({
        behavior: "smooth", // Same as navbar
        block: "start", // Same as navbar
      });

      // Update URL and state
      const sectionConfig = SECTIONS.find((s) => s.id === sectionId);
      if (sectionConfig) {
        window.history.replaceState(null, "", sectionConfig.path);
        setCurrentSection(sectionId);
      }
    }
  };

  // SOLUTION 2: Initialize with same approach as navbar
  useEffect(() => {
    // Disable browser scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  // SOLUTION 3: Handle refresh navigation (navbar-style)
  useEffect(() => {
    if (defaultSection === "home") return;

    // Use same timing and approach as navbar
    const timer = setTimeout(() => {
      navigateToSection(defaultSection);
    }, 50); // Minimal delay, similar to navbar's immediate response

    return () => clearTimeout(timer);
  }, [defaultSection]);

  // SOLUTION 4: Simple scroll tracking (only for URL updates)
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);

      // Minimal delay for smooth URL updates
      scrollTimer = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollTop = container.scrollTop;
        const viewportHeight = container.clientHeight;
        const scrollCenter = scrollTop + viewportHeight * 0.5;

        // Find active section
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

        // Update URL only when section changes
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
      {/* Pass navigation function to Navbar for consistency */}
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
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Hero Section */}
        <motion.section
          id="home"
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
          <Hero />
        </motion.section>

        {/* Projects Section */}
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
          <Projects />
        </motion.section>

        {/* Experience Section - Isolated Overflow */}
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
              <Experience />
            </div>
          </div>
        </motion.section>

        {/* Certifications Section - Isolated Overflow */}
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
              <Certifications />
            </div>
          </div>
        </motion.section>

        {/* Skills Section - Clean */}
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
              <Skills />
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
