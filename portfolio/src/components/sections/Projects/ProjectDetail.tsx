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
  Clock,
  Tag,
  Download,
  Share2,
  Bookmark,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  MousePointer,
  Sparkles,
  Filter,
  BarChart3,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MovingStars from "@/components/ui/animations/Movingstars";
import SmartImage from "@/components/common/SmartImage";

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const router = useRouter();
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  // Image carousel states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const autoSlideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (!project.images || project.images.length <= 1 || !isAutoSliding) {
      return;
    }

    const startAutoSlide = () => {
      autoSlideTimeoutRef.current = setTimeout(() => {
        setActiveImageIndex((prev) =>
          prev === (project.images?.length ? project.images.length - 1 : 0) ? 0 : prev + 1
        );
      }, 4000);
    };

    startAutoSlide();

    return () => {
      if (autoSlideTimeoutRef.current) {
        clearTimeout(autoSlideTimeoutRef.current);
      }
    };
  }, [activeImageIndex, project.images, isAutoSliding]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? (project.images?.length ? project.images.length - 1 : 0) : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === (project.images?.length ? project.images.length - 1 : 0) ? 0 : prev + 1
    );
  };

  const handleImagePreview = (index: number) => {
    setSelectedImageIndex(index);
    setIsImagePreviewOpen(true);
  };

  const toggleAutoSlide = () => {
    setIsAutoSliding(!isAutoSliding);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div
        className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark transition-colors duration-300"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent dark:via-black/70 dark:to-black z-1" />
        <div className="absolute inset-0 overflow-hidden">
          <MovingStars />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />

        {/* Header Section */}
        <motion.div 
          className="sticky top-0 z-30 backdrop-blur-xl bg-transparent 
                     border-b border-border-primary/20 dark:border-border-primary-dark/20"
          variants={itemVariants}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-start">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background-secondary/30 dark:bg-background-secondary-dark/30 
                         hover:bg-background-secondary/50 dark:hover:bg-background-secondary-dark/50 
                         border border-border-primary/20 dark:border-border-primary-dark/20 backdrop-blur-sm
                         transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 text-text-secondary dark:text-text-secondary-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors" />
                <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
                  Back to Projects
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:items-start">
            
            {/* Left Section - Project Info & Planet */}
            <motion.div 
              className="lg:col-span-4 flex flex-col h-full"
              variants={itemVariants}
            >
              <div className="space-y-6 flex-1 flex flex-col">
              {/* Planet Image */}
              <motion.div 
                className="relative flex justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              >
                <div className="relative">
                  {/* Planet Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-yellow-400/20 blur-xl rounded-full transform scale-150 animate-pulse"></div>
                  
                  {/* Planet Image */}
                  <motion.div 
                    className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/30 dark:border-primary-dark/30"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 4, repeat: Infinity }
                    }}
                  >
                    {project.planetImage ? (
                      <SmartImage
                        src={project.planetImage}
                        alt={`${project.name} Planet`}
                        fill
                        className="object-cover"
                        showPlaceholder={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 flex items-center justify-center">
                        <Star className="w-16 h-16 text-white/80" />
                      </div>
                    )}
                  </motion.div>

                  {/* Active Project Badge */}
                  {project.featured && (
                    <motion.div 
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 
                               text-white text-sm font-medium rounded-full border-2 border-white dark:border-gray-800 shadow-lg"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      ⭐ Active Project
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Project Title */}
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <h1 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
                  {project.name}
                </h1>
                <p className="text-text-secondary dark:text-text-secondary-dark leading-relaxed">
                  {project.previewContent.description || "No description available."}
                </p>
              </motion.div>

              {/* Technologies */}
              <motion.div 
                className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 rounded-2xl p-6 
                         backdrop-blur-sm border border-border-primary/50 dark:border-border-primary-dark/50"
                variants={itemVariants}
              >
                <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary dark:text-primary-dark" />
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <motion.span
                      key={tech}
                      className="px-3 py-1.5 text-sm rounded-lg bg-primary/10 dark:bg-primary-dark/10
                               text-primary dark:text-primary-dark border border-primary/20 dark:border-primary-dark/20
                               hover:bg-primary/20 dark:hover:bg-primary-dark/20 
                               transition-all duration-300"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Key Features */}
              {project.previewContent.features && project.previewContent.features.length > 0 && (
                <motion.div 
                  className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 rounded-2xl p-6 
                           backdrop-blur-sm border border-border-primary/50 dark:border-border-primary-dark/50 flex-1"
                  variants={itemVariants}
                >
                  <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary dark:text-primary-dark" />
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {project.previewContent.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3 text-text-secondary dark:text-text-secondary-dark"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-yellow-400 dark:from-primary-dark dark:to-yellow-400 mt-2.5 flex-shrink-0"></div>
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
              </div>
            </motion.div>

            {/* Right Section - Gallery & Stats */}
            <motion.div 
              className="lg:col-span-8 space-y-6"
              variants={itemVariants}
            >
              {/* Project Gallery */}
              <motion.div 
                className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 rounded-2xl overflow-hidden 
                         backdrop-blur-sm border border-border-primary/50 dark:border-border-primary-dark/50"
                variants={itemVariants}
              >
                {/* Gallery Header */}
                <div className="p-4 border-b border-border-primary/50 dark:border-border-primary-dark/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary dark:text-primary-dark" />
                    <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                      Project Gallery
                    </h3>
                  </div>
                  <div className="text-sm text-text-tertiary dark:text-text-tertiary-dark">
                    {project.images?.length ? `${activeImageIndex + 1} / ${project.images.length}` : '0 / 0'}
                  </div>
                </div>

                {/* Main Image Display */}
                {project.images && project.images.length > 0 ? (
                  <div className="relative aspect-video group">
                    {project.images[activeImageIndex]?.url ? (
                      <SmartImage
                        src={project.images[activeImageIndex].url}
                        alt={project.images[activeImageIndex]?.alt || project.name}
                        className="w-full h-full object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
                        showPlaceholder={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 flex items-center justify-center">
                        <div className="text-center text-text-tertiary dark:text-text-tertiary-dark">
                          <div className="w-16 h-16 mx-auto mb-2 bg-background-secondary/50 dark:bg-background-secondary-dark/50 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/>
                            </svg>
                          </div>
                          <p className="text-sm">No preview available</p>
                        </div>
                      </div>
                    )}

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.button
                        onClick={() => handleImagePreview(activeImageIndex)}
                        className="p-3 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm 
                                 hover:bg-white dark:hover:bg-black transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ZoomIn className="w-5 h-5 text-text-primary dark:text-text-primary-dark" />
                      </motion.button>
                    </div>

                    {/* Navigation Arrows */}
                    {project.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full 
                                   bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-300 
                                   opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full 
                                   bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-300 
                                   opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                      </>
                    )}

                    {/* Auto-slide controls */}
                    {project.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={toggleAutoSlide}
                          className="p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-300"
                        >
                          {isAutoSliding ? 
                            <Pause className="w-4 h-4 text-white" /> : 
                            <Play className="w-4 h-4 text-white" />
                          }
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 flex items-center justify-center">
                    <div className="text-center text-text-tertiary dark:text-text-tertiary-dark">
                      <div className="w-24 h-24 mx-auto mb-4 bg-background-secondary/50 dark:bg-background-secondary-dark/50 rounded-2xl flex items-center justify-center">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-text-secondary dark:text-text-secondary-dark mb-2">No Images Available</h3>
                      <p className="text-sm">This project doesn't have any preview images yet.</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Bottom Section - Stats & Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Project Stats */}
                <motion.div 
                  className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 rounded-2xl p-6 
                           backdrop-blur-sm border border-border-primary/50 dark:border-border-primary-dark/50"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-primary dark:text-primary-dark" />
                    <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                      Project Stats
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Code className="w-4 h-4 text-primary dark:text-primary-dark" />
                      </div>
                      <div className="text-2xl font-bold text-primary dark:text-primary-dark">{project.techStack.length}</div>
                      <div className="text-xs text-text-tertiary dark:text-text-tertiary-dark">Technologies</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Eye className="w-4 h-4 text-primary dark:text-primary-dark" />
                      </div>
                      <div className="text-2xl font-bold text-primary dark:text-primary-dark">{project.images?.length || 0}</div>
                      <div className="text-xs text-text-tertiary dark:text-text-tertiary-dark">Screenshots</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Layers className="w-4 h-4 text-primary dark:text-primary-dark" />
                      </div>
                      <div className="text-2xl font-bold text-primary dark:text-primary-dark">{project.previewContent.features?.length || 0}</div>
                      <div className="text-xs text-text-tertiary dark:text-text-tertiary-dark">Features</div>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div 
                  className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 rounded-2xl p-6 
                           backdrop-blur-sm border border-border-primary/50 dark:border-border-primary-dark/50"
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-primary dark:text-primary-dark" />
                    <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
                      Quick Actions
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {project.demoLink && (
                      <motion.a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-orange-400 to-yellow-500 
                                 hover:from-orange-500 hover:to-yellow-600 text-white transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Globe className="w-5 h-5" />
                        <span className="font-medium">Live Demo</span>
                      </motion.a>
                    )}
                    
                    {project.githubLink && (
                      <motion.a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 
                                 hover:from-gray-700 hover:to-gray-800 text-white transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Github className="w-5 h-5" />
                        <span className="font-medium">View Code</span>
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {isImagePreviewOpen && project.images && project.images[selectedImageIndex] && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImagePreviewOpen(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsImagePreviewOpen(false)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 
                         backdrop-blur-sm transition-all duration-300 z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Navigation for multiple images */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(selectedImageIndex === 0 ? project.images!.length - 1 : selectedImageIndex - 1);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
                             bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(selectedImageIndex === project.images!.length - 1 ? 0 : selectedImageIndex + 1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full 
                             bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}

              {project.images[selectedImageIndex]?.url ? (
                <SmartImage
                  src={project.images[selectedImageIndex].url}
                  alt={project.images[selectedImageIndex].alt || project.name}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  width={1200}
                  height={800}
                  showPlaceholder={true}
                />
              ) : (
                <div className="max-w-4xl max-h-[90vh] bg-background-secondary/80 dark:bg-background-secondary-dark/80 rounded-lg flex items-center justify-center p-12">
                  <div className="text-center text-text-tertiary dark:text-text-tertiary-dark">
                    <div className="w-24 h-24 mx-auto mb-4 bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/>
                      </svg>
                    </div>
                    <p>Image not available</p>
                  </div>
                </div>
              )}

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