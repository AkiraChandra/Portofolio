'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const MovingStars = () => {
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
    const positions: Array<{ bottom: number; left: number }> = [];
    const totalStars = 70;
    for (let i = 0; i < totalStars; i++) {
      positions.push(generatePosition(positions));
    }

    setStarPositions(positions);
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (starPositions.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute inset-0">
        {starPositions.map((position, i) => (
          <div
            key={i}
            className={`absolute animate-star transition-opacity duration-300 ${
              isLoaded ? 'start-animation' : ''
            }`}
            style={{
              height: '1px',
              width: '50px',
              background: 'linear-gradient(90deg, transparent, rgb(var(--color-text-primary)), transparent)',
              bottom: `${position.bottom}%`,
              left: `${position.left}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <div
              className="absolute"
              style={{
                top: '-8px',
                right: '0',
              }}
            >
              <Image
                src="/star.png"
                alt="star"
                width={20}
                height={20}
                className="object-contain"
                style={{
                  filter: 'drop-shadow(0 0 3px rgb(var(--color-text-primary)))',
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