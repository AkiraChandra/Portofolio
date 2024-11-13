// src/components/sections/Experience/components/TimeLinePoint.tsx

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { TimelinePointProps } from '@/types/experience';
import { config } from '@/config';

const TimelinePoint: React.FC<TimelinePointProps> = ({
  experience,
  isActive,
  onHover,
  onLeave
}) => {
  return (
    <motion.div
      className="relative"
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      initial={config.animations.timeline.point.initial}
      whileHover={config.animations.timeline.point.hover}
    >
      <motion.div
        className={`w-12 h-12 rounded-full flex items-center justify-center
                   ${isActive ? 'bg-primary dark:bg-primary-dark' : 'bg-background-tertiary dark:bg-background-tertiary-dark'}
                   transition-colors duration-300 cursor-pointer relative z-10`}
        animate={isActive ? {
          boxShadow: [
            '0 0 10px rgba(var(--color-primary), 0.3)',
            '0 0 20px rgba(var(--color-primary), 0.5)',
            '0 0 10px rgba(var(--color-primary), 0.3)'
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Image
          src={experience.icon}
          alt={experience.company}
          width={32}
          height={32}
          className="rounded-full"
        />
      </motion.div>
    </motion.div>
  );
};

export default TimelinePoint;