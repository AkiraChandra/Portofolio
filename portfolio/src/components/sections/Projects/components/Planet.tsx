// src/components/sections/Projects/components/Planet.tsx (ENHANCED WITH SECTION ACTIVITY)
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { PlanetProps } from '@/types/projects';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';
import { usePlanetAnimation } from '@/hooks/projects/usePlanetAnimation'; // ✅ ADD: Import planet animation hook

interface EnhancedPlanetProps extends PlanetProps {
  size: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onPlanetClick: () => void;
  isTransitioning: boolean;
  isSelected: boolean;
  sectionActive?: boolean; // ✅ ADD: Section activity status
}

const Planet: React.FC<EnhancedPlanetProps> = ({
  project,
  isActive,
  index,
  size,
  onHoverStart,
  onHoverEnd,
  onPlanetClick,
  isTransitioning,
  isSelected,
  sectionActive = true // ✅ ADD: Default to true for backward compatibility
}) => {
  // Mobile detection
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // ✅ ADD: Hover state for planet animation
  const [isHovered, setIsHovered] = useState(false);
  
  // ✅ ADD: Use planet animation hook for rotation
  const { rotateAnimation, scaleAnimation } = usePlanetAnimation(
    isActive && sectionActive, // Only animate when both planet and section are active
    isHovered
  );
  
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

  // ✅ ENHANCED: Cleanup when section becomes inactive
  useEffect(() => {
    if (!sectionActive) {
      cleanupAnimations();
    }
  }, [sectionActive]);

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

  // ✅ ENHANCED: Mobile-optimized glow effects with section activity
  const getMobileGlowVariants = () => ({
    initial: { opacity: 0, scale: 1 },
    animate: { 
      opacity: (isActive && sectionActive) ? (isMobile ? [0.2, 0.3, 0.2] : [0.3, 0.5, 0.3]) : 0,
      scale: (isActive && sectionActive) ? (isMobile ? [1.05, 1.1, 1.05] : [1.1, 1.2, 1.1]) : 1,
      transition: {
        duration: isMobile ? 2 : 3, // Faster on mobile
        repeat: (isActive && sectionActive) ? Infinity : 0, // ✅ FIXED: Stop repeat when inactive
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

  // ✅ ENHANCED: Simplified pulse rings for mobile with section activity
  const PulseRings = () => {
    if (!isSelected || !sectionActive) return null; // ✅ Don't render if section inactive
    
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
              repeat: sectionActive ? 2 : 0, // ✅ FIXED: Stop repeat when section inactive
              repeatType: "loop"
            }}
          />
        ))}
      </motion.div>
    );
  };

  // ✅ ENHANCED: Simplified energy particles for mobile with section activity
  const EnergyParticles = () => {
    if (!isSelected || !sectionActive) return null; // ✅ Don't render if section inactive
    
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
              repeat: sectionActive ? 2 : 0, // ✅ FIXED: Stop repeat when section inactive
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
          onHoverStart={() => {
            if (!isTransitioning) {
              setIsHovered(true); // ✅ ADD: Set hover state
              onHoverStart();
            }
          }}
          onHoverEnd={() => {
            if (!isTransitioning) {
              setIsHovered(false); // ✅ ADD: Reset hover state
              onHoverEnd();
            }
          }}
          onClick={() => !isTransitioning && onPlanetClick()}
          key={`planet-${project.id}-${isSelected ? 'selected' : 'normal'}`}
          style={{
            // ✅ ADD: Apply CSS animation control for section activity
            animationPlayState: sectionActive ? 'running' : 'paused'
          }}
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
              willChange: 'transform, opacity', // Optimize for animations
              // ✅ ADD: Apply CSS animation control
              animationPlayState: sectionActive ? 'running' : 'paused'
            }}
          />

          {/* ✅ ENHANCED: Planet image with rotation animation */}
          <motion.div 
            className={`relative flex items-center justify-center overflow-hidden rounded-full
                       ${isSelected ? 'shadow-2xl shadow-primary/50 dark:shadow-primary-dark/50' : ''}`}
            style={{ width: size, height: size }}
            animate={rotateAnimation} // ✅ FIXED: Apply planet rotation
            whileHover={scaleAnimation} // ✅ FIXED: Apply scale animation on hover
          >
            <Image
              src={project.planetImage}
              alt={project.name}
              width={size}
              height={size}
              className="rounded-full object-cover transform transition-transform duration-300"
              priority={false} 
              loading="lazy" // Lazy load non-priority planets
            />
          </motion.div>

          {/* ✅ ENHANCED: Active indicator with section activity */}
          {isActive && !isTransitioning && sectionActive && (
            <motion.div
              className="absolute inset-0 border-2 border-primary dark:border-primary-dark rounded-full"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ 
                scale: isMobile ? [1.1, 1.12, 1.1] : [1.1, 1.15, 1.1],
                opacity: isMobile ? [0.2, 0.4, 0.2] : [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: isMobile ? 2 : 3,
                repeat: sectionActive ? Infinity : 0, // ✅ FIXED: Stop repeat when section inactive
                ease: "easeInOut"
              }}
              style={{
                willChange: 'transform, opacity',
                // ✅ ADD: Apply CSS animation control
                animationPlayState: sectionActive ? 'running' : 'paused'
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