import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const PDFViewer = ({ url = '', className = '' }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  
  const handleDownload = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 bg-background-secondary/80 dark:bg-background-secondary-dark/80 p-2 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-background-tertiary dark:hover:bg-background-tertiary-dark rounded-lg transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-background-tertiary dark:hover:bg-background-tertiary-dark rounded-lg transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 hover:bg-background-tertiary dark:hover:bg-background-tertiary-dark rounded-lg transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 dark:bg-primary-dark/10 
                    text-primary dark:text-primary-dark rounded-lg hover:bg-primary/20 
                    dark:hover:bg-primary-dark/20 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* PDF Viewer */}
      <div className={`relative rounded-lg overflow-hidden bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-primary/50 dark:bg-background-primary-dark/50 backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-primary/30 dark:border-primary-dark/30 border-t-primary dark:border-t-primary-dark rounded-full animate-spin" />
          </div>
        )}
        
        <iframe
          src={`${url}#view=FitH&zoom=${scale * 100}&page=${currentPage}`}
          className="w-full min-h-[600px] border-0"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
          }}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

export default PDFViewer;