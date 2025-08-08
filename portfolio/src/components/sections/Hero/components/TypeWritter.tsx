// File: src/components/sections/Hero/components/TypeWritter.tsx - FIXED VERSION
// Enhanced TypeWriter Component dengan Activity Lifecycle Management

'use client';

import React, { useEffect, useState, useRef } from "react";
import { useSectionActivity, useActiveTimeout } from '@/contexts/SectionActivityContext';

interface TypeWriterProps {
  words: string[];
}

const TypeWriter = ({ words }: TypeWriterProps) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);
  const [text, setText] = useState("");
  
  // Get activity status
  const { isActive } = useSectionActivity();
  const isHomeActive = isActive('home');

  // Blink animation dengan useActiveTimeout
  useActiveTimeout(() => {
    setBlink((prev) => !prev);
  }, 500, 'home');

  // Typing animation
  useEffect(() => {
    if (!words.length || !words[index] || !isHomeActive) return;

    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
      setText(words[index].substring(0, subIndex));
    }, Math.max(reverse ? 75 : 150, Math.random() * 350));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, isHomeActive]);

  if (!words.length) return null;

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