# ─── Build stage ───────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# ─── Production stage ──────────────────────────────────────────────────────
FROM node:20-slim

WORKDIR /app

# Install system dependencies: ffmpeg, python3, curl for yt-dlp
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ffmpeg \
      python3 \
      curl \
      ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install yt-dlp binary
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
      -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Verify binaries are available
RUN yt-dlp --version && ffmpeg -version | head -1

# Copy node_modules and source from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Create temp downloads directory
RUN mkdir -p downloads

# Non-root user for security
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
