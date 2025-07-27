// src/components/transitions/LoadingSpinner.tsx

'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-primary/80 dark:bg-background-primary-dark/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-8 h-8 border-2 border-primary dark:border-primary-dark border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}