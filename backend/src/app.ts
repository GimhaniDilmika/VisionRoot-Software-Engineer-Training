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

// ── Security Hardening (Day 09) ──────────────────────────────────────────────
// 1. Disable server banner to prevent technology fingerprinting
app.disable('x-powered-by');

// 2. Set defensive security response headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

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
  const isProduction = process.env.NODE_ENV === 'production';
  const rawError = dbHealth.error || 'Connection to PostgreSQL database failed';
  // Guard against any accidental credentials in error string in non-production
  const safeDevError = rawError
    .replace(/password=[^&;\s]+/gi, 'password=***')
    .replace(/:([^:@\s]+)@/g, ':***@');
  const sanitizedError = isProduction
    ? 'Database connection unavailable'
    : safeDevError;

  res.status(503).json({
    success: false,
    error: {
      code: 'SERVICE_UNAVAILABLE',
      message: 'System health probe failed',
      details: [
        {
          component: 'database',
          status: 'disconnected',
          error: sanitizedError,
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
