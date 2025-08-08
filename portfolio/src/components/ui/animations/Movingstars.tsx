// src/components/ui/animations/Movingstars.tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MovingStarsProps {
  isActive?: boolean;
}

const MovingStars = ({ isActive = true }: MovingStarsProps) => {
  const [starPositions, setStarPositions] = useState<Array<{ bottom: number; left: number }>>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
    if (!isActive) {
      setStarPositions([]);
      setIsLoaded(false);
      return;
    }

    const positions: Array<{ bottom: number; left: number }> = [];
    const totalStars = 70;
    for (let i = 0; i < totalStars; i++) {
      positions.push(generatePosition(positions));
    }

    setStarPositions(positions);
    
    // Delay yang lebih singkat dan set isLoaded bersamaan dengan positions
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [isActive]);

  if (!isActive || starPositions.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      style={{ 
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      <div className="relative w-full h-full">
        {starPositions.map((position, i) => (
          <div
            key={i}
            className="absolute animate-twinkle opacity-0"
            style={{
              bottom: `${position.bottom}%`,
              left: `${position.left}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Image
              src="/images/star.svg"
              alt=""
              width={4}
              height={4}
              className="w-1 h-1"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovingStars;