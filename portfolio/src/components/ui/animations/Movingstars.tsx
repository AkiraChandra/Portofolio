'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/theme/useTheme';

const MovingStars = () => {
  const [starPositions, setStarPositions] = useState<Array<{
    bottom: number;
    left: number;
    delay: number;
  }>>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // ✅ PERFORMANCE FIX: Only 15 stars instead of 70 (75% reduction)
    const totalStars = 15;
    const positions = [];

    // ✅ PERFORMANCE FIX: Simple random positioning (no collision detection)
    for (let i = 0; i < totalStars; i++) {
      positions.push({
        bottom: -20 + Math.random() * 140,
        left: -20 + Math.random() * 140,
        delay: i * 0.3, // Stagger animation for nice effect
      });
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
            className={`absolute transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              bottom: `${position.bottom}%`,
              left: `${position.left}%`,
              animationDelay: `${position.delay}s`,
              // ✅ PERFORMANCE FIX: Use CSS animation instead of complex animations
              animation: 'star-twinkle 3s infinite alternate',
            }}
          >
            {/* ✅ PERFORMANCE FIX: Remove nested div wrapper */}
            <Image
              src="/star.png"
              alt="star"
              width={20}
              height={20}
              className="object-contain"
              style={{
                // ✅ PERFORMANCE FIX: Lighter filter (remove expensive drop-shadow)
                filter: 'brightness(1.2)',
              }}
            />
          </div>
        ))}
      </div>

      {/* ✅ Add CSS animation definition */}
      <style jsx>{`
        @keyframes star-twinkle {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default MovingStars;