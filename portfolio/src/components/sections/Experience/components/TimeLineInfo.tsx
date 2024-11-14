import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineInfoProps } from '@/types/experience';

const TimelineInfo: React.FC<TimelineInfoProps> = ({ 
  experience,
  isVisible
}) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative -ml-[42px] mb-20" // Adjusted margin to prevent overlap
        >
          <div className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                       backdrop-blur-lg rounded-lg shadow-lg overflow-hidden
                       border border-border-primary dark:border-border-primary-dark"
          >
            <div className="p-8 grid grid-cols-2 gap-8">
              {/* Overview Section */}
              <div>
                <h4 className="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-4">
                  Overview
                </h4>
                <p className="text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed">
                  {experience.description}
                </p>
                
                {experience.location && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-dark" />
                    <span className="text-sm text-text-tertiary dark:text-text-tertiary-dark">
                      {experience.location}
                    </span>
                  </div>
                )}
              </div>

              {/* Achievements Section */}
              <div className="border-l border-border-primary dark:border-border-primary-dark pl-8">
                <h4 className="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-4">
                  Key Achievements
                </h4>
                <ul className="space-y-3">
                  {experience.achievements.map((achievement, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-dark mt-2 shrink-0" />
                      <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
                        {achievement}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimelineInfo;