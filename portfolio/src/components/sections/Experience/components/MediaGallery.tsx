import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigateGallery = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex(prev => (prev === 0 ? media.length - 1 : prev - 1));
    } else {
      setCurrentIndex(prev => (prev === media.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="relative mt-6">
      <h3 className="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-4">
        Project Gallery
      </h3>

      {/* Main Gallery View */}
      <div className="relative rounded-lg overflow-hidden bg-background-tertiary dark:bg-background-tertiary-dark">
        <div className="aspect-video relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {media[currentIndex].type === 'image' ? (
                <img
                  src={media[currentIndex].url}
                  alt={media[currentIndex].caption || `Media ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={media[currentIndex].url}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateGallery('prev')}
              className="p-2 rounded-full bg-black/50 text-white backdrop-blur-sm"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateGallery('next')}
              className="p-2 rounded-full bg-black/50 text-white backdrop-blur-sm"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>

          {/* Expand Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity"
          >
            <Maximize2 size={20} />
          </motion.button>
        </div>

        {/* Caption */}
        {media[currentIndex].caption && (
          <div className="p-4 bg-background-secondary/80 dark:bg-background-secondary-dark/80">
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              {media[currentIndex].caption}
            </p>
          </div>
        )}

        {/* Thumbnails */}
        <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar">
          {media.map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden 
                         ${currentIndex === index ? 'ring-2 ring-primary dark:ring-primary-dark' : ''}`}
            >
              <img
                src={item.thumbnail || item.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="w-4 h-4 border-2 border-white rounded-full" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white backdrop-blur-sm"
            >
              <X size={24} />
            </motion.button>

            <img
              src={media[currentIndex].url}
              alt={media[currentIndex].caption || `Media ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaGallery;