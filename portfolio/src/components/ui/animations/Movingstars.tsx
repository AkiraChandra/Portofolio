// src/components/ui/animations/Movingstars.tsx
// ✅ OPTIMIZED: Canvas-inspired performance strategy with DOM rendering
// - Conditional rendering based on isActive (pause when not visible)
// - Will-change optimization for GPU acceleration
// - Reduced animation when inactive
'use client';

import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';

interface MovingStarsProps {
  isActive?: boolean;
  starCount?: number;
}

const MovingStars = ({ isActive = true, starCount = 70 }: MovingStarsProps) => {
  const [starPositions, setStarPositions] = useState<Array<{
    bottom: number;
    left: number;
  }>>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ OPTIMIZATION: Memoize star count untuk prevent re-calculation
  const totalStars = useMemo(() => starCount, [starCount]);

  const generatePosition = (existingPositions: Array<{ bottom: number; left: number }>) => {
    const minDistance = 20;
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const newPosition = {
        bottom: -20 + Math.random() * 140,
        left: -20 + Math.random() * 140,
      };

      const isFarEnough = existingPositions.every((pos) => {
        const distance = Math.sqrt(
          Math.pow(pos.bottom - newPosition.bottom, 2) +
          Math.pow(pos.left - newPosition.left, 2)
        );
        return distance >= minDistance;
      });

      if (isFarEnough || existingPositions.length === 0) {
        return newPosition;
      }

      attempts++;
    }

    return {
      bottom: -20 + Math.random() * 140,
      left: -20 + Math.random() * 140,
    };
  };

  useEffect(() => {
    // ✅ OPTIMIZATION: Generate positions once on mount - independent of isActive
    if (starPositions.length === 0) {
      const positions: Array<{ bottom: number; left: number }> = [];
      for (let i = 0; i < totalStars; i++) {
        positions.push(generatePosition(positions));
      }
      setStarPositions(positions);
      
      // ✅ Delayed load for smooth CSS animation initialization
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [totalStars]); // ✅ Dependency on totalStars untuk dynamic star count

  // ✅ OPTIMIZATION: Keep component mounted, only control visibility/animation
  if (starPositions.length === 0) {
    return null;
  }

  return (
    <div 
      className="absolute inset-0 overflow-hidden z-0"
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        // ✅ PERFORMANCE: will-change only when active untuk GPU optimization
        willChange: isActive ? 'transform, opacity' : 'auto',
        // ✅ PERFORMANCE: contain layout untuk isolate repaint
        contain: 'layout style paint',
      }}
    >
      <div className="absolute inset-0">
        {starPositions.map((position, i) => (
          <div
            key={i}
            className={`absolute transition-opacity duration-300 ${
              isActive && isLoaded ? 'animate-star start-animation' : 'opacity-30'
            }`}
            style={{
              height: '1px',
              width: '50px',
              background: `linear-gradient(90deg, transparent, rgb(var(--color-text-primary))${isActive ? '' : ', 0.3'}, transparent)`,
              bottom: `${position.bottom}%`,
              left: `${position.left}%`,
              animationDelay: isActive && isLoaded ? `${i * 0.5}s` : '0s',
              // ✅ CANVAS STRATEGY: Pause animation when not active
              animationPlayState: isActive ? 'running' : 'paused',
              visibility: isLoaded ? 'visible' : 'hidden',
              // ✅ PERFORMANCE: will-change per element only when active
              willChange: isActive ? 'transform' : 'auto',
            }}
          >
            <div
              className="absolute"
              style={{
                top: '-8px',
                right: '0',
                visibility: isLoaded ? 'visible' : 'hidden',
                // ✅ PERFORMANCE: Transform GPU acceleration hint
                transform: 'translateZ(0)',
              }}
            >
              <Image
                src="/star.png"
                alt="star"
                width={20}
                height={20}
                // ✅ OPTIMIZATION: Priority loading untuk first stars
                priority={i < 10}
                className={`object-contain transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-30'
                }`}
                style={{
                  filter: `drop-shadow(0 0 3px rgb(var(--color-text-primary))${isActive ? '' : ', 0.3'})`,
                  // ✅ PERFORMANCE: Force GPU layer untuk smooth animation
                  transform: 'translateZ(0)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovingStars;