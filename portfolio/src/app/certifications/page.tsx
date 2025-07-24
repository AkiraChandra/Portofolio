// src/app/certifications/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/navigations/Navbar';
import Certifications from '@/components/sections/Certifications/Certifications';
import MovingStars from '@/components/ui/animations/Movingstars';

export default function CertificationsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background-primary dark:bg-background-primary-dark">
      <Navbar />
      
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden">
        <MovingStars />
      </div>
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent dark:via-black/20 dark:to-black z-1" />
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <Certifications />
      </motion.div>
    </main>
  );
}