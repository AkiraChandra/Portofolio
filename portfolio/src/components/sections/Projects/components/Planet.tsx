import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlanetProps } from '@/types/projects';

interface EnhancedPlanetProps extends PlanetProps {
  size: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onPlanetClick: () => void;
  isTransitioning: boolean;
  isSelected: boolean;
}

const Planet: React.FC<EnhancedPlanetProps> = ({
  project,
  isActive,
  index,
  totalPlanets,
  size,
  onHoverStart,
  onHoverEnd,
  onPlanetClick,
  isTransitioning,
  isSelected
}) => {
  const planetVariants = {
    initial: { 
      scale: 0, 
      opacity: 0,
      y: 20
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: index * 0.15,
        y: {
          type: "spring",
          stiffness: 150,
          damping: 15
        }
      }
    },
    hover: {
      scale: 1.08,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: isSelected ? {
      scale: [1, 1.2, 0.8],
      y: [-10, -400],
      opacity: [1, 1, 0],
      transition: {
        duration: 1.2,
        times: [0, 0.7, 1],
        ease: [0.4, 0, 0.2, 1]
      }
    } : {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const orbitVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: isActive ? 1 : 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: index * 0.15 + 0.2,
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 1.2 },
    animate: { 
      opacity: isActive ? [0.3, 0.5, 0.3] : 0,
      scale: isActive ? [1.2, 1.25, 1.2] : 1.2,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 1.5,
      transition: {
        duration: 0.3
      }
    }
  };

  const particlesVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: isActive ? 1 : 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className="relative cursor-pointer"
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover={isTransitioning ? undefined : "hover"}
        variants={planetVariants}
        onHoverStart={() => !isTransitioning && onHoverStart()}
        onHoverEnd={() => !isTransitioning && onHoverEnd()}
        onClick={() => !isTransitioning && onPlanetClick()}
      >
        {/* Orbit Ring */}
        <motion.div
          className="absolute inset-0 border-2 border-primary/30 dark:border-primary-dark/30 rounded-full"
          style={{ 
            width: size * 1.2, 
            height: size * 1.2, 
            left: -size * 0.1,
            top: -size * 0.1
          }}
          variants={orbitVariants}
        />

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary-dark/20 
                     filter blur-xl pointer-events-none"
          variants={glowVariants}
        />

        {/* Floating Particles */}
        <motion.div
          className="absolute inset-0"
          variants={particlesVariants}
        >
          {isActive && Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 dark:bg-primary-dark/40 rounded-full"
              animate={{
                y: [-20, -40],
                x: Math.sin(i) * 10,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              style={{
                left: `${50 + Math.cos(i * 45) * 20}%`,
                top: `${50 + Math.sin(i * 45) * 20}%`,
              }}
            />
          ))}
        </motion.div>

        {/* Planet Image */}
        <div className="relative flex items-center justify-center overflow-hidden rounded-full"
             style={{ width: size, height: size }}>
          <Image
            src={project.planetImage}
            alt={project.name}
            width={size}
            height={size}
            className="rounded-full object-cover transform transition-transform duration-300"
            priority
          />

          {/* Active Indicator Ring */}
          {isActive && !isTransitioning && (
            <motion.div
              className="absolute inset-0 border-2 border-primary dark:border-primary-dark rounded-full"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ 
                scale: [1.1, 1.15, 1.1],
                opacity: [0.3, 0.5, 0.3]
              }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Planet Name */}
      {!isTransitioning && (
        <motion.div
          className="absolute -bottom-6 text-center w-full"
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <span className="inline-block text-xs font-medium text-text-primary dark:text-text-primary-dark
                       transition-colors duration-300 whitespace-nowrap px-3 py-1.5
                       bg-background-secondary/40 dark:bg-background-secondary-dark/40
                       backdrop-blur-sm rounded-full">
            {project.name}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default Planet;