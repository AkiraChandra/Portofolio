// src/components/sections/Experience/components/TimelineInfo.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineInfoProps } from '@/types/experience';
import { config } from '@/config';

const TimelineInfo: React.FC<TimelineInfoProps> = ({ experience, isVisible }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          variants={config.animations.timeline.info}
          initial="initial"
          animate="animate"
          exit="exit"
          className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 
                     backdrop-blur-lg rounded-lg p-6 shadow-lg border border-white/10
                     w-full max-w-lg"
        >
          <h3 className="text-xl font-bold text-primary dark:text-primary-dark mb-2">
            {experience.company}
          </h3>
          
          <div className="flex flex-col space-y-1 mb-4">
            <p className="text-lg text-text-primary dark:text-text-primary-dark">
              {experience.role}
            </p>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              {experience.period}
            </p>
          </div>
          
          <p className="text-text-secondary dark:text-text-secondary-dark mb-4">
            {experience.description}
          </p>
          
          <ul className="space-y-2">
            {experience.achievements.map((achievement, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center space-x-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-primary-dark" />
                <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  {achievement}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimelineInfo;