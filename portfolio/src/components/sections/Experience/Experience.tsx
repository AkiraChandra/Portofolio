// File: /src/components/sections/Experience/Experience.tsx
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
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
            My{" "}
            <span className="text-primary dark:text-primary-dark">Journey</span>
          </h2>
          <p className="text-text-secondary dark:text-text-secondary-dark">
            Explore my space mission throughout the years
          </p>
        </div>

        {/* Timeline Container with Fixed Height */}
        <div className="flex gap-6 lg:gap-14">
          {/* Timeline Column - Fixed Height */}
          <div className="w-[280px] md:w-[320px] lg:w-[380px] relative">
            <div className="h-[700px] overflow-y-auto hide-scrollbar pr-2 lg:pr-4">
              {/* Timeline Items */}
              <div className="space-y-[80px] relative pb-4">
                {experiences.map((exp: ExperienceType, index: number) => (
                  <div key={exp.id} className="relative">
                    <TimelinePoint
                      experience={exp}
                      isActive={index === activeIndex}
                      onClick={() => handleExperienceClick(index)}
                      isLast={index === experiences.length - 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Card Area - Fixed Height */}
          <div className="flex-1 hidden md:block h-[600px]">
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