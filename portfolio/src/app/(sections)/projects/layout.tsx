'use client';

import { motion } from 'framer-motion';
import MovingStars from '@/components/ui/animations/Movingstars';

export default function ProjectsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark">
      <div className="absolute inset-0 bg-gradient-to-t from-transparent dark:via-black/70 dark:to-black z-1" />
      <div className="absolute inset-0 overflow-hidden">
        <MovingStars />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </section>
  );
}