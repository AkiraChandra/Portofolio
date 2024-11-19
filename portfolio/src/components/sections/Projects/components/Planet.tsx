import React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
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
  // Initial animation dan hover state
  const planetVariants = {
    initial: { 
      scale: 0, 
      opacity: 0,
      y: 20,
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: index * 0.15
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
    selected: {
      scale: [1, 1.2, 1.5, 2, 4],
      y: [0, -30, -60, -100, -150],
      opacity: 1,
      transition: {
        duration: 1.8,
        times: [0, 0.2, 0.4, 0.6, 1],
        ease: "easeOut"
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 }
    }
  };

  // Ring animation
  const ringVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: isActive ? 1 : 0,
      scale: 1,
      transition: { duration: 0.6 }
    },
    exit: isSelected ? {
      scale: [1, 2, 3, 4, 5],
      opacity: [1, 0.8, 0.6, 0.3, 0],
      rotate: [0, 90, 180, 270, 360],
      transition: {
        duration: 2,
        times: [0, 0.2, 0.4, 0.6, 1]
      }
    } : {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  // Glow effect
  const glowVariants = {
    initial: { opacity: 0, scale: 1 },
    animate: { 
      opacity: isActive ? [0.3, 0.5, 0.3] : 0,
      scale: isActive ? [1.1, 1.2, 1.1] : 1,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    exit: isSelected ? {
      opacity: [0.3, 0.6, 1, 0.8, 0],
      scale: [1, 2, 4, 6, 8],
      filter: [
        'blur(10px) hue-rotate(0deg)',
        'blur(20px) hue-rotate(90deg)',
        'blur(30px) hue-rotate(180deg)',
        'blur(40px) hue-rotate(270deg)',
        'blur(50px) hue-rotate(360deg)'
      ],
      transition: {
        duration: 2,
        times: [0, 0.2, 0.4, 0.6, 1]
      }
    } : {
      opacity: 0,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  // Overlay fade effect
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 0 },
    exit: isSelected ? {
      opacity: [0, 0.2, 0.4, 0.6, 1],
      backdropFilter: [
        'blur(0px)',
        'blur(4px)',
        'blur(8px)',
        'blur(12px)',
        'blur(16px)'
      ],
      transition: {
        duration: 2,
        times: [0, 0.2, 0.4, 0.6, 1]
      }
    } : { opacity: 0 }
  };

  // Pulse rings effect
  const PulseRings = () => {
    return (
      <motion.div
        className="absolute inset-0"
        initial="initial"
        animate={isSelected ? "animate" : "initial"}
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1 }
        }}
      >
        {isSelected && Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary/30 dark:border-primary-dark/30"
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 2 + i],
              opacity: [0.6, 0],
              rotate: [0, 90 * (i + 1)],
            }}
            transition={{
              duration: 1.5 + i * 0.2,
              ease: "easeOut",
              delay: i * 0.1,
              repeat: 2,
              repeatType: "loop"
            }}
          />
        ))}
      </motion.div>
    );
  };

  // Energy particles effect
  const EnergyParticles = () => {
    return (
      <motion.div
        className="absolute inset-0"
        initial="initial"
        animate={isSelected ? "animate" : "initial"}
      >
        {isSelected && Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 dark:bg-primary-dark/60 rounded-full"
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [1, 0],
              x: Math.cos(i * 30 * (Math.PI / 180)) * (100 + Math.random() * 50),
              y: Math.sin(i * 30 * (Math.PI / 180)) * (100 + Math.random() * 50),
              opacity: [1, 0],
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              delay: i * 0.05,
              repeat: 2,
              repeatType: "loop"
            }}
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
    <div className="relative flex flex-col items-center">
      {/* Background overlay */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black pointer-events-none z-50"
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      />

      {/* Main planet container */}
      <motion.div
        className="relative cursor-pointer z-10"
        initial="initial"
        animate={isSelected ? "selected" : "animate"}
        exit="exit"
        whileHover={isTransitioning ? undefined : "hover"}
        variants={planetVariants}
        onHoverStart={() => !isTransitioning && onHoverStart()}
        onHoverEnd={() => !isTransitioning && onHoverEnd()}
        onClick={() => !isTransitioning && onPlanetClick()}
      >
        {/* Pulse rings effect */}
        <PulseRings />

        {/* Energy particles */}
        <EnergyParticles />

        {/* Orbit ring */}
        <motion.div
          className="absolute inset-0 border-2 border-primary/30 dark:border-primary-dark/30 rounded-full"
          style={{ 
            width: size * 1.2, 
            height: size * 1.2, 
            left: -size * 0.1,
            top: -size * 0.1
          }}
          variants={ringVariants}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary-dark/20 
                     filter blur-xl pointer-events-none"
          variants={glowVariants}
        />

        {/* Planet image */}
        <div 
          className={`relative flex items-center justify-center overflow-hidden rounded-full
                     ${isSelected ? 'shadow-2xl shadow-primary/50 dark:shadow-primary-dark/50' : ''}`}
          style={{ width: size, height: size }}>
          <Image
            src={project.planetImage}
            alt={project.name}
            width={size}
            height={size}
            className="rounded-full object-cover transform transition-transform duration-300"
            priority
          />
        </div>

        {/* Active indicator */}
        {isActive && !isTransitioning && (
          <motion.div
            className="absolute inset-0 border-2 border-primary dark:border-primary-dark rounded-full"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ 
              scale: [1.1, 1.15, 1.1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Planet name */}
      {!isTransitioning && (
        <motion.div
          className="absolute -bottom-6 text-center w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1,
            y: 0,
            transition: {
              delay: index * 0.15 + 0.2,
              duration: 0.4
            }
          }}
          exit={{ opacity: 0, y: 10 }}
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
    </AnimatePresence>
  );
};

export default Planet;