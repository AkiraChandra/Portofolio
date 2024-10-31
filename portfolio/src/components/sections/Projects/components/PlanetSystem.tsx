// PlanetSystem.tsx
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
    <div className="relative w-full min-h-[600px] lg:min-h-[800px]">
      {/* Preview Card Container */}
      <div className="absolute top-0 left-0 w-full">
        <AnimatePresence mode="wait">
          {projects.map((project, index) => (
            index === activeIndex && (
              <ProjectPreview
                key={project.id}
                project={project}
                isVisible={!isTransitioning}
                onTransitionEnd={handleTransitionEnd}
              />
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Planets Container */}
      <div className="relative flex justify-center items-center mt-32 lg:mt-64">
        <div className="flex space-x-8 lg:space-x-16">
          {projects.map((project, index) => (
            <React.Fragment key={project.id}>
              <Planet
                project={project}
                isActive={index === activeIndex}
                index={index}
                totalPlanets={projects.length}
              />
              {index < projects.length - 1 && (
                <ProgressLine
                  startIndex={index}
                  endIndex={index + 1}
                  progress={index === activeIndex ? progress : index < activeIndex ? 100 : 0}
                  isActive={index === activeIndex}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanetSystem;