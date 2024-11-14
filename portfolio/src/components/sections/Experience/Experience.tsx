// src/components/sections/Experience/Experience.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimelinePoint from './components/TimeLinePoint';
import TimelineInfo from './components/TimeLineInfo';
import MovingStars from '@/components/ui/animations/Movingstars';
import { experiences } from '@/data/experience';
import type { Experience as ExperienceType } from '@/types/experience';

const Experience: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleExperienceClick = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark transition-colors duration-300 px-4">
      {/* Background Stars */}
      <div className="absolute inset-0 z-0">
        <MovingStars />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto py-20">
        {/* Header - Optimized for mobile */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-2 sm:mb-4">
            My{" "}
            <span className="text-primary dark:text-primary-dark">Journey</span>
          </h2>
          <p className="text-sm sm:text-base text-text-secondary dark:text-text-secondary-dark">
            Explore my space mission throughout the years
          </p>
        </div>

        {/* Timeline Container - Mobile Optimized */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-14">
                      {/* Timeline Column */}
          <div className="w-full lg:w-[380px] relative h-[calc(100vh-150px)]">
            {/* Mobile Timeline Container */}
            <div className="h-full overflow-y-auto hide-scrollbar pr-2 lg:pr-4">

              {/* Timeline Items */}
              <div className="space-y-6 sm:space-y-[80px] relative pb-4">
                {experiences.map((exp: ExperienceType, index: number) => (
                  <div key={exp.id} className="relative">
                    <TimelinePoint
                      experience={exp}
                      isActive={index === activeIndex}
                      onClick={() => handleExperienceClick(index)}
                      isLast={index === experiences.length - 1}
                    />
                    
                    {/* Mobile-only Info Card */}
                    <AnimatePresence>
                      {activeIndex === index && (
                        <div className="block lg:hidden mt-4">
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                                     backdrop-blur-sm rounded-lg p-4 border border-border-primary/50 
                                     dark:border-border-primary-dark/50"
                          >
                            <div className="space-y-3">
                              {/* Quick Info */}
                              <div className="text-sm text-text-secondary dark:text-text-secondary-dark">
                                <p className="mb-2">{exp.description}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {exp.technologies?.slice(0, 4).map((tech) => (
                                    <span
                                      key={tech}
                                      className="px-2 py-1 text-xs rounded-full
                                               bg-primary/10 dark:bg-primary-dark/10
                                               text-primary dark:text-primary-dark
                                               border border-primary/20 dark:border-primary-dark/20"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Mobile Project Gallery Carousel */}
{exp.projectImages && exp.projectImages.length > 0 && (
  <motion.div 
    className="mb-6 w-full"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <h4 className="text-sm font-medium text-text-primary dark:text-text-primary-dark mb-3 flex items-center gap-2">
      <span>Project Gallery</span>
      <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
        (Swipe to explore)
      </span>
    </h4>
    
    {/* Carousel Container with ScrollArea */}
    <div className="relative group">
      <div className="relative rounded-xl overflow-hidden">
        {/* Main Carousel Container with Improved Touch Handling */}
        <div 
          className="flex overflow-x-scroll hide-scrollbar snap-x snap-mandatory touch-pan-x"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          {exp.projectImages.map((image, idx) => (
            <div
              key={idx}
              className="flex-none w-[calc(100vw-48px)] sm:w-[300px] px-1 first:pl-0 last:pr-0 snap-center"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-background-tertiary dark:bg-background-tertiary-dark">
                {/* Shimmer Loading Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                
                {/* Project Image with Optimized Loading */}
                <img
                  src={image.url}
                  alt={image.caption || `Project image ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                {/* Always Visible Caption for Better Mobile UX */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                  <p className="text-white text-sm font-medium line-clamp-2">
                    {image.caption || `Project Screenshot ${idx + 1}`}
                  </p>
                </div>

                {/* Image Counter Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
                  <p className="text-white text-xs font-medium">
                    {idx + 1}/{exp.projectImages?.length}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Improved Scroll Indicators */}
        <div className="absolute bottom-3 left-0 right-0 z-10">
          <div className="flex justify-center items-center gap-1">
            {exp.projectImages.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === 0 
                    ? 'w-4 bg-white' 
                    : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Initial Swipe Indicator - More Subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: 1,
          repeatType: "reverse",
          delay: 1
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
      >
        <div className="text-white/90 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium">
          Swipe to view more
        </div>
      </motion.div>
    </div>
  </motion.div>
)}

                              {/* Key Achievements - Mobile Compact View */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
                                  Key Achievements
                                </h4>
                                <ul className="space-y-2">
                                  {exp.achievements.slice(0, 3).map((achievement, idx) => (
                                    <motion.li
                                      key={idx}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.1 }}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-dark mt-1.5 shrink-0" />
                                      <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
                                        {achievement}
                                      </span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Info Card Area - Hidden on Mobile */}
          <div className="hidden lg:block flex-1 h-[600px]">
            <AnimatePresence mode="wait">
              {activeIndex !== null && (
                <motion.div
                  key={`info-${activeIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <TimelineInfo
                    experience={experiences[activeIndex]}
                    isVisible={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;