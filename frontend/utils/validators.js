/**
 * YouTube URL validation regex
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/
 */
export const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})([&?].*)?$/;

/**
 * Validates whether a string is a valid YouTube URL
 * @param {string} url
 * @returns {boolean}
 */
export const isValidYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return YOUTUBE_URL_REGEX.test(url.trim());
};

/**
 * Extracts the video ID from a YouTube URL
 * @param {string} url
 * @returns {string|null}
 */
export const extractVideoId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:v=|youtu\.be\/|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};
