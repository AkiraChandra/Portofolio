import React, { useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectPreviewProps } from '@/types/projects';
import { ExternalLink, Github } from 'lucide-react';

const ProjectPreview: React.FC<ProjectPreviewProps> = React.memo(({
  project,
  isVisible,
  containerWidth = 400
}) => {
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Clear any pending transitions on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Handle visibility changes with debouncing
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Ensure smooth transition between states
    transitionTimeoutRef.current = setTimeout(() => {
      // Additional state updates if needed
    }, 50); // Small buffer for state transitions
  }, [isVisible, project.id]);

  const memoizedContent = useMemo(() => (
    <div className="w-full" style={{ maxWidth: containerWidth }}>
      <div className="bg-[#17082f]/80 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id} // Important: Key helps React handle transitions
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              {project.previewContent.title}
            </h3>
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {project.previewContent.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-xs rounded-full bg-[#F6B00D]/10 text-[#F6B00D] 
                           border border-[#F6B00D]/20"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              {project.demoLink && (
                <motion.a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-white hover:text-[#F6B00D] 
                           transition-colors duration-200 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink size={14} />
                  <span>Live Demo</span>
                </motion.a>
              )}
              {project.githubLink && (
                <motion.a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-white hover:text-[#F6B00D] 
                           transition-colors duration-200 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github size={14} />
                  <span>View Code</span>
                </motion.a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  ), [project, containerWidth]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.2,
        type: "tween", // Using tween instead of spring for more predictable animations
        ease: "easeOut"
      }}
    >
      {memoizedContent}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Enhanced comparison function with safety checks
  return (
    prevProps.project?.id === nextProps.project?.id &&
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.containerWidth === nextProps.containerWidth &&
    prevProps.project?.previewContent?.title === nextProps.project?.previewContent?.title
  );
});

ProjectPreview.displayName = 'ProjectPreview';

export default ProjectPreview;