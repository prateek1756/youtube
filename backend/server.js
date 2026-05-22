require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');
const { globalLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { ensureDir } = require('./utils/fileCleanup');
const videoRoutes = require('./routes/videoRoutes');

const app = express();

// ─── Ensure temp download directory exists ─────────────────────────────────
ensureDir(config.tempDir);

// ─── Security middleware ────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ─── CORS ───────────────────────────────────────────────────────────────────
// Supports comma-separated origins: "https://a.vercel.app,http://localhost:3000"
const allowedOrigins = config.corsOrigin
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Request logging ────────────────────────────────────────────────────────
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// ─── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Global rate limiting ───────────────────────────────────────────────────
app.use(globalLimiter);

// ─── Health check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'YouTube Downloader API',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/video', videoRoutes);

// ─── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
  });
});

// ─── Global error handler ───────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start server ───────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀 YouTube Downloader API running on port ${config.port}`);
  console.log(`   Environment : ${config.nodeEnv}`);
  console.log(`   CORS Origin : ${config.corsOrigin}`);
  console.log(`   Temp Dir    : ${config.tempDir}`);
  console.log(`   Health      : http://localhost:${config.port}/health\n`);
});

module.exports = app;
