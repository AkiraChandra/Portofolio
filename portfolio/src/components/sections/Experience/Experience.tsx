// src/components/sections/Experience/Experience.tsx (MOBILE OPTIMIZED)
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  RefreshCw,
  Sparkles,
  Briefcase,
  Trophy,
  Code2,
  Calendar,
  MapPin,
  Rocket,
  Zap,
  Target,
  Star,
  ChevronRight,
  Eye,
} from "lucide-react";
import TimelinePoint from "./components/TimeLinePoint";
import TimelineInfo from "./components/TimeLineInfo";
import MovingStars from "@/components/ui/animations/Movingstars";
import type { Experience as ExperienceType } from "@/types/experience";
import ResumeExport from "./components/ResumeExport";
import { useExperienceVisibility } from "@/hooks/experience/useExperienceVisibility";
import { useExperience } from "@/hooks/experience/useExperience";
import SmartImage from "@/components/common/SmartImage";
import PlaceholderImage from "@/components/common/PlaceholderImage";

const Experience: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { isExperienceVisible, experienceSectionRef } = useExperienceVisibility();
  const headerRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [scrollTarget, setScrollTarget] = useState<"info" | "top" | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Use the new hook instead of hardcoded data
  const { experiences, loading, error, refetch } = useExperience();

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToInfo = () => {
    if (infoRef.current) {
      infoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const scrollToTop = () => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Enhanced mobile scroll to center active timeline item
  const scrollToActiveTimelineItem = (index: number) => {
    if (isMobile && timelineContainerRef.current) {
      const container = timelineContainerRef.current;
      const activeElement = container.querySelector(`[data-timeline-index="${index}"]`) as HTMLElement;
      
      if (activeElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        
        // Calculate position to center the element
        const containerCenter = containerRect.height / 2;
        const elementCenter = elementRect.height / 2;
        const currentScrollTop = container.scrollTop;
        const elementTopRelativeToContainer = elementRect.top - containerRect.top;
        
        // Target scroll position to center the element
        const targetScrollTop = currentScrollTop + elementTopRelativeToContainer - containerCenter + elementCenter;
        
        // Smooth scroll to center
        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    if (shouldScroll) {
      if (scrollTarget === "info" && activeIndex !== null) {
        if (isMobile) {
          // On mobile, scroll to center the active timeline item
          setTimeout(() => scrollToActiveTimelineItem(activeIndex), 100);
        } else {
          scrollToInfo();
        }
      } else if (scrollTarget === "top") {
        scrollToTop();
      }
      setShouldScroll(false);
      setScrollTarget(null);
    }
  }, [shouldScroll, scrollTarget, activeIndex, isMobile]);

  const handleExperienceClick = (index: number) => {
    setActiveIndex((prev) => {
      const newIndex = prev === index ? null : index;
      setShouldScroll(true);
      if (newIndex !== null) {
        setScrollTarget("info");
      } else {
        setScrollTarget("top");
      }
      return newIndex;
    });
  };

  // Enhanced Floating Animation Elements
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--color-primary), 0.3) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        >
          <motion.div
            animate={{
              backgroundPosition: ["0px 0px", "50px 50px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--color-primary), 0.2) 1px, transparent 0)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {/* Enhanced floating particles - reduced for mobile performance */}
      {[...Array(isMobile ? 6 : 12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          animate={{
            x: [0, 200, 0],
            y: [0, -150, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 8 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
          style={{
            left: `${5 + i * 8}%`,
            top: `${10 + (i % 3) * 25}%`,
          }}
        >
          <div className="relative">
            <div className="w-3 h-3 bg-gradient-to-br from-primary/40 to-yellow-400/40 dark:from-primary-dark/40 dark:to-yellow-400/40 rounded-full blur-sm" />
            <div className="absolute inset-0 w-1 h-1 bg-primary/80 dark:bg-primary-dark/80 rounded-full top-1 left-1" />
          </div>
        </motion.div>
      ))}

      {/* Tech orbit animations - reduced for mobile */}
      {[Code2, Briefcase, Trophy, Rocket, Zap].slice(0, isMobile ? 3 : 5).map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/8 dark:text-primary-dark/12"
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.3, 0.8],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
          style={{
            right: `${8 + i * 15}%`,
            top: `${20 + (i % 2) * 40}%`,
          }}
        >
          <Icon size={isMobile ? 24 : 32 + i * 4} />
        </motion.div>
      ))}

      {/* Pulsing energy rings - reduced for mobile */}
      {[...Array(isMobile ? 2 : 3)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute w-64 h-64 border border-primary/5 dark:border-primary-dark/10 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.1, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
        />
      ))}
    </div>
  );

  // Stats Cards Component
  const StatsCards = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="bg-gradient-to-br from-primary/5 to-yellow-400/5 dark:from-primary-dark/5 dark:to-yellow-400/5 
                   backdrop-blur-sm rounded-xl p-4 border border-primary/10 dark:border-primary-dark/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-yellow-400 dark:from-primary-dark dark:to-yellow-400 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              {experiences.length}
            </p>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              Experiences
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-sm rounded-xl p-4 border border-blue-500/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              {experiences.reduce(
                (acc, exp) => acc + (exp.technologies?.length || 0),
                0
              )}
            </p>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              Technologies
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 backdrop-blur-sm rounded-xl p-4 border border-green-500/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              {experiences.reduce(
                (acc, exp) => acc + (exp.achievements?.length || 0),
                0
              )}
            </p>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              Key Milestones
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="bg-gradient-to-br from-orange-500/5 to-red-500/5 backdrop-blur-sm rounded-xl p-4 border border-orange-500/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
              3+
            </p>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
              Years
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // Loading state with enhanced animation
  if (loading) {
    return (
      <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <MovingStars />
        </div>
        <FloatingElements />
        <motion.div
          className="relative z-10 flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-primary/20 dark:border-primary-dark/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary dark:border-t-primary-dark rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-primary dark:text-primary-dark" />
            </div>
          </div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center"
          >
            <p className="text-text-primary dark:text-text-primary-dark font-medium">
              Loading career journey...
            </p>
            <p className="text-text-tertiary dark:text-text-tertiary-dark text-sm mt-1">
              Preparing an epic experience ✨
            </p>
          </motion.div>
        </motion.div>
      </section>
    );
  }

  // Enhanced Error state
  if (error) {
    return (
      <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <MovingStars />
        </div>
        <FloatingElements />
        <motion.div
          className="relative z-10 flex flex-col items-center gap-6 max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-red-500/10 dark:bg-red-400/10 rounded-full flex items-center justify-center"
          >
            <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-red-500 dark:text-red-400 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
              Failed to load career experiences. Let's try that again!
            </p>
          </div>
          <motion.button
            onClick={refetch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-yellow-400 
                     dark:from-primary-dark dark:to-yellow-400 rounded-xl text-white font-medium
                     shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Retry Mission
          </motion.button>
        </motion.div>
      </section>
    );
  }

  // No experiences state
  if (!experiences?.length) {
    return (
      <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <MovingStars />
        </div>
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-24 h-24 bg-primary/10 dark:bg-primary-dark/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Eye className="w-12 h-12 text-primary/50 dark:text-primary-dark/50" />
          </motion.div>
          <p className="text-text-primary dark:text-text-primary-dark text-lg">
            No career adventures found yet...
          </p>
          <p className="text-text-tertiary dark:text-text-tertiary-dark text-sm mt-2">
            The journey is just beginning! 🚀
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      ref={experienceSectionRef}
      className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark transition-colors duration-300 px-4"
    >
      <div
        ref={headerRef}
        className={`mb-0 ${isMobile ? "pb-60" : "pb-0"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent dark:via-black/70 dark:to-black z-1" />
        <div className="absolute inset-0 overflow-hidden">
          <MovingStars />
        </div>
        <FloatingElements />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />

        <div className="relative z-10 max-w-7xl mx-auto min-h-screen overflow-y-auto">
          <div className="mt-20 mb-0">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-2 sm:mb-4">
                My{" "}
                <span className="text-primary dark:text-primary-dark">
                  Journey
                </span>
              </h2>
              <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary-dark">
                Explore my space mission throughout the years
              </p>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            {/* Enhanced Timeline Section Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-background-secondary/40 dark:bg-background-secondary-dark/40 
                       backdrop-blur-lg rounded-3xl p-8 border border-border-primary/30 dark:border-border-primary-dark/30 
                       shadow-2xl relative overflow-hidden"
            >
              {/* Enhanced Card Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/3 to-transparent dark:via-primary-dark/3" />
              <motion.div
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 80%, rgba(var(--color-primary), 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 20%, rgba(var(--color-primary), 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 40% 40%, rgba(var(--color-primary), 0.1) 0%, transparent 50%)",
                  ],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute inset-0 opacity-30"
              />

              {/* Timeline Section */}
              <div className="relative z-10 flex flex-col lg:flex-row gap-8">
                {/* Enhanced Timeline Points Container */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="w-full lg:w-[400px] relative"
                >
                  {/* MOBILE: Remove Professional Timeline Card */}
                  {!isMobile && (
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-gradient-to-r from-primary/5 to-yellow-400/5 dark:from-primary-dark/5 dark:to-yellow-400/5 
                                backdrop-blur-sm rounded-2xl p-6 mb-8 border border-primary/10 dark:border-primary-dark/10
                                shadow-lg relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      />
                      <div className="relative flex items-center gap-4">
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-primary to-yellow-400 dark:from-primary-dark dark:to-yellow-400 rounded-xl flex items-center justify-center shadow-lg"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Calendar className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                            Professional Timeline
                          </h3>
                          <div className="text-sm text-text-secondary dark:text-text-secondary-dark flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Click any milestone to explore
                          </div>
                        </div>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="ml-auto"
                        >
                          <ChevronRight className="w-5 h-5 text-primary/50 dark:text-primary-dark/50" />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* ENHANCED MOBILE: Centered Timeline Container */}
                  <div className={`${isMobile ? 'h-[calc(100vh-320px)]' : 'h-[calc(100vh-450px)] lg:h-[calc(100vh-250px)]'}`}>
                    <div 
                      ref={timelineContainerRef}
                      className="h-full overflow-y-auto hide-scrollbar pr-2 lg:pr-4 relative"
                      style={{
                        // Enhanced mobile scrolling
                        scrollBehavior: 'smooth',
                        scrollPaddingTop: isMobile ? '40%' : '0px'
                      }}
                    >
                      <div className={`space-y-8 ${isMobile ? 'sm:space-y-[120px]' : 'sm:space-y-[100px]'} relative pb-6 mb-10 lg:mb-0`}>
                        {experiences.map(
                          (exp: ExperienceType, index: number) => (
                            <motion.div
                              key={exp.id}
                              data-timeline-index={index}
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.6,
                                delay: 0.8 + index * 0.15,
                                type: "spring",
                                stiffness: 100,
                              }}
                              className="relative"
                            >
                              <TimelinePoint
                                experience={exp}
                                isActive={index === activeIndex}
                                onClick={() => handleExperienceClick(index)}
                                isLast={index === experiences.length - 1}
                              />

                              <AnimatePresence>
                                {activeIndex === index && (
                                  <div className="block lg:hidden mt-6">
                                    <motion.div
                                      initial={{
                                        opacity: 0,
                                        y: -20,
                                        scale: 0.95,
                                      }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                      transition={{
                                        duration: 0.3,
                                        type: "spring",
                                      }}
                                      className="bg-background-secondary/90 dark:bg-background-secondary-dark/90 
                                             backdrop-blur-md rounded-2xl p-6 border border-border-primary/50 
                                             dark:border-border-primary-dark/50 shadow-xl relative overflow-hidden
                                             mx-auto max-w-sm" // Centered and constrained width
                                    >
                                      <motion.div
                                        animate={{
                                          background: [
                                            "linear-gradient(45deg, rgba(var(--color-primary), 0.05) 0%, transparent 100%)",
                                            "linear-gradient(225deg, rgba(var(--color-primary), 0.05) 0%, transparent 100%)",
                                          ],
                                        }}
                                        transition={{
                                          duration: 4,
                                          repeat: Infinity,
                                        }}
                                        className="absolute inset-0"
                                      />

                                      <div className="relative space-y-6">
                                        <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
                                          <p className="mb-4 leading-relaxed">
                                            {exp.description}
                                          </p>

                                          {/* Enhanced Mobile Skills */}
                                          {exp.technologies &&
                                            exp.technologies.length > 0 && (
                                              <div className="mt-5">
                                                <div className="flex items-center gap-2 mb-4">
                                                  <Code2 className="w-4 h-4 text-primary dark:text-primary-dark" />
                                                  <h4 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
                                                    Technology Stack
                                                  </h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                  {exp.technologies
                                                    .slice(0, 5)
                                                    .map((tech, techIndex) => (
                                                      <motion.span
                                                        key={tech}
                                                        initial={{
                                                          opacity: 0,
                                                          scale: 0,
                                                        }}
                                                        animate={{
                                                          opacity: 1,
                                                          scale: 1,
                                                        }}
                                                        transition={{
                                                          delay:
                                                            techIndex * 0.1,
                                                        }}
                                                        whileHover={{
                                                          scale: 1.05,
                                                        }}
                                                        className="px-3 py-1.5 text-xs rounded-xl
                                                           bg-gradient-to-r from-primary/10 to-yellow-400/10 
                                                           dark:from-primary-dark/10 dark:to-yellow-400/10
                                                           text-primary dark:text-primary-dark
                                                           border border-primary/20 dark:border-primary-dark/20
                                                           backdrop-blur-sm font-medium shadow-sm
                                                           hover:shadow-md transition-all duration-200"
                                                      >
                                                        {tech}
                                                      </motion.span>
                                                    ))}
                                                  {exp.technologies.length >
                                                    5 && (
                                                    <motion.span
                                                      className="px-3 py-1.5 text-xs rounded-xl bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 text-text-tertiary dark:text-text-tertiary-dark border border-border-primary/20"
                                                      whileHover={{
                                                        scale: 1.05,
                                                      }}
                                                    >
                                                      +
                                                      {exp.technologies.length -
                                                        5}{" "}
                                                      more
                                                    </motion.span>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                        </div>

                                        {/* Enhanced Mobile Project Images Gallery */}
                                        {exp.projectImages &&
                                          exp.projectImages.length > 0 && (
                                            <motion.div
                                              className="mb-6 w-full"
                                              initial={{ opacity: 0, y: 10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ delay: 0.2 }}
                                            >
                                              <div className="flex items-center gap-2 mb-4">
                                                <Eye className="w-4 h-4 text-blue-500" />
                                                <h4 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
                                                  Documentation
                                                </h4>
                                                <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark bg-blue-500/10 px-2 py-1 rounded-full">
                                                  Swipe to explore
                                                </span>
                                              </div>

                                              <div className="relative group">
                                                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                                                  <div
                                                    className="flex overflow-x-scroll hide-scrollbar snap-x snap-mandatory touch-pan-x"
                                                    style={{
                                                      WebkitOverflowScrolling:
                                                        "touch",
                                                      scrollBehavior: "smooth",
                                                    }}
                                                  >
                                                    {exp.projectImages.map(
                                                      (image, idx) => {
                                                        const hasValidImage =
                                                          image.url &&
                                                          image.url.trim() !==
                                                            "";

                                                        return (
                                                          <div
                                                            key={idx}
                                                            className="flex-none w-[calc(100vw-88px)] sm:w-[280px] px-1 first:pl-0 last:pr-0 snap-center"
                                                          >
                                                            <motion.div
                                                              className="relative aspect-video rounded-xl overflow-hidden bg-background-tertiary dark:bg-background-tertiary-dark shadow-md"
                                                              whileHover={{
                                                                scale: 1.02,
                                                              }}
                                                              transition={{
                                                                duration: 0.2,
                                                              }}
                                                            >
                                                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

                                                              {hasValidImage ? (
                                                                <SmartImage
                                                                  src={
                                                                    image.url
                                                                  }
                                                                  alt={
                                                                    image.caption ||
                                                                    `Project showcase ${
                                                                      idx + 1
                                                                    }`
                                                                  }
                                                                  fill
                                                                  sizes="(max-width: 640px) 100vw, 280px"
                                                                  className="object-cover"
                                                                  onError={() => {
                                                                    console.warn(
                                                                      `Mobile project image failed: ${image.url}`
                                                                    );
                                                                  }}
                                                                />
                                                              ) : (
                                                                <PlaceholderImage
                                                                  type="project"
                                                                  className="rounded-xl"
                                                                />
                                                              )}

                                                              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                                                                <p className="text-white text-sm font-medium line-clamp-2">
                                                                  {image.caption ||
                                                                    `Project Screenshot ${
                                                                      idx + 1
                                                                    }`}
                                                                </p>
                                                              </div>

                                                              <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/20">
                                                                <p className="text-white text-xs font-medium">
                                                                  {idx + 1}/
                                                                  {
                                                                    exp
                                                                      .projectImages
                                                                      ?.length
                                                                  }
                                                                </p>
                                                              </div>
                                                            </motion.div>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>

                                                  <div className="absolute bottom-4 left-0 right-0 z-10">
                                                    <div className="flex justify-center items-center gap-1.5">
                                                      {exp.projectImages.map(
                                                        (_, idx) => (
                                                          <motion.div
                                                            key={idx}
                                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                              idx === 0
                                                                ? "w-6 bg-white shadow-lg"
                                                                : "w-2 bg-white/50"
                                                            }`}
                                                            whileHover={{
                                                              scale: 1.2,
                                                            }}
                                                          />
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>

                                                <motion.div
                                                  initial={{ opacity: 0 }}
                                                  animate={{
                                                    opacity: [0, 1, 0],
                                                  }}
                                                  transition={{
                                                    duration: 2,
                                                    repeat: 1,
                                                    repeatType: "reverse",
                                                    delay: 1,
                                                  }}
                                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
                                                >
                                                  <div className="text-white/90 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium shadow-lg border border-white/20">
                                                    👈 Swipe to explore more
                                                  </div>
                                                </motion.div>
                                              </div>
                                            </motion.div>
                                          )}

                                        {/* Fixed Mobile Key Highlights - Show All */}
                                        <div className="space-y-5">
                                          <div className="flex items-center gap-2 mb-4">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <h4 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
                                              Key Highlights
                                            </h4>
                                          </div>
                                          <ul className="space-y-4">
                                            {exp.achievements.map(
                                              (achievement, idx) => (
                                                <motion.li
                                                  key={idx}
                                                  initial={{
                                                    opacity: 0,
                                                    x: -10,
                                                  }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  transition={{
                                                    delay: idx * 0.1,
                                                  }}
                                                  className="flex items-start gap-3 py-2"
                                                >
                                                  <motion.div
                                                    animate={{
                                                      scale: [1, 1.2, 1],
                                                      rotate: [0, 180, 360],
                                                    }}
                                                    transition={{
                                                      duration: 2,
                                                      repeat: Infinity,
                                                      delay: idx * 0.3,
                                                    }}
                                                    className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-yellow-400 dark:from-primary-dark dark:to-yellow-400 mt-2 shrink-0 shadow-sm"
                                                  />
                                                  <span className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                                                    {achievement}
                                                  </span>
                                                </motion.li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced Desktop Experience Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="hidden lg:block flex-1"
                  ref={infoRef}
                >
                  {/* Enhanced Info Title Card */}
                  <motion.div
                    className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-blue-500/10 shadow-lg relative overflow-hidden"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <motion.div
                      animate={{
                        background: [
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0"
                    />
                    <div className="relative flex items-center gap-4">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <MapPin className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
                          Experience Deep Dive
                        </h3>
                        <div className="text-sm text-text-secondary dark:text-text-secondary-dark flex items-center gap-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-green-500"
                          />
                          {activeIndex !== null
                            ? "Exploring milestone details"
                            : "Ready to explore"}
                        </div>
                      </div>
                      <motion.div
                        animate={{
                          rotate: activeIndex !== null ? 0 : [0, 10, -10, 0],
                          scale: activeIndex !== null ? 1.1 : 1,
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="ml-auto"
                      >
                        <Eye className="w-5 h-5 text-blue-500/50" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {activeIndex !== null ? (
                      <motion.div
                        key={`info-${activeIndex}`}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{
                          duration: 0.4,
                          type: "spring",
                          stiffness: 100,
                        }}
                        className="h-full"
                      >
                        <TimelineInfo
                          experience={experiences[activeIndex]}
                          isVisible={true}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center h-80 bg-gradient-to-br from-background-tertiary/20 to-background-tertiary/10 dark:from-background-tertiary-dark/20 dark:to-background-tertiary-dark/10 rounded-2xl border border-border-primary/10 dark:border-border-primary-dark/10 relative overflow-hidden"
                      >
                        <motion.div
                          animate={{
                            background: [
                              "radial-gradient(circle at 30% 70%, rgba(var(--color-primary), 0.1) 0%, transparent 50%)",
                              "radial-gradient(circle at 70% 30%, rgba(var(--color-primary), 0.1) 0%, transparent 50%)",
                            ],
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute inset-0"
                        />
                        <div className="relative text-center">
                          <motion.div
                            animate={{
                              rotate: 360,
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              rotate: {
                                duration: 6,
                                repeat: Infinity,
                                ease: "linear",
                              },
                              scale: { duration: 2, repeat: Infinity },
                            }}
                            className="w-20 h-20 bg-gradient-to-br from-primary/20 to-yellow-400/20 dark:from-primary-dark/20 dark:to-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                          >
                            <Sparkles className="w-10 h-10 text-primary/60 dark:text-primary-dark/60" />
                          </motion.div>
                          <motion.h3
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-2"
                          >
                            Ready for Discovery
                          </motion.h3>
                          <p className="text-text-tertiary dark:text-text-tertiary-dark max-w-sm">
                            Click on any timeline milestone to unveil the full
                            story behind each career adventure 🚀
                          </p>

                          {/* Floating hint elements */}
                          <div className="absolute -top-4 -left-4">
                            <motion.div
                              animate={{
                                y: [0, -10, 0],
                                opacity: [0.3, 0.7, 0.3],
                              }}
                              transition={{ duration: 3, repeat: Infinity }}
                              className="w-3 h-3 bg-primary/30 dark:bg-primary-dark/30 rounded-full"
                            />
                          </div>
                          <div className="absolute -bottom-4 -right-4">
                            <motion.div
                              animate={{
                                y: [0, 10, 0],
                                opacity: [0.3, 0.7, 0.3],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: 1.5,
                              }}
                              className="w-3 h-3 bg-yellow-400/30 rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Resume Export with better positioning */}
      {isExperienceVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <ResumeExport
            onExport={(format) => {
              console.log("Exporting career journey in format:", format);
            }}
          />
        </motion.div>
      )}
    </section>
  );
};

export default Experience;