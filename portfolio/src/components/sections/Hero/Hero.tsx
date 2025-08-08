// src/components/sections/Hero/Hero.tsx - FIXED IMPLEMENTATION
"use client";

import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import MovingStars from "@/components/ui/animations/Movingstars";
import TypeWriter from "./components/TypeWritter";
import { useAstronautSize } from "@/hooks/common/useMediaQuery";
import ProfilePicture from "@/components/sections/Hero/components/ProfilePicture";
import AboutModal from "@/components/sections/Hero/components/AboutModal";
import { config } from "@/config";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";
import { useHeroActivity } from "@/hooks/common/useSectionActivity";

// const useHeroActivity = () => {
//   const [isActive, setIsActive] = useState(true);
//   const observerRef = useRef<IntersectionObserver | null>(null);
  
//   useEffect(() => {
//     // ✅ FIXED: Remove isActive from dependency to prevent loop
//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.target.id === 'home') {
//             const newIsActive = entry.intersectionRatio > 0.5;
            
//             setIsActive((prevIsActive) => {
//               if (newIsActive !== prevIsActive) {
//                 console.log(`🏠 Hero: ${newIsActive ? 'ACTIVE' : 'SUSPENDED'}`);
//               }
//               return newIsActive;
//             });
//           }
//         });
//       },
//       { threshold: [0, 0.5, 1.0], rootMargin: '-10% 0px' }
//     );

//     // ✅ FIXED: Immediate observation without setTimeout
//     const heroElement = document.getElementById('home');
//     if (heroElement && observerRef.current) {
//       observerRef.current.observe(heroElement);
//     }

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//     };
//   }, []); // ✅ FIXED: Empty dependency array

//   return { isActive };
// };

