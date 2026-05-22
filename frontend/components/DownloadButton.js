'use client';

import { motion } from 'framer-motion';

const PROGRESS_STATES = {
  idle: null,
  preparing: { text: 'Preparing download...', color: 'from-amber-500 to-orange-500' },
  downloading: { text: 'Downloading...', color: 'from-blue-500 to-purple-500' },
  complete: { text: 'Download complete! ✓', color: 'from-green-500 to-emerald-500' },
};

/**
 * Animated download button with progress state feedback
 */
export default function DownloadButton({
  onDownload,
  isDownloading,
  downloadProgress,
  selectedFormat,
  disabled,
}) {
  const progressState = PROGRESS_STATES[downloadProgress];
  const isComplete = downloadProgress === 'complete';

  const getButtonText = () => {
    if (isComplete) return 'Downloaded! ✓';
    if (downloadProgress === 'preparing') return 'Preparing...';
    if (downloadProgress === 'downloading') return 'Downloading...';
    if (!selectedFormat) return 'Select a Format';
    if (selectedFormat.type === 'audio') return 'Download MP3';
    return `Download ${selectedFormat.label} MP4`;
  };

  const getGradient = () => {
    if (isComplete) return 'from-green-500 to-emerald-600';
    if (selectedFormat?.type === 'audio') return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.button
        whileHover={!disabled && !isDownloading ? { scale: 1.02, y: -2 } : {}}
        whileTap={!disabled && !isDownloading ? { scale: 0.98 } : {}}
        onClick={onDownload}
        disabled={disabled || isDownloading || !selectedFormat}
        id="download-btn"
        className={`relative w-full py-4 px-8 rounded-2xl font-bold text-white text-base overflow-hidden transition-all duration-500 ${
          disabled || !selectedFormat
            ? 'opacity-40 cursor-not-allowed bg-white/10'
            : `bg-gradient-to-r ${getGradient()} shadow-lg cursor-pointer`
        } ${isDownloading ? 'cursor-wait' : ''}`}
      >
        {/* Shimmer animation */}
        {isDownloading && !isComplete && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Shadow glow */}
        {!disabled && selectedFormat && (
          <div
            className={`absolute -inset-1 bg-gradient-to-r ${getGradient()} rounded-2xl blur-xl opacity-30 -z-10 transition-opacity duration-500`}
          />
        )}

        <span className="relative z-10 flex items-center justify-center gap-3">
          {isDownloading && !isComplete ? (
            <>
              <motion.svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </motion.svg>
              {getButtonText()}
            </>
          ) : (
            <>
              {isComplete ? (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </motion.svg>
              ) : selectedFormat ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              ) : (
                <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              {getButtonText()}
            </>
          )}
        </span>
      </motion.button>

      {/* Progress bar */}
      {isDownloading && !isComplete && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden origin-left"
        >
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${progressState?.color || 'from-blue-500 to-purple-500'}`}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '50%' }}
          />
        </motion.div>
      )}

      {/* Status text */}
      {progressState && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-white/50 mt-2"
        >
          {isComplete
            ? 'Your file should be saving now. Check your Downloads folder.'
            : 'This may take a minute for larger videos. Please wait...'}
        </motion.p>
      )}
    </div>
  );
}
