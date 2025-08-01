// src/components/sections/Projects/components/Planet.tsx (ENHANCED FOR MOBILE)
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { PlanetProps } from '@/types/projects';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';

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
  // Mobile detection
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Refs for cleanup
  const animationRefs = useRef<{
    pulseTimeout?: NodeJS.Timeout;
    energyTimeout?: NodeJS.Timeout;
    overlayTimeout?: NodeJS.Timeout;
  }>({});

  // Cleanup function
  const cleanupAnimations = () => {
    Object.values(animationRefs.current).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
    animationRefs.current = {};
  };

  // Enhanced cleanup on unmount and route changes
  useEffect(() => {
    const handleRouteChange = () => {
      cleanupAnimations();
    };

    // Listen for navigation events
    window.addEventListener('beforeunload', handleRouteChange);
    window.addEventListener('pagehide', handleRouteChange);
    
    return () => {
      cleanupAnimations();
      window.removeEventListener('beforeunload', handleRouteChange);
      window.removeEventListener('pagehide', handleRouteChange);
    };
  }, []);

  // Reset animation state when transitioning stops
  useEffect(() => {
    if (!isSelected && !isTransitioning) {
      cleanupAnimations();
      // Reset planet element if exists
      const planetElement = document.querySelector(`[data-planet-id="${project.id}"]`);
      if (planetElement) {
        (planetElement as HTMLElement).style.transform = '';
        (planetElement as HTMLElement).style.opacity = '';
      }
    }
  }, [isSelected, isTransitioning, project.id]);

  // Mobile-optimized animations (same visual result, better performance)
  const getMobileOptimizedVariants = () => ({
    initial: { 
      scale: 0, 
      opacity: 0,
      y: isMobile ? 10 : 20, // Smaller movement on mobile
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: isMobile ? 300 : 200, // Faster spring on mobile
        damping: isMobile ? 25 : 20,
        delay: index * (isMobile ? 0.1 : 0.15) // Faster sequence on mobile
      }
    },
    hover: {
      scale: isMobile ? 1.05 : 1.08, // Slightly smaller hover on mobile
      y: isMobile ? -3 : -5,
      transition: {
        type: "spring",
        stiffness: isMobile ? 500 : 400, // Snappier on mobile
        damping: 25
      }
    },
    selected: {
      scale: isMobile ? [1, 1.1, 1.3, 1.8, 3] : [1, 1.2, 1.5, 2, 4], // Smaller scale progression on mobile
      y: isMobile ? [0, -20, -40, -70, -100] : [0, -30, -60, -100, -150],
      opacity: 1,
      transition: {
        duration: isMobile ? 1.5 : 1.8, // Faster on mobile
        times: [0, 0.2, 0.4, 0.6, 1],
        ease: "easeOut"
      }
    },
    reset: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      y: isMobile ? 10 : 20,
      transition: { duration: 0.3 }
    }
  });

  // Mobile-optimized ring animations
  const getMobileRingVariants = () => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: isActive ? 1 : 0,
      scale: 1,
      transition: { duration: isMobile ? 0.4 : 0.6 }
    },
    exit: isSelected ? {
      scale: isMobile ? [1, 1.5, 2, 2.5, 3] : [1, 2, 3, 4, 5],
      opacity: [1, 0.8, 0.6, 0.3, 0],
      rotate: isMobile ? [0, 45, 90, 135, 180] : [0, 90, 180, 270, 360],
      transition: {
        duration: isMobile ? 1.5 : 2,
        times: [0, 0.2, 0.4, 0.6, 1]
      }
    } : {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  });

  // Mobile-optimized glow effects
  const getMobileGlowVariants = () => ({
    initial: { opacity: 0, scale: 1 },
    animate: { 
      opacity: isActive ? (isMobile ? [0.2, 0.3, 0.2] : [0.3, 0.5, 0.3]) : 0,
      scale: isActive ? (isMobile ? [1.05, 1.1, 1.05] : [1.1, 1.2, 1.1]) : 1,
      transition: {
        duration: isMobile ? 2 : 3, // Faster on mobile
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    exit: isSelected ? {
      opacity: isMobile ? [0.2, 0.4, 0.6, 0.4, 0] : [0.3, 0.6, 1, 0.8, 0],
      scale: isMobile ? [1, 1.5, 2.5, 4, 6] : [1, 2, 4, 6, 8],
      transition: {
        duration: isMobile ? 1.5 : 2,
        times: [0, 0.2, 0.4, 0.6, 1]
      }
    } : {
      opacity: 0,
      scale: 1,
      transition: { duration: 0.3 }
    }
  });

  // Simplified pulse rings for mobile
  const PulseRings = () => {
    if (!isSelected) return null;
    
    const ringCount = isMobile ? 2 : 4; // Fewer rings on mobile
    
    return (
      <motion.div
        className="absolute inset-0"
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1 }
        }}
      >
        {Array.from({ length: ringCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary/30 dark:border-primary-dark/30"
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.5 + i * 0.5], // Smaller scale progression on mobile
              opacity: [0.6, 0],
              rotate: [0, 45 * (i + 1)], // Simpler rotation on mobile
            }}
            transition={{
              duration: isMobile ? 1 : (1.5 + i * 0.2),
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

  // Simplified energy particles for mobile
  const EnergyParticles = () => {
    if (!isSelected) return null;
    
    const particleCount = isMobile ? 6 : 12; // Fewer particles on mobile
    
    return (
      <motion.div
        className="absolute inset-0"
        initial="initial"
        animate="animate"
      >
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 dark:bg-primary-dark/60 rounded-full"
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [1, 0],
              x: Math.cos(i * (360 / particleCount) * (Math.PI / 180)) * (isMobile ? 60 : 100),
              y: Math.sin(i * (360 / particleCount) * (Math.PI / 180)) * (isMobile ? 60 : 100),
              opacity: [1, 0],
            }}
            transition={{
              duration: isMobile ? 1 : 1.5,
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

  // Simplified overlay for mobile
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 0 },
    exit: isSelected ? {
      opacity: isMobile ? [0, 0.3, 0.5, 0.7, 1] : [0, 0.2, 0.4, 0.6, 1],
      backdropFilter: isMobile ? [
        'blur(0px)',
        'blur(2px)',
        'blur(4px)',
        'blur(6px)',
        'blur(8px)'
      ] : [
        'blur(0px)',
        'blur(4px)',
        'blur(8px)',
        'blur(12px)',
        'blur(16px)'
      ],
      transition: {
        duration: isMobile ? 1.5 : 2,
        times: [0, 0.2, 0.4, 0.6, 1]
      }
    } : { opacity: 0 }
  };

  const getCurrentAnimationState = () => {
    if (isSelected) return "selected";
    if (!isSelected && isTransitioning) return "reset";
    return "animate";
  };

  const planetVariants = getMobileOptimizedVariants();
  const ringVariants = getMobileRingVariants();
  const glowVariants = getMobileGlowVariants();

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
          data-planet-id={project.id}
          initial="initial"
          animate={getCurrentAnimationState()}
          exit="exit"
          whileHover={isTransitioning ? undefined : "hover"}
          variants={planetVariants}
          onHoverStart={() => !isTransitioning && onHoverStart()}
          onHoverEnd={() => !isTransitioning && onHoverEnd()}
          onClick={() => !isTransitioning && onPlanetClick()}
          key={`planet-${project.id}-${isSelected ? 'selected' : 'normal'}`}
        >
          {/* Pulse rings effect */}
          <PulseRings />

          {/* Energy particles */}
          <EnergyParticles />

          {/* Glow effect - simplified for mobile */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary-dark/20 
                       filter blur-xl pointer-events-none"
            variants={glowVariants}
            style={{
              willChange: 'transform, opacity' // Optimize for animations
            }}
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
              priority={index < 3} // Only prioritize first 3 planets
              loading={index < 3 ? "eager" : "lazy"} // Lazy load non-priority planets
              quality={isMobile ? 75 : 90} // Lower quality on mobile
            />
          </div>

          {/* Active indicator - simplified for mobile */}
          {isActive && !isTransitioning && (
            <motion.div
              className="absolute inset-0 border-2 border-primary dark:border-primary-dark rounded-full"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ 
                scale: isMobile ? [1.1, 1.12, 1.1] : [1.1, 1.15, 1.1],
                opacity: isMobile ? [0.2, 0.4, 0.2] : [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: isMobile ? 2 : 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                willChange: 'transform, opacity'
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
                delay: index * (isMobile ? 0.1 : 0.15) + 0.2,
                duration: isMobile ? 0.3 : 0.4
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