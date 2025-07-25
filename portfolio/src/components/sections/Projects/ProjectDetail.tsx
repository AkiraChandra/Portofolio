// src/components/sections/Projects/ProjectDetail.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types/projects";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Calendar,
  Code,
  Eye,
  Star,
  Globe,
  Layers,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MovingStars from "@/components/ui/animations/Movingstars";
import SmartImage from "@/components/common/SmartImage";
import PlaceholderImage from "@/components/common/PlaceholderImage";
import FileViewer from "@/utils/helpers/FileViewer";

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const router = useRouter();
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Image carousel states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const autoSlideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (!project.images || project.images.length <= 1) {
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
  }, [activeImageIndex, project.images]);

  useEffect(() => {
    return () => {
      if (autoSlideTimeoutRef.current) {
        clearTimeout(autoSlideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project.id]);

  // Image navigation functions
  const handleNextImage = () => {
    if (autoSlideTimeoutRef.current) {
      clearTimeout(autoSlideTimeoutRef.current);
    }
    setActiveImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (autoSlideTimeoutRef.current) {
      clearTimeout(autoSlideTimeoutRef.current);
    }
    setActiveImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleDotClick = (index: number) => {
    if (autoSlideTimeoutRef.current) {
      clearTimeout(autoSlideTimeoutRef.current);
    }
    setActiveImageIndex(index);
  };

  // Modal functions
  const openImagePreview = (index: number) => {
    setSelectedImageIndex(index);
    setIsImagePreviewOpen(true);
  };

  const closeImagePreview = () => {
    setIsImagePreviewOpen(false);
  };

  const nextPreviewImage = () => {
    setSelectedImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevPreviewImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  return (
    <>
      {/* Main Content */}
      <div className="relative h-screen overflow-hidden bg-background-primary dark:bg-background-primary-dark">
        {/* Background Stars */}
        <div className="absolute inset-0 overflow-hidden">
          <MovingStars />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />

        {/* Main Content Container - Full Height */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Back Button */}
          <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 pt-4 lg:pt-6">
            <motion.button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-text-primary dark:text-text-primary-dark 
                       hover:text-primary dark:hover:text-primary-dark transition-colors duration-300
                       bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                       backdrop-blur-sm rounded-xl px-4 py-2.5 border border-border-primary/20 
                       dark:border-border-primary-dark/20"
              whileHover={{ scale: 1.02, x: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Projects</span>
            </motion.button>
          </div>

          {/* Main Content Grid - Flexible Height */}
          <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 min-h-0">
            <div className="h-full grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
              {/* Mobile: Right Column First (Main Content) */}
              <div className="xl:col-span-7 xl:order-2 order-1 flex flex-col min-h-0">
                {/* Image Gallery Widget */}
                {project.images && project.images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-background-secondary/60 dark:bg-background-secondary-dark/60 
                             backdrop-blur-sm rounded-2xl border border-border-primary/10 
                             dark:border-border-primary-dark/10 overflow-hidden flex-1 min-h-0 mb-4"
                  >
                    <div className="p-3 border-b border-border-primary/10 dark:border-border-primary-dark/10">
                      <h3
                        className="text-base font-semibold text-text-primary dark:text-text-primary-dark 
                                   flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Project Gallery
                        <span className="ml-auto text-sm text-text-secondary dark:text-text-secondary-dark">
                          {activeImageIndex + 1} / {project.images.length}
                        </span>
                      </h3>
                    </div>

                    <div className="relative flex-1 min-h-0">
                      {/* Main Carousel Image */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeImageIndex}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4 }}
                          className="w-full h-full cursor-pointer group"
                          onClick={() => openImagePreview(activeImageIndex)}
                        >
                          <FileViewer
                            url={project.images[activeImageIndex].url}
                            alt={
                              project.images[activeImageIndex].alt ||
                              project.name
                            }
                            caption={project.images[activeImageIndex].caption}
                            className="w-full h-full object-cover"
                          />

                          {/* Zoom Overlay */}
                          <div
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                        transition-opacity duration-300 flex items-center justify-center"
                          >
                            <div className="flex items-center gap-2 text-white">
                              <ZoomIn className="w-5 h-5" />
                              <span className="font-medium text-sm">
                                Click to enlarge
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Navigation Arrows */}
                      {project.images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full 
                                     bg-black/60 hover:bg-black/80 backdrop-blur-sm 
                                     text-white transition-all duration-300 z-10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <button
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full 
                                     bg-black/60 hover:bg-black/80 backdrop-blur-sm 
                                     text-white transition-all duration-300 z-10"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Dot Indicators */}
                      {project.images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                          {project.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => handleDotClick(index)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                activeImageIndex === index
                                  ? "bg-white scale-125 shadow-lg"
                                  : "bg-white/50 hover:bg-white/75"
                              }`}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Project Info Widget - Removed (moved to left column) */}

                {/* Stats & Actions Widget - Moved here */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-background-secondary/60 dark:bg-background-secondary-dark/60 
                           backdrop-blur-sm rounded-2xl p-4 border border-border-primary/10 
                           dark:border-border-primary-dark/10 flex-shrink-0"
                >
                  {/* Quick Stats */}
                  <div className="mb-4">
                    <h3
                      className="text-sm font-semibold text-text-primary dark:text-text-primary-dark mb-3 
                                 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Project Stats
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="text-center p-2.5 bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 
                                    rounded-lg border border-border-primary/10 dark:border-border-primary-dark/10"
                      >
                        <div className="text-xl font-bold text-primary dark:text-primary-dark">
                          {project.techStack?.length || 0}
                        </div>
                        <div className="text-xs text-text-secondary dark:text-text-secondary-dark">
                          Technologies
                        </div>
                      </div>

                      <div
                        className="text-center p-2.5 bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 
                                    rounded-lg border border-border-primary/10 dark:border-border-primary-dark/10"
                      >
                        <div className="text-xl font-bold text-primary dark:text-primary-dark">
                          {project.images?.length || 0}
                        </div>
                        <div className="text-xs text-text-secondary dark:text-text-secondary-dark">
                          Screenshots
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3
                      className="text-sm font-semibold text-text-primary dark:text-text-primary-dark mb-3 
                                 flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Quick Actions
                    </h3>

                    <div className="space-y-2.5">
                      {project.demoLink && (
                        <motion.a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 
                                   bg-primary dark:bg-primary-dark text-white rounded-xl font-medium 
                                   hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors duration-300"
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">Live Demo</span>
                        </motion.a>
                      )}

                      {project.githubLink && (
                        <motion.a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 
                                   bg-background-tertiary dark:bg-background-tertiary-dark 
                                   text-text-primary dark:text-text-primary-dark rounded-xl font-medium 
                                   border border-border-primary/20 dark:border-border-primary-dark/20 
                                   hover:bg-background-quaternary dark:hover:bg-background-quaternary-dark 
                                   transition-colors duration-300"
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Github className="w-4 h-4" />
                          <span className="text-sm">View Code</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Desktop: Left Column, Mobile: Second (Info Widgets) */}
              <div className="xl:col-span-5 xl:order-1 order-2 flex flex-col gap-4 min-h-0">
                {/* Planet Widget - Compact */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-background-secondary/60 dark:bg-background-secondary-dark/60 
                           backdrop-blur-sm rounded-2xl p-4 border border-border-primary/10 
                           dark:border-border-primary-dark/10 flex-shrink-0"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="relative w-32 h-32 lg:w-40 lg:h-40 xl:w-44 xl:h-44 mb-3"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      {project.planetImage ? (
                        <SmartImage
                          src={project.planetImage}
                          alt={`${project.name} planet`}
                          width={176}
                          height={176}
                          className="w-full h-full object-cover rounded-full border-3 border-primary/30 dark:border-primary-dark/30 shadow-xl"
                          showPlaceholder={true}
                        />
                      ) : (
                        <PlaceholderImage
                          type="project"
                          className="w-full h-full rounded-full"
                        />
                      )}

                      {/* Glow Effect */}
                      <div
                        className="absolute inset-0 rounded-full bg-primary/15 dark:bg-primary-dark/15 
                                    filter blur-xl -z-10"
                      />
                    </motion.div>

                    {/* Project Status Badge */}
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 dark:bg-primary-dark/10 
                                  rounded-full border border-primary/20 dark:border-primary-dark/20"
                    >
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-primary dark:text-primary-dark">
                        Active Project
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Project Info Widget - Compact */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="bg-background-secondary/60 dark:bg-background-secondary-dark/60 
             backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-border-primary/10 
             dark:border-border-primary-dark/10 flex-1 min-h-0 w-full max-w-4xl mx-auto
             flex items-center justify-center"
                >
                  <div className="space-y-4 sm:space-y-6 w-full">
                    {/* Project Header */}
                    <div className="space-y-3 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3">
                        <h1
                          className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-text-primary 
                       dark:text-text-primary-dark leading-tight w-full sm:w-auto"
                        >
                          {project.name}
                        </h1>
                        {project.featured && (
                          <div
                            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/10 
                        text-yellow-600 dark:text-yellow-400 rounded-full text-xs sm:text-sm font-medium
                        mx-auto sm:mx-0 flex-shrink-0"
                          >
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                            Featured
                          </div>
                        )}
                      </div>

                      <p
                        className="text-base sm:text-lg lg:text-xl text-text-secondary dark:text-text-secondary-dark 
                   leading-relaxed text-center sm:text-left"
                      >
                        {project.previewContent?.description}
                      </p>
                    </div>

                    {/* Tech Stack - Responsive */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="space-y-3 sm:space-y-4">
                        <h3
                          className="text-base sm:text-lg lg:text-xl font-semibold text-text-primary 
                     dark:text-text-primary-dark flex items-center justify-center sm:justify-start gap-2"
                        >
                          <Code className="w-5 h-5 sm:w-6 sm:h-6" />
                          Technologies
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                          {project.techStack.map((tech, index) => (
                            <motion.span
                              key={tech}
                              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 dark:bg-primary-dark/10 
                       text-primary dark:text-primary-dark rounded-lg text-sm sm:text-base font-medium
                       border border-primary/20 dark:border-primary-dark/20"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.5 + index * 0.05,
                              }}
                              whileHover={{ scale: 1.05 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Features - Responsive */}
                    {project.previewContent &&
                      project.previewContent.features &&
                      project.previewContent.features.length > 0 && (
                        <div className="space-y-3 sm:space-y-4">
                          <h4
                            className="text-base sm:text-lg lg:text-xl font-semibold text-text-primary 
                     dark:text-text-primary-dark flex items-center justify-center sm:justify-start gap-2"
                          >
                            <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                            Key Features
                          </h4>
                          <ul className="space-y-2 sm:space-y-3">
                            {project.previewContent.features
                              .slice(0, 3)
                              .map((feature, index) => (
                                <motion.li
                                  key={index}
                                  className="flex items-start gap-3 text-sm sm:text-base text-text-secondary 
                       dark:text-text-secondary-dark justify-center sm:justify-start"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: 0.6 + index * 0.1,
                                  }}
                                >
                                  <div
                                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary dark:bg-primary-dark 
                           rounded-full mt-1.5 sm:mt-2 flex-shrink-0"
                                  />
                                  <span className="text-center sm:text-left">
                                    {feature}
                                  </span>
                                </motion.li>
                              ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {isImagePreviewOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImagePreview}
          >
            <motion.div
              className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeImagePreview}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 
                         text-white rounded-full p-3 backdrop-blur-sm transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Main Preview Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                {project.images[selectedImageIndex]?.url ? (
                  <SmartImage
                    src={project.images[selectedImageIndex]?.url}
                    alt={
                      project.images[selectedImageIndex]?.alt ||
                      `${project.name} preview`
                    }
                    width={1200}
                    height={800}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    showPlaceholder={true}
                  />
                ) : (
                  <PlaceholderImage
                    type="project"
                    className="max-w-full max-h-full"
                  />
                )}

                {/* Navigation Arrows */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prevPreviewImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 
                               text-white rounded-full p-3 backdrop-blur-sm transition-colors duration-300"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextPreviewImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 
                               text-white rounded-full p-3 backdrop-blur-sm transition-colors duration-300"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Image Caption */}
              {project.images[selectedImageIndex]?.caption && (
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm 
                              text-white px-4 py-2 rounded-lg max-w-md text-center"
                >
                  {project.images[selectedImageIndex].caption}
                </div>
              )}

              {/* Image Counter */}
              <div
                className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm 
                            text-white px-3 py-1 rounded-full text-sm"
              >
                {selectedImageIndex + 1} / {project.images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectDetail;
