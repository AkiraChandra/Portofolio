// src/components/sections/Certifications/components/LoadingState.tsx
'use client';

import React, { memo } from 'react';
import { Award } from 'lucide-react';
import MovingStars from '@/components/ui/animations/Movingstars';

const LoadingState = memo(() => {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <MovingStars />
      </div>
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <div className="text-white text-xl mb-2">Loading Certifications...</div>
            <div className="text-gray-400 text-sm">Fetching certifications from database</div>
            
            {/* Loading Animation */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;