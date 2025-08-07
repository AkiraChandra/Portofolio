// File: src/components/sections/Hero/components/TypeWritter.tsx - UPDATED WITH CONTEXT
"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useActiveTimeout, useAnimationState } from '@/contexts/SectionActivityContext'; // ✅ IMPORT CONTEXT

interface TypeWriterProps {
  words: string[];
}

const TypeWriter = ({ words }: TypeWriterProps) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);
  const [text, setText] = useState("");

  // ✅ GUNAKAN CONTEXT - CHECK APAKAH HOME SECTION AKTIF
  const { shouldPause } = useAnimationState('home');

  // ✅ BLINK ANIMATION - GANTI useEffect dengan useActiveTimeout
  useActiveTimeout(() => {
    setBlink((prev) => !prev);
  }, 500, 'home');

  // ✅ TYPING ANIMATION - TAMBAH CHECK shouldPause
  useEffect(() => {
    if (!words.length || !words[index] || shouldPause) return; // ✅ TAMBAH shouldPause CHECK

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
  }, [subIndex, index, reverse, words, shouldPause]); // ✅ TAMBAH shouldPause DI DEPENDENCY

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