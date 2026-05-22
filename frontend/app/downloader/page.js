'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useVideoDownloader } from '@/hooks/useVideoDownloader';
import UrlInput from '@/components/UrlInput';
import VideoCard from '@/components/VideoCard';
import FormatSelector from '@/components/FormatSelector';
import DownloadButton from '@/components/DownloadButton';
import { VideoCardSkeleton, FormatSkeleton } from '@/components/SkeletonLoader';

export default function DownloaderPage() {
  const {
    url,
    urlError,
    videoInfo,
    selectedFormat,
    isLoading,
    isDownloading,
    error,
    downloadProgress,
    handleUrlChange,
    setSelectedFormat,
    fetchInfo,
    handleDownload,
    reset,
  } = useVideoDownloader();

  const hasShownError = useRef(false);

  // Pre-fill URL from sessionStorage (set by hero section)
  useEffect(() => {
    const savedUrl = sessionStorage.getItem('ytgrab_url');
    if (savedUrl) {
      handleUrlChange(savedUrl);
      sessionStorage.removeItem('ytgrab_url');
    }
  }, []);

  // Show toast on error
  useEffect(() => {
    if (error && !hasShownError.current) {
      toast.error(error, { duration: 5000 });
      hasShownError.current = true;
    } else if (!error) {
      hasShownError.current = false;
    }
  }, [error]);

  // Show toast on download complete
  useEffect(() => {
    if (downloadProgress === 'complete') {
      toast.success('Download started! Check your Downloads folder.', { duration: 4000 });
    }
  }, [downloadProgress]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    fetchInfo();
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(239,68,68,0.12)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.10)_0%,_transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-4 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Downloader
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Grab Any YouTube
            <br />
            <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Video or Audio
            </span>
          </h1>
          <p className="text-white/50 text-base max-w-md mx-auto">
            Paste a YouTube link below, choose your format, and download instantly.
          </p>
        </motion.div>

        {/* Input section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <UrlInput
              value={url}
              onChange={handleUrlChange}
              onSubmit={fetchInfo}
              error={urlError}
              isLoading={isLoading}
            />
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                id="fetch-info-btn"
                disabled={isLoading || !!urlError || !url}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-base shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Fetching Info...
                  </span>
                ) : (
                  '→ Fetch Video Info'
                )}
              </motion.button>

              {(videoInfo || error) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  id="reset-btn"
                  onClick={reset}
                  className="px-4 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300"
                  title="Reset"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Loading skeletons */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <VideoCardSkeleton />
              <div className="h-px bg-white/5 my-6" />
              <FormatSkeleton />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        <AnimatePresence>
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 mb-6"
            >
              <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-red-300 font-semibold text-sm">Something went wrong</p>
                <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video results */}
        <AnimatePresence>
          {videoInfo && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Video Card */}
              <VideoCard info={videoInfo} />

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">Choose Format</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>

              {/* Format selector */}
              <FormatSelector
                formats={videoInfo.availableFormats}
                selected={selectedFormat}
                onSelect={setSelectedFormat}
              />

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Download button */}
              <DownloadButton
                onDownload={handleDownload}
                isDownloading={isDownloading}
                downloadProgress={downloadProgress}
                selectedFormat={selectedFormat}
                disabled={!videoInfo}
              />

              {/* Disclaimer */}
              <p className="text-center text-white/20 text-xs">
                For personal use only. Please respect copyright laws.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!videoInfo && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-white/40 font-semibold text-base mb-2">Ready to download</h3>
            <p className="text-white/20 text-sm">Paste a YouTube URL above and click Fetch Video Info</p>
            <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
              {['youtube.com/watch?v=...', 'youtu.be/...', 'youtube.com/shorts/...'].map((ex) => (
                <span key={ex} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/30 text-xs font-mono">
                  {ex}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
