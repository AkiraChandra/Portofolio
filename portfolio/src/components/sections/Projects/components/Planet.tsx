// src/components/sections/Projects/components/Planet.tsx
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlanetProps } from '@/types/projects';
import { useRouter } from 'next/navigation';
import { usePlanetTransition } from '@/hooks/projects/usePlanetTransition';

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
  const router = useRouter();
  const handleClick = () => {
    // Animasi sebelum navigasi
    const planetElement = document.getElementById(`planet-${project.id}`);
    if (planetElement) {
      planetElement.style.transition = 'all 0.6s ease-in-out';
      planetElement.style.transform = 'scale(1.2) translateY(-100vh)';
      
      setTimeout(() => {
        router.push(`/project/${project.id}`);
      }, 500);
    }
  };
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
      scale: 1.05,
      transition: {
        duration: 0.3,
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
        delay: index * 0.2 + 0.3,
        duration: 0.3
      }
    }
  };

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
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
      id={`planet-${project.id}`} // Tambahkan id untuk referensi
      className="relative cursor-pointer" // Tambahkan cursor-pointer
        // className="relative"
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={planetVariants}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        onClick={handleClick}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary-dark/20 
                     filter blur-xl pointer-events-none"
          variants={glowVariants}
        />

        {/* Planet Image */}
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <Image
            src={project.planetImage}
            alt={project.name}
            width={size}
            height={size}
            className="rounded-full object-cover transform transition-transform duration-300"
            priority
          />

          {/* Active Indicator Ring */}
          {isActive && (
            <motion.div
              className="absolute inset-0 border border-primary dark:border-primary-dark rounded-full"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ 
                scale: [1.1, 1.15, 1.1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Planet Name - Centered */}
      <motion.div
        className="absolute -bottom-6 text-center w-full"
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        <span className="inline-block text-xs font-medium text-text-primary dark:text-text-primary-dark
                     transition-colors duration-300 whitespace-nowrap px-2 py-1
                     bg-background-secondary/30 dark:bg-background-secondary-dark/30
                     backdrop-blur-sm rounded-full">
          {project.name}
        </span>
      </motion.div>
    </div>
  );
};

export default Planet;