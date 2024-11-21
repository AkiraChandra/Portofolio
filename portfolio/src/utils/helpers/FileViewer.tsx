import React, { useState } from 'react';
import { FileText, Image as ImageIcon, File, Download, ExternalLink } from 'lucide-react';

const getFileType = (url: string) => {
  const extension = url.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
  if (extension === 'pdf') return 'pdf';
  return 'other';
};

const FileViewer = ({ 
  url, 
  alt = '', 
  caption = '', 
  className = '',
  showDownload = true
}: {
  url: string;
  alt?: string;
  caption?: string;
  className?: string;
  showDownload?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const fileType = getFileType(url);

  const handleDownload = () => {
    window.open(url, '_blank');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-background-tertiary dark:bg-background-tertiary-dark rounded-lg">
        <File className="w-12 h-12 text-text-tertiary dark:text-text-tertiary-dark mb-2" />
        <p className="text-sm text-text-tertiary dark:text-text-tertiary-dark">
          Failed to load file
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {fileType === 'image' && (
        <div className="relative aspect-video bg-background-tertiary dark:bg-background-tertiary-dark rounded-lg overflow-hidden">
          <img
            src={url}
            alt={alt}
            className="w-full h-full object-cover"
            onLoad={() => setIsLoading(false)}
            onError={() => setError(true)}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary dark:border-primary-dark rounded-full animate-spin border-t-transparent" />
            </div>
          )}
        </div>
      )}

      {fileType === 'pdf' && (
        <div className="relative aspect-[3/4] bg-background-tertiary dark:bg-background-tertiary-dark rounded-lg overflow-hidden">
          <iframe
            src={`${url}#view=FitH`}
            className="w-full h-full"
            onLoad={() => setIsLoading(false)}
            onError={() => setError(true)}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary dark:border-primary-dark rounded-full animate-spin border-t-transparent" />
            </div>
          )}
        </div>
      )}

      {fileType === 'other' && (
        <div className="flex flex-col items-center justify-center p-8 bg-background-tertiary dark:bg-background-tertiary-dark rounded-lg">
          <FileText className="w-12 h-12 text-primary dark:text-primary-dark mb-2" />
          <p className="text-sm text-text-primary dark:text-text-primary-dark mb-4">
            {alt || 'Document'}
          </p>
        </div>
      )}

      {caption && (
        <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary-dark">
          {caption}
        </p>
      )}

      {showDownload && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={handleDownload}
            className="p-2 bg-background-primary/80 dark:bg-background-primary-dark/80 
                     hover:bg-background-primary dark:hover:bg-background-primary-dark 
                     rounded-full transition-colors backdrop-blur-sm"
            title="Download file"
          >
            <Download className="w-4 h-4 text-text-primary dark:text-text-primary-dark" />
          </button>
          <button
            onClick={() => window.open(url, '_blank')}
            className="p-2 bg-background-primary/80 dark:bg-background-primary-dark/80 
                     hover:bg-background-primary dark:hover:bg-background-primary-dark 
                     rounded-full transition-colors backdrop-blur-sm"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 text-text-primary dark:text-text-primary-dark" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileViewer;