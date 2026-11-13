/**
 * Server Entry Point — Day 05
 * Imports the configured Express app and starts the HTTP listener.
 * Handles graceful shutdown signals.
 */

import app from './app';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `[VisionRoot Backend] Server initialized in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
  console.log(
    `[VisionRoot Backend] Health check: http://localhost:${PORT}/api/health`
  );
  console.log(
    `[VisionRoot Backend] API base:     http://localhost:${PORT}/api/requests`
  );
});

// Graceful shutdown
function shutdown(signal: string): void {
  console.log(`\n[VisionRoot Backend] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[VisionRoot Backend] Server closed.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default server;
