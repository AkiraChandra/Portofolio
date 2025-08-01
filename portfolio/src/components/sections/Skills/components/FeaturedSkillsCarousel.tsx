// src/components/sections/Skills/components/FeaturedSkillsCarousel.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import SkillCard from './SkillCard';
import type { SkillWithCategory } from '@/types/skills';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';

interface FeaturedSkillsCarouselProps {
  skills: SkillWithCategory[];
  onSkillSelect?: (skill: SkillWithCategory) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

const FeaturedSkillsCarousel: React.FC<FeaturedSkillsCarouselProps> = ({
  skills,
  onSkillSelect,
  autoPlay = true,
  autoPlayInterval = 4000,
  className = ''
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // Media queries
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  
  // Card dimensions
  const cardDimensions = {
    width: isMobile ? 140 : isTablet ? 160 : 180,
    height: isMobile ? 160 : isTablet ? 180 : 200,
    gap: isMobile ? 12 : 20
  };

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (!isPlaying || skills.length <= 1) return;
    
    autoPlayRef.current = setTimeout(() => {
      setActiveIndex(prev => (prev + 1) % skills.length);
    }, autoPlayInterval);
  }, [isPlaying, skills.length, autoPlayInterval]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && !isDragging) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return stopAutoPlay;
  }, [activeIndex, isPlaying, isDragging, startAutoPlay, stopAutoPlay]);

  // Scroll to active card
  const scrollToCard = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const cardWidth = cardDimensions.width + cardDimensions.gap;
    const scrollLeft = index * cardWidth - (container.clientWidth - cardDimensions.width) / 2;

    container.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth'
    });
  }, [cardDimensions]);

  // Handle card navigation
  const goToCard = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, skills.length - 1));
    setActiveIndex(clampedIndex);
    scrollToCard(clampedIndex);
    onSkillSelect?.(skills[clampedIndex]);
  }, [skills, scrollToCard, onSkillSelect]);

  const goToPrevious = useCallback(() => {
    const newIndex = activeIndex === 0 ? skills.length - 1 : activeIndex - 1;
    goToCard(newIndex);
  }, [activeIndex, skills.length, goToCard]);

  const goToNext = useCallback(() => {
    const newIndex = (activeIndex + 1) % skills.length;
    goToCard(newIndex);
  }, [activeIndex, skills.length, goToCard]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isDragging) return;

    const container = scrollContainerRef.current;
    const cardWidth = cardDimensions.width + cardDimensions.gap;
    const scrollLeft = container.scrollLeft;
    const newIndex = Math.round(scrollLeft / cardWidth);
    
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < skills.length) {
      setActiveIndex(newIndex);
      onSkillSelect?.(skills[newIndex]);
    }
  }, [activeIndex, skills, cardDimensions, isDragging, onSkillSelect]);

  // Handle drag events
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setIsPlaying(false);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => {
      if (autoPlay) setIsPlaying(true);
    }, 1000);
  }, [autoPlay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      } else if (event.key === ' ') {
        event.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Initialize
  useEffect(() => {
    if (skills.length > 0) {
      onSkillSelect?.(skills[0]);
    }
  }, [skills, onSkillSelect]);

  if (skills.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-secondary dark:text-text-secondary-dark">
          No featured skills found
        </div>
      </div>
    );
  }

  return (
    <div className={`featured-skills-carousel ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-text-primary-dark"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          ⭐ <span className="text-primary dark:text-primary-dark">Featured</span> Skills
        </motion.h2>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                       hover:bg-background-secondary dark:hover:bg-background-secondary-dark
                       border border-border-primary/20 dark:border-border-primary-dark/20
                       transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
          >
            {isPlaying ? 
              <Pause className="w-4 h-4 text-text-primary dark:text-text-primary-dark" /> : 
              <Play className="w-4 h-4 text-text-primary dark:text-text-primary-dark" />
            }
          </motion.button>

          {/* Navigation Arrows - Desktop Only */}
          {!isMobile && (
            <>
              <motion.button
                onClick={goToPrevious}
                className="p-2 rounded-lg bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                           hover:bg-background-secondary dark:hover:bg-background-secondary-dark
                           border border-border-primary/20 dark:border-border-primary-dark/20
                           transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={skills.length <= 1}
              >
                <ChevronLeft className="w-4 h-4 text-text-primary dark:text-text-primary-dark" />
              </motion.button>

              <motion.button
                onClick={goToNext}
                className="p-2 rounded-lg bg-background-secondary/50 dark:bg-background-secondary-dark/50 
                           hover:bg-background-secondary dark:hover:bg-background-secondary-dark
                           border border-border-primary/20 dark:border-border-primary-dark/20
                           transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={skills.length <= 1}
              >
                <ChevronRight className="w-4 h-4 text-text-primary dark:text-text-primary-dark" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Skills Cards Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide pb-4"
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            gap: `${cardDimensions.gap}px`
          }}
          onScroll={handleScroll}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              style={{
                minWidth: `${cardDimensions.width}px`,
                height: `${cardDimensions.height}px`,
                scrollSnapAlign: 'center'
              }}
            >
              <SkillCard
                skill={skill}
                isActive={index === activeIndex}
                isFeatured={true}
                onClick={() => goToCard(index)}
                className="w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlays for Better Visual */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background-primary dark:from-background-primary-dark to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background-primary dark:from-background-primary-dark to-transparent pointer-events-none z-10" />
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center mt-6 gap-2">
        {skills.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToCard(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === activeIndex 
                ? 'bg-primary dark:bg-primary-dark scale-125' 
                : 'bg-text-tertiary/30 dark:bg-text-tertiary-dark/30 hover:bg-text-secondary dark:hover:bg-text-secondary-dark'
              }
            `}
            whileHover={{ scale: index === activeIndex ? 1.25 : 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to skill ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar for Auto-play */}
      {isPlaying && !isDragging && (
        <div className="mt-4">
          <div className="w-full h-1 bg-background-tertiary/30 dark:bg-background-tertiary-dark/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary dark:bg-primary-dark rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ 
                duration: autoPlayInterval / 1000,
                ease: "linear",
                repeat: Infinity,
              }}
              key={activeIndex}
            />
          </div>
        </div>
      )}

      {/* Mobile Touch Instructions */}
      {isMobile && (
        <motion.div
          className="text-center mt-4 text-xs text-text-tertiary dark:text-text-tertiary-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          👆 Swipe left or right to explore skills
        </motion.div>
      )}
    </div>
  );
};

export default FeaturedSkillsCarousel;