import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/types/projects";
import FileViewer from "@/utils/helpers/FileViewer";
import { useProjectSizes } from "@/hooks/common/useMediaQuery"; // Import your hook

interface ProjectPreviewProps {
  project: Project;
  isVisible: boolean;
  containerWidth?: number;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  project,
  isVisible,
  containerWidth = 400,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSlideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get dynamic sizes based on screen dimensions
  const sizes = useProjectSizes();

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (autoSlideTimeoutRef.current) {
        clearTimeout(autoSlideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project.id]);

  // Auto-slide functionality
  useEffect(() => {
    if (!project.images || project.images.length <= 1 || !isVisible) {
      return;
    }

    const startAutoSlide = () => {
      autoSlideTimeoutRef.current = setTimeout(() => {
        setActiveImageIndex((prev) =>
          prev === (project.images?.length ?? 1) - 1 ? 0 : prev + 1
        );
      }, 4000);
    };

    startAutoSlide();

    return () => {
      if (autoSlideTimeoutRef.current) {
        clearTimeout(autoSlideTimeoutRef.current);
      }
    };
  }, [activeImageIndex, project.images, isVisible]);

  const handlePrevImage = () => {
    if (autoSlideTimeoutRef.current) {
      clearTimeout(autoSlideTimeoutRef.current);
    }
    setActiveImageIndex((prev) =>
      prev === 0 ? (project.images?.length ?? 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (autoSlideTimeoutRef.current) {
      clearTimeout(autoSlideTimeoutRef.current);
    }
    setActiveImageIndex((prev) =>
      prev === (project.images?.length ?? 1) - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (index: number) => {
    if (autoSlideTimeoutRef.current) {
      clearTimeout(autoSlideTimeoutRef.current);
    }
    setActiveImageIndex(index);
  };

  if (!project) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-center items-center min-h-full"
    >
      <div className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 backdrop-blur-md rounded-xl border border-border-primary/20 dark:border-border-primary-dark/20 p-4 md:p-6 shadow-xl w-full md:w-auto md:inline-flex md:min-w-fit md:max-w-none">
        <div style={{ opacity: 1 }}>
          {/* Mobile Layout - Vertical */}
          <div className="flex flex-col justify-center md:hidden">
            {/* Image Section - Mobile with dynamic height */}
            {project.images && project.images.length > 0 && (
              <div
                className="relative w-full rounded-lg overflow-hidden mb-4"
                style={{ height: `${sizes.mobilePreviewImageHeight}px` }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <FileViewer
                      url={project.images[activeImageIndex].url}
                      alt={project.images[activeImageIndex].alt || project.name}
                      caption={project.images[activeImageIndex].caption}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {project.images.length > 1 && (
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
                  </>
                )}
              </div>
            )}

            {/* Content Section - Mobile */}
            <div className="flex flex-col">
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
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200 text-sm"
                    tabIndex={0}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                )}

                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200 text-sm"
                    tabIndex={0}
                  >
                    <Github className="w-4 h-4" />
                    <span>View Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Horizontal with dynamic dimensions */}
          <div className="hidden md:flex items-center gap-6 w-auto">
            {/* Image Section - Desktop with dynamic dimensions */}
            {project.images && project.images.length > 0 && (
              <div
                className="flex-shrink-0"
                style={{
                  width: `${sizes.previewImageWidth}px`,
                  height: `${sizes.previewImageHeight}px`,
                }}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      <FileViewer
                        url={project.images[activeImageIndex].url}
                        alt={
                          project.images[activeImageIndex].alt || project.name
                        }
                        caption={project.images[activeImageIndex].caption}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                                 bg-black/30 hover:bg-black/50 backdrop-blur-sm 
                                 text-white transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full 
                                 bg-black/30 hover:bg-black/50 backdrop-blur-sm 
                                 text-white transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {project.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleDotClick(index)}
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
              </div>
            )}

            {/* Content Section - Desktop with dynamic height */}
            <div
              className="flex flex-col justify-center w-auto min-w-0"
              style={{ height: `${sizes.previewContentHeight}px` }}
            >
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-lg xl:text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-2 whitespace-nowrap">
                  {project.previewContent.title}
                </h3>

                <div className="mb-3 overflow-hidden">
                  <p className="text-text-secondary dark:text-text-secondary-dark text-xs xl:text-sm leading-relaxed overflow-hidden">
                    {project.previewContent.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3 xl:mb-4 max-w-xs xl:max-w-md">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs rounded-full bg-primary/10 dark:bg-primary-dark/10 
                               text-primary dark:text-primary-dark border border-primary/20 dark:border-primary-dark/20 whitespace-nowrap"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="px-2 py-0.5 text-xs text-text-secondary dark:text-text-secondary-dark">
                      +{project.techStack.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 xl:space-x-4 mt-auto">
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200 text-xs xl:text-sm whitespace-nowrap"
                    tabIndex={0}
                  >
                    <ExternalLink className="w-3 h-3 xl:w-4 xl:h-4" />
                    <span>Live Demo</span>
                  </a>
                )}

                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200 text-xs xl:text-sm whitespace-nowrap"
                    tabIndex={0}
                  >
                    <Github className="w-3 h-3 xl:w-4 xl:h-4" />
                    <span>View Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectPreview;
