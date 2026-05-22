# YTGrab — YouTube Video Downloader

A full-stack personal YouTube video downloader with a premium dark UI, powered by **yt-dlp** and **FFmpeg**.

![YTGrab Preview](./preview.png)

## ✨ Features

- 📥 Download YouTube videos (MP4) in 360p, 480p, 720p, 1080p
- 🎵 Extract audio as MP3 (192kbps) via FFmpeg
- 🎬 Preview video metadata — thumbnail, title, channel, views, duration
- ⚡ Real-time loading/progress states
- 🔒 URL validation, rate limiting, and secure file cleanup
- 📱 Fully mobile-responsive dark UI with glassmorphism
- 🎨 Framer Motion animations throughout

---

## 🏗️ Project Structure

```
youtube-downloader/
├── frontend/                # Next.js 15 + Tailwind + Framer Motion
│   ├── app/
│   │   ├── layout.js        # Root layout with SEO metadata
│   │   ├── page.js          # Home page (Hero section)
│   │   ├── globals.css      # Global styles
│   │   ├── downloader/
│   │   │   └── page.js      # Main downloader UI
│   │   └── not-found.js     # Custom 404 page
│   ├── components/
│   │   ├── Navbar.js        # Glassmorphism navbar
│   │   ├── HeroSection.js   # Hero with animated background
│   │   ├── UrlInput.js      # URL input with validation
│   │   ├── VideoCard.js     # Video metadata display card
│   │   ├── FormatSelector.js # Quality/format pill buttons
│   │   ├── DownloadButton.js # Animated download button
│   │   └── SkeletonLoader.js # Loading skeletons
│   ├── hooks/
│   │   └── useVideoDownloader.js  # Custom hook for all download logic
│   ├── services/
│   │   └── api.js           # Axios API service
│   └── utils/
│       ├── validators.js    # YouTube URL validation
│       └── formatters.js    # Duration/views formatters
│
├── backend/                 # Express.js API
│   ├── server.js            # Entry point
│   ├── config/
│   │   └── config.js        # Central configuration
│   ├── controllers/
│   │   └── videoController.js  # Request handlers
│   ├── routes/
│   │   └── videoRoutes.js   # API routes
│   ├── services/
│   │   └── ytdlpService.js  # yt-dlp + FFmpeg integration
│   ├── middleware/
│   │   ├── rateLimiter.js   # Rate limiting
│   │   ├── validateUrl.js   # URL validation
│   │   └── errorHandler.js  # Global error handler
│   └── utils/
│       ├── fileCleanup.js   # Temp file management
│       └── formatters.js    # Data formatters
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

Install these tools before running the app:

| Tool | Install |
|------|---------|
| **Node.js 18+** | [nodejs.org](https://nodejs.org) |
| **yt-dlp** | [yt-dlp.github.io](https://github.com/yt-dlp/yt-dlp#installation) |
| **FFmpeg** | [ffmpeg.org](https://ffmpeg.org/download.html) |

> **Windows**: Download `yt-dlp.exe` and `ffmpeg.exe`, place them in a folder on your PATH (e.g., `C:\tools\`), and add that folder to your system PATH environment variable.

> **Mac/Linux**: Install via package manager:
> ```bash
> brew install yt-dlp ffmpeg    # macOS
> sudo apt install yt-dlp ffmpeg  # Ubuntu/Debian
> ```

### 1. Clone / Download the project

```bash
cd youtube-downloader
```

### 2. Start the Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start server
npm run dev
```

The backend starts on `http://localhost:5000`

### 3. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend starts on `http://localhost:3000`

### 4. Open the App

Go to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Endpoints

### `POST /api/video/info`
Fetch video metadata.

**Body:**
```json
{ "url": "https://www.youtube.com/watch?v=VIDEO_ID" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "VIDEO_ID",
    "title": "Video Title",
    "thumbnail": "https://...",
    "duration": 215,
    "durationFormatted": "3:35",
    "channel": "Channel Name",
    "views": 1500000,
    "viewsFormatted": "1.5M",
    "uploadDate": "May 22, 2026",
    "availableFormats": [
      { "label": "720p", "type": "video", "quality": 720 },
      { "label": "MP3", "type": "audio", "quality": "audio" }
    ]
  }
}
```

### `POST /api/video/download`
Download video as MP4.

**Body:**
```json
{ "url": "...", "quality": "720p", "title": "Video Title" }
```

**Response:** Binary MP4 stream with `Content-Disposition: attachment`

### `POST /api/video/audio`
Download audio as MP3.

**Body:**
```json
{ "url": "...", "title": "Video Title" }
```

**Response:** Binary MP3 stream

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
TEMP_DIR=./downloads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
DOWNLOAD_RATE_LIMIT_MAX=10
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🚢 Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

Set environment variable:
- `NEXT_PUBLIC_API_URL` = your backend URL

### Backend → Railway / Render

1. Push `backend/` to a GitHub repo
2. Connect to [Railway](https://railway.app) or [Render](https://render.com)
3. Set environment variables from `.env.example`
4. Make sure `yt-dlp` and `ffmpeg` are available in the deployment environment

> ⚠️ **Note:** Most free cloud platforms don't include `yt-dlp`/`ffmpeg`. For personal use, running the backend locally is recommended.

---

## 🛡️ Security

- **Helmet.js** — Security headers
- **CORS** — Restricted to configured origin
- **Rate limiting** — 100 req/15min global, 10 downloads/15min
- **URL validation** — Strict YouTube URL regex
- **File cleanup** — Temp files deleted after streaming
- **Input sanitization** — Video IDs extracted and reconstructed safely

---

## 📄 License

Personal use only. Respect YouTube's Terms of Service and copyright laws.
