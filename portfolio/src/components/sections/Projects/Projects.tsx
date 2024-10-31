// src/components/sections/Projects/Projects.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Planet from "./components/Planet";
import ProjectPreview from "./components/ProjectPreview";
import ConnectingLine from "./components/ConnectingLine";
import MovingStars from "@/components/ui/animations/Movingstars";
import { useProjectTransition } from "@/hooks/projects/useProjectTransition";
import { useProjectSizes } from "@/hooks/common/useMediaQuery";
import { projects } from "@/data/projects";

const Projects: React.FC = () => {
  const {
    activeIndex,
    progress,
    isLineAnimating,
    isPaused,
    jumpToProject,
    pausePreview,
    resumePreview,
  } = useProjectTransition({
    totalProjects: projects.length,
    previewDuration: 6000,
    lineDuration: 1000,
  });

  const { planetSize, spacing } = useProjectSizes();

  return (
    <section
      className="relative min-h-screen w-full bg-background-primary dark:bg-[#1a0836] overflow-hidden"
      aria-label="Projects Section"
    >
      {/* Background Layer */}
      <div className="absolute inset-0">
        <MovingStars />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent 
                      via-background-primary/50 to-background-primary 
                      dark:via-[#1a0836]/50 dark:to-[#1a0836]"
        />
      </div>

      {/* Content Container */}
      <div className="relative w-full h-screen flex flex-col justify-center items-center">
        <div className="w-full max-w-[1440px] relative z-10 px-4 md:px-6 lg:px-8">
          {/* Project Preview Layer */}
          <div className="absolute w-full left-0 -top-40 sm:-top-32 lg:-top-24">
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                {projects.map(
                  (project, index) =>
                    index === activeIndex && (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.23, 1, 0.32, 1], // Custom easing
                        }}
                        className="w-full max-w-[500px] px-4 sm:px-0 relative"
                      >
                        {/* Glow Effect behind preview */}
                        <div
                          className="absolute inset-0 blur-2xl opacity-20 bg-primary/20 dark:bg-primary-dark/20"
                          style={{
                            transform: "translateY(-10%) scale(0.95)",
                          }}
                        />
                        <ProjectPreview
                          project={project}
                          isVisible={true}
                          containerWidth={500}
                        />
                      </motion.div>
                    )
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Planets Showcase Layer - Adjusted position */}
          <div className="mt-72 relative">
            {" "}
            {/* Adjusted from mt-96 to mt-72 */}
            <div
              className="relative mx-auto overflow-visible"
              style={{ width: `${planetSize * 3 + spacing * 2}px` }}
            >
              {/* Sliding Track */}
              <motion.div
                className="absolute flex items-center"
                style={{
                  left: `${planetSize + spacing}px`,
                }}
                animate={{
                  x: -activeIndex * (planetSize + spacing),
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 28,
                  mass: 1.2,
                }}
              >
                {/* Planet Items */}
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="relative flex items-center"
                    style={{
                      width: planetSize,
                      flexShrink: 0,
                      marginRight: index < projects.length - 1 ? spacing : 0,
                    }}
                  >
                    {/* Individual Planet */}
                    <div className="relative group">
                      {/* Interactive Area */}
                      <div
                        className="absolute inset-0 rounded-full cursor-pointer
                                 transition-transform duration-300 group-hover:scale-105"
                        onClick={() => {
                          if (index !== activeIndex) {
                            pausePreview();
                            jumpToProject(index);
                          }
                        }}
                        onMouseEnter={() => {
                          if (index !== activeIndex) {
                            pausePreview();
                          }
                        }}
                        onMouseLeave={resumePreview}
                      />

                      {/* Planet Renderer */}
                      <Planet
                        project={project}
                        isActive={index === activeIndex}
                        index={index}
                        totalPlanets={projects.length}
                        size={planetSize}
                        onHoverStart={() => {}}
                        onHoverEnd={() => {}}
                      />
                    </div>

                    {/* Connecting Line */}
                    {index < projects.length - 1 && (
                      <div
                        className="absolute left-full top-1/2 -translate-y-1/2"
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

          {/* Navigation Controls */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => jumpToProject(index)}
                aria-label={`View project ${index + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 
                           transform hover:scale-125 focus:outline-none focus:ring-2
                           focus:ring-primary/50 dark:focus:ring-primary-dark/50
                           ${
                             index === activeIndex
                               ? "bg-primary dark:bg-primary-dark scale-125"
                               : "bg-gray-400/20 hover:bg-gray-400/40"
                           }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
