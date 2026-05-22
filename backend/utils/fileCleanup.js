const fs = require('fs');

/**
 * Deletes a file safely, suppressing errors if it doesn't exist
 * @param {string} filePath - Absolute path to the file
 */
const deleteFile = (filePath) => {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`[FileCleanup] Failed to delete ${filePath}:`, err.message);
    } else {
      console.log(`[FileCleanup] Deleted temp file: ${filePath}`);
    }
  });
};

/**
 * Deletes a file with a delay (useful for post-stream cleanup)
 * @param {string} filePath
 * @param {number} delayMs - Milliseconds to wait before deletion
 */
const deleteFileDelayed = (filePath, delayMs = 5000) => {
  setTimeout(() => deleteFile(filePath), delayMs);
};

/**
 * Ensures a directory exists, creating it if necessary
 * @param {string} dirPath
 */
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`[FileCleanup] Created directory: ${dirPath}`);
  }
};

module.exports = { deleteFile, deleteFileDelayed, ensureDir };
