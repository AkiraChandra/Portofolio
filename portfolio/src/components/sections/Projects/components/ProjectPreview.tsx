import React, { useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectPreviewProps } from '@/types/projects';
import { ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';

const ProjectPreview: React.FC<ProjectPreviewProps> = React.memo(({
  project,
  isVisible,
  containerWidth = 400
}) => {
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  // Clear any pending transitions on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Reset active image index when project changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [project.id]);

  // Handle visibility changes with debouncing
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      // Additional state updates if needed
    }, 50);
  }, [isVisible, project.id]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => 
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const memoizedContent = useMemo(() => (
    <div className="w-full" style={{ maxWidth: containerWidth }}>
      <div className="bg-[#17082f]/80 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Project Images Carousel */}
            {project.images && project.images.length > 0 && (
              <div className="relative mb-4 rounded-lg overflow-hidden aspect-video">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative aspect-video"
                  >
                    <img
                      src={project.images[activeImageIndex].url}
                      alt={project.images[activeImageIndex].alt || project.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {project.images[activeImageIndex].caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                        <p className="text-white text-sm text-center">
                          {project.images[activeImageIndex].caption}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                               bg-black/30 hover:bg-black/50 backdrop-blur-sm 
                               text-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                               bg-black/30 hover:bg-black/50 backdrop-blur-sm 
                               text-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {project.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all",
                          activeImageIndex === index 
                            ? "bg-white scale-125" 
                            : "bg-white/50 hover:bg-white/80"
                        )}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

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
  ), [project, containerWidth, activeImageIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.2,
        type: "tween",
        ease: "easeOut"
      }}
    >
      {memoizedContent}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.project?.id === nextProps.project?.id &&
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.containerWidth === nextProps.containerWidth &&
    prevProps.project?.previewContent?.title === nextProps.project?.previewContent?.title &&
    JSON.stringify(prevProps.project?.images) === JSON.stringify(nextProps.project?.images)
  );
});

ProjectPreview.displayName = 'ProjectPreview';

export default ProjectPreview;

function cn(arg0: string, arg1: string): string | undefined {
  throw new Error('Function not implemented.');
}
