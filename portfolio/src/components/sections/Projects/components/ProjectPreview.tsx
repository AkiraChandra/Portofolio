import React from 'react';
import { motion } from 'framer-motion';
import { ProjectPreviewProps } from '@/types/projects';
import { ExternalLink, Github } from 'lucide-react';

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  project,
  isVisible,
  containerWidth,
  onTransitionEnd
}) => {
  return (
    <motion.div
      className="absolute bottom-full mb-20 left-1/2 transform -translate-x-1/2 w-[400px]"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20,
        scale: isVisible ? 1 : 0.95,
      }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
      onAnimationComplete={() => {
        if (!isVisible) onTransitionEnd?.();
      }}
    >
      <div className="bg-[#17082f]/60 backdrop-blur-sm rounded-lg border border-white/10 p-6">
        {/* Title */}
        <h3 className="text-2xl font-semibold text-white mb-2">
          {project.previewContent.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-base mb-6">
          {project.previewContent.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-sm rounded-full bg-[#F6B00D]/10 text-[#F6B00D]
                       border border-[#F6B00D]/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center space-x-4">
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-white hover:text-[#F6B00D] 
                     transition-colors duration-200"
            >
              <ExternalLink size={16} />
              <span>Live Demo</span>
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-white hover:text-[#F6B00D] 
                     transition-colors duration-200"
            >
              <Github size={16} />
              <span>View Code</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectPreview;