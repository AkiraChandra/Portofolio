import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Share2, X, File, ChevronDown } from 'lucide-react';
import type { ResumeExportProps, ExportFormat } from '@/types/experience';

const ResumeExport: React.FC<ResumeExportProps> = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showFormats, setShowFormats] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    try {
      setIsExporting(true);
      setShowFormats(false);
      onExport?.(format);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportFormats = [
    { type: 'pdf', label: 'PDF Document', icon: FileText },
    { type: 'docx', label: 'Word Document', icon: File },
    { type: 'txt', label: 'Plain Text', icon: FileText },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <div className="bg-background-secondary/80 dark:bg-background-secondary-dark/80 backdrop-blur-lg rounded-lg shadow-lg border border-border-primary/50 dark:border-border-primary-dark/50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-primary-dark">
                    Export Resume
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-background-tertiary dark:hover:bg-background-tertiary-dark rounded-full"
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setShowFormats(!showFormats)}
                    className="w-full px-4 py-2 flex items-center justify-between text-sm text-text-primary dark:text-text-primary-dark bg-background-tertiary/50 dark:bg-background-tertiary-dark/50 rounded-lg hover:bg-background-tertiary dark:hover:bg-background-tertiary-dark"
                  >
                    <span>Select Format</span>
                    <ChevronDown 
                      size={16}
                      className={`transform transition-transform ${showFormats ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showFormats && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-1"
                      >
                        {exportFormats.map((format) => (
                          <motion.button
                            key={format.type}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleExport({ type: format.type as 'pdf' | 'docx' | 'txt' })}
                            className="w-full px-4 py-2 flex items-center gap-2 text-sm text-text-secondary dark:text-text-secondary-dark hover:bg-background-tertiary dark:hover:bg-background-tertiary-dark rounded-lg"
                          >
                            <format.icon size={16} />
                            <span>{format.label}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleExport({ type: 'pdf' })}
                    disabled={isExporting}
                    className="flex-1 px-4 py-2 bg-primary dark:bg-primary-dark text-background-primary rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Download size={16} />
                    <span className="text-sm font-medium">
                      {isExporting ? 'Exporting...' : 'Export Resume'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-background-tertiary dark:hover:bg-background-tertiary-dark rounded-lg text-text-secondary dark:text-text-secondary-dark"
                  >
                    <Share2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-primary dark:bg-primary-dark text-background-primary rounded-lg flex items-center gap-2"
          >
            <Download size={16} />
            <span className="text-sm font-medium">Export Resume</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeExport;