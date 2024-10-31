//src/components/sections/Projects/components/ProjectPreview.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectPreviewProps } from '@/types/projects';
import { ExternalLink, Github } from 'lucide-react';

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  project,
  isVisible,
  containerWidth = 400,
  onTransitionEnd
}) => {
  return (
    <div className="w-full" style={{ maxWidth: containerWidth }}>
      <div className="bg-[#17082f]/80 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-xl">
        <h3 className="text-2xl font-semibold text-white mb-3">
          {project.previewContent.title}
        </h3>

        <p className="text-gray-300 text-base mb-4 line-clamp-2">
          {project.previewContent.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
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
    </div>
  );
};

export default ProjectPreview;