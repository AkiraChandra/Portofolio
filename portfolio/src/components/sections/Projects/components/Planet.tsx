import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlanetProps } from '@/types/projects';
import { usePlanetAnimation } from '@/hooks/projects/usePlanetAnimation';

const Planet: React.FC<PlanetProps> = ({
  project,
  isActive,
  index,
  totalPlanets
}) => {
  const { rotateAnimation, scaleAnimation } = usePlanetAnimation(isActive);

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
    >
      {/* Planet Container */}
      <motion.div
        className={`relative w-24 h-24 lg:w-32 lg:h-32 cursor-pointer transition-transform duration-300 ${
          isActive ? 'scale-125' : 'hover:scale-110'
        }`}
        animate={{
          rotate: rotateAnimation.rotate,
          scale: scaleAnimation.scale
        }}
        transition={{
          rotate: rotateAnimation.transition,
          scale: scaleAnimation.transition
        }}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0, scale: 1 }}
          animate={isActive ? {
            opacity: [0.2, 0.4],
            scale: [1, 1.1],
            transition: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          } : { opacity: 0 }}
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
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ 
              scale: 1.2, 
              opacity: 1,
              transition: {
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default Planet;