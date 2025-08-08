// src/components/sections/Projects/components/ProjectPreview.tsx - ENHANCED WITH ACTIVITY SUPPORT
// Modifikasi minimal untuk mendukung pause/resume auto-slide

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/types/projects";
import SmartImage from "@/components/common/SmartImage";
import { useProjectSizes } from "@/hooks/common/useMediaQuery";

interface ProjectPreviewProps {
  project: Project;
  isVisible: boolean; // ✅ MODIFIKASI: Rename dari existing prop untuk clarity
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  project,
  isVisible, // ✅ This replaces the original prop name
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoSlideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get all responsive data from single hook
  const {
    isTablet,
    isSmallMobile,
    previewImageWidth,
    previewImageHeight,
    previewContentHeight,
    mobilePreviewImageHeight,
    cardPadding: mobilePadding,
    textSizes: mobileTextSizes,
    autoSlideDuration,
    transitionDuration
  } = useProjectSizes();

  // ✅ TAMBAH: Cleanup function untuk all timers
  const clearAllTimers = () => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    if (autoSlideTimeoutRef.current) {
      clearTimeout(autoSlideTimeoutRef.current);
      autoSlideTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return clearAllTimers;
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project.id]);

  // ✅ MODIFIKASI: Activity-aware auto-slide functionality
  useEffect(() => {
    // Clear any existing timers
    clearAllTimers();

    // Don't start auto-slide if:
    // - Not visible/active
    // - No images or only one image
    if (!project.images || project.images.length <= 1 || !isVisible) {
      console.log('🖼️ ProjectPreview: Auto-slide disabled', {
        hasImages: !!project.images,
        imageCount: project.images?.length || 0,
        isVisible
      });
      return;
    }

    console.log('🖼️ ProjectPreview: Starting auto-slide for', project.name);

    const startAutoSlide = () => {
      autoSlideTimeoutRef.current = setTimeout(() => {
        // Double-check visibility before proceeding
        if (isVisible) {
          setActiveImageIndex((prev) =>
            prev === (project.images?.length ?? 1) - 1 ? 0 : prev + 1
          );
        }
      }, autoSlideDuration);
    };

    startAutoSlide();

    return clearAllTimers;
  }, [project.images, project.name, isVisible, autoSlideDuration]);

  // ✅ MODIFIKASI: Activity-aware manual navigation
  const handlePrevImage = () => {
    if (!isVisible) return; // Prevent interaction when not active
    
    clearAllTimers();
    setActiveImageIndex((prev) =>
      prev === 0 ? (project.images?.length ?? 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!isVisible) return; // Prevent interaction when not active
    
    clearAllTimers();
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
      transition={{ duration: transitionDuration }}
      className="w-full flex justify-center items-center min-h-full"
    >
      <div className={`bg-background-secondary/80 dark:bg-background-secondary-dark/80 backdrop-blur-md rounded-xl border border-border-primary/20 dark:border-border-primary-dark/20 ${mobilePadding} shadow-xl w-full md:w-auto md:inline-flex md:min-w-fit md:max-w-none`}>
        <div style={{ opacity: 1 }}>
          {/* Mobile Layout - Vertical */}
          <div className="flex flex-col justify-center md:hidden">
            {/* Image Section - Mobile with optimized height */}
            {project.images && project.images.length > 0 && (
              <div
                className={`relative w-full rounded-lg overflow-hidden ${isSmallMobile ? 'mb-3' : 'mb-4'}`}
                style={{ height: `${mobilePreviewImageHeight}px` }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: transitionDuration }}
                    className="w-full h-full"
                  >
                    {/* ✅ OPTIMIZED: SmartImage untuk performance yang lebih baik */}
                    <SmartImage
                      src={project.images[activeImageIndex].url}
                      alt={project.images[activeImageIndex].alt || project.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={activeImageIndex === 0} // Priority untuk gambar pertama
                      showPlaceholder={true}
                    />
                  </motion.div>
                </AnimatePresence>

                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className={`absolute ${isSmallMobile ? 'left-1 top-1/2 p-0.5' : 'left-2 top-1/2 p-1'} -translate-y-1/2 rounded-full 
                               bg-black/30 hover:bg-black/50 backdrop-blur-sm 
                               text-white transition-colors`}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className={isSmallMobile ? "w-4 h-4" : "w-5 h-5"} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className={`absolute ${isSmallMobile ? 'right-1 top-1/2 p-0.5' : 'right-2 top-1/2 p-1'} -translate-y-1/2 rounded-full 
                               bg-black/30 hover:bg-black/50 backdrop-blur-sm 
                               text-white transition-colors`}
                      aria-label="Next image"
                    >
                      <ChevronRight className={isSmallMobile ? "w-4 h-4" : "w-5 h-5"} />
                    </button>

                    {/* Mobile dots - smaller and repositioned */}
                    <div className={`absolute ${isSmallMobile ? 'bottom-1' : 'bottom-2'} left-1/2 -translate-x-1/2 flex gap-1`}>
                      {project.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleDotClick(index)}
                          className={`${isSmallMobile ? 'w-1 h-1' : 'w-1.5 h-1.5'} rounded-full transition-all ${
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

            {/* Content Section - Mobile optimized */}
            <div className="flex flex-col">
              <h3 className={`${mobileTextSizes.title} font-semibold text-text-primary dark:text-text-primary-dark ${isSmallMobile ? 'mb-1' : 'mb-2'}`}>
                {project.previewContent.title}
              </h3>

              <p className={`text-text-secondary dark:text-text-secondary-dark ${mobileTextSizes.description} ${isSmallMobile ? 'mb-2 line-clamp-2' : 'mb-3 line-clamp-2'}`}>
                {project.previewContent.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className={`${mobileTextSizes.tech} rounded-full bg-primary/10 dark:bg-primary-dark/10 
                             text-primary dark:text-primary-dark border border-primary/20 dark:border-primary-dark/20`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action buttons - mobile optimized */}
              <div className="flex items-center space-x-3 mt-3">
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-1.5 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200 ${mobileTextSizes.link}`}
                    tabIndex={0}
                  >
                    <ExternalLink className={isSmallMobile ? "w-3 h-3" : "w-4 h-4"} />
                    <span>Live Demo</span>
                  </a>
                )}

                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-1.5 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200 ${mobileTextSizes.link}`}
                    tabIndex={0}
                  >
                    <Github className={isSmallMobile ? "w-3 h-3" : "w-4 h-4"} />
                    <span>View Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Horizontal with optimized dimensions */}
          <div className="hidden md:flex items-center gap-6 w-auto">
            {/* Image Section - Desktop & Tablet */}
            {project.images && project.images.length > 0 && (
              <div
                className="flex-shrink-0"
                style={{
                  width: `${previewImageWidth}px`,
                  height: `${previewImageHeight}px`,
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
                      {/* ✅ OPTIMIZED: SmartImage untuk desktop/tablet */}
                      <SmartImage
                        src={project.images[activeImageIndex].url}
                        alt={project.images[activeImageIndex].alt || project.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        priority={activeImageIndex === 0}
                        showPlaceholder={true}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full 
                                 bg-black/30 hover:bg-black/50 backdrop-blur-sm 
                                 text-white transition-colors ${isTablet ? 'p-1.5' : 'p-1'}`}
                        aria-label="Previous image"
                      >
                        <ChevronLeft className={isTablet ? "w-5 h-5" : "w-4 h-4"} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full 
                                 bg-black/30 hover:bg-black/50 backdrop-blur-sm 
                                 text-white transition-colors ${isTablet ? 'p-1.5' : 'p-1'}`}
                        aria-label="Next image"
                      >
                        <ChevronRight className={isTablet ? "w-5 h-5" : "w-4 h-4"} />
                      </button>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {project.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`${isTablet ? 'w-2 h-2' : 'w-1.5 h-1.5'} rounded-full transition-all ${
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

            {/* Content Section - Desktop & Tablet with optimized height */}
            <div
              className="flex flex-col justify-center w-auto min-w-0"
              style={{ height: `${previewContentHeight}px` }}
            >
              <div className="flex-1 flex flex-col justify-center">
                <h3 className={`${mobileTextSizes.title} font-semibold text-text-primary dark:text-text-primary-dark mb-3 ${isTablet ? 'whitespace-normal' : 'whitespace-nowrap'}`}>
                  {project.previewContent.title}
                </h3>

                <div className="mb-4 overflow-hidden">
                  <p className={`text-text-secondary dark:text-text-secondary-dark ${mobileTextSizes.description} leading-relaxed overflow-hidden ${isTablet ? 'line-clamp-3' : ''}`}>
                    {project.previewContent.description}
                  </p>
                </div>

                <div className={`flex flex-wrap gap-2 mb-4 ${isTablet ? 'max-w-lg' : 'max-w-xs xl:max-w-md'}`}>
                  {project.techStack.slice(0, isTablet ? 6 : 4).map((tech) => (
                    <span
                      key={tech}
                      className={`${mobileTextSizes.tech} rounded-full bg-primary/10 dark:bg-primary-dark/10 
                               text-primary dark:text-primary-dark border border-primary/20 dark:border-primary-dark/20 whitespace-nowrap`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > (isTablet ? 6 : 4) && (
                    <span className={`${mobileTextSizes.tech} text-text-secondary dark:text-text-secondary-dark`}>
                      +{project.techStack.length - (isTablet ? 6 : 4)} more
                    </span>
                  )}
                </div>
              </div>

              <div className={`flex items-center mt-auto ${isTablet ? 'space-x-4' : 'space-x-3 xl:space-x-4'}`}>
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-2 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200 ${mobileTextSizes.link} whitespace-nowrap`}
                    tabIndex={0}
                  >
                    <ExternalLink className={isTablet ? "w-5 h-5" : "w-3 h-3 xl:w-4 xl:h-4"} />
                    <span>Live Demo</span>
                  </a>
                )}

                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-2 text-text-primary dark:text-text-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors duration-200 ${mobileTextSizes.link} whitespace-nowrap`}
                    tabIndex={0}
                  >
                    <Github className={isTablet ? "w-5 h-5" : "w-3 h-3 xl:w-4 xl:h-4"} />
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