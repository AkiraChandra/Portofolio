// src/components/sections/Projects/Projects.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PlanetSystem from './components/PlanetSystem';
import { useTheme } from '@/hooks/theme/useTheme';
import { projects } from '@/data/projects';

const Projects: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark transition-colors duration-300 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-primary/50 to-background-primary dark:from-transparent dark:via-background-primary-dark/50 dark:to-background-primary-dark" />
      
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* <h2 className="text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
            My Projects
          </h2>
          <p className="text-text-secondary dark:text-text-secondary-dark text-lg">
            Explore my journey through the digital universe
          </p> */}
        </motion.div>

        <div className="relative h-[800px] flex flex-col items-center justify-center">
          <PlanetSystem projects={projects} />
        </div>
      </div>
    </section>
  );
};

export default Projects;