// src/components/sections/Projects/components/ProjectPreview.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectPreviewProps } from '@/types/projects';
import { ExternalLink, Github } from 'lucide-react';

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  project,
  isVisible,
  onTransitionEnd
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        if (!isVisible) onTransitionEnd?.();
      }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative backdrop-blur-md bg-background-secondary/30 dark:bg-background-secondary-dark/30 
                    rounded-xl p-6 shadow-lg border border-border-primary/10 dark:border-border-primary-dark/10">
        {/* Preview Content */}
        <div className="space-y-4">
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
          >
            {project.previewContent.title}
          </motion.h3>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary dark:text-text-secondary-dark"
          >
            {project.previewContent.description}
          </motion.p>

          {/* Tech Stack */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm rounded-full bg-primary/10 dark:bg-primary-dark/10 
                         text-primary dark:text-primary-dark"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          {/* Features List */}
          {project.previewContent.features && (
            <motion.ul 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2 ml-4"
            >
              {project.previewContent.features.map((feature, index) => (
                <li 
                  key={index}
                  className="text-text-secondary dark:text-text-secondary-dark flex items-center"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-dark mr-2" />
                  {feature}
                </li>
              ))}
            </motion.ul>
          )}

          {/* Links */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex space-x-4 mt-6"
          >
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-text-primary dark:text-text-primary-dark 
                         hover:text-primary dark:hover:text-primary-dark transition-colors"
              >
                <ExternalLink size={20} />
                <span>Live Demo</span>
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-text-primary dark:text-text-primary-dark 
                         hover:text-primary dark:hover:text-primary-dark transition-colors"
              >
                <Github size={20} />
                <span>View Code</span>
              </a>
            )}
          </motion.div>
        </div>

        {/* Preview Image */}
        {project.previewContent.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 rounded-lg overflow-hidden"
          >
            <img
              src={project.previewContent.image}
              alt={project.name}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
