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
    setActiveIndex(prev => prev === index ? null : index);
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
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
            My <span className="text-primary dark:text-primary-dark">Journey</span>
          </h2>
          <p className="text-text-secondary dark:text-text-secondary-dark">
            Explore my space mission throughout the years
          </p>
        </div>

        {/* Timeline Container */}
        <div className="flex min-h-[600px] gap-12">
          {/* Timeline Column */}
          <div className="w-[280px] relative">
            {/* Vertical Line */}
            <div className="absolute left-[45px] top-[30px] bottom-6 w-0.5 bg-primary/30 dark:bg-primary-dark/30" />

            {/* Timeline Items */}
            <div className="space-y-32 relative">
              {experiences.map((exp: ExperienceType, index: number) => (
                <div key={exp.id} className="relative">
                  <div className="flex items-start gap-3">
                    <TimelinePoint
                      experience={exp}
                      isActive={index === activeIndex}
                      onClick={() => handleExperienceClick(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Card Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeIndex !== null && (
                <motion.div
                  key={`info-${activeIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="sticky top-20"
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