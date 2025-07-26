// src/components/common/navigations/ScrollIndicators.tsx
"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollRouter } from '@/hooks/common/useScrollRouter';
import { SECTIONS } from '@/utils/navigation/sectionUtils';

interface ScrollIndicatorsProps {
  className?: string;
  position?: 'left' | 'right';
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ScrollIndicators: React.FC<ScrollIndicatorsProps> = ({
  className = '',
  position = 'right',
  showLabels = false,
  size = 'md'
}) => {
  const sections = SECTIONS.map(section => ({
    id: section.id,
    path: section.path
  }));

  const { activeSection, navigateToSection, isScrolling } = useScrollRouter(sections, {
    threshold: 0.6,
    rootMargin: '-10% 0px -10% 0px',
  });

  const sizeClasses = {
    sm: {
      dot: 'w-2 h-2',
      activeDot: 'w-6 h-2',
      container: 'gap-3',
      label: 'text-xs'
    },
    md: {
      dot: 'w-3 h-3',
      activeDot: 'w-8 h-3',
      container: 'gap-4',
      label: 'text-sm'
    },
    lg: {
      dot: 'w-4 h-4',
      activeDot: 'w-10 h-4',
      container: 'gap-5',
      label: 'text-base'
    }
  };

  const positionClasses = {
    left: 'left-4 lg:left-8',
    right: 'right-4 lg:right-8'
  };

  return (
    <div 
      className={`fixed top-1/2 transform -translate-y-1/2 z-40 ${positionClasses[position]} ${className}`}
    >
      <div className={`flex flex-col items-center ${sizeClasses[size].container}`}>
        {SECTIONS.map((section, index) => {
          const isActive = activeSection === section.id;
          const isNavigating = isScrolling && activeSection === section.id;
          
          return (
            <motion.div
              key={section.id}
              className="group relative flex items-center"
              initial={{ opacity: 0, x: position === 'right' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Label */}
              <AnimatePresence>
                {showLabels && (
                  <motion.div
                    className={`absolute ${position === 'right' ? 'right-full mr-4' : 'left-full ml-4'} 
                               bg-background-secondary/90 dark:bg-background-secondary-dark/90 
                               backdrop-blur-sm rounded-lg px-3 py-1 border border-border-primary/20 dark:border-border-primary-dark/20
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <span className={`${sizeClasses[size].label} text-text-primary dark:text-text-primary-dark font-medium whitespace-nowrap`}>
                      {section.title}
                    </span>
                    
                    {/* Arrow */}
                    <div 
                      className={`absolute top-1/2 transform -translate-y-1/2 
                                 ${position === 'right' ? 'left-full' : 'right-full'} 
                                 w-2 h-2 bg-background-secondary/90 dark:bg-background-secondary-dark/90 
                                 border-r border-b border-border-primary/20 dark:border-border-primary-dark/20 
                                 ${position === 'right' ? 'rotate-45' : '-rotate-45'}`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dot Indicator */}
              <motion.button
                onClick={() => navigateToSection(section.id)}
                className={`relative rounded-full cursor-pointer transition-all duration-300 
                           ${isActive 
                             ? `${sizeClasses[size].activeDot} bg-primary dark:bg-primary-dark` 
                             : `${sizeClasses[size].dot} bg-text-tertiary/40 dark:bg-text-tertiary-dark/40 hover:bg-text-secondary dark:hover:bg-text-secondary-dark`
                           }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Navigate to ${section.title} section`}
              >
                {/* Active indicator glow */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30 dark:bg-primary-dark/30 blur-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Loading indicator */}
                {isNavigating && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/50 dark:border-primary-dark/50"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {/* Tooltip on hover */}
                <motion.div
                  className={`absolute ${position === 'right' ? 'right-full mr-2' : 'left-full ml-2'} 
                             top-1/2 transform -translate-y-1/2 
                             bg-text-primary dark:bg-text-primary-dark text-background-primary dark:text-background-primary-dark 
                             px-2 py-1 rounded text-xs font-medium whitespace-nowrap
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {section.title}
                </motion.div>
              </motion.button>

              {/* Connection line to next dot */}
              {index < SECTIONS.length - 1 && (
                <motion.div
                  className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 
                           w-px bg-border-primary/20 dark:bg-border-primary-dark/20"
                  style={{ height: sizeClasses[size].container === 'gap-3' ? '12px' : sizeClasses[size].container === 'gap-4' ? '16px' : '20px' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px bg-primary/60 dark:bg-primary-dark/60 origin-top"
        style={{
          height: `${((SECTIONS.findIndex(s => s.id === activeSection) + 1) / SECTIONS.length) * 100}%`
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default ScrollIndicators;