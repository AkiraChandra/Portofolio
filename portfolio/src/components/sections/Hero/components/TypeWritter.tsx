// File: src/components/sections/Hero/components/TypeWritter.tsx - FIXED VERSION
// Enhanced TypeWriter Component dengan Activity Lifecycle Management

'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  useActivityLifecycle, 
  useActiveInterval, 
  useActiveTimeout 
} from '@/contexts/ActivityLifecycleContext';

// ===============================================================
// INTERFACES - FIXED
// ===============================================================

interface TypeWriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  sectionId: string; // Required, not optional
  loop?: boolean;
  showCursor?: boolean;
  cursorChar?: string;
}

// ===============================================================
// ENHANCED TYPEWRITER COMPONENT
// ===============================================================

const TypeWriter: React.FC<TypeWriterProps> = memo(({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = '',
  sectionId,
  loop = true,
  showCursor = true,
  cursorChar = '|'
}) => {
  // Activity Lifecycle hooks
  const { isActive, addSuspendCallback, addResumeCallback } = useActivityLifecycle();

  // State management
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Refs for performance
  const currentIndexRef = useRef(0);
  const isActiveRef = useRef(false);
  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);

  // ===============================================================
  // CORE TYPING LOGIC
  // ===============================================================

  const updateText = useCallback(() => {
    if (!isActive(sectionId) || isPaused) return;

    const currentWord = words[currentWordIndex];
    if (!currentWord) return;

    const now = performance.now();
    const timeDelta = now - lastUpdateTimeRef.current;
    const requiredDelay = isDeleting ? deletingSpeed : typingSpeed;

    if (timeDelta < requiredDelay) {
      animationFrameRef.current = requestAnimationFrame(updateText);
      return;
    }

    lastUpdateTimeRef.current = now;

    if (isDeleting) {
      // Deleting characters
      if (currentIndexRef.current > 0) {
        currentIndexRef.current--;
        setCurrentText(currentWord.substring(0, currentIndexRef.current));
        animationFrameRef.current = requestAnimationFrame(updateText);
      } else {
        // Finished deleting, move to next word
        setIsDeleting(false);
        if (loop || currentWordIndex < words.length - 1) {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
        
        // Pause before typing next word
        setTimeout(() => {
          if (isActive(sectionId)) {
            animationFrameRef.current = requestAnimationFrame(updateText);
          }
        }, 500);
      }
    } else {
      // Typing characters
      if (currentIndexRef.current < currentWord.length) {
        currentIndexRef.current++;
        setCurrentText(currentWord.substring(0, currentIndexRef.current));
        animationFrameRef.current = requestAnimationFrame(updateText);
      } else {
        // Finished typing current word
        setIsTypingComplete(true);
        
        // Pause before starting to delete (or stop if not looping)
        setTimeout(() => {
          if (isActive(sectionId)) {
            if (loop || currentWordIndex < words.length - 1) {
              setIsDeleting(true);
              setIsTypingComplete(false);
              animationFrameRef.current = requestAnimationFrame(updateText);
            }
          }
        }, pauseDuration);
      }
    }
  }, [
    words,
    currentWordIndex,
    isDeleting,
    isPaused,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    loop,
    isActive,
    sectionId
  ]);

  // ===============================================================
  // CURSOR BLINKING EFFECT
  // ===============================================================

  useActiveInterval(() => {
    if (isActive(sectionId) && showCursor) {
      setCursorVisible(prev => !prev);
    }
  }, 500, sectionId);

  // ===============================================================
  // ACTIVITY LIFECYCLE MANAGEMENT
  // ===============================================================

  useEffect(() => {
    isActiveRef.current = isActive(sectionId);

    if (isActive(sectionId)) {
      // Resume animation
      setIsPaused(false);
      currentIndexRef.current = currentText.length;
      lastUpdateTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(updateText);
    } else {
      // Pause animation
      setIsPaused(true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive(sectionId), updateText, currentText.length]);

  // ===============================================================
  // SUSPEND/RESUME CALLBACKS
  // ===============================================================

  useEffect(() => {
    // Add suspend callback
    addSuspendCallback(sectionId, () => {
      console.log('🛑 TypeWriter: Suspending typing animation');
      setIsPaused(true);
      setCursorVisible(false);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    });

    // Add resume callback
    addResumeCallback(sectionId, () => {
      console.log('▶️ TypeWriter: Resuming typing animation');
      setIsPaused(false);
      setCursorVisible(true);
      
      if (isActive(sectionId)) {
        lastUpdateTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(updateText);
      }
    });
  }, [addSuspendCallback, addResumeCallback, sectionId, isActive, updateText]);

  // ===============================================================
  // INITIALIZATION
  // ===============================================================

  useEffect(() => {
    if (words.length === 0) return;

    // Reset state when words change
    setCurrentWordIndex(0);
    setCurrentText('');
    setIsDeleting(false);
    setIsPaused(false);
    setIsTypingComplete(false);
    currentIndexRef.current = 0;

    // Start typing if section is active
    if (isActive(sectionId)) {
      lastUpdateTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(updateText);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [words, sectionId, isActive, updateText]);

  // ===============================================================
  // CLEANUP
  // ===============================================================

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // ===============================================================
  // FALLBACK FOR INACTIVE STATE
  // ===============================================================

  if (!isActive(sectionId)) {
    return (
      <span className={`typewriter-static ${className}`}>
        {words[0] || 'Full Stack Developer'}
        {showCursor && (
          <span className="typewriter-cursor opacity-50">
            {cursorChar}
          </span>
        )}
      </span>
    );
  }

  // ===============================================================
  // RENDER
  // ===============================================================

  return (
    <span className={`typewriter-container ${className}`}>
      <span 
        className="typewriter-text text-primary dark:text-primary-dark font-semibold"
        data-section={sectionId}
        data-active={isActive(sectionId)}
      >
        {currentText}
      </span>
      
      {showCursor && (
        <span 
          className={`
            typewriter-cursor inline-block ml-1 font-bold text-primary dark:text-primary-dark
            transition-opacity duration-100
            ${cursorVisible ? 'opacity-100' : 'opacity-0'}
            ${isTypingComplete ? 'animate-pulse' : ''}
          `}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
});

TypeWriter.displayName = 'TypeWriter';

export default TypeWriter;

// ===============================================================
// ADDITIONAL HOOK FOR TYPEWRITER CONTROL - FIXED
// ===============================================================

export const useTypeWriter = (
  words: string[],
  sectionId: string, // Added required sectionId parameter
  options: Partial<Omit<TypeWriterProps, 'words' | 'sectionId'>> = {}
) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentWord, setCurrentWord] = useState(words[0] || '');

  const pause = useCallback(() => setIsPlaying(false), []);
  const resume = useCallback(() => setIsPlaying(true), []);
  const reset = useCallback(() => {
    setCurrentWord(words[0] || '');
    setIsPlaying(true);
  }, [words]);

  return {
    isPlaying,
    currentWord,
    pause,
    resume,
    reset,
    TypeWriterComponent: (props: Omit<Partial<TypeWriterProps>, 'sectionId'>) => (
      <TypeWriter
        words={words}
        sectionId={sectionId} 
        {...options}
        {...props}
      />
    )
  };
};