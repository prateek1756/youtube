/**
 * Middleware to validate YouTube URLs
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/
 */

const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})([&?].*)?$/;

/**
 * Extracts and validates a YouTube URL from the request body.
 * Attaches the sanitized URL to req.videoUrl.
 */
const validateUrl = (req, res, next) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'URL is required.',
    });
  }

  const trimmedUrl = url.trim();

  if (!YOUTUBE_URL_REGEX.test(trimmedUrl)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid YouTube URL. Please provide a valid YouTube video link.',
    });
  }

  // Extract video ID and reconstruct a clean URL
  const videoIdMatch = trimmedUrl.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/);
  if (!videoIdMatch) {
    return res.status(400).json({
      success: false,
      error: 'Could not extract video ID from URL.',
    });
  }

  req.videoUrl = `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
  req.videoId = videoIdMatch[1];
  next();
};

module.exports = { validateUrl, YOUTUBE_URL_REGEX };
