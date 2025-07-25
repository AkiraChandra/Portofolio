// src/components/sections/Projects/ProjectDetail.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types/projects';
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
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MovingStars from '@/components/ui/animations/Movingstars';
import SmartImage from '@/components/common/SmartImage';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import FileViewer from '@/utils/helpers/FileViewer';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const router = useRouter();
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);



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
      <div className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark">
        {/* Background Stars - Same as Projects page */}
        <div className="absolute inset-0 overflow-hidden">
          <MovingStars />
        </div>

        {/* Gradient Overlay - Same as Projects page */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />

        {/* Main Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          {/* Back Button */}
          <motion.button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-text-primary dark:text-text-primary-dark 
                     hover:text-primary dark:hover:text-primary-dark transition-colors duration-300
                     bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                     backdrop-blur-sm rounded-lg px-4 py-2 border border-border-primary/20 
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Project Images */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Planet Image */}
              <motion.div
                className="relative aspect-square max-w-md mx-auto planet-glow-effect"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {project.planetImage ? (
                  <SmartImage
                    src={project.planetImage}
                    alt={`${project.name} planet`}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover rounded-full border-4 border-primary/30 dark:border-primary-dark/30 shadow-2xl"
                    showPlaceholder={true}
                  />
                ) : (
                  <PlaceholderImage type="project" className="w-full h-full rounded-full" />
                )}
              </motion.div>
            </motion.div>

            {/* Right Column - Project Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Project Header */}
              <div className="space-y-4">
                <motion.h1
                  className="text-3xl lg:text-4xl xl:text-5xl font-bold 
                           text-text-primary dark:text-text-primary-dark"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {project.name}
                </motion.h1>

                <motion.p
                  className="text-lg text-text-secondary dark:text-text-secondary-dark leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {project.previewContent.description}
                </motion.p>
              </div>

              {/* Project Features */}
              {project.previewContent?.features && project.previewContent.features.length > 0 && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark 
                               flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary dark:text-primary-dark" />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {project.previewContent.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3 text-text-secondary dark:text-text-secondary-dark"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-primary dark:bg-primary-dark 
                                      mt-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Tech Stack */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark 
                             flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary dark:text-primary-dark" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <motion.span
                      key={tech}
                      className="px-4 py-2 bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                               text-text-primary dark:text-text-primary-dark rounded-full text-sm font-medium
                               border border-border-primary/20 dark:border-border-primary-dark/20
                               backdrop-blur-sm hover:bg-primary/10 dark:hover:bg-primary-dark/10
                               transition-colors duration-300"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                {project.demoLink && (
                  <motion.a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-primary dark:bg-primary-dark 
                             text-white rounded-lg font-medium shadow-lg
                             hover:bg-primary/90 dark:hover:bg-primary-dark/90
                             transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={20} />
                    Live Demo
                  </motion.a>
                )}
                
                {project.githubLink && (
                  <motion.a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 border-2 border-border-primary/30 
                             dark:border-border-primary-dark/30 text-text-primary dark:text-text-primary-dark
                             rounded-lg font-medium backdrop-blur-sm
                             hover:border-primary dark:hover:border-primary-dark
                             hover:bg-primary/5 dark:hover:bg-primary-dark/5
                             transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={20} />
                    View Code
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
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
                         text-white rounded-full p-2 backdrop-blur-sm transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Main Preview Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                {project.images[selectedImageIndex]?.url ? (
                  <SmartImage
                    src={project.images[selectedImageIndex]?.url}
                    alt={project.images[selectedImageIndex]?.alt || `${project.name} preview`}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    showPlaceholder={true}
                  />
                ) : (
                  <PlaceholderImage type="project" className="max-w-full max-h-full" />
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
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm 
                              text-white px-4 py-2 rounded-lg max-w-md text-center">
                  {project.images[selectedImageIndex].caption}
                </div>
              )}

              {/* Image Counter */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm 
                            text-white px-3 py-1 rounded-full text-sm">
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