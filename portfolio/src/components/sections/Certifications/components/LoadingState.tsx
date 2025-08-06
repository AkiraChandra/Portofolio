// src/components/sections/Certifications/components/LoadingState.tsx
'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Award, Loader2 } from 'lucide-react';

const LoadingState = memo(() => {
  const skeletonVariants = {
    loading: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="py-12 md:py-20 lg:py-24 relative overflow-hidden min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-30 dark:opacity-50">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--color-primary), 0.1) 1px, transparent 0)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          {/* Title Skeleton */}
          <motion.div
            variants={skeletonVariants}
            animate="loading"
            className="h-8 md:h-12 lg:h-16 bg-background-secondary dark:bg-background-secondary-dark rounded-xl mx-auto mb-4 w-3/4 max-w-2xl"
          />
          
          {/* Description Skeleton */}
          <motion.div
            variants={skeletonVariants}
            animate="loading"
            className="h-4 md:h-6 bg-background-secondary dark:bg-background-secondary-dark rounded-lg mx-auto mb-8 w-2/3 max-w-xl"
            style={{ animationDelay: '0.2s' }}
          />
          
          {/* Stats Skeleton */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                variants={skeletonVariants}
                animate="loading"
                className="min-w-[100px] max-w-[120px] flex-1 p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl border border-border-primary/20 dark:border-border-primary-dark/20 bg-background-secondary/50 dark:bg-background-secondary-dark/50"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {/* Icon Skeleton */}
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mx-auto mb-3 rounded-lg bg-background-tertiary dark:bg-background-tertiary-dark" />
                
                {/* Value Skeleton */}
                <div className="h-6 md:h-8 lg:h-10 bg-background-tertiary dark:bg-background-tertiary-dark rounded mb-2" />
                
                {/* Label Skeleton */}
                <div className="h-3 md:h-4 bg-background-tertiary dark:bg-background-tertiary-dark rounded w-3/4 mx-auto" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content Loading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-8"
        >
          {/* Controls Skeleton */}
          <div className="space-y-4">
            {/* Search and View Controls */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <motion.div
                variants={skeletonVariants}
                animate="loading"
                className="h-10 md:h-12 bg-background-secondary dark:bg-background-secondary-dark rounded-lg flex-1 max-w-md"
              />
              <div className="flex gap-3">
                <motion.div
                  variants={skeletonVariants}
                  animate="loading"
                  className="h-10 md:h-12 w-24 bg-background-secondary dark:bg-background-secondary-dark rounded-lg"
                  style={{ animationDelay: '0.1s' }}
                />
                <motion.div
                  variants={skeletonVariants}
                  animate="loading"
                  className="h-10 md:h-12 w-32 bg-background-secondary dark:bg-background-secondary-dark rounded-lg"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              {[...Array(5)].map((_, index) => (
                <motion.div
                  key={index}
                  variants={skeletonVariants}
                  animate="loading"
                  className="h-8 md:h-10 w-20 md:w-24 bg-background-secondary dark:bg-background-secondary-dark rounded-full"
                  style={{ animationDelay: `${0.1 * index}s` }}
                />
              ))}
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                variants={skeletonVariants}
                animate="loading"
                className="p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl border border-border-primary/20 dark:border-border-primary-dark/20 bg-background-secondary/50 dark:bg-background-secondary-dark/50"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {/* Image Skeleton */}
                <div className="h-32 md:h-36 lg:h-40 bg-background-tertiary dark:bg-background-tertiary-dark rounded-lg mb-4" />
                
                {/* Title Skeleton */}
                <div className="h-5 md:h-6 bg-background-tertiary dark:bg-background-tertiary-dark rounded mb-2" />
                
                {/* Organization Skeleton */}
                <div className="h-4 bg-background-tertiary dark:bg-background-tertiary-dark rounded w-3/4 mb-3" />
                
                {/* Footer Skeleton */}
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-background-tertiary dark:bg-background-tertiary-dark rounded w-1/3" />
                  <div className="h-3 bg-background-tertiary dark:bg-background-tertiary-dark rounded w-1/4" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-background-primary dark:bg-background-primary-dark border border-border-primary/20 dark:border-border-primary-dark/20 rounded-full shadow-lg backdrop-blur-sm">
            <Loader2 className="w-5 h-5 text-primary dark:text-primary-dark animate-spin" />
            <span className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
              Loading certifications...
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;