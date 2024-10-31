import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Planet from './Planet';
import ProjectPreview from './ProjectPreview';
import ProgressLine from './ProgressLine';
import { Project } from '@/types/projects';
import { useProjectTransition } from '@/hooks/projects/useProjectTrnsition';

interface PlanetSystemProps {
  projects: Project[];
}

const PlanetSystem: React.FC<PlanetSystemProps> = ({ projects }) => {
  const { 
    activeIndex,
    progress,
    isTransitioning,
    handleTransitionEnd
  } = useProjectTransition(projects.length);

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[600px] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Planets Container */}
        <div className="flex items-center">
          {projects.map((project, index) => (
            <React.Fragment key={project.id}>
              <div className="relative flex items-center">
                <div className="relative flex flex-col items-center">
                  {/* Preview Container */}
                  <AnimatePresence mode="wait">
                    {index === activeIndex && (
                      <div className="absolute bottom-full mb-4 w-[300px] -translate-x-1/2 left-1/2">
                        <ProjectPreview
                          key={project.id}
                          project={project}
                          isVisible={!isTransitioning}
                          onTransitionEnd={handleTransitionEnd}
                        />
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Planet */}
                  <div className="relative">
                    <Planet
                      project={project}
                      isActive={index === activeIndex}
                      index={index}
                      totalPlanets={projects.length}
                    />

                    {/* Project Name */}
                    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-center">
                      <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                        {project.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Line */}
                {index < projects.length - 1 && (
                  <div className="w-32 mx-16"> {/* Adjusted spacing */}
                    <ProgressLine
                      startIndex={index}
                      endIndex={index + 1}
                      progress={index === activeIndex ? progress : index < activeIndex ? 100 : 0}
                      isActive={index === activeIndex}
                    />
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanetSystem;