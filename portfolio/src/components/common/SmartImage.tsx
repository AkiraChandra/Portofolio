'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Simple cache untuk URL yang gagal
const failedUrls = new Set<string>();

interface SmartImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  showPlaceholder?: boolean;
  onError?: () => void;
  onLoad?: () => void;
}

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  fill,
  width,
  height,
  sizes,
  priority,
  showPlaceholder = true,
  onError,
  onLoad,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const hasTriedFallback = useRef(false);

  // Reset state ketika src berubah
  useEffect(() => {
    // Jika URL sudah pernah gagal, langsung show placeholder
    if (failedUrls.has(src)) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Reset semua state
    setCurrentSrc(src);
    setHasError(false);
    setShowFallback(false);
    setIsLoading(true);
    hasTriedFallback.current = false;
  }, [src]);

  const handleImageError = () => {
    // Tambahkan ke failed cache
    failedUrls.add(currentSrc);
    
    // Coba fallback jika ada dan belum pernah dicoba
    if (!hasTriedFallback.current && fallbackSrc && !failedUrls.has(fallbackSrc)) {
      hasTriedFallback.current = true;
      setCurrentSrc(fallbackSrc);
      setShowFallback(true);
      setIsLoading(true);
      setHasError(false);
    } else {
      // Tampilkan placeholder
      setHasError(true);
      setIsLoading(false);
    }
    
    onError?.();
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  // Jika error dan harus show placeholder
  if (hasError && showPlaceholder) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={fill ? undefined : { width, height }}
      >
        <svg 
          className="w-1/3 h-1/3 text-gray-400" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      {/* Loading shimmer */}
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse ${className}`}
          style={fill ? undefined : { width, height }}
        />
      )}
      
      {/* Actual image */}
      <Image
        src={currentSrc}
        alt={alt}
        className={className}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        priority={priority}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </>
  );
};

export default SmartImage;