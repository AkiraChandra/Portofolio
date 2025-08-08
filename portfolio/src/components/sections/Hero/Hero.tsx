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
        hidden: { 
          opacity: 0, 
          x: prefersReducedMotion ? 0 : (isMobile ? -20 : -50),
          y: prefersReducedMotion ? 0 : 20
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: isMobile ? 0.4 : 0.8,
            ease: "easeOut",
            staggerChildren: isMobile ? 0.1 : 0.15,
            delayChildren: isMobile ? 0.1 : 0.2,
          },
        },
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

  const buttonHoverAnimation = useMemo(() => 
    prefersReducedMotion ? {} : { scale: 1.05 },
    [prefersReducedMotion]
  );

  const buttonTapAnimation = useMemo(() => 
    prefersReducedMotion ? {} : { scale: 0.95 },
    [prefersReducedMotion]
  );

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
              id="hero-content-left"
              variants={optimizedAnimations.hero.leftContent}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="relative z-10 lg:col-span-6 xl:col-span-6 lg:flex lg:items-center xl:flex xl:items-center"
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="md:flex md:items-center">
                {/* Profile Picture - Tablet */}
                <div className="hidden md:block lg:hidden mr-4">
                  <ProfilePicture
                    src="/profile.jpg"
                    className="w-[160px] h-[160px] sm:w-[160px] sm:h-[160px]"
                    fromLeft={false}
                  />
                </div>

                {/* Profile Picture - Mobile */}
                <div className="md:hidden mb-4 flex justify-center">
                  <ProfilePicture
                    src="/profile.jpg"
                    className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px]"
                    fromLeft={true}
                  />
                </div>

                <div className="flex-1 max-w-[560px] xl:max-w-[640px]">
                  {/* About Me Button - Mobile & Tablet */}
                  <motion.div
                    variants={optimizedAnimations.hero.child}
                    className="lg:hidden mb-3"
                  >
                    <motion.button
                      onClick={handleAboutClick}
                      className={`${buttonBaseClasses} px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base`}
                      whileHover={hoverAnimation}
                      whileTap={tapAnimation}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <span>About Me</span>
                    </motion.button>
                  </motion.div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:block">
                    <div className="inline-flex flex-col items-center mb-4">
                      <ProfilePicture
                        src="/profile.jpg"
                        className="w-[220px] h-[220px] lg:mb-8"
                        fromLeft={true}
                      />
                      <motion.div
                        variants={optimizedAnimations.hero.child}
                        className="w-[220px]"
                      >
                        <motion.button
                          onClick={handleAboutClick}
                          className={`${buttonBaseClasses} px-6 py-2.5 text-[0.9rem] justify-center w-full font-poppins`}
                          whileHover={hoverAnimation}
                          whileTap={tapAnimation}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <span>About Me</span>
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>

                  <motion.h1 variants={optimizedAnimations.hero.child} className="mb-3">
                    <div className="flex items-baseline space-x-2 font-poppins font-bold text-[1.5rem] sm:text-4xl lg:text-5xl xl:text-[3.5rem] text-text-primary dark:text-text-primary-dark lg:space-x-4 lg:mb-1">
                      <span className="whitespace-nowrap">Hi! I&apos;m</span>
                      <span className="dark:text-yellow-400 text-glow whitespace-nowrap">
                        {config.site.author}
                      </span>
                    </div>
                    <div className="max-w-60 sm:max-w-none lg:max-w-none xl:max-w-none mb-2 overflow-visible space-x-1 lg:space-x-2 font-poppins font-bold leading-none sm:leading-none lg:leading-none text-[1.5rem] sm:text-4xl lg:text-5xl xl:text-[3.5rem] text-text-primary dark:text-text-primary-dark">
                      <span className="whitespace-nowrap">I&apos;m a </span>
                      <TypeWriter words={words} />
                    </div>
                  </motion.h1>

                  <motion.p
                    variants={optimizedAnimations.hero.child}
                    className="font-poppins text-[0.8rem] dark:text-text-secondary-dark mb-4 sm:text-[1.1rem] xl:text-[1.1rem] lg:leading-6"
                  >
                    {config.site.description}
                  </motion.p>

                  <motion.div
                    variants={optimizedAnimations.hero.child}
                    className="flex flex-wrap gap-3 sm:gap-4"
                  >
                    <motion.a
                      href={config.site.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={buttonHoverAnimation}
                      whileTap={buttonTapAnimation}
                      className="px-6 sm:px-8 py-2.5 sm:py-3 lg:px-8 xl:px-10 lg:py-3 xl:py-4 bg-yellow-500 text-black rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 text-sm sm:text-base lg:text-lg"
                    >
                      Let&apos;s Connect
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </motion.a>

                    <motion.button
                      whileHover={buttonHoverAnimation}
                      whileTap={buttonTapAnimation}
                      className="px-6 sm:px-8 py-2.5 sm:py-3 lg:px-8 xl:px-10 lg:py-3 xl:py-4 border border-white/20 text-yellow-400 rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base lg:text-lg"
                    >
                      Download CV
                    </motion.button>
                  </motion.div>
                </div>
              </div>
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

      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutModalOpen}
        onClose={closeAboutModal}
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

export default Hero;