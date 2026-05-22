const { execFile, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const { formatDuration, formatViews, sanitizeFilename } = require('../utils/formatters');
const { ensureDir } = require('../utils/fileCleanup');

// yt-dlp binary path — uses system-installed yt-dlp
const YTDLP_BINARY = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';

// Quality height map for format selection
const QUALITY_MAP = {
  '360p': 360,
  '480p': 480,
  '720p': 720,
  '1080p': 1080,
};

/**
 * Runs yt-dlp with given args and returns stdout as string
 */
const runYtDlp = (args) => {
  return new Promise((resolve, reject) => {
    execFile(YTDLP_BINARY, args, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        const msg = stderr || err.message;
        console.error('[yt-dlp error]', msg);
        reject(new Error(extractYtDlpError(msg)));
        return;
      }
      resolve(stdout.trim());
    });
  });
};

/**
 * Extracts a user-friendly error message from yt-dlp stderr
 */
const extractYtDlpError = (stderr) => {
  if (stderr.includes('Video unavailable')) return 'This video is unavailable or private.';
  if (stderr.includes('Sign in to confirm')) return 'This video requires sign-in to access.';
  if (stderr.includes('This video is not available')) return 'This video is not available in your region.';
  if (stderr.includes('not a valid URL')) return 'Invalid YouTube URL.';
  if (stderr.includes('Requested format is not available')) return 'The selected quality is not available for this video.';
  return 'Failed to process the video. Please try again.';
};

/**
 * Fetches video metadata from YouTube using yt-dlp
 * @param {string} url - Sanitized YouTube URL
 * @returns {Promise<Object>} Video metadata object
 */
const fetchVideoInfo = async (url) => {
  const args = [
    '--dump-json',
    '--no-playlist',
    '--no-warnings',
    '--skip-download',
    url,
  ];

  const raw = await runYtDlp(args);
  let info;
  try {
    info = JSON.parse(raw);
  } catch {
    throw new Error('Failed to parse video metadata.');
  }

  // Extract available formats grouped by quality
  const availableFormats = extractFormats(info.formats || []);

  return {
    id: info.id,
    title: info.title || 'Unknown Title',
    thumbnail: getBestThumbnail(info.thumbnails),
    duration: info.duration || 0,
    durationFormatted: formatDuration(info.duration),
    channel: info.channel || info.uploader || 'Unknown Channel',
    channelUrl: info.channel_url || info.uploader_url || '',
    views: info.view_count || 0,
    viewsFormatted: formatViews(info.view_count),
    uploadDate: formatUploadDate(info.upload_date),
    description: (info.description || '').substring(0, 300),
    availableFormats,
  };
};

/**
 * Extracts and deduplicates available video formats
 */
const extractFormats = (formats) => {
  const qualities = new Set();
  const result = [];

  // Check for specific resolutions
  const targetQualities = [360, 480, 720, 1080];

  for (const q of targetQualities) {
    const hasQuality = formats.some(
      (f) => f.height === q && f.vcodec && f.vcodec !== 'none'
    );
    if (hasQuality) {
      qualities.add(`${q}p`);
      result.push({ label: `${q}p`, type: 'video', quality: q });
    }
  }

  // Always offer MP3
  result.push({ label: 'MP3', type: 'audio', quality: 'audio' });

  return result;
};

/**
 * Gets the best quality thumbnail URL
 */
const getBestThumbnail = (thumbnails) => {
  if (!thumbnails || thumbnails.length === 0) return '';
  // Sort by resolution descending and pick the best
  const sorted = [...thumbnails]
    .filter((t) => t.url)
    .sort((a, b) => (b.width || 0) * (b.height || 0) - (a.width || 0) * (a.height || 0));
  return sorted[0]?.url || '';
};

/**
 * Formats upload_date (YYYYMMDD) to readable string
 */
const formatUploadDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 8) return '';
  const y = dateStr.substring(0, 4);
  const m = dateStr.substring(4, 6);
  const d = dateStr.substring(6, 8);
  return new Date(`${y}-${m}-${d}`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Downloads a video at the specified quality using yt-dlp
 * @param {string} url - YouTube URL
 * @param {string} quality - '360p' | '480p' | '720p' | '1080p'
 * @param {string} title - Video title for filename
 * @returns {Promise<{filePath: string, filename: string}>}
 */
const downloadVideo = async (url, quality = '720p', title = 'video') => {
  ensureDir(config.tempDir);

  const id = uuidv4();
  const safeTitle = sanitizeFilename(title);
  const filename = `${safeTitle}_${quality}_${id}.mp4`;
  const filePath = path.join(config.tempDir, filename);

  const height = QUALITY_MAP[quality] || 720;

  // Format selector: best video up to target height + best audio, merge to mp4
  const formatSelector = `bestvideo[height<=${height}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`;

  const args = [
    '-f', formatSelector,
    '--merge-output-format', 'mp4',
    '--no-playlist',
    '--no-warnings',
    '-o', filePath,
    url,
  ];

  await runYtDlp(args);

  if (!fs.existsSync(filePath)) {
    throw new Error('Download failed: output file not found.');
  }

  return { filePath, filename };
};

/**
 * Downloads audio only and converts to MP3 using FFmpeg (via yt-dlp)
 * @param {string} url - YouTube URL
 * @param {string} title - Video title for filename
 * @returns {Promise<{filePath: string, filename: string}>}
 */
const downloadAudio = async (url, title = 'audio') => {
  ensureDir(config.tempDir);

  const id = uuidv4();
  const safeTitle = sanitizeFilename(title);
  const filename = `${safeTitle}_${id}.mp3`;
  const filePath = path.join(config.tempDir, filename);

  const args = [
    '-f', 'bestaudio/best',
    '--extract-audio',
    '--audio-format', 'mp3',
    '--audio-quality', '192K',
    '--no-playlist',
    '--no-warnings',
    '-o', filePath,
    url,
  ];

  await runYtDlp(args);

  // yt-dlp may add .mp3 extension automatically, check both
  const finalPath = fs.existsSync(filePath) ? filePath : filePath.replace('.mp3', '') + '.mp3';

  if (!fs.existsSync(finalPath)) {
    throw new Error('Audio extraction failed: output file not found.');
  }

  return { filePath: finalPath, filename };
};

module.exports = { fetchVideoInfo, downloadVideo, downloadAudio };
