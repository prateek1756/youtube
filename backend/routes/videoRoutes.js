const express = require('express');
const router = express.Router();
const { getVideoInfo, downloadVideo, downloadAudio } = require('../controllers/videoController');
const { validateUrl } = require('../middleware/validateUrl');
const { downloadLimiter } = require('../middleware/rateLimiter');

/**
 * POST /api/video/info
 * Body: { url: string }
 * Returns video metadata
 */
router.post('/info', validateUrl, getVideoInfo);

/**
 * POST /api/video/download
 * Body: { url: string, quality: '360p'|'480p'|'720p'|'1080p', title: string }
 * Streams MP4 video file
 */
router.post('/download', downloadLimiter, validateUrl, downloadVideo);

/**
 * POST /api/video/audio
 * Body: { url: string, title: string }
 * Streams MP3 audio file
 */
router.post('/audio', downloadLimiter, validateUrl, downloadAudio);

module.exports = router;
