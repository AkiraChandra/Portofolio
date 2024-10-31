import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlanetProps } from '@/types/projects';

interface EnhancedPlanetProps extends PlanetProps {
  size: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const Planet: React.FC<EnhancedPlanetProps> = ({
  project,
  isActive,
  index,
  totalPlanets,
  size,
  onHoverStart,
  onHoverEnd
}) => {
  // Animation variants
  const planetVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.2
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    active: {
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Glow effect variants
  const glowVariants = {
    initial: { opacity: 0, scale: 1.2 },
    animate: { 
      opacity: isActive ? [0.4, 0.6, 0.4] : 0,
      scale: isActive ? [1.2, 1.3, 1.2] : 1.2,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      opacity: 0.6,
      scale: 1.3,
      transition: {
        duration: 0.3
      }
    }
  };

  const rotationVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <motion.div
      className="relative"
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={planetVariants}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary-dark/20 
                   filter blur-xl pointer-events-none"
        variants={glowVariants}
      />

      {/* Planet Container */}
      <motion.div
        className="relative"
        variants={rotationVariants}
        style={{
          width: size,
          height: size
        }}
      >
        <Image
          src={project.planetImage}
          alt={project.name}
          width={size}
          height={size}
          className="rounded-full object-cover"
          priority
        />

        {/* Active Indicator Ring */}
        {isActive && (
          <motion.div
            className="absolute inset-0 border-2 border-primary dark:border-primary-dark rounded-full"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ 
              scale: [1.1, 1.2, 1.1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Planet Name */}
      <motion.div
        className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 + 0.3 }}
      >
        <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
          {project.name}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default Planet;