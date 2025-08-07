// src/components/sections/Experience/components/ResumeExport.tsx - ENHANCED WITH ACTIVITY SUPPORT
// Modifikasi minimal untuk mendukung activity-aware interactions

import React, { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  FileText, 
  File, 
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { ExportFormat } from "@/types/experience";

interface ResumeExportProps {
  onExport?: (format: ExportFormat) => void;
  isExporting?: boolean;
  isActivityEnabled?: boolean; // ✅ TAMBAH: Activity-aware prop
}

const ResumeExport = memo<ResumeExportProps>(({ 
  onExport,
  isExporting = false,
  isActivityEnabled = true // ✅ TAMBAH: Default enabled
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // ✅ MODIFIKASI: Activity-aware toggle expansion
  const toggleExpanded = useCallback(() => {
    if (!isActivityEnabled) {
      console.log('📄 ResumeExport: Toggle disabled due to inactivity');
      return;
    }
    setIsExpanded(prev => !prev);
  }, [isActivityEnabled]);

  // ✅ MODIFIKASI: Activity-aware export handler
  const handleExport = useCallback(async (format: ExportFormat) => {
    if (!isActivityEnabled) {
      console.log('📄 ResumeExport: Export disabled due to inactivity');
      return;
    }

    try {
      setExportStatus('idle');
      if (onExport) {
        await onExport(format);
        setExportStatus('success');
        setTimeout(() => setExportStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  }, [onExport, isActivityEnabled]);

  const exportFormats = [
    {
      type: 'pdf' as const,
      label: 'PDF Resume',
      icon: FileText,
      description: 'Professional formatted PDF',
      color: 'from-red-500 to-red-600',
      bg: 'from-red-500/10 to-red-600/5',
      border: 'border-red-500/20'
    },
    {
      type: 'docx' as const,
      label: 'Word Document',
      icon: File,
      description: 'Editable Microsoft Word format',
      color: 'from-blue-500 to-blue-600',
      bg: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/20'
    },
    {
      type: 'txt' as const,
      label: 'Plain Text',
      icon: FileSpreadsheet,
      description: 'Simple text format',
      color: 'from-gray-500 to-gray-600',
      bg: 'from-gray-500/10 to-gray-600/5',
      border: 'border-gray-500/20'
    }
  ];

  const getStatusIcon = () => {
    switch (exportStatus) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (exportStatus) {
      case 'success':
        return 'Export Successful!';
      case 'error':
        return 'Export Failed';
      default:
        return 'Export Resume';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isActivityEnabled ? 1 : 0.7, // ✅ TAMBAH: Visual feedback for inactive state
        y: 0 
      }}
      className="space-y-4"
    >
      {/* Main Export Button */}
      <div className="text-center">
        <button
          onClick={toggleExpanded}
          disabled={!isActivityEnabled || isExporting} // ✅ TAMBAH: Disable when inactive or exporting
          className={`
            inline-flex items-center gap-3 px-6 py-3 rounded-xl font-medium
            bg-gradient-to-r from-primary to-accent text-white shadow-lg
            transition-all duration-300 group
            ${isActivityEnabled && !isExporting
              ? 'hover:shadow-xl hover:scale-105 transform' 
              : 'opacity-60 cursor-not-allowed'
            }
          `}
        >
          {isExporting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <motion.div
              animate={exportStatus !== 'idle' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {getStatusIcon()}
            </motion.div>
          )}
          <span>{isExporting ? 'Exporting...' : getStatusText()}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      {/* Export Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-gray-200/50 dark:border-gray-700/50 space-y-3">
              <h4 className={`font-medium text-center text-text-primary dark:text-text-primary-dark mb-4 ${!isActivityEnabled && 'opacity-60'}`}>
                Choose Export Format
              </h4>
              
              <div className="grid gap-3">
                {exportFormats.map((format, index) => (
                  <motion.button
                    key={format.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: isActivityEnabled ? 1 : 0.6,
                      x: 0,
                      transition: { delay: index * 0.1 }
                    }}
                    onClick={() => handleExport({ type: format.type })}
                    disabled={!isActivityEnabled || isExporting} // ✅ TAMBAH: Disable when inactive or exporting
                    className={`
                      flex items-center gap-4 p-3 lg:p-4 rounded-xl 
                      bg-gradient-to-r ${format.bg} border ${format.border}
                      transition-all duration-300 group text-left
                      ${isActivityEnabled && !isExporting
                        ? 'hover:shadow-md hover:scale-[1.02] transform' 
                        : 'cursor-not-allowed'
                      }
                    `}
                    whileHover={
                      isActivityEnabled && !isExporting 
                        ? { y: -2 } 
                        : {}
                    }
                    whileTap={
                      isActivityEnabled && !isExporting 
                        ? { scale: 0.98 } 
                        : {}
                    }
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 bg-gradient-to-br ${format.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <format.icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h5 className={`font-medium text-text-primary dark:text-text-primary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                        {format.label}
                      </h5>
                      <p className={`text-sm text-text-secondary dark:text-text-secondary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                        {format.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <motion.div
                      animate={isActivityEnabled ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`${!isActivityEnabled && 'opacity-60'}`}
                    >
                      <Download className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark group-hover:text-primary transition-colors" />
                    </motion.div>
                  </motion.button>
                ))}
              </div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isActivityEnabled ? 1 : 0.6 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200/30 dark:border-gray-700/30 text-center"
              >
                <p className={`text-xs text-text-secondary dark:text-text-secondary-dark ${!isActivityEnabled && 'opacity-60'}`}>
                  All exports include comprehensive work experience, skills, and achievements
                </p>
                
                {!isActivityEnabled && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    ⚠️ Export functionality is disabled when section is not active
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Messages */}
      <AnimatePresence>
        {exportStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              text-center p-3 rounded-lg text-sm font-medium
              ${exportStatus === 'success' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }
            `}
          >
            {exportStatus === 'success' 
              ? '✅ Resume exported successfully! Check your downloads folder.'
              : '❌ Export failed. Please try again or check your connection.'
            }
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

ResumeExport.displayName = "ResumeExport";

export default ResumeExport;