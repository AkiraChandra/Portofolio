import React from 'react';
import { motion } from 'framer-motion';
import { ConnectingLineProps } from '@/types/projects';

const ConnectingLine: React.FC<ConnectingLineProps> = ({
  progress,
  isActive
}) => {
  return (
    <div className="min-w-[240px] lg:min-w-[320px] h-[2px] relative mx-4">
      {/* Base Line */}
      <div className="absolute inset-0 bg-white/10" />

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
          background: 'linear-gradient(90deg, #F6B00D 0%, #F3EB00 100%)'
        }}
      >
        {/* Subtle Glow Effect */}
        <motion.div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, #F6B00D 0%, #F3EB00 100%)',
            filter: 'blur(2px)',
            opacity: 0.4
          }}
        />
      </motion.div>

      {/* End Points */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
           style={{ background: '#F6B00D' }} />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
           style={{ background: '#F3EB00' }} />
    </div>
  );
};

export default ConnectingLine;