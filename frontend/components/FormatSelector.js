'use client';

import { motion } from 'framer-motion';

const QUALITY_CONFIG = {
  '360p': { color: 'from-slate-500 to-slate-600', badge: 'SD', icon: '📱' },
  '480p': { color: 'from-blue-500 to-blue-600', badge: 'SD+', icon: '💻' },
  '720p': { color: 'from-emerald-500 to-emerald-600', badge: 'HD', icon: '🖥️' },
  '1080p': { color: 'from-purple-500 to-purple-600', badge: 'FHD', icon: '🎬' },
  'MP3': { color: 'from-amber-500 to-orange-500', badge: 'AUDIO', icon: '🎵' },
};

/**
 * FormatSelector — displays available download formats as animated pills
 */
export default function FormatSelector({ formats = [], selected, onSelect }) {
  if (!formats || formats.length === 0) return null;

  // Separate video and audio formats
  const videoFormats = formats.filter((f) => f.type === 'video');
  const audioFormats = formats.filter((f) => f.type === 'audio');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Video formats */}
      {videoFormats.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            Video Quality
          </p>
          <div className="flex flex-wrap gap-2">
            {videoFormats.map((format) => {
              const cfg = QUALITY_CONFIG[format.label] || { color: 'from-gray-500 to-gray-600', badge: 'HD', icon: '🎬' };
              const isSelected = selected?.label === format.label;
              return (
                <motion.button
                  key={format.label}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelect(format)}
                  id={`format-${format.label}`}
                  className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? `bg-gradient-to-r ${cfg.color} border-transparent text-white shadow-lg`
                      : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <span className="text-base">{cfg.icon}</span>
                  <span>{format.label}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {cfg.badge}
                  </span>
                  {isSelected && (
                    <motion.div
                      layoutId="selectedFormat"
                      className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-white shadow-md flex items-center justify-center"
                    >
                      <svg className="w-2 h-2 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Audio formats */}
      {audioFormats.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            Audio Only
          </p>
          <div className="flex flex-wrap gap-2">
            {audioFormats.map((format) => {
              const cfg = QUALITY_CONFIG[format.label] || { color: 'from-amber-500 to-orange-500', badge: 'AUDIO', icon: '🎵' };
              const isSelected = selected?.label === format.label;
              return (
                <motion.button
                  key={format.label}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelect(format)}
                  id={`format-${format.label}`}
                  className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? `bg-gradient-to-r ${cfg.color} border-transparent text-white shadow-lg`
                      : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <span className="text-base">{cfg.icon}</span>
                  <span>{format.label}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    192kbps
                  </span>
                  {isSelected && (
                    <motion.div
                      layoutId="selectedFormat"
                      className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-white shadow-md flex items-center justify-center"
                    >
                      <svg className="w-2 h-2 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
