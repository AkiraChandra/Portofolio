import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '@/types/projects';

interface ProjectPreviewProps {
  project: Project;
  isVisible: boolean;
  containerWidth?: number;
}

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, isVisible, containerWidth = 400 }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const fallbackImage = '/placeholder-project.png'; // Add a placeholder image in your public folder

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project.id]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? (project.images?.length ?? 1) - 1 : prev - 1
    );
    setIsImageLoading(true);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => 
      prev === (project.images?.length ?? 1) - 1 ? 0 : prev + 1
    );
    setIsImageLoading(true);
  };

  const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className }) => (
    <div className="relative w-full h-full">
      {isImageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background-tertiary dark:bg-background-tertiary-dark">
          <div className="w-8 h-8 border-4 border-primary dark:border-primary-dark rounded-full animate-spin border-t-transparent"></div>
        </div>
      )}
      <img
        src={imageError ? fallbackImage : src}
        alt={alt}
        className={className}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ opacity: isImageLoading ? 0 : 1 }}
      />
    </div>
  );

  if (!project) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, type: "tween", ease: "easeOut" }}
    >
      <div className="w-full" style={{ maxWidth: containerWidth }}>
        <div className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 backdrop-blur-md rounded-xl border border-border-primary/20 dark:border-border-primary-dark/20 p-4 shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
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
                      <ImageWithFallback
                        src={project.images[activeImageIndex].url}
                        alt={project.images[activeImageIndex].alt || project.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      
                      {project.images[activeImageIndex].caption && !imageError && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                          <p className="text-white text-sm text-center">
                            {project.images[activeImageIndex].caption}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {project.images.length > 1 && !imageError && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                                 bg-black/30 hover:bg-black/50 backdrop-blur-sm 
                                 text-white transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                                 bg-black/30 hover:bg-black/50 backdrop-blur-sm 
                                 text-white transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {project.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              activeImageIndex === index 
                                ? "bg-white scale-125" 
                                : "bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                {project.previewContent.title}
              </h3>
              
              <p className="text-text-secondary dark:text-text-secondary-dark text-sm mb-3 line-clamp-2">
                {project.previewContent.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs rounded-full bg-primary/10 dark:bg-primary-dark/10 
                             text-primary dark:text-primary-dark border border-primary/20 dark:border-primary-dark/20"
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
                    className="inline-flex items-center space-x-1.5 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark 
                             transition-colors duration-200 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </motion.a>
                )}
                
                {project.githubLink && (
                  <motion.a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark 
                             transition-colors duration-200 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github className="w-4 h-4" />
                    <span>View Code</span>
                  </motion.a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectPreview;