// src/components/ui/animations/Movingstars.tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MovingStarsProps {
  isActive?: boolean;
}

const MovingStars = ({ isActive = true }: MovingStarsProps) => {
  const [starPositions, setStarPositions] = useState<Array<{
    bottom: number;
    left: number;
  }>>([]);
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
    // ✅ GENERATE POSITIONS ONCE ON MOUNT - tidak bergantung pada isActive
    if (starPositions.length === 0) {
      const positions: Array<{ bottom: number; left: number }> = [];
      const totalStars = 70;
      for (let i = 0; i < totalStars; i++) {
        positions.push(generatePosition(positions));
      }
      setStarPositions(positions);
      
      // ✅ Delay lebih lama untuk memastikan CSS animation siap
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, []); // ✅ Hanya run sekali saat mount

  // ✅ Jangan return null berdasarkan isActive, biarkan komponen tetap render
  if (starPositions.length === 0) {
    return null;
  }

  return (
    <div 
      className="absolute inset-0 overflow-hidden z-0"
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
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
              animationPlayState: isActive ? 'running' : 'paused',
              visibility: isLoaded ? 'visible' : 'hidden',
            }}
          >
            <div
              className="absolute"
              style={{
                top: '-8px',
                right: '0',
                visibility: isLoaded ? 'visible' : 'hidden',
              }}
            >
              <Image
                src="/star.png"
                alt="star"
                width={20}
                height={20}
                className={`object-contain transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-30'
                }`}
                style={{
                  filter: `drop-shadow(0 0 3px rgb(var(--color-text-primary))${isActive ? '' : ', 0.3'})`,
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