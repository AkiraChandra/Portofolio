'use client';

import React from 'react';
import Navbar from '@/components/common/navigations/Navbar';
import Hero from '@/components/sections/Hero/Hero';
import Projects from '@/components/sections/Projects/Projects';
import { useSmoothScroll } from '@/hooks/common/useSmoothScroll';
import Experience from '@/components/sections/Experience';
import { motion, AnimatePresence } from 'framer-motion';
import { Certifications } from '@/components/sections/Certifications';

// src/app/page.tsx
export default function Home() {
  const isScrolling = useSmoothScroll(0.3);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="h-screen overflow-y-auto snap-y snap-mandatory">
        <section className="snap-start h-screen w-full">
          <Hero />
        </section>
        <motion.section 
          className="snap-start h-screen w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Projects />
        </motion.section>
        <motion.section 
          // Tambahkan snap-start tapi gunakan min-h-screen
          className="snap-start min-h-screen w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Experience />
        </motion.section>
        <motion.section 
          // Tambahkan snap-start tapi gunakan min-h-screen
          className="snap-start min-h-screen w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Certifications />
        </motion.section>
        
      </div>
    </main>
  );
}