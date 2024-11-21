import { useState } from 'react';
import Image from 'next/image';
import { Loader } from 'lucide-react';

interface ProjectImageProps {
  url: string;
  alt?: string;
  className?: string;
  size?: number;
}

const ProjectImage = ({ url, alt = 'Project image', className = '', size = 200 }: ProjectImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background-secondary/50 dark:bg-background-secondary-dark/50 backdrop-blur-sm rounded-lg">
          <Loader className="w-6 h-6 text-primary dark:text-primary-dark animate-spin" />
        </div>
      )}
      
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-background-tertiary dark:bg-background-tertiary-dark rounded-lg">
          <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
            Failed to load image
          </span>
        </div>
      ) : (
        <Image
          src={url}
          alt={alt}
          width={size}
          height={size}
          className="rounded-lg object-cover w-full h-full"
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectImage;