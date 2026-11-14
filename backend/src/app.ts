/**
 * Express Application Setup — Day 05
 * Assembles middleware pipeline and mounts route modules.
 * Separated from server.ts for testability (Supertest imports app without starting listener).
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { requestLogger } from './middleware/request-logger';
import { notFoundHandler } from './middleware/not-found';
import { errorHandler } from './middleware/error-handler';
import requestRoutes from './modules/requests/routes';
import { checkDatabaseConnection } from './infrastructure/database/pool';

dotenv.config();

const app = express();

// ── Cross-cutting middleware ─────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(requestLogger);

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  const dbHealth = await checkDatabaseConnection();

  if (dbHealth.connected) {
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        uptime_seconds: parseFloat(process.uptime().toFixed(1)),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
          status: 'connected',
          latency_ms: dbHealth.latency_ms,
        },
      },
    });
    return;
  }

  // Graceful degradation / service unavailable if database connection fails
  res.status(503).json({
    success: false,
    error: {
      code: 'SERVICE_UNAVAILABLE',
      message: 'System health probe failed',
      details: [
        {
          component: 'database',
          status: 'disconnected',
          error: dbHealth.error || 'Connection to PostgreSQL database failed',
        },
      ],
    },
    timestamp: new Date().toISOString(),
  });
});

// ── Root info endpoint ───────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'VisionRoot Service Request Management System API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── Domain routes ────────────────────────────────────────────────────────────
app.use('/api/requests', requestRoutes);

// ── Fallback handlers ────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
