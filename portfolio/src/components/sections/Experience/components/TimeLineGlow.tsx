import React from 'react';
import { motion } from 'framer-motion';

interface TimelineGlowProps {
  isActive: boolean;
  color?: string;
}

const TimelineGlow: React.FC<TimelineGlowProps> = ({ 
  isActive,
  color = 'var(--color-primary)'
}) => {
  if (!isActive) return null;

  return (
    <motion.div className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Outer Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            `0 0 20px ${color}33`,
            `0 0 40px ${color}33`,
            `0 0 20px ${color}33`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Middle Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            `0 0 10px ${color}66`,
            `0 0 20px ${color}66`,
            `0 0 10px ${color}66`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2
        }}
      />

      {/* Inner Glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            `0 0 5px ${color}99`,
            `0 0 10px ${color}99`,
            `0 0 5px ${color}99`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.4
        }}
      />
    </motion.div>
  );
};

export default TimelineGlow;