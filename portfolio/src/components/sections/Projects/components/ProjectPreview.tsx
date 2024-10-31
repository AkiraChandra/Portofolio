import React from 'react';
import { motion } from 'framer-motion';
import { ProjectPreviewProps } from '@/types/projects';
import { ExternalLink, Github } from 'lucide-react';

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  project,
  isVisible,
  onTransitionEnd
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => {
        if (!isVisible) onTransitionEnd?.();
      }}
      className="w-full"
    >
      <div className="backdrop-blur-md bg-background-secondary/30 dark:bg-background-secondary-dark/30 
                    rounded-lg p-3 shadow-lg border border-border-primary/10 dark:border-border-primary-dark/10">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
            {project.previewContent.title}
          </h3>

          <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
            {project.previewContent.description}
          </p>

          <div className="flex flex-wrap gap-1">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-1.5 py-0.5 text-[10px] rounded-full bg-primary/10 dark:bg-primary-dark/10 
                         text-primary dark:text-primary-dark"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex space-x-3 pt-1">
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-text-primary dark:text-text-primary-dark 
                         hover:text-primary dark:hover:text-primary-dark transition-colors"
              >
                <ExternalLink size={12} />
                <span>Live Demo</span>
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-text-primary dark:text-text-primary-dark 
                         hover:text-primary dark:hover:text-primary-dark transition-colors"
              >
                <Github size={12} />
                <span>View Code</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectPreview;