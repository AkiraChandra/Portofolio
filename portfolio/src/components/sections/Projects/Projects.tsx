"use client";

import React, { useState, useRef, useEffect } from "react";
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

const Projects = () => {
  const { projects, loading, error, refetch } = useProjects();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const {
    activeIndex,
    progress,
    isLineAnimating,
    isPaused,
    jumpToProject,
    pausePreview,
    resumePreview,
  } = useProjectTransition({
    totalProjects: projects?.length || 0,
    previewDuration: 6000,
    lineDuration: 1000,
  });

  const { planetSize, spacing } = useProjectSizes();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const containerRef = useRef(null);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handlePlanetClick = (projectId: string) => {
    if (isNavigating) return;

    setIsNavigating(true);
    setIsTransitioning(true);
    setSelectedPlanetId(projectId);

    setTimeout(() => {
      window.location.href = `/project/${projectId}`;
    }, 2000);
  };

  // Enhanced drag handlers for planet navigation
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);

    if (isMobile) {
      const swipe = info.offset.x;
      const velocity = info.velocity.x;
      const moveThreshold = 50;

      if ((swipe < -moveThreshold && velocity < 0) || velocity < -500) {
        if (activeIndex < projects.length - 1) {
          jumpToProject(activeIndex + 1);
        }
      } else if ((swipe > moveThreshold && velocity > 0) || velocity > 500) {
        if (activeIndex > 0) {
          jumpToProject(activeIndex - 1);
        }
      }
    }
  };

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

  return (
    <section className="relative min-h-screen w-full bg-background-primary dark:bg-background-primary-dark overflow-x-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent dark:via-black/70 dark:to-black z-1" />

      {/* Background with better overflow control */}
      <div className="absolute inset-0 overflow-hidden">
        <MovingStars />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />
      <AnimatePresence mode="wait">
        {/* Main Content */}
        <div className="relative w-full min-h-screen flex flex-col pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-8 sm:pb-12 md:pb-16">
          {/* Header Section */}
          <div className="w-full relative z-10">
            <div className="text-center mb-8 sm:mb-10 md:mb-6 2xl:mb-14 px-4 sm:px-6 lg:px-8">
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-primary-dark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                My{" "}
                <span className="text-primary dark:text-primary-dark">
                  Projects
                </span>
              </motion.h2>
              <motion.p
                className="mt-2 sm:mt-3 md:mt-3 text-text-secondary dark:text-text-secondary-dark text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Explore my latest projects and creative works
              </motion.p>
            </div>

            {/* Project Preview */}
            <div className="w-full px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
              <motion.div
                className="flex justify-center"
                drag={isMobile ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                dragElastic={1.6}
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
                          transition={{ duration: 0.3 }}
                          className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 max-w-lg mx-auto px-2 sm:px-4"
                        >
                          <ProjectPreview
                            project={project}
                            isVisible={true}
                            containerWidth={500}
                          />
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            <div className="w-full flex justify-center mb-12 sm:mb-6 2xl:mb-8">
              <motion.div
                className="flex justify-between items-center w-[280px] sm:w-[320px] bg-background-primary/80 dark:bg-[#1a0836]/80 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button
                  onClick={() =>
                    activeIndex > 0 && jumpToProject(activeIndex - 1)
                  }
                  className={`p-1.5 sm:p-2 text-base sm:text-lg text-primary dark:text-primary-dark 
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

                {/* Non-draggable dots navigation */}
                <div className="flex items-center gap-1.5">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => jumpToProject(index)}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 
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
                  className={`p-1.5 sm:p-2 text-base sm:text-lg text-primary dark:text-primary-dark 
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

            {/* Planets Navigation */}
            <div className="flex justify-center">
              <div
                ref={containerRef}
                className="relative flex justify-center"
                style={{
                  width: `${planetSize * 3}px`,
                }}
              >
                {/* Motion div untuk planets */}
                <motion.div
                  className="absolute flex items-center cursor-grab active:cursor-grabbing"
                  style={{
                    left: `${planetSize}px`,
                  }}
                  drag={isMobile ? "x" : false}
                  dragConstraints={{
                    left: -((projects.length - 1) * (planetSize + spacing)),
                    right: 0,
                  }}
                  dragElastic={0.1}
                  dragMomentum={false}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  animate={{
                    x: -activeIndex * (planetSize + spacing),
                    transition: {
                      type: "spring",
                      stiffness: 150,
                      damping: 28,
                      mass: 1.2,
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
                        transition={{ duration: 0.5 }}
                      >
                        {/* Planet component */}
                        <Planet
                          project={project}
                          isActive={index === activeIndex}
                          index={index}
                          totalPlanets={projects.length}
                          size={planetSize}
                          onHoverStart={() => {
                            if (!isTransitioning && index !== activeIndex) {
                              pausePreview();
                              jumpToProject(index);
                            }
                          }}
                          onHoverEnd={() => !isTransitioning && resumePreview()}
                          isTransitioning={isTransitioning}
                          isSelected={project.id === selectedPlanetId}
                          onPlanetClick={() => handlePlanetClick(project.id)}
                        />

                        {/* Connecting line */}
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
    </section>
  );
};

export default Projects;
