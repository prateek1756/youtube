const path = require('path');
const fs = require('fs');
const ytdlpService = require('../services/ytdlpService');
const { AppError } = require('../middleware/errorHandler');
const { deleteFileDelayed } = require('../utils/fileCleanup');

/**
 * POST /api/video/info
 * Fetches video metadata for the given YouTube URL
 */
const getVideoInfo = async (req, res, next) => {
  try {
    const { videoUrl } = req;
    console.log(`[Controller] Fetching info for: ${videoUrl}`);

    const info = await ytdlpService.fetchVideoInfo(videoUrl);

    res.json({
      success: true,
      data: info,
    });
  } catch (err) {
    next(new AppError(err.message || 'Failed to fetch video info', 422));
  }
};

/**
 * POST /api/video/download
 * Downloads a YouTube video at the specified quality and streams it to the client
 */
const downloadVideo = async (req, res, next) => {
  let filePath = null;
  try {
    const { videoUrl } = req;
    const { quality = '720p', title = 'video' } = req.body;

    const validQualities = ['360p', '480p', '720p', '1080p'];
    if (!validQualities.includes(quality)) {
      throw new AppError(`Invalid quality. Must be one of: ${validQualities.join(', ')}`, 400);
    }

    console.log(`[Controller] Downloading video: ${videoUrl} @ ${quality}`);

    const result = await ytdlpService.downloadVideo(videoUrl, quality, title);
    filePath = result.filePath;

    if (!fs.existsSync(filePath)) {
      throw new AppError('Download file not found after processing.', 500);
    }

    const stat = fs.statSync(filePath);
    const filename = result.filename;

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stat.size);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on('end', () => {
      console.log(`[Controller] Stream complete: ${filename}`);
      deleteFileDelayed(filePath, 10000);
    });

    stream.on('error', (streamErr) => {
      console.error('[Controller] Stream error:', streamErr.message);
      deleteFileDelayed(filePath, 5000);
    });

    req.on('close', () => {
      // Client disconnected early
      stream.destroy();
      deleteFileDelayed(filePath, 5000);
    });
  } catch (err) {
    if (filePath) deleteFileDelayed(filePath, 3000);
    next(err instanceof AppError ? err : new AppError(err.message || 'Download failed', 500));
  }
};

/**
 * POST /api/video/audio
 * Extracts audio as MP3 and streams it to the client
 */
const downloadAudio = async (req, res, next) => {
  let filePath = null;
  try {
    const { videoUrl } = req;
    const { title = 'audio' } = req.body;

    console.log(`[Controller] Extracting audio: ${videoUrl}`);

    const result = await ytdlpService.downloadAudio(videoUrl, title);
    filePath = result.filePath;

    if (!fs.existsSync(filePath)) {
      throw new AppError('Audio file not found after processing.', 500);
    }

    const stat = fs.statSync(filePath);
    const filename = result.filename;

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stat.size);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on('end', () => {
      console.log(`[Controller] Audio stream complete: ${filename}`);
      deleteFileDelayed(filePath, 10000);
    });

    stream.on('error', (streamErr) => {
      console.error('[Controller] Audio stream error:', streamErr.message);
      deleteFileDelayed(filePath, 5000);
    });

    req.on('close', () => {
      stream.destroy();
      deleteFileDelayed(filePath, 5000);
    });
  } catch (err) {
    if (filePath) deleteFileDelayed(filePath, 3000);
    next(err instanceof AppError ? err : new AppError(err.message || 'Audio extraction failed', 500));
  }
};

module.exports = { getVideoInfo, downloadVideo, downloadAudio };
