// =================================
// 2. FILE: src/components/common/PlaceholderImage.tsx
// =================================
import React from 'react';

interface PlaceholderImageProps {
  type?: 'company' | 'project' | 'user' | 'general';
  className?: string;
  width?: number | string;
  height?: number | string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  type = 'general',
  className = '',
  width = '100%',
  height = '100%',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'company':
        return (
          <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
          </svg>
        );
      case 'project':
        return (
          <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
        );
      case 'user':
        return (
          <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/>
          </svg>
        );
    }
  };

  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded ${className}`}
      style={{ width, height }}
    >
      {getIcon()}
    </div>
  );
};

export default PlaceholderImage;