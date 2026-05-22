'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatDuration, formatCount } from '@/utils/formatters';

/**
 * Displays video metadata: thumbnail, title, channel, duration, views
 */
export default function VideoCard({ info }) {
  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden">
        {info.thumbnail ? (
          <img
            src={info.thumbnail}
            alt={info.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
        )}
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 text-white text-sm font-mono font-semibold tracking-wide backdrop-blur-sm">
          {info.durationFormatted || formatDuration(info.duration)}
        </div>
        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/30">
          <div className="w-16 h-16 rounded-full bg-red-500/90 flex items-center justify-center shadow-xl">
            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        {/* Title */}
        <h2 className="text-white font-bold text-lg leading-snug mb-3 line-clamp-2">
          {info.title}
        </h2>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
          {/* Channel */}
          <a
            href={info.channelUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors duration-200"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-[10px] text-white font-bold">
              {info.channel?.charAt(0)?.toUpperCase() || 'Y'}
            </div>
            <span className="font-medium">{info.channel}</span>
          </a>

          {/* Separator */}
          <span className="text-white/20">•</span>

          {/* Views */}
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {info.viewsFormatted || formatCount(info.views)} views
          </span>

          {/* Separator */}
          {info.uploadDate && <span className="text-white/20">•</span>}

          {/* Upload date */}
          {info.uploadDate && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {info.uploadDate}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
