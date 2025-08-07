"use client";

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
    <span className="text-text-primary dark:text-yellow-400 text-glow-lg transition-colors duration-300">
      {text}
      <span
        className={`${
          blink ? "opacity-100" : "opacity-0"
        } transition-opacity duration-100`}
      >
        |
      </span>
    </span>
  );
};

export default TypeWriter;