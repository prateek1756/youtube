import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for large downloads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — log requests in development
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Fetches video metadata for a YouTube URL
 * @param {string} url - YouTube video URL
 * @returns {Promise<Object>} Video metadata
 */
export const fetchVideoInfo = async (url) => {
  const response = await api.post('/api/video/info', { url });
  return response.data.data;
};

/**
 * Triggers a video download at the specified quality
 * Automatically prompts browser save dialog
 * @param {string} url - YouTube URL
 * @param {string} quality - '360p' | '480p' | '720p' | '1080p'
 * @param {string} title - Video title for filename
 */
export const downloadVideo = async (url, quality, title) => {
  const response = await api.post(
    '/api/video/download',
    { url, quality, title },
    { responseType: 'blob' }
  );

  const blob = new Blob([response.data], { type: 'video/mp4' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${sanitizeFilename(title)}_${quality}.mp4`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Triggers an MP3 audio download
 * @param {string} url - YouTube URL
 * @param {string} title - Video title for filename
 */
export const downloadAudio = async (url, title) => {
  const response = await api.post(
    '/api/video/audio',
    { url, title },
    { responseType: 'blob' }
  );

  const blob = new Blob([response.data], { type: 'audio/mpeg' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${sanitizeFilename(title)}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
};

const sanitizeFilename = (name) => {
  if (!name) return 'video';
  return name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').substring(0, 80);
};

export default api;
