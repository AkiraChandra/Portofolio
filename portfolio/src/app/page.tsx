'use client';

import React from 'react';
import Navbar from '@/components/common/navigations/Navbar';
import Hero from '@/components/sections/Hero/Hero';
import Projects from '@/components/sections/Projects/Projects';
import { useSmoothScroll } from '@/hooks/common/useSmoothScroll';
import Experience from '@/components/sections/Experience';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const isScrolling = useSmoothScroll(0.3); // Trigger at 30% scroll

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <div className="snap-y snap-mandatory h-screen overflow-y-auto">
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
          className="snap-start h-screen w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-20%" }}
        >
          <Experience />
        </motion.section>
      </div>
    </main>
  );
}