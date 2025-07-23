// src/components/sections/Projects/components/ConnectingLine.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ConnectingLineProps } from '@/types/projects';

const ConnectingLine: React.FC<ConnectingLineProps> = ({
  progress,
  isActive,
  width = 240
}) => {
  return (
    <div className="relative" style={{ width: `${width}px` }}>
      {/* Base Line */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full h-0.5">
        <div className="absolute inset-0 bg-white/5" />
        
        {/* Progress Line */}
        <motion.div
          className="absolute h-full origin-left"
          initial={false}
          animate={{ 
            width: `${progress}%`,
            opacity: isActive ? 1 : progress === 100 ? 0.7 : 0.5
          }}
          transition={{ 
            width: { duration: 0.3, ease: "linear" },
            opacity: { duration: 0.2 }
          }}
          style={{
            background: 'linear-gradient(90deg, rgba(246, 176, 13, 1) 0%, rgba(243, 235, 0, 1) 100%)'
          }}
        >
          {/* Glow Effect */}
          <motion.div 
            className="absolute inset-0 blur-sm"
            style={{
              background: 'linear-gradient(90deg, rgba(246, 176, 13, 0.5) 0%, rgba(243, 235, 0, 0.5) 100%)'
            }}
          />
        </motion.div>

        {/* End Points */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ background: '#F6B00D' }}
        />
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ background: '#F3EB00' }}
        />
      </div>
    </div>
  );
};

export default ConnectingLine;