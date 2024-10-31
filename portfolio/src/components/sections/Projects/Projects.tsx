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
    isTransitioning,
    isPaused,
    setActiveIndex,
    pauseAutoPlay,
    resumeAutoPlay,
    handleTransitionEnd
  } = useProjectTransition({
    totalProjects: projects.length,
    autoPlayInterval: 5000,
    progressDuration: 5000
  });

  const { planetSize, spacing, previewWidth } = useProjectSizes();

  return (
    <section className="relative min-h-screen w-full bg-background-primary dark:bg-[#1a0836] overflow-hidden">
      {/* Background with Stars */}
      <div className="absolute inset-0">
        <MovingStars />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent 
                      via-background-primary/50 to-background-primary 
                      dark:via-[#1a0836]/50 dark:to-[#1a0836]" />
      </div>

      {/* Main Content */}
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="w-full px-4 relative z-10">
          {/* Projects Row */}
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-32 lg:space-x-48">
              {projects.map((project, index) => (
                <div key={project.id} className="relative">
                  {/* Preview Container */}
                  <AnimatePresence mode="wait">
                    {index === activeIndex && (
                      <ProjectPreview
                        project={project}
                        isVisible={!isTransitioning}
                        containerWidth={previewWidth}
                        onTransitionEnd={handleTransitionEnd}
                      />
                    )}
                  </AnimatePresence>

                  {/* Planet */}
                  <Planet
                    project={project}
                    isActive={index === activeIndex}
                    index={index}
                    totalPlanets={projects.length}
                    size={planetSize}
                    onHoverStart={() => {
                      setActiveIndex(index);
                      pauseAutoPlay();
                    }}
                    onHoverEnd={resumeAutoPlay}
                  />

                  {/* Project Name */}
                  <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 text-center">
                    <span className="text-lg font-medium text-white">
                      {project.name}
                    </span>
                  </div>

                  {/* Connecting Line */}
                  {index < projects.length - 1 && (
                    <div className="absolute top-1/2 left-full transform -translate-y-1/2">
                      <ConnectingLine
                        progress={index === activeIndex ? progress : index < activeIndex ? 100 : 0}
                        isActive={index === activeIndex}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;