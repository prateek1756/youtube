/**
 * Formats seconds into HH:MM:SS or MM:SS
 * @param {number} seconds
 * @returns {string}
 */
export const formatDuration = (seconds) => {
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
 * Formats a large number into a compact string (1.2M, 4.5K)
 * @param {number} count
 * @returns {string}
 */
export const formatCount = (count) => {
  if (!count) return '0';
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
};

/**
 * Truncates a string to a max length, appending ellipsis
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export const truncate = (str, maxLen = 80) => {
  if (!str) return '';
  return str.length > maxLen ? `${str.substring(0, maxLen)}...` : str;
};
