// src/components/sections/Projects/components/PlanetSystem.tsx
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
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Preview Card Container - Positioned above planets */}
      <div className="absolute top-0 left-0 right-0 mb-16">
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

      {/* Planets Container - Centered horizontally */}
      <div className="relative mt-[400px] flex justify-center items-center">
        <div className="flex space-x-16 lg:space-x-24">
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