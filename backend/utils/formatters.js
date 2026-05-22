/**
 * Formats seconds into HH:MM:SS or MM:SS
 * @param {number} seconds
 * @returns {string}
 */
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
};

/**
 * Formats a view count to a human-readable string
 * @param {number} views
 * @returns {string}
 */
const formatViews = (views) => {
  if (!views) return '0';
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
};

/**
 * Sanitizes a string for use as a filename
 * @param {string} name
 * @returns {string}
 */
const sanitizeFilename = (name) => {
  if (!name) return 'video';
  return name
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100)
    .trim() || 'video';
};

module.exports = { formatDuration, formatViews, sanitizeFilename };
