'use client';

import { ProgressLineProps } from "@/types/projects";

// src/components/sections/Projects/components/ProgressLine.tsx
const ProgressLine: React.FC<ProgressLineProps> = ({
    startIndex,
    endIndex,
    progress,
    isActive
  }) => {
    return (
      <div className="relative flex items-center h-1 w-16 lg:w-24">
        {/* Base Line */}
        <div className="absolute w-full h-0.5 bg-border-primary/20 dark:bg-border-primary-dark/20 rounded-full" />
  
        {/* Progress Line */}
        <motion.div
          className="absolute h-0.5 rounded-full bg-gradient-to-r from-primary via-primary to-primary-dark 
                     dark:from-primary-dark dark:via-primary-dark dark:to-primary"
          style={{
            width: `${progress}%`,
            opacity: isActive ? 1 : progress === 100 ? 0.5 : 0.2
          }}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 blur-sm bg-primary dark:bg-primary-dark opacity-50" />
        </motion.div>
      </div>
    );
  };
  
  export default ProgressLine;