// Projects.tsx
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
      
      <motion.div 
        className="container mx-auto px-4 pt-32 lg:pt-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-text-primary dark:text-text-primary-dark mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            My Projects
          </motion.h2>
          <motion.p 
            className="text-text-secondary dark:text-text-secondary-dark text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Explore my journey through the digital universe
          </motion.p>
        </div>

        <PlanetSystem projects={projects} />
      </motion.div>
    </section>
  );
};

export default Projects;