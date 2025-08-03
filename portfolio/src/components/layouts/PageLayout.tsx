"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/common/navigations/Navbar";
import { 
  LazyHero,
  LazyProjects, 
  LazySkills, 
  LazyExperience, 
  LazyCertifications,
  LazySection 
} from '@/components/LazyComponents';

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

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (defaultSection === "home") return;

    const timer = setTimeout(() => {
      navigateToSection(defaultSection);
    }, 50);

    return () => clearTimeout(timer);
  }, [defaultSection]);

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
        {/* ✅ HERO - Critical, but optimized */}
        <section
          id="home"
          className="flex-shrink-0 h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <LazySection>
            <LazyHero />
          </LazySection>
        </section>

        {/* ✅ PROJECTS - Lazy loaded */}
        <section
          id="projects"
          className="flex-shrink-0 h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
          }}
        >
          <LazySection>
            <LazyProjects />
          </LazySection>
        </section>

        {/* ✅ EXPERIENCE - Lazy loaded with isolation */}
        <section
          id="experience"
          className="flex-shrink-0 relative h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            contain: "layout style paint",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <LazySection>
                <LazyExperience />
              </LazySection>
            </div>
          </div>
        </section>

        {/* ✅ CERTIFICATIONS - Lazy loaded with isolation */}
        <section
          id="certifications"
          className="flex-shrink-0 relative h-screen"
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            contain: "layout style paint",
          }}
        >
          <div className="absolute inset-0 overflow-hidden bg-black">
            <div className="h-full overflow-y-auto">
              <LazySection>
                <LazyCertifications />
              </LazySection>
            </div>
          </div>
        </section>

        {/* ✅ SKILLS - Lazy loaded with isolation */}
        <section
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
            <div className="h-full overflow-y-auto">
              <LazySection>
                <LazySkills />
              </LazySection>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}