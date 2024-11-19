'use client';

import { motion } from 'framer-motion';
import MovingStars from '@/components/ui/animations/Movingstars';

export default function ProjectDetailLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative min-h-screen bg-background-primary dark:bg-background-primary-dark">
      <div className="absolute inset-0">
        <MovingStars />
      </div>
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