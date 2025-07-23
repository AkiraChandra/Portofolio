import React, { useState, useEffect, useRef } from 'react';
import { FileText, File, Download, ExternalLink, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader, AlertCircle } from 'lucide-react';

// Type declaration for PDF.js
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

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
  const [imageError, setImageError] = useState(false);
  
  // PDF specific states
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(0.8);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  
  const fileType = getFileType(url);

  // Load PDF when URL changes and file type is PDF
  useEffect(() => {
    if (fileType === 'pdf') {
      loadPDF();
    }
  }, [url, fileType]);

  // Load PDF.js and PDF document
  const loadPDF = async () => {
    try {
      setPdfLoading(true);
      setPdfError(null);
      
      // Load PDF.js if not already loaded
      if (!(window as any).pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve(true);
          };
          script.onerror = () => reject(new Error('Failed to load PDF.js'));
          document.head.appendChild(script);
        });
      }
      
      // Load PDF document
      const loadingTask = (window as any).pdfjsLib.getDocument({
        url: url,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
      });
      
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      setPdfLoading(false);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setPdfError('Failed to load PDF');
      setPdfLoading(false);
      setIsLoading(false);
      setError(true);
    }
  };

  // Render PDF page
  const renderPDFPage = async (pageNumber: number) => {
    if (!pdfDoc || !canvasRef.current || isRendering) return;

    try {
      // Cancel any existing render task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      setIsRendering(true);
      
      const page = await pdfDoc.getPage(pageNumber);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Calculate scale based on container width
      const container = containerRef.current;
      const containerWidth = container ? container.clientWidth - 20 : 300;
      const viewport = page.getViewport({ scale: 1.0 });
      const calculatedScale = Math.min(scale, containerWidth / viewport.width);
      
      const scaledViewport = page.getViewport({ scale: calculatedScale });
      
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      
      // Clear canvas before rendering
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      };
      
      // Store render task reference
      renderTaskRef.current = page.render(renderContext);
      
      await renderTaskRef.current.promise;
      
      // Clear the reference after successful render
      renderTaskRef.current = null;
      setIsRendering(false);
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'name' in err && (err as any).name === 'RenderingCancelledException') {
      } else {
        setPdfError('Failed to render PDF page');
      }
      setIsRendering(false);
      renderTaskRef.current = null;
    }
  };

  // Re-render PDF when page or scale changes
  useEffect(() => {
    if (pdfDoc && fileType === 'pdf') {
      // Add small delay to prevent rapid re-renders
      const timeoutId = setTimeout(() => {
        renderPDFPage(currentPage);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [pdfDoc, currentPage, scale]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending render task on cleanup
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, []);

  // Handle mouse wheel for zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (fileType === 'pdf' && e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
      return () => scrollContainer.removeEventListener('wheel', handleWheel);
    }
  }, [fileType]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(url, '_blank');
  };

  // PDF Controls
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleZoomIn = () => {
    if (!isRendering) {
      setScale(prev => Math.min(prev + 0.2, 2.0));
    }
  };

  const handleZoomOut = () => {
    if (!isRendering) {
      setScale(prev => Math.max(prev - 0.2, 0.4));
    }
  };

  if (error && fileType !== 'pdf') {
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
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Image Display */}
      {fileType === 'image' && (
        <div className="relative aspect-video bg-background-tertiary dark:bg-background-tertiary-dark rounded-lg overflow-hidden">
          {imageError ? (
            <div className="flex flex-col items-center justify-center h-full">
              <FileText className="w-12 h-12 text-text-tertiary dark:text-text-tertiary-dark mb-2" />
              <p className="text-sm text-text-tertiary dark:text-text-tertiary-dark">
                Failed to load image
              </p>
            </div>
          ) : (
            <>
              <img
                src={url}
                alt={alt}
                className="w-full h-full object-cover"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setImageError(true);
                  setIsLoading(false);
                }}
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary dark:border-primary-dark rounded-full animate-spin border-t-transparent" />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* PDF Display */}
      {fileType === 'pdf' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* PDF Controls */}
          {pdfDoc && totalPages > 0 && (
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomOut}
                  disabled={scale <= 0.4 || isRendering}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                  title="Zoom out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="text-xs px-1 min-w-[40px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={scale >= 2.0 || isRendering}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                  title="Zoom in"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
              
              {/* Page Navigation */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1 || isRendering}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                  title="Previous page"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="text-xs px-1">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages || isRendering}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                  title="Next page"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
          
          {/* PDF Canvas or Error - with scroll */}
          <div 
            ref={scrollContainerRef}
            className="max-h-[500px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
            style={{
              scrollBehavior: 'smooth'
            }}
          >
            <div className="flex justify-center items-center min-h-[200px] p-2">
              {pdfLoading ? (
                <div className="flex flex-col items-center">
                  <Loader className="w-6 h-6 animate-spin text-primary dark:text-primary-dark mb-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Loading PDF...</p>
                </div>
              ) : pdfError ? (
                <div className="flex flex-col items-center text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                  <p className="text-sm text-red-600 dark:text-red-400 mb-2">{pdfError}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary dark:text-primary-dark 
                                rounded text-xs hover:bg-primary/20 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                    <button
                      onClick={handleOpenInNewTab}
                      className="flex items-center gap-1 px-2 py-1 border border-gray-300 dark:border-gray-600 
                                rounded text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open
                    </button>
                  </div>
                </div>
              ) : (
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto shadow-sm"
                />
              )}
            </div>
            
            {/* Scroll hint */}
            {pdfDoc && !pdfError && (
              <div className="text-center pb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  💡 Use mouse wheel to scroll • Ctrl + wheel to zoom
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other Files (fallback to iframe) */}
      {fileType === 'other' && (
        <div className="relative w-full h-full bg-white rounded-lg overflow-hidden">
          <object
            data={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            type="application/pdf"
            className="w-full aspect-[4/3]"
            style={{
              height: '100%',
              border: 'none',
              background: 'white',
            }}
          >
            <iframe
              src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full aspect-[4/3]"
              style={{
                height: '100%',
                border: 'none',
                background: 'white',
              }}
              onLoad={() => setIsLoading(false)}
              onError={() => setError(true)}
            />
          </object>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary dark:border-primary-dark rounded-full animate-spin border-t-transparent" />
            </div>
          )}
        </div>
      )}

      {/* Caption */}
      {caption && (
        <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary-dark">
          {caption}
        </p>
      )}

      {/* Download/External Link Buttons */}
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
            onClick={handleOpenInNewTab}
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
