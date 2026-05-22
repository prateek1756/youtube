const rateLimit = require('express-rate-limit');
const config = require('../config/config');

/**
 * Global rate limiter — applied to all routes
 */
const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
});

/**
 * Stricter rate limiter — applied to download endpoints
 */
const downloadLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.downloadMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Download limit reached. Please wait before downloading again.',
  },
});

module.exports = { globalLimiter, downloadLimiter };
