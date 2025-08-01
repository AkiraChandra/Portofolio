// src/components/sections/Experience/Experience.tsx (MOBILE PERFORMANCE OPTIMIZED)
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  Star,
  Eye,
} from "lucide-react";
import TimelinePoint from "./components/TimeLinePoint";
import TimelineInfo from "./components/TimeLineInfo";
import MovingStars from "@/components/ui/animations/Movingstars";
import type { Experience as ExperienceType } from "@/types/experience";
import ResumeExport from "./components/ResumeExport";
import { useExperienceVisibility } from "@/hooks/experience/useExperienceVisibility";
import { useExperience } from "@/hooks/experience/useExperience";


// Add CSS for hiding scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`;

// Mobile detection hook with better performance
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);

    // Check immediately
    checkMobile();

    // Throttled resize handler
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
};

const Experience: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { isExperienceVisible, experienceSectionRef } =
    useExperienceVisibility();
  const headerRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [scrollTarget, setScrollTarget] = useState<"info" | "top" | null>(null);

  // Performance optimizations
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();

  // Use the new hook instead of hardcoded data
  const { experiences, loading, error, refetch } = useExperience();

  // Memoized calculations to avoid recalculation on every render
  const statsData = useMemo(() => {
    if (!experiences?.length)
      return { experienceCount: 0, techCount: 0, achievementCount: 0 };

    return {
      experienceCount: experiences.length,
      techCount: experiences.reduce(
        (acc, exp) => acc + (exp.technologies?.length || 0),
        0
      ),
      achievementCount: experiences.reduce(
        (acc, exp) => acc + (exp.achievements?.length || 0),
        0
      ),
    };
  }, [experiences]);

  const scrollToInfo = useCallback(() => {
    if (isMobile) {
      const timelineSection = experienceSectionRef.current;
      if (timelineSection) {
        const timelineMainDiv = timelineSection.querySelector(
          ".bg-background-secondary\\/30"
        );
        if (timelineMainDiv) {
          setTimeout(() => {
            (timelineMainDiv as HTMLElement).scrollIntoView({
              behavior: shouldReduceMotion ? "auto" : "smooth",
              block: "start",
            });
          }, 150);
        }
      }
    } else {
      // Desktop: scroll to info panel
      if (!infoRef.current) return;
      infoRef.current.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [isMobile, shouldReduceMotion]);

  const scrollToTop = useCallback(() => {
    // Same behavior for both mobile and desktop - scroll to header
    if (!headerRef.current) return;
    headerRef.current.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [shouldReduceMotion]);

  // Optimized mobile scroll function with better performance
  const scrollToActiveTimelineItem = useCallback(
    (index: number) => {
      if (!isMobile || !timelineContainerRef.current) return;

      const container = timelineContainerRef.current;
      const activeElement = container.querySelector(
        `[data-timeline-index="${index}"]`
      ) as HTMLElement;

      if (!activeElement) return;

      // Use immediate scroll on reduced motion
      if (shouldReduceMotion) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        const containerCenter = containerRect.height / 2;
        const elementCenter = elementRect.height / 2;
        const currentScrollTop = container.scrollTop;
        const elementTopRelativeToContainer =
          elementRect.top - containerRect.top;
        const targetScrollTop =
          currentScrollTop +
          elementTopRelativeToContainer -
          containerCenter +
          elementCenter;

        container.scrollTop = Math.max(0, targetScrollTop);
        return;
      }

      // Use requestAnimationFrame for smooth performance
      requestAnimationFrame(() => {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();

        const containerCenter = containerRect.height / 2;
        const elementCenter = elementRect.height / 2;
        const currentScrollTop = container.scrollTop;
        const elementTopRelativeToContainer =
          elementRect.top - containerRect.top;

        // Calculate target position to center the clicked item
        const targetScrollTop =
          currentScrollTop +
          elementTopRelativeToContainer -
          containerCenter +
          elementCenter;

        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: "smooth",
        });
      });
    },
    [isMobile, shouldReduceMotion]
  );

  useEffect(() => {
    if (shouldScroll) {
      console.log("Scroll triggered:", { scrollTarget, activeIndex, isMobile }); // Debug log

      if (scrollTarget === "info" && activeIndex !== null) {
        // Both mobile and desktop: scroll to info section when item is clicked
        console.log("Scrolling to info..."); // Debug log
        scrollToInfo();
      } else if (scrollTarget === "top") {
        // Both mobile and desktop: scroll to top when item is unclicked
        console.log("Scrolling to top..."); // Debug log
        scrollToTop();
      }
      setShouldScroll(false);
      setScrollTarget(null);
    }
  }, [shouldScroll, scrollTarget, activeIndex, scrollToInfo, scrollToTop]);

  const handleExperienceClick = useCallback(
    (index: number) => {
      console.log("Experience clicked:", { index, currentActive: activeIndex }); // Debug log

      setActiveIndex((prev) => {
        const newIndex = prev === index ? null : index;

        console.log("Setting new index:", newIndex); // Debug log

        // Always trigger scroll behavior
        setShouldScroll(true);

        if (newIndex !== null) {
          // When opening/selecting an item, scroll to show info
          console.log("Setting scroll target to info"); // Debug log
          setScrollTarget("info");
        } else {
          // When closing/deselecting an item, scroll to top
          console.log("Setting scroll target to top"); // Debug log
          setScrollTarget("top");
        }

        return newIndex;
      });
    },
    [activeIndex]
  );

  // Performance optimized Floating Animation Elements
  const FloatingElements = React.memo(() => {
    if (!isExperienceVisible) return null;

    // Skip heavy animations on mobile or reduced motion
    if (isMobile || shouldReduceMotion) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Static Grid Pattern for mobile */}
          <div className="absolute inset-0 opacity-3 dark:opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--color-primary), 0.15) 1px, transparent 0)`,
                backgroundSize: "60px 60px",
              }}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-3 dark:opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--color-primary), 0.15) 1px, transparent 0)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Reduced floating particles - Desktop only */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 dark:bg-primary-dark/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -75, 0],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 2) * 30}%`,
            }}
          />
        ))}

        {/* Minimal tech orbit animations - Desktop only */}
        {[Code2, Briefcase, Trophy].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/6 dark:text-primary-dark/8"
            animate={{
              rotate: 360,
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              right: `${15 + i * 20}%`,
              top: `${30 + i * 20}%`,
            }}
          >
            <Icon size={24 + i * 4} />
          </motion.div>
        ))}
      </div>
    );
  });

  // Memoized Stats Cards Component with performance optimizations
  const StatsCards = React.memo(() => {
    const statsConfig = useMemo(
      () => [
        {
          icon: Briefcase,
          value: statsData.experienceCount,
          label: "Experiences",
          gradient:
            "from-primary to-yellow-400 dark:from-primary-dark dark:to-yellow-400",
          bg: "from-primary/5 to-yellow-400/5 dark:from-primary-dark/5 dark:to-yellow-400/5",
          border: "border-primary/10 dark:border-primary-dark/10",
        },
        {
          icon: Code2,
          value: statsData.techCount,
          label: "Technologies",
          gradient: "from-blue-500 to-purple-500",
          bg: "from-blue-500/5 to-purple-500/5",
          border: "border-blue-500/10",
        },
        {
          icon: Trophy,
          value: statsData.achievementCount,
          label: "Milestones",
          gradient: "from-green-500 to-emerald-500",
          bg: "from-green-500/5 to-emerald-500/5",
          border: "border-green-500/10",
        },
        {
          icon: Rocket,
          value: "3+",
          label: "Years",
          gradient: "from-orange-500 to-red-500",
          bg: "from-orange-500/5 to-red-500/5",
          border: "border-orange-500/10",
        },
      ],
      [statsData]
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.4,
          delay: shouldReduceMotion ? 0 : 0.2,
        }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8"
      >
        {statsConfig.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={
              !isMobile && !shouldReduceMotion
                ? { scale: 1.02, y: -2 }
                : undefined
            }
            className={`bg-gradient-to-br ${stat.bg} backdrop-blur-sm rounded-xl p-3 lg:p-4 border ${stat.border}`}
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <div
                className={`w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <p className="text-lg lg:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
                  {stat.value}
                </p>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                  {stat.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  });

  // Optimized Loading State
  if (loading) {
    return (
      <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden opacity-50">
          {!isMobile && <MovingStars />}
        </div>
        <motion.div
          className="relative z-10 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        >
          <div className="relative">
            <motion.div
              animate={shouldReduceMotion ? {} : { rotate: 360 }}
              transition={
                shouldReduceMotion
                  ? {}
                  : { duration: 1, repeat: Infinity, ease: "linear" }
              }
              className="w-12 h-12 border-3 border-primary/20 dark:border-primary-dark/20 border-t-primary dark:border-t-primary-dark rounded-full"
            />
          </div>
          <div className="text-center">
            <p className="text-text-primary dark:text-text-primary-dark font-medium">
              Loading experiences...
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  // Simplified Error State
  if (error) {
    return (
      <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <motion.div
          className="relative z-10 flex flex-col items-center gap-4 max-w-md text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400" />
          <div>
            <h3 className="text-xl font-bold text-red-500 dark:text-red-400 mb-2">
              Something went wrong
            </h3>
            <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
              Failed to load experiences.
            </p>
          </div>
          <motion.button
            onClick={refetch}
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-primary-dark rounded-lg text-white font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </motion.button>
        </motion.div>
      </section>
    );
  }

  // No experiences state
  if (!experiences?.length) {
    return (
      <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        >
          <Eye className="w-16 h-16 text-primary/50 dark:text-primary-dark/50 mx-auto mb-4" />
          <p className="text-text-primary dark:text-text-primary-dark text-lg">
            No experiences found...
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section
      ref={experienceSectionRef}
      className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark px-4"
    >
      {/* Add inline styles for scrollbar hiding */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyles }} />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent dark:via-black/70 dark:to-black z-1" />
      <div className="absolute inset-0 overflow-hidden">
        <MovingStars />
      </div>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />
      <div ref={headerRef} className={`mb-0 ${isMobile ? "pb-20" : "pb-0"}`}>
        <FloatingElements />
        <div className="relative z-10 max-w-7xl mx-auto min-h-screen">
          <div className="pt-16 lg:pt-20">
            {/* Header */}
            <div className="text-center mb-8 lg:mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
                My{" "}
                <span className="text-primary dark:text-primary-dark">
                  Journey
                </span>
              </h1>
              <p className="text-sm lg:text-base text-text-secondary dark:text-text-secondary-dark">
                Explore my career milestones
              </p>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            {/* Main Timeline Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.4,
                delay: shouldReduceMotion ? 0 : 0.3,
              }}
              className="bg-background-secondary/30 dark:bg-background-secondary-dark/30 
                       backdrop-blur-lg rounded-2xl lg:rounded-3xl p-4 lg:p-8 
                       border border-border-primary/20 dark:border-border-primary-dark/20 
                       shadow-xl relative overflow-hidden"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/2 to-transparent dark:via-primary-dark/2" />

              {/* Timeline Content */}
              <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Timeline Points Container */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,
                    delay: shouldReduceMotion ? 0 : 0.4,
                  }}
                  className="w-full lg:w-[400px] relative"
                >
                  {/* Desktop Header Card */}
                  {!isMobile && (
                    <motion.div
                      className="bg-gradient-to-r from-primary/5 to-yellow-400/5 dark:from-primary-dark/5 dark:to-yellow-400/5 
                                backdrop-blur-sm rounded-xl p-4 mb-6 border border-primary/10 dark:border-primary-dark/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-yellow-400 dark:from-primary-dark dark:to-yellow-400 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary dark:text-text-primary-dark">
                            Professional Timeline
                          </h3>
                          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                            Click to explore details
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Timeline Container */}
                  <div className={`${isMobile ? "h-[90vh]" : "h-[70vh]"}`}>
                    <div
                      ref={timelineContainerRef}
                      className="h-full overflow-y-auto pr-2 scrollbar-hide"
                      style={{
                        scrollBehavior: shouldReduceMotion ? "auto" : "smooth",
                      }}
                    >
                      <div className="space-y-6 lg:space-y-8 pb-4">
                        {experiences.map(
                          (exp: ExperienceType, index: number) => (
                            <motion.div
                              key={exp.id}
                              data-timeline-index={index}
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: shouldReduceMotion ? 0 : 0.4,
                                delay: shouldReduceMotion
                                  ? 0
                                  : 0.5 + index * 0.1,
                              }}
                              className="relative"
                            >
                              <TimelinePoint
                                experience={exp}
                                isActive={index === activeIndex}
                                onClick={() => handleExperienceClick(index)}
                                isLast={index === experiences.length - 1}
                              />

                              {/* Mobile Inline Info */}
                              <AnimatePresence>
                                {activeIndex === index && (
                                  <div className="block lg:hidden mt-4">
                                    <motion.div
                                      initial={
                                        shouldReduceMotion
                                          ? {}
                                          : { opacity: 0, height: 0 }
                                      }
                                      animate={
                                        shouldReduceMotion
                                          ? {}
                                          : { opacity: 1, height: "auto" }
                                      }
                                      exit={
                                        shouldReduceMotion
                                          ? {}
                                          : { opacity: 0, height: 0 }
                                      }
                                      transition={{
                                        duration: shouldReduceMotion ? 0 : 0.3,
                                      }}
                                      className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                                             backdrop-blur-md rounded-xl p-4 border border-border-primary/30 
                                             dark:border-border-primary-dark/30 shadow-lg overflow-hidden"
                                    >
                                      <div className="space-y-4">
                                        <p className="text-sm text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                                          {exp.description}
                                        </p>

                                        {/* Mobile Technologies */}
                                        {exp.technologies &&
                                          exp.technologies.length > 0 && (
                                            <div>
                                              <div className="flex items-center gap-2 mb-3">
                                                <Code2 className="w-4 h-4 text-primary dark:text-primary-dark" />
                                                <h4 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
                                                  Technologies
                                                </h4>
                                              </div>
                                              <div className="flex flex-wrap gap-2">
                                                {exp.technologies
                                                  .slice(0, 6)
                                                  .map((tech) => (
                                                    <span
                                                      key={tech}
                                                      className="px-2 py-1 text-xs rounded-lg bg-primary/10 dark:bg-primary-dark/10 
                                                         text-primary dark:text-primary-dark border border-primary/20 dark:border-primary-dark/20"
                                                    >
                                                      {tech}
                                                    </span>
                                                  ))}
                                                {exp.technologies.length >
                                                  6 && (
                                                  <span
                                                    className="px-2 py-1 text-xs rounded-lg bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 
                                                             text-text-tertiary dark:text-text-tertiary-dark"
                                                  >
                                                    +
                                                    {exp.technologies.length -
                                                      6}{" "}
                                                    more
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          )}

                                        {/* Mobile Achievements */}
                                        {exp.achievements &&
                                          exp.achievements.length > 0 && (
                                            <div>
                                              <div className="flex items-center gap-2 mb-3">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <h4 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
                                                  Key Highlights
                                                </h4>
                                              </div>
                                              <ul className="space-y-2">
                                                {exp.achievements
                                                  .slice(0, 3)
                                                  .map((achievement, idx) => (
                                                    <li
                                                      key={idx}
                                                      className="flex items-start gap-2 text-sm text-text-secondary dark:text-text-secondary-dark"
                                                    >
                                                      <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-dark mt-2 shrink-0" />
                                                      <span>{achievement}</span>
                                                    </li>
                                                  ))}
                                                {exp.achievements.length >
                                                  3 && (
                                                  <li className="text-sm text-text-tertiary dark:text-text-tertiary-dark pl-3.5">
                                                    +
                                                    {exp.achievements.length -
                                                      3}{" "}
                                                    more achievements
                                                  </li>
                                                )}
                                              </ul>
                                            </div>
                                          )}
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

                {/* Desktop Experience Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,
                    delay: shouldReduceMotion ? 0 : 0.6,
                  }}
                  className="hidden lg:block flex-1"
                  ref={infoRef}
                >
                  {/* Info Header */}
                  <motion.div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-blue-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary dark:text-text-primary-dark">
                          Experience Details
                        </h3>
                        <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                          {activeIndex !== null
                            ? "Exploring details"
                            : "Select a milestone"}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {activeIndex !== null ? (
                      <motion.div
                        key={`info-${activeIndex}`}
                        initial={
                          shouldReduceMotion ? {} : { opacity: 0, y: 20 }
                        }
                        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                      >
                        <TimelineInfo
                          experience={experiences[activeIndex]}
                          isVisible={true}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={shouldReduceMotion ? {} : { opacity: 0 }}
                        animate={shouldReduceMotion ? {} : { opacity: 1 }}
                        exit={shouldReduceMotion ? {} : { opacity: 0 }}
                        className="flex items-center justify-center h-80 bg-gradient-to-br from-background-tertiary/10 to-background-tertiary/5 
                                 dark:from-background-tertiary-dark/10 dark:to-background-tertiary-dark/5 rounded-xl 
                                 border border-border-primary/10 dark:border-border-primary-dark/10"
                      >
                        <div className="text-center">
                          <Sparkles className="w-12 h-12 text-primary/40 dark:text-primary-dark/40 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                            Ready to Explore
                          </h3>
                          <p className="text-text-tertiary dark:text-text-tertiary-dark max-w-sm">
                            Click on any timeline item to see detailed
                            information about that experience.
                          </p>
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

      {/* Resume Export */}
      {isExperienceVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.8 }}
        >
          <ResumeExport
            onExport={(format) => {
              console.log("Exporting in format:", format);
            }}
          />
        </motion.div>
      )}
    </section>
  );
};

export default Experience;
