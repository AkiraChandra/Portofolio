import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import Planet from './components/Planet';
import ProjectPreview from './components/ProjectPreview';
import ConnectingLine from './components/ConnectingLine';
import MovingStars from '@/components/ui/animations/Movingstars';
import { useProjectTransition } from '@/hooks/projects/useProjectTransition';
import { useProjectSizes } from '@/hooks/common/useMediaQuery';
import { projects } from '@/data/projects';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';

const Projects = () => {
  const {
    activeIndex,
    progress,
    isLineAnimating,
    isPaused,
    jumpToProject,
    pausePreview,
    resumePreview
  } = useProjectTransition({
    totalProjects: projects.length,
    previewDuration: 6000,
    lineDuration: 1000
  });

  const { planetSize, spacing } = useProjectSizes();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const containerRef = useRef(null);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (_: never, info: PanInfo) => {
    setIsDragging(true);
    setDragStart(info.point.x);
  };

  const handleDragEnd = (_: never, info: PanInfo) => {
    setIsDragging(false);
    const dragDistance = info.point.x - dragStart;
    const dragThreshold = 50; // Minimum distance to trigger page change

    if (Math.abs(dragDistance) > dragThreshold) {
      if (dragDistance > 0 && activeIndex > 0) {
        // Dragged right - go to previous
        jumpToProject(activeIndex - 1);
      } else if (dragDistance < 0 && activeIndex < projects.length - 1) {
        // Dragged left - go to next
        jumpToProject(activeIndex + 1);
      }
    }
  };

  return (
    <section className="relative min-h-screen w-full bg-background-primary dark:bg-[#1a0836] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <MovingStars />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent 
                      via-background-primary/50 to-background-primary 
                      dark:via-[#1a0836]/50 dark:to-[#1a0836]" />
      </div>

      {/* Content Container */}
      <div className="relative w-full h-screen flex flex-col justify-between mt-20 sm:mt-0 sm:py-8 md:py-8 lg:py-10">
        <div className="w-full relative z-10">
          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-12 px-4 sm:px-6 lg:px-0">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-text-primary dark:text-text-primary-dark">
              My <span className="text-primary dark:text-primary-dark">Projects</span>
            </h2>
            <p className="mt-2 sm:mt-4 text-text-secondary dark:text-text-secondary-dark text-sm sm:text-base lg:text-lg px-4 sm:px-0">
              Explore my latest projects and creative works
            </p>
          </div>

          {/* Project Preview Section */}
          <div className="w-full px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
            <motion.div 
              className="flex justify-center"
              drag={isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              dragElastic={0.2}
            >
              <AnimatePresence mode="wait">
                {projects.map((project, index) => (
                  index === activeIndex && (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: isDragging ? 0 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isDragging ? 0 : -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full max-w-[320px] sm:max-w-[440px] lg:max-w-[500px] mx-auto px-2 sm:px-4 lg:px-0"
                    >
                      <ProjectPreview
                        project={project}
                        isVisible={true}
                        containerWidth={500}
                      />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Planets Navigation Section */}
          <div className="mt-auto pb-12 sm:pb-16 lg:pb-0 overflow-visible">
            <div 
              ref={containerRef}
              className="relative mx-auto overflow-visible" 
              style={{ width: `${planetSize * 3 + spacing * 2}px` }}
            >
              {/* Sliding Planets Container */}
              <motion.div 
                className="absolute flex items-center"
                style={{ left: `${planetSize + spacing}px` }}
                animate={{ 
                  x: -activeIndex * (planetSize + spacing),
                  transition: {
                    type: "spring",
                    stiffness: 150,
                    damping: 28,
                    mass: 1.2
                  }
                }}
              >
                {/* Planet Items */}
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="relative flex items-center w-full sm:w-auto px-4 sm:px-0"
                    style={{
                      width: planetSize,
                      flexShrink: 0,
                      marginRight: index < projects.length - 1 ? spacing : 0,
                    }}
                  >
                    <Planet
                      project={project}
                      isActive={index === activeIndex}
                      index={index}
                      totalPlanets={projects.length}
                      size={planetSize}
                      onHoverStart={() => {
                        if (index !== activeIndex) {
                          pausePreview();
                          jumpToProject(index);
                        }
                      }}
                      onHoverEnd={resumePreview}
                    />

                    {/* Connecting Lines - Now visible on mobile */}
                    {index < projects.length - 1 && (
                      <div 
                        className="absolute left-full top-1/2 -translate-y-1/2 block"
                        style={{ width: spacing }}
                      >
                        <ConnectingLine
                          progress={
                            index === activeIndex && isLineAnimating
                              ? progress
                              : index < activeIndex
                              ? 100
                              : 0
                          }
                          isActive={index === activeIndex && isLineAnimating}
                          width={spacing}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Navigation Dots and Arrows */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="flex justify-between items-center max-w-[320px] sm:max-w-[440px] lg:max-w-[500px] mx-auto">
              {/* Previous Arrow */}
              <button
                onClick={() => activeIndex > 0 && jumpToProject(activeIndex - 1)}
                className={`p-2 text-primary dark:text-primary-dark transition-opacity ${
                  activeIndex === 0 ? 'opacity-30' : 'opacity-100'
                }`}
                disabled={activeIndex === 0}
              >
                ←
              </button>

              {/* Dots */}
              <div className="flex space-x-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => jumpToProject(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 
                              ${index === activeIndex 
                                ? 'bg-primary dark:bg-primary-dark' 
                                : 'bg-gray-400/20'}`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>

              {/* Next Arrow */}
              <button
                onClick={() => 
                  activeIndex < projects.length - 1 && jumpToProject(activeIndex + 1)
                }
                className={`p-2 text-primary dark:text-primary-dark transition-opacity ${
                  activeIndex === projects.length - 1 ? 'opacity-30' : 'opacity-100'
                }`}
                disabled={activeIndex === projects.length - 1}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;