'use client';

import Image from 'next/image';
import { starConfig } from '@/config/star.config';
import { useEffect, useState } from 'react';

const MovingStars = () => {
  const [starPositions, setStarPositions] = useState<Array<{
    bottom: number;
    left: number;
  }>>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  
  const generatePosition = (existingPositions: Array<{ bottom: number; left: number }>) => {
    const minDistance = 15; 
    let attempts = 0;
    const maxAttempts = 50;

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
              height: starConfig.trail.height,
              width: starConfig.trail.width,
              background: starConfig.trail.gradient,
              bottom: `${position.bottom}%`,
              left: `${position.left}%`,
              animationDelay: `${i * 0.5}s`, 
            }}
          >
            <div
              className="absolute"
              style={{
                top: starConfig.position.top,
                right: starConfig.position.right,
              }}
            >
              <Image
                src="/star.png"
                alt="star"
                width={starConfig.size.width}
                height={starConfig.size.height}
                className="object-contain"
                style={{
                  filter: starConfig.effects.glow,
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