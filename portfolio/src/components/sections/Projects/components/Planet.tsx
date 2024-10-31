'use client';

import React from 'react';
import Image from 'next/image';
import { motion, TargetAndTransition, Variant } from 'framer-motion';
import { PlanetProps } from '@/types/projects';
import { usePlanetAnimation } from '@/hooks/projects/usePlanetAnimation';

const Planet: React.FC<PlanetProps> = ({
  project,
  isActive,
  index,
  totalPlanets
}) => {
  const { rotateAnimation, scaleAnimation } = usePlanetAnimation(isActive);

  // Define proper animation types
  const containerAnimation: TargetAndTransition = {
    opacity: 1,
    y: 0
  };

  const planetAnimation: TargetAndTransition = {
    rotate: rotateAnimation.rotate,
    scale: scaleAnimation.scale
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 1 },
    animate: {
      opacity: [0.2, 0.4],
      scale: [1, 1.1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };

  const indicatorVariants = {
    initial: { scale: 1.1, opacity: 0 },
    animate: { 
      scale: 1.2, 
      opacity: 1,
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, y: 50 }}
      animate={containerAnimation}
      transition={{ delay: index * 0.2, duration: 0.5 }}
    >
      {/* Planet Container */}
      <motion.div
        className="relative w-24 h-24 lg:w-32 lg:h-32 cursor-pointer"
        animate={planetAnimation}
        whileHover={{ scale: 1.1 }}
        transition={rotateAnimation.transition}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          variants={glowVariants}
          initial="initial"
          animate={isActive ? "animate" : "initial"}
          style={{
            background: `radial-gradient(circle, rgb(var(--color-primary)) 0%, transparent 70%)`
          }}
        />

        {/* Planet Image */}
        <div className="relative w-full h-full">
          <Image
            src={project.planetImage}
            alt={project.name}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Active Indicator Ring */}
        {isActive && (
          <motion.div
            className="absolute inset-0 border-2 border-primary dark:border-primary-dark rounded-full"
            variants={indicatorVariants}
            initial="initial"
            animate="animate"
          />
        )}
      </motion.div>

      {/* Project Name */}
      <motion.p
        className="mt-4 text-sm lg:text-base font-medium text-text-primary dark:text-text-primary-dark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.2 + 0.3 }}
      >
        {project.name}
      </motion.p>
    </motion.div>
  );
};

export default Planet;