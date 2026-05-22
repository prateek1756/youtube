'use client';

import { motion } from 'framer-motion';

/**
 * Skeleton loader for the video card while metadata is loading
 */
export function VideoCardSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden bg-white/5 border border-white/10">
      {/* Thumbnail skeleton */}
      <div className="aspect-video w-full bg-white/5 animate-pulse" />
      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        <div className="h-5 bg-white/10 rounded-lg animate-pulse w-4/5" />
        <div className="h-4 bg-white/10 rounded-lg animate-pulse w-3/5" />
        <div className="flex gap-3 mt-4">
          <div className="h-3 bg-white/10 rounded-full animate-pulse w-24" />
          <div className="h-3 bg-white/10 rounded-full animate-pulse w-20" />
          <div className="h-3 bg-white/10 rounded-full animate-pulse w-28" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for the format selector
 */
export function FormatSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="h-3 bg-white/10 rounded-full animate-pulse w-24" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-11 bg-white/5 rounded-xl animate-pulse"
            style={{ width: `${60 + i * 8}px` }}
          />
        ))}
      </div>
      <div className="h-3 bg-white/10 rounded-full animate-pulse w-20 mt-4" />
      <div className="flex gap-2">
        <div className="h-11 w-24 bg-white/5 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Generic pulsing skeleton line
 */
export default function SkeletonLoader({ className = '' }) {
  return (
    <div className={`bg-white/10 rounded-lg animate-pulse ${className}`} />
  );
}
