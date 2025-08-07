// File: src/components/sections/Hero/Hero.tsx - REPLACE EXISTING
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
                className="px-8 py-4 bg-primary hover:bg-primary/90 dark:bg-primary-dark dark:hover:bg-primary-dark/90 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                disabled={!isActive(SECTION_ID)}
              >
                About Me
              </button>
              
              <button
                onClick={() => {
                  if (isActive(SECTION_ID)) {
                    const projectsSection = document.getElementById('projects');
                    projectsSection?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 border-2 border-primary dark:border-primary-dark text-primary dark:text-primary-dark hover:bg-primary hover:text-white dark:hover:bg-primary-dark dark:hover:text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                disabled={!isActive(SECTION_ID)}
              >
                View Projects
              </button>
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
                  size={astronautSize}
                  className="relative z-10"
                  priority={isActive(SECTION_ID)}
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
                    className="absolute -top-4 -right-4 w-8 h-8 bg-primary dark:bg-primary-dark rounded-full opacity-80"
                    animate={shouldRenderAnimations ? {
                      y: [0, -10, 0],
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-6 -left-6 w-6 h-6 bg-secondary dark:bg-secondary-dark rounded-full opacity-60"
                    animate={shouldRenderAnimations ? {
                      y: [0, 10, 0],
                      scale: [1, 0.9, 1],
                    } : {}}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Only on desktop and when active */}
        {!isMobile && isActive(SECTION_ID) && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center scroll-hint"
            {...optimizedAnimations.scroll}
          >
            <p className="text-text-tertiary dark:text-text-tertiary-dark text-sm mb-2">
              Scroll to explore
            </p>
            <motion.div
              className="w-6 h-10 border-2 border-text-tertiary dark:border-text-tertiary-dark rounded-full flex justify-center"
              animate={shouldRenderAnimations ? {
                y: [0, 5, 0],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="w-1 h-3 bg-text-tertiary dark:bg-text-tertiary-dark rounded-full mt-2"
                animate={shouldRenderAnimations ? {
                  opacity: [1, 0.3, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={handleCloseModal}
        sectionId={SECTION_ID}
      />
    </div>
  );
});

Hero.displayName = "Hero";

export default Hero;