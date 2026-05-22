'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isValidYouTubeUrl } from '@/utils/validators';

/**
 * Reusable URL input with validation feedback, paste button, and clear button
 */
export default function UrlInput({
  value,
  onChange,
  onSubmit,
  error,
  isLoading,
  placeholder = 'Paste YouTube URL here...',
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch {
      // Clipboard access denied — silently fail
    }
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const isValid = value && isValidYouTubeUrl(value);

  return (
    <div className="w-full">
      <div
        className={`relative flex items-center rounded-2xl transition-all duration-300 ${
          isFocused
            ? 'ring-2 ring-red-400/30 border-red-400/40'
            : error
            ? 'ring-1 ring-red-500/40 border-red-500/30'
            : isValid
            ? 'ring-1 ring-green-400/40 border-green-400/30'
            : 'border-white/10 hover:border-white/20'
        } border bg-white/5 backdrop-blur-sm`}
      >
        {/* Link icon */}
        <div className="flex-shrink-0 pl-4">
          <svg
            className={`w-5 h-5 transition-colors duration-300 ${
              isFocused ? 'text-red-400' : 'text-white/30'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>

        {/* Input */}
        <input
          id="url-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
          placeholder={placeholder}
          className="flex-1 px-4 py-4 bg-transparent text-white placeholder-white/30 text-base outline-none"
        />

        {/* Validation icon */}
        <AnimatePresence mode="wait">
          {isValid && !error && (
            <motion.div
              key="valid"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex-shrink-0 pr-2"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div
              key="invalid"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex-shrink-0 pr-2"
            >
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear button */}
        {value && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleClear}
            id="url-clear-btn"
            className="flex-shrink-0 p-2 mx-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
            title="Clear"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}

        {/* Paste button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePaste}
          id="url-paste-btn"
          className="flex-shrink-0 mr-2 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-semibold transition-all duration-200"
          title="Paste from clipboard"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Paste
        </motion.button>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 text-xs text-red-400 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
