// File: src/components/sections/Hero/Hero.tsx - FINAL FIXED VERSION
// Enhanced Hero Component dengan Activity Lifecycle Management

"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import MovingStars from "@/components/ui/animations/Movingstars";
import TypeWriter from "./components/TypeWritter";
import { useAstronautSize } from "@/hooks/common/useMediaQuery";
import ProfilePicture from "@/components/sections/Hero/components/ProfilePicture";
import AboutModal from "@/components/sections/Hero/components/AboutModal";
import { config } from "@/config";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";
import { 
  useActivityLifecycle, 
  useActiveEffect, 
  useActiveTimeout 
} from "@/contexts/ActivityLifecycleContext";

// ===============================================================
// ENHANCED HERO COMPONENT
// ===============================================================

const Hero: React.FC = memo(() => {
  // Section ID for activity management
  const SECTION_ID = 'home';
  
  // Activity Lifecycle hooks
  const { isActive, isVisible, addSuspendCallback, addResumeCallback } = useActivityLifecycle();
  
  // Media queries - optimized
  const isMobile = useMediaQuery("(max-width: 768px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const astronautSize = useAstronautSize();
  
  // Local state
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'loading' | 'entering' | 'active'>('loading');

  // ===============================================================
  // OPTIMIZED ANIMATION VARIANTS
  // ===============================================================

  const optimizedAnimations = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        leftContent: { initial: {}, animate: {}, transition: { duration: 0 } },
        rightContent: { initial: {}, animate: {}, transition: { duration: 0 } },
        scroll: { initial: {}, animate: {}, transition: { duration: 0 } }
      };
    }

    const baseAnimation = {
      duration: isMobile ? 0.4 : 0.8,
      ease: "easeOut" as const
    };

    return {
      leftContent: {
        initial: { opacity: 0, x: isMobile ? -20 : -50, y: 20 },
        animate: { opacity: 1, x: 0, y: 0 },
        transition: baseAnimation
      },
      rightContent: {
        initial: { opacity: 0, x: isMobile ? 20 : 50, scale: 0.9 },
        animate: { opacity: 1, x: 0, scale: 1 },
        transition: { ...baseAnimation, delay: isMobile ? 0.1 : 0.2 }
      },
      scroll: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { ...baseAnimation, delay: isMobile ? 0.2 : 0.4 }
      }
    };
  }, [isMobile, prefersReducedMotion]);

  // ===============================================================
  // ACTIVITY-AWARE EFFECTS
  // ===============================================================

  // Load animation sequence - only when active
  useActiveEffect(() => {
    if (!isActive(SECTION_ID)) return;

    const loadTimer = setTimeout(() => {
      setHasLoaded(true);
      setAnimationPhase('entering');
    }, 100);

    const enterTimer = setTimeout(() => {
      setAnimationPhase('active');
    }, isMobile ? 800 : 1200);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(enterTimer);
    };
  }, [isActive(SECTION_ID), isMobile], SECTION_ID);

  // Auto-scroll hint animation - only when active
  useActiveTimeout(() => {
    if (!isMobile && isActive(SECTION_ID) && animationPhase === 'active') {
      // Trigger scroll hint animation
      const scrollHint = document.querySelector('.scroll-hint');
      if (scrollHint) {
        scrollHint.classList.add('animate-bounce');
      }
    }
  }, 3000, SECTION_ID);

  // ===============================================================
  // SUSPEND/RESUME CALLBACKS
  // ===============================================================

  useEffect(() => {
    // Add suspend callback
    addSuspendCallback(SECTION_ID, () => {
      console.log('🛑 Hero: Suspending activities');
      setAnimationPhase('loading');
      
      // Pause any ongoing animations
      const heroElement = document.getElementById('home');
      if (heroElement) {
        heroElement.style.animationPlayState = 'paused';
      }
    });

    // Add resume callback
    addResumeCallback(SECTION_ID, () => {
      console.log('▶️ Hero: Resuming activities');
      setAnimationPhase('active');
      
      // Resume animations
      const heroElement = document.getElementById('home');
      if (heroElement) {
        heroElement.style.animationPlayState = 'running';
      }
    });
  }, [addSuspendCallback, addResumeCallback, SECTION_ID]);

  // ===============================================================
  // EVENT HANDLERS
  // ===============================================================

  const handleAboutClick = useCallback(() => {
    if (isActive(SECTION_ID)) {
      setIsAboutModalOpen(true);
    }
  }, [isActive, SECTION_ID]);

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary dark:from-background-primary-dark dark:via-background-secondary-dark dark:to-background-tertiary-dark">
      
      {/* Background Stars - Only when active */}
      {shouldRenderStars && (
        <div className="absolute inset-0 z-0">
          <MovingStars />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left space-y-6 lg:space-y-8"
            {...(shouldRenderAnimations ? optimizedAnimations.leftContent : {})}
          >
            {/* Greeting */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: shouldRenderAnimations ? 1 : 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary dark:text-text-primary-dark leading-tight">
                Hi! I'm{" "}
                <span className="text-primary dark:text-primary-dark bg-gradient-to-r from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark bg-clip-text text-transparent">
                  Akira Chandra
                </span>
              </h1>
            </motion.div>

            {/* Typewriter Effect - Only when active */}
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

          {/* Right Content - Profile Picture */}
          <motion.div
            className="flex justify-center lg:justify-end"
            {...(shouldRenderAnimations ? optimizedAnimations.rightContent : {})}
          >
            <div className="relative">
              {/* Profile Picture with Activity-aware loading */}
              {isVisible(SECTION_ID) ? (
                <ProfilePicture
                  src="/profile.jpg"
                  className="relative z-10"
                  // priority={isActive(SECTION_ID)}
                />
              ) : (
                <div 
                  className={`${astronautSize} bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex items-center justify-center`}
                >
                  <div className="w-1/2 h-1/2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
              )}

              {/* Floating Elements - Only when active */}
              {isActive(SECTION_ID) && !isMobile && (
                <>
                  <motion.div
                    className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 dark:bg-primary-dark/20 rounded-full"
                    animate={{
                      y: [0, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  <motion.div
                    className="absolute -bottom-6 -right-6 w-12 h-12 bg-secondary/20 dark:bg-secondary-dark/20 rounded-full"
                    animate={{
                      y: [0, 10, 0],
                      x: [0, 5, 0],
                      scale: [1, 0.9, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {shouldRenderAnimations && (
          <motion.div
            className="scroll-hint absolute bottom-8 left-1/2 transform -translate-x-1/2"
            {...optimizedAnimations.scroll}
          >
            <motion.div
              className="flex flex-col items-center text-text-tertiary dark:text-text-tertiary-dark"
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-sm font-medium mb-2">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center">
                <motion.div
                  className="w-1 h-3 bg-current rounded-full mt-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* About Modal - FIXED: Remove incompatible prop */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
});

Hero.displayName = 'Hero';

export default Hero;