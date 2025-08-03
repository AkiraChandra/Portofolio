// File: src/components/common/SmartImage.tsx
import { memo, useState, useCallback } from 'react';
import Image from 'next/image';

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  showPlaceholder?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'eager' | 'lazy';
  unoptimized?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  [key: string]: any;
}

const SmartImage = memo(({
  src,
  alt,
  width,
  height,
  className,
  fill,
  priority = false,
  quality = 75,
  sizes,
  showPlaceholder = false,
  placeholder,
  blurDataURL,
  loading,
  unoptimized,
  onLoad,
  onError,
  ...props
}: SmartImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showFallback, setShowFallback] = useState(false); // ✅ NOW USED

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    setShowFallback(true); // ✅ NOW setShowFallback IS USED
    if (onError) onError();
  }, [onError]);

  // ✅ IMPLEMENT showFallback functionality
  if (hasError || showFallback) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-gray-500 text-sm">Failed to load image</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* ✅ Loading placeholder */}
      {isLoading && showPlaceholder && (
        <div className={`absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg ${className}`}>
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      {/* ✅ Actual Image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={className}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={loading}
        unoptimized={unoptimized}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
});

SmartImage.displayName = 'SmartImage';

export default SmartImage;