'use client';

import { useState, useCallback } from 'react';
import { fetchVideoInfo, downloadVideo, downloadAudio } from '@/services/api';
import { isValidYouTubeUrl } from '@/utils/validators';

/**
 * Custom hook for managing the full video downloader flow:
 * URL input → validation → metadata fetch → format selection → download
 */
export const useVideoDownloader = () => {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState('idle'); // 'idle' | 'preparing' | 'downloading' | 'complete'

  /**
   * Validates URL on change
   */
  const handleUrlChange = useCallback((value) => {
    setUrl(value);
    setUrlError('');
    setError('');
    if (value && !isValidYouTubeUrl(value)) {
      setUrlError('Please enter a valid YouTube URL');
    }
  }, []);

  /**
   * Fetches video metadata for the current URL
   */
  const fetchInfo = useCallback(async () => {
    if (!url.trim()) {
      setUrlError('Please enter a YouTube URL');
      return;
    }
    if (!isValidYouTubeUrl(url)) {
      setUrlError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setVideoInfo(null);
    setSelectedFormat(null);

    try {
      const info = await fetchVideoInfo(url);
      setVideoInfo(info);
      // Auto-select best available quality
      const defaultFormat = info.availableFormats?.find(
        (f) => f.label === '720p' || f.label === '480p'
      ) || info.availableFormats?.[0];
      setSelectedFormat(defaultFormat);
    } catch (err) {
      setError(err.message || 'Failed to fetch video information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  /**
   * Triggers download for the selected format
   */
  const handleDownload = useCallback(async () => {
    if (!videoInfo || !selectedFormat) return;

    setIsDownloading(true);
    setDownloadProgress('preparing');
    setError('');

    try {
      if (selectedFormat.type === 'audio') {
        setDownloadProgress('downloading');
        await downloadAudio(url, videoInfo.title);
      } else {
        setDownloadProgress('downloading');
        await downloadVideo(url, selectedFormat.label, videoInfo.title);
      }
      setDownloadProgress('complete');
      setTimeout(() => setDownloadProgress('idle'), 3000);
    } catch (err) {
      setError(err.message || 'Download failed. Please try again.');
      setDownloadProgress('idle');
    } finally {
      setIsDownloading(false);
    }
  }, [url, videoInfo, selectedFormat]);

  /**
   * Resets the downloader state for a new search
   */
  const reset = useCallback(() => {
    setUrl('');
    setUrlError('');
    setVideoInfo(null);
    setSelectedFormat(null);
    setIsLoading(false);
    setIsDownloading(false);
    setError('');
    setDownloadProgress('idle');
  }, []);

  return {
    url,
    urlError,
    videoInfo,
    selectedFormat,
    isLoading,
    isDownloading,
    error,
    downloadProgress,
    handleUrlChange,
    setSelectedFormat,
    fetchInfo,
    handleDownload,
    reset,
  };
};
