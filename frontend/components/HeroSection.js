'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import UrlInput from './UrlInput';
import { useVideoDownloader } from '@/hooks/useVideoDownloader';
import { useRouter } from 'next/navigation';

const floatingIcons = [
  { icon: '🎬', delay: 0, x: '10%', y: '20%' },
  { icon: '🎵', delay: 0.5, x: '85%', y: '15%' },
  { icon: '📱', delay: 1, x: '5%', y: '70%' },
  { icon: '⚡', delay: 1.5, x: '90%', y: '65%' },
  { icon: '🎧', delay: 0.8, x: '75%', y: '40%' },
  { icon: '🎨', delay: 0.3, x: '15%', y: '50%' },
];

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lightning Fast',
    desc: 'Download in seconds with optimized streaming',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    title: 'MP3 & MP4',
    desc: 'Download video or extract audio effortlessly',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
    title: 'Up to 1080p',
    desc: 'Full HD quality downloads with audio merge',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure & Private',
    desc: 'No accounts, no tracking, no data stored',
  },
];

export default function HeroSection() {
  const router = useRouter();
  const { url, urlError, handleUrlChange, fetchInfo, isLoading } = useVideoDownloader();

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    await fetchInfo();
    if (url && !urlError) {
      // Store URL in sessionStorage and navigate to downloader page
      sessionStorage.setItem('ytgrab_url', url);
      router.push('/downloader');
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(239,68,68,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.1)_0%,_transparent_60%)]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating emoji decorations */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl select-none pointer-events-none hidden lg:block"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Free • Fast • No Sign-up Required
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
        >
          Download YouTube
          <br />
          <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
            Videos Instantly
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Paste any YouTube link and download MP4 or MP3 in seconds.
          Supports up to 1080p HD quality — completely free.
        </motion.p>

        {/* URL input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input
                id="hero-url-input"
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Paste YouTube URL here..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/10 hover:border-white/20 focus:border-red-400/50 focus:ring-2 focus:ring-red-400/20 text-white placeholder-white/30 text-base outline-none transition-all duration-300 backdrop-blur-sm"
              />
              {urlError && (
                <p className="absolute -bottom-6 left-0 text-xs text-red-400">{urlError}</p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              id="hero-download-btn"
              disabled={isLoading}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold text-base shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Fetching...
                </span>
              ) : (
                '→ Get Video'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/8 transition-all duration-300 group"
            >
              <div className="text-red-400 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <div className="text-white font-semibold text-xs">{f.title}</div>
              <div className="text-white/40 text-xs text-center leading-snug">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10"
        >
          <Link
            href="/downloader"
            id="hero-go-to-downloader"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 text-sm group"
          >
            Go to full downloader
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </div>
      </motion.div>
    </section>
  );
}
