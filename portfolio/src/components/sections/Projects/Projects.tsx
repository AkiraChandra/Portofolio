// src/components/sections/Projects/Projects.tsx (MOBILE OPTIMIZED)
"use client";

import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Planet from "./components/Planet";
import ProjectPreview from "./components/ProjectPreview";
import ConnectingLine from "./components/ConnectingLine";
import MovingStars from "@/components/ui/animations/Movingstars";
import { useProjectTransition } from "@/hooks/projects/useProjectTransition";
import { useProjectSizes } from "@/hooks/common/useMediaQuery";
import { useProjects } from "@/hooks/projects/useProjects";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";
import { Loader } from "lucide-react";
import { debounce } from "@/utils/helpers/debounce";
import { useProjectsActivity } from "@/hooks/common/useSectionActivity"; // ✅ IMPORT REUSABLE

const Projects = memo(() => {
  const { isActive } = useProjectsActivity({
    onActiveChange: (isActive) => {
      if (isActive) {
        console.log("🚀 Projects animations resumed");
      } else {
        console.log("🚀 Projects animations paused");
      }
    },
  });
  const { projects, loading, error, refetch } = useProjects();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);

  // Mobile detection
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  const {
    activeIndex,
    progress,
    isLineAnimating,
    jumpToProject,
    pausePreview,
    resumePreview
  } = useProjectTransition({
    totalProjects: projects?.length || 0,
    previewDuration: isMobile ? 4000 : 6000, // Faster transitions on mobile
    lineDuration: isMobile ? 800 : 1000,
    isActive
  });

  const { planetSize, spacing } = useProjectSizes();
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastHoverTime, setLastHoverTime] = useState(0);
  const size = useProjectSizes();
  const is2xl = useMediaQuery("(min-width: 1536px)");

  // Mobile-optimized hover handler
  const handlePlanetHover = debounce(
    (index) => {
      // Disable hover on mobile for performance
      if (!isActive) return; // Prevent hover if not active
      if (isMobile) return;

      const currentTime = Date.now();
      const timeSinceLastHover = currentTime - lastHoverTime;
      const minTimeBetweenHovers = 300;

      if (timeSinceLastHover >= minTimeBetweenHovers) {
        if (!isTransitioning && index !== activeIndex) {
          setLastHoverTime(currentTime);
          pausePreview();
          jumpToProject(index);
        }
      }
    },
    isMobile ? 200 : 100
  );

  const handlePlanetClick = (projectId: string) => {
    if (!isActive) return; // Prevent navigation if not active
    if (isNavigating) return;

    setIsNavigating(true);
    setIsTransitioning(true);
    setSelectedPlanetId(projectId);

    // Faster transition on mobile
    setTimeout(
      () => {
        window.location.href = `/project/${projectId}`;
      },
      isMobile ? 1500 : 2000
    );
  };

  // Enhanced drag handlers for mobile
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    if (!isActive) return; // Prevent navigation if not active
    if (isMobile) {
      const swipe = info.offset.x;
      const velocity = info.velocity.x;
      const moveThreshold = 30; // Lower threshold for mobile

      if ((swipe < -moveThreshold && velocity < 0) || velocity < -300) {
        if (activeIndex < projects.length - 1) {
          jumpToProject(activeIndex + 1);
        }
      } else if ((swipe > moveThreshold && velocity > 0) || velocity > 300) {
        if (activeIndex > 0) {
          jumpToProject(activeIndex - 1);
        }
      }
    }
  };

  useEffect(() => {
    if (!isActive) {
      pausePreview();
    } else {
      resumePreview();
    }
  }, [isActive, pausePreview, resumePreview]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsTransitioning(false);
      setSelectedPlanetId(null);
      setIsNavigating(false);
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="relative min-h-screen w-full bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-primary dark:text-primary-dark" />
          <p className="text-text-primary dark:text-text-primary-dark">
            Loading projects...
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative min-h-screen w-full bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500 dark:text-red-400">
            Failed to load projects
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-primary dark:bg-primary-dark rounded-lg text-background-primary"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // No projects state
  if (!projects?.length) {
    return (
      <section className="relative min-h-screen w-full bg-background-primary dark:bg-background-primary-dark flex items-center justify-center">
        <p className="text-text-primary dark:text-text-primary-dark">
          No projects available.
        </p>
      </section>
    );
  }

  // Mobile-specific spacing and sizing
  const getMobileSpacing = () => {
    if (isMobile) {
      return {
        containerPaddingTop: 80,
        headerMarginBottom: 20,
        sectionPadding: "pt-12 pb-6",
        previewMargin: "mb-3 mt-6",
      };
    }
    if (isTablet) {
      return {
        containerPaddingTop: 80,
        headerMarginBottom: 20,
        sectionPadding: "pt-16 pb-8",
        previewMargin: "mb-4 mt-20",
      };
    }
    return {
      containerPaddingTop: size.containerPaddingTop,
      headerMarginBottom: size.headerMarginBottom,
      sectionPadding: "pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-8 sm:pb-12 md:pb-16",
      previewMargin: "mb-4 sm:mb-6",
    };
  };

  const mobileSpacing = getMobileSpacing();

  return (
    <section className="relative min-h-screen w-full bg-background-primary dark:bg-background-primary-dark overflow-x-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent dark:via-black/70 dark:to-black z-1" />

      {/* Background with better overflow control */}
      <div className="absolute inset-0 overflow-hidden">
        {isActive && <MovingStars isActive={isActive} />}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />

      {
        <AnimatePresence mode="wait">
          {/* Main Content */}
          <div
            className={`relative w-full min-h-screen flex flex-col ${mobileSpacing.sectionPadding}`}
            style={{
              ...(is2xl &&
                !isMobile && { paddingTop: `${size.containerPaddingTop}px` }),
            }}
          >
            {/* Header Section - Mobile optimized */}
            <div className="w-full relative z-10">
              <div
                className={`text-center ${
                  isMobile
                    ? "mb-4 px-4"
                    : isTablet
                    ? "mb-6 px-6"
                    : "mb-8 sm:mb-10 md:mb-6 px-4 sm:px-6 lg:px-8"
                }`}
                style={{
                  ...(is2xl &&
                    !isMobile && {
                      marginBottom: `${size.headerMarginBottom}px`,
                    }),
                }}
              >
                <motion.h2
                  className={`font-bold text-text-primary dark:text-text-primary-dark ${
                    isMobile
                      ? "text-3xl"
                      : isTablet
                      ? "text-4xl"
                      : "text-3xl sm:text-4xl md:text-5xl"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: isMobile ? 0.4 : 0.6 }}
                >
                  My{" "}
                  <span className="text-primary dark:text-primary-dark">
                    Projects
                  </span>
                </motion.h2>
                <motion.p
                  className={`text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto ${
                    isMobile
                      ? "mt-1 text-sm"
                      : isTablet
                      ? "mt-2 text-base"
                      : "mt-2 sm:mt-3 md:mt-3 text-sm sm:text-base md:text-lg"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: isMobile ? 0.4 : 0.6, delay: 0.2 }}
                >
                  Explore my latest projects and creative works
                </motion.p>
              </div>

              {/* Project Preview - Mobile optimized */}
              <div
                className={`w-full ${
                  isMobile ? "px-3" : isTablet ? "px-4" : "px-4 sm:px-6 lg:px-8"
                } ${mobileSpacing.previewMargin}`}
              >
                <motion.div
                  className="flex justify-center"
                  drag={isMobile ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  dragElastic={isMobile ? 0.1 : 1.6} // Less elastic on mobile
                >
                  <AnimatePresence mode="wait">
                    {projects.map(
                      (project, index) =>
                        index === activeIndex && (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, x: isDragging ? 0 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isDragging ? 0 : -20 }}
                            transition={{ duration: isMobile ? 0.2 : 0.25 }}
                            className={`mx-auto ${
                              isMobile
                                ? "w-full px-1"
                                : isTablet
                                ? "w-11/12 px-2"
                                : "w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 max-w-lg px-2 sm:px-4"
                            }`}
                          >
                            <ProjectPreview
                              project={project}
                              isVisible={isActive}
                            />
                          </motion.div>
                        )
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Navigation Controls - Mobile optimized */}
              <div
                className={`w-full flex justify-center ${
                  isMobile
                    ? "mb-4"
                    : isTablet
                    ? "mb-8"
                    : "mb-12 sm:mb-6 2xl:mb-8"
                }`}
              >
                <motion.div
                  className={`flex justify-between items-center bg-background-primary/80 dark:bg-[#1a0836]/80 backdrop-blur-sm rounded-full ${
                    isMobile
                      ? "w-[240px] px-2 py-1"
                      : isTablet
                      ? "w-[280px] px-2.5 py-1.5"
                      : "w-[280px] sm:w-[320px] px-2 py-1 sm:px-3 sm:py-1.5"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: isMobile ? 0.4 : 0.6, delay: 0.4 }}
                >
                  <button
                    onClick={() =>
                      activeIndex > 0 && jumpToProject(activeIndex - 1)
                    }
                    className={`${
                      isMobile
                        ? "p-1.5 text-base"
                        : "p-1.5 sm:p-2 text-base sm:text-lg"
                    } text-primary dark:text-primary-dark 
                 transition-all hover:scale-110 focus:outline-none focus:ring-2 
                 focus:ring-primary/50 rounded-full ${
                   activeIndex === 0
                     ? "opacity-30 cursor-not-allowed"
                     : "opacity-100"
                 }`}
                    disabled={activeIndex === 0}
                    aria-label="Previous project"
                  >
                    ←
                  </button>

                  {/* Dots navigation */}
                  <div
                    className={`flex items-center ${
                      isMobile ? "gap-1" : "gap-1.5"
                    }`}
                  >
                    {projects.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => jumpToProject(index)}
                        className={`${
                          isMobile ? "w-1.5 h-1.5" : "w-1.5 h-1.5 sm:w-2 sm:h-2"
                        } rounded-full transition-all duration-200 
                    hover:scale-110 focus:outline-none focus:ring-1 focus:ring-primary/50 
                    ${
                      index === activeIndex
                        ? "bg-primary dark:bg-primary-dark scale-110"
                        : "bg-gray-400/20 hover:bg-gray-400/40"
                    }`}
                        aria-label={`Go to project ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      activeIndex < projects.length - 1 &&
                      jumpToProject(activeIndex + 1)
                    }
                    className={`${
                      isMobile
                        ? "p-1.5 text-base"
                        : "p-1.5 sm:p-2 text-base sm:text-lg"
                    } text-primary dark:text-primary-dark 
                 transition-all hover:scale-110 focus:outline-none focus:ring-2 
                 focus:ring-primary/50 rounded-full ${
                   activeIndex === projects.length - 1
                     ? "opacity-30 cursor-not-allowed"
                     : "opacity-100"
                 }`}
                    disabled={activeIndex === projects.length - 1}
                    aria-label="Next project"
                  >
                    →
                  </button>
                </motion.div>
              </div>

              {/* Planets Navigation - Mobile optimized */}
              <div className="flex justify-center">
                <div
                  ref={containerRef}
                  className="relative flex justify-center"
                  style={{
                    width: `${planetSize * (isMobile ? 2.5 : 3)}px`, // Smaller container on mobile
                  }}
                >
                  <motion.div
                    className="absolute flex items-center cursor-grab active:cursor-grabbing"
                    style={{
                      left: `${planetSize * (isMobile ? 0.75 : 1)}px`,
                    }}
                    drag={isMobile ? "x" : false}
                    dragConstraints={{
                      left: -((projects.length - 1) * (planetSize + spacing)),
                      right: 0,
                    }}
                    dragElastic={isMobile ? 0.05 : 0.1} // Less elastic on mobile
                    dragMomentum={false}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    animate={{
                      x: -activeIndex * (planetSize + spacing),
                      transition: {
                        type: "spring",
                        stiffness: isMobile ? 200 : 150, // Snappier on mobile
                        damping: isMobile ? 30 : 28,
                        mass: isMobile ? 1 : 1.2,
                      },
                    }}
                  >
                    <AnimatePresence>
                      {projects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          className="relative flex items-center shrink-0"
                          style={{
                            width: planetSize,
                            marginRight:
                              index < projects.length - 1 ? spacing : 0,
                          }}
                          initial={{ opacity: 1 }}
                          animate={{
                            opacity: selectedPlanetId
                              ? project.id === selectedPlanetId
                                ? 1
                                : 0
                              : 1,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: isMobile ? 0.3 : 0.5 }}
                        >
                          {/* Planet component */}
                          <Planet
                            project={project}
                            isActive={index === activeIndex && isActive}
                            sectionActive={isActive} // ✅ ADD: Pass section activity status
                            index={index}
                            totalPlanets={projects.length}
                            size={planetSize}
                            onHoverStart={() => handlePlanetHover(index)}
                            onHoverEnd={() =>
                              !isTransitioning && resumePreview()
                            }
                            isTransitioning={isTransitioning}
                            isSelected={project.id === selectedPlanetId}
                            onPlanetClick={() => handlePlanetClick(project.id)}
                          />

                          {/* Connecting line - simplified on mobile */}
                          {index < projects.length - 1 && !selectedPlanetId && (
                            <motion.div
                              className="absolute left-full top-1/2 -translate-y-1/2 block"
                              style={{ width: spacing }}
                              initial={{ opacity: 1 }}
                              animate={{ opacity: selectedPlanetId ? 0 : 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ConnectingLine
                                progress={
                                  index === activeIndex && isLineAnimating
                                    ? progress
                                    : index < activeIndex
                                    ? 100
                                    : 0
                                }
                                isActive={
                                  index === activeIndex && isLineAnimating
                                }
                                width={spacing}
                              />
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </AnimatePresence>
      }
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-16 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
          Projects: {isActive ? "🟢 ACTIVE" : "🔴 SUSPENDED"}
        </div>
      )}
    </section>
  );
});

Projects.displayName = "Projects";

export default Projects;