const Hero: React.FC = memo(() => {
  Hero.displayName = "Hero";
  
  // ✅ FIXED: Activity hook integration
  const { isActive } = useHeroActivity();
  
  // Media queries
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const astronautSize = useAstronautSize();
  
  // States
  const [isVisible, setIsVisible] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  
  // Memoized data
  const words = useMemo(() => 
    ["Web Developer", "UI/UX Designer", "Full Stack Developer", "System Analyst", "Data Analyst"], 
    []
  );
  
  const { width, height } = useAstronautSize();

  // ✅ FIXED: Single intersection observer untuk visibility animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const heroElement = document.getElementById('home');
    if (heroElement) {
      observer.observe(heroElement);
    }

    return () => observer.disconnect();
  }, []);

  // Event handlers
  const handleAboutClick = useCallback(() => setIsAboutModalOpen(true), []);
  const closeAboutModal = useCallback(() => setIsAboutModalOpen(false), []);

  // ✅ FIXED: Add isActive to animation dependencies
  const optimizedAnimations = useMemo(() => ({
    hero: {
      leftContent: {
        initial: { opacity: 0, x: isMobile ? -20 : -50, y: 20 },
        animate: { opacity: 1, x: 0, y: 0 },
        transition: baseAnimation
      },
      rightContent: {
        hidden: { 
          opacity: 0, 
          x: prefersReducedMotion ? 0 : (isMobile ? 20 : 50),
          scale: prefersReducedMotion ? 1 : 0.9
        },
        visible: {
          opacity: 1,
          x: 0,
          scale: 1,
          transition: {
            duration: isMobile ? 0.4 : 0.8,
            ease: "easeOut",
            delay: isMobile ? 0.2 : 0.3,
          },
        },
      },
      child: {
        hidden: { 
          opacity: 0, 
          y: prefersReducedMotion ? 0 : 20 
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: isMobile ? 0.3 : 0.5,
            ease: "easeOut"
          },
        },
      },
    },
    astronaut: {
      float: {
        animate: prefersReducedMotion || !isActive ? {} : {
          y: isMobile ? [-3, 3, -3] : [-10, 10, -10],
          transition: {
            duration: isMobile ? 4 : 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
      },
    },
    scroll: {
      indicator: {
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            delay: isMobile ? 0.8 : 1.2,
            duration: isMobile ? 0.3 : 0.5,
          },
        },
      },
      arrow: {
        animate: prefersReducedMotion || !isActive ? {} : {
          y: [0, 5, 0],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
      },
    },
  }), [isMobile, prefersReducedMotion, isActive]);

  // Memoized button styles
  const buttonBaseClasses = useMemo(() => 
    "inline-flex items-center gap-2 bg-gradient-to-r from-primary/80 to-yellow-400/80 " +
    "dark:from-primary-dark/80 dark:to-yellow-400/80 text-black rounded-lg backdrop-blur-sm font-medium " +
    "hover:from-primary hover:to-yellow-400 dark:hover:from-primary-dark dark:hover:to-yellow-400 " +
    "transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 dark:hover:shadow-primary-dark/25",
    []
  );

  // Memoized animations
  const hoverAnimation = useMemo(() => 
    prefersReducedMotion ? {} : { scale: 1.02, y: -1 },
    [prefersReducedMotion]
  );
  
  const tapAnimation = useMemo(() => 
    prefersReducedMotion ? {} : { scale: 0.98 },
    [prefersReducedMotion]
  );

  const handleCloseModal = useCallback(() => {
    setIsAboutModalOpen(false);
  }, []);

  // ===============================================================
  // CONDITIONAL RENDERING LOGIC
  // ===============================================================

  // Only render MovingStars when section is active for performance
  const shouldRenderStars = isActive(SECTION_ID) && !prefersReducedMotion;
  
  // Only render complex animations when visible
  const shouldRenderAnimations = isVisible(SECTION_ID) && hasLoaded;

  // ===============================================================
  // RENDER
  // ===============================================================

  return (
    <>
      {/* ✅ FIXED: Single id="home" for consistency */}
      <section 
        id="home"
        className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark transition-colors duration-300 overflow-hidden lg:px-24"
        style={{ 
          contain: 'layout style paint',
          willChange: 'auto'
        }}
      >
        {/* ✅ FIXED: Conditional MovingStars based on isActive */}
        {(!isMobile || !prefersReducedMotion) && (
          <div className="absolute inset-0 z-0">
            {isActive && <MovingStars isActive={isActive} />}
          </div>
        )}

        {/* Simplified Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-1" />

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10 h-full min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 w-full items-center py-10 lg:py-0 xl:py-0">
            
            {/* Left Column - Text Content */}
            <motion.div
              className="text-xl md:text-2xl lg:text-3xl text-text-secondary dark:text-text-secondary-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: shouldRenderAnimations ? 1 : 0 }}
              transition={{ delay: 0.3 }}
            >
              I'm a{" "}
              {isActive(SECTION_ID) ? (
                <TypeWriter
                  words={[
                    "Full Stack Developer",
                    "UI/UX Designer", 
                    "System Analyst",
                    "Problem Solver"
                  ]}
                  sectionId={SECTION_ID}
                />
              ) : (
                <span className="text-primary dark:text-primary-dark font-semibold">
                  Full Stack Developer
                </span>
              )}
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-text-tertiary dark:text-text-tertiary-dark max-w-2xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: shouldRenderAnimations ? 1 : 0 }}
              transition={{ delay: 0.5 }}
            >
              Passionate about creating innovative solutions and bringing ideas to life through code. 
              Currently working as a Junior Programmer while pursuing Information Systems at Bina Nusantara University.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: shouldRenderAnimations ? 1 : 0,
                y: shouldRenderAnimations ? 0 : 20
              }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={handleAboutClick}
                className="px-8 py-4 bg-primary dark:bg-primary-dark text-white dark:text-gray-900 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-primary-dark dark:hover:bg-primary hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50"
              >
                Learn More About Me
              </button>
              
              <motion.a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  const projectsSection = document.getElementById('projects');
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 border-2 border-primary dark:border-primary-dark text-primary dark:text-primary-dark rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-primary dark:hover:bg-primary-dark hover:text-white dark:hover:text-gray-900 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
              </motion.a>
            </motion.div>

            {/* Social Links - FIXED: Use config.site instead of config.portfolio */}
            <motion.div
              className="flex justify-center lg:justify-start gap-6 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: shouldRenderAnimations ? 1 : 0 }}
              transition={{ delay: 0.9 }}
            >
              {config.site.social && (
                <>
                  {config.site.social.github && (
                    <motion.a
                      href={config.site.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-300"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="GitHub Profile"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </motion.a>
                  )}
                  
                  {config.site.social.linkedin && (
                    <motion.a
                      href={config.site.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-300"
                      whileHover={{ scale: 1.2, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="LinkedIn Profile"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </motion.a>
                  )}
                  
                  {config.site.social.instagram && (
                    <motion.a
                      href={config.site.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-300"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Instagram Profile"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </motion.a>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>

            {/* Right Column - Astronaut */}
            <motion.div
              id="hero-content-right"
              variants={optimizedAnimations.hero.rightContent}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="relative z-10 flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] lg:col-span-6 xl:col-span-6 lg:flex lg:items-center xl:flex xl:items-center"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Container for both glow and astronaut */}
              <div className="relative flex items-center justify-center lg:translate-y-10 lg:translate-x-10">
                {/* ✅ FIXED: Conditional glow rendering based on isActive */}
                {!isMobile && !prefersReducedMotion && isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-full max-w-[500px] aspect-square rounded-full bg-[var(--glow-outer)] blur-3xl scale-75 opacity-30" />
                    <div className="absolute w-full max-w-[350px] aspect-square rounded-full bg-[var(--glow-middle)] blur-2xl scale-75 opacity-40" />
                    <div className="absolute w-full max-w-[250px] aspect-square rounded-full bg-[var(--glow-inner)] blur-xl scale-75 opacity-50" />
                  </div>
                )}

                {/* Astronaut */}
                <motion.div
                  animate={optimizedAnimations.astronaut.float.animate}
                  className="relative z-20 w-full h-full flex items-center justify-center scale-90 lg:scale-100 xl:scale-110"
                  style={{
                    willChange: prefersReducedMotion || !isActive ? 'auto' : 'transform',
                    transform: 'translateZ(0)'
                  }}
                >
                  <Image
                    src="/astronaut.png"
                    alt="Astronaut"
                    width={width}
                    height={height}
                    className="w-full h-full object-contain"
                    priority={true}
                    loading="eager"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli2Qc7bk/wANVdVzBZFmgjmTM080OoKCKu0HS0T41LbZVPdS/I0gTthV"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Modal - FIXED: Remove incompatible prop */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={handleCloseModal}
      />

      {/* ✅ FIXED: Debug indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50 border border-green-500">
          <div>Hero: {isActive ? '🟢 ACTIVE' : '🔴 SUSPENDED'}</div>
          <div>Stars: {isActive && (!isMobile || !prefersReducedMotion) ? '🌟 ON' : '⭐ OFF'}</div>
          <div>TypeWriter: {isActive ? '✏️ ON' : '📝 OFF'}</div>
        </div>
      )}
    </>
  );
});

Hero.displayName = 'Hero';

export default Hero;