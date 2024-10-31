import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Planet from './components/Planet';
import ProjectPreview from './components/ProjectPreview';
import ConnectingLine from './components/ConnectingLine';
import MovingStars from '@/components/ui/animations/Movingstars';
import { useProjectTransition } from '@/hooks/projects/useProjectTransition';
import { useProjectSizes } from '@/hooks/common/useMediaQuery';
import { projects } from '@/data/projects';

const Projects: React.FC = () => {
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

  return (
    <section className="relative min-h-screen w-full bg-background-primary dark:bg-[#1a0836] overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0">
        {/* Stars Animation */}
        <MovingStars />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent 
                      via-background-primary/50 to-background-primary 
                      dark:via-[#1a0836]/50 dark:to-[#1a0836]" />
      </div>

      {/* Content Container */}
      <div className="relative w-full h-screen flex flex-col justify-between py-16 sm:py-20 md:py-16 lg:py-24">
        <div className="w-full relative z-10">
          {/* Section Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-primary-dark">
              My <span className="text-primary dark:text-primary-dark">Projects</span>
            </h2>
            <p className="mt-4 text-text-secondary dark:text-text-secondary-dark text-base sm:text-lg">
              Explore my latest projects and creative works
            </p>
          </div>

          {/* Project Preview Section */}
          <div className="w-full px-4 sm:px-6 lg:px-8 mb-20">
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                {projects.map((project, index) => (
                  index === activeIndex && (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full max-w-[500px] px-4 sm:px-0"
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
            </div>
          </div>

          {/* Planets Navigation Section */}
          <div className="mt-auto">
            <div 
              className="relative mx-auto overflow-visible" 
              style={{ width: `${planetSize * 3 + spacing * 2}px` }}
            >
              {/* Sliding Planets Container */}
              <motion.div 
                className="absolute flex items-center"
                style={{ left: `${planetSize + spacing}px` }}
                animate={{ x: -activeIndex * (planetSize + spacing) }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 28,
                  mass: 1.2
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
                    {/* Planet */}
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

          {/* Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
        </div>
      </div>
    </section>
  );
};

export default Projects;