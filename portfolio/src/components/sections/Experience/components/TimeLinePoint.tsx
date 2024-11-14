import React from 'react';
import { motion } from 'framer-motion';
import { TimelineItemProps } from '@/types/experience';

const TimelinePoint: React.FC<TimelineItemProps> = ({
  experience,
  isActive,
  onClick
}) => {
  return (
    <motion.div 
      className="group cursor-pointer flex items-center"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Timeline Point Container */}
      <div className="relative">
        <motion.div
          className="relative z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Main Circle - Made slightly larger */}
          <motion.div
            className={`w-6 h-6 rounded-full flex items-center justify-center
                     transition-colors duration-300 border-3
                     ${isActive 
                       ? 'bg-primary dark:bg-primary-dark border-primary dark:border-primary-dark' 
                       : 'bg-background-primary dark:bg-background-primary-dark border-primary/30 dark:border-primary-dark/30 group-hover:border-primary/50 dark:group-hover:border-primary-dark/50'
                     }`}
            animate={isActive ? {
              boxShadow: [
                '0 0 10px rgba(var(--color-primary), 0.3)',
                '0 0 20px rgba(var(--color-primary), 0.5)',
                '0 0 10px rgba(var(--color-primary), 0.3)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Inner Circle */}
            <div className={`w-3 h-3 rounded-full transition-colors duration-300
                         ${isActive 
                           ? 'bg-primary dark:bg-primary-dark' 
                           : 'bg-primary/30 dark:bg-primary-dark/30 group-hover:bg-primary/50 dark:group-hover:bg-primary-dark/50'
                         }`} 
            />
          </motion.div>
          
          {/* Status Indicator */}
          <div 
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 
                     border-background-primary dark:border-background-primary-dark
                     ${experience.status === 'ongoing' 
                       ? 'bg-green-400 dark:bg-green-500' 
                       : 'bg-blue-400 dark:bg-blue-500'
                     }`}
          />
        </motion.div>
      </div>

      {/* Company Info */}
      <div className="ml-6 group-hover:translate-x-1 transition-transform duration-200">
        <h3 className={`text-base font-medium transition-colors duration-300
                     ${isActive 
                       ? 'text-primary dark:text-primary-dark' 
                       : 'text-text-primary dark:text-text-primary-dark group-hover:text-primary dark:group-hover:text-primary-dark'
                     }`}>
          {experience.company}
        </h3>
        <div className="mt-0.5">
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
            {experience.role}
          </p>
          <span className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
            {experience.period}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelinePoint;