// src/components/sections/Experience/Experience.tsx

import React from 'react';
import { motion } from 'framer-motion';
import TimelinePoint from './components/TimeLinePoint';
import TimelineInfo from './components/TimeLineInfo';
import MovingStars from '@/components/ui/animations/Movingstars';
import { experiences } from '@/data/experience';
import { Experience as ExperienceType } from '@/types/experience';
import { useExperienceTransition } from '@/hooks/experience/useExperienceTransition';
import { config } from '@/config';

const Experience: React.FC = () => {
  const { activeIndex, setActiveIndex, isTransitioning } = useExperienceTransition();

  return (
    <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark 
                        transition-colors duration-300 overflow-hidden snap-start">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <MovingStars />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
            My <span className="text-primary dark:text-primary-dark">Journey</span>
          </h2>
          <p className="text-text-secondary dark:text-text-secondary-dark max-w-2xl mx-auto">
            Explore my space mission throughout the years
          </p>
        </motion.div>

        <div className="flex justify-center">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent 
                          via-primary/20 dark:via-primary-dark/20 to-transparent" />

            {/* Experience Points */}
            <div className="relative">
              {experiences.map((exp: ExperienceType, index) => (
                <div
                  key={exp.id}
                  className="mb-32 relative"
                  style={{ 
                    opacity: isTransitioning ? 0.5 : 1,
                    transition: 'opacity 0.3s'
                  }}
                >
                  <div className="flex items-start">
                    <TimelinePoint
                      experience={exp}
                      isActive={index === activeIndex}
                      onHover={() => setActiveIndex(index)}
                      onLeave={() => {}}
                    />
                    
                    <div className="ml-8">
                      <TimelineInfo
                        experience={exp}
                        isVisible={index === activeIndex}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;