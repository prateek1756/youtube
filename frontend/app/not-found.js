'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.08)_0%,_transparent_60%)]" />
      </div>

      {/* Animated 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
        className="mb-8"
      >
        <div className="text-[10rem] sm:text-[14rem] font-black leading-none select-none">
          <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            404
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4 max-w-md"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Page Not Found</h1>
        <p className="text-white/50 text-base leading-relaxed">
          This page doesn&apos;t exist or has been moved.
          Head back to grab some YouTube videos!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            id="error-go-home"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:scale-105"
          >
            Go Home
          </Link>
          <Link
            href="/downloader"
            id="error-go-downloader"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 font-semibold transition-all duration-300"
          >
            Open Downloader
          </Link>
        </div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-red-500/40"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
