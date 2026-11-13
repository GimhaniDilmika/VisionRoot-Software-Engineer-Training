/**
 * Centralized Error Handler — Catches unhandled errors and returns
 * a safe, consistent JSON response. No stack traces leaked in production.
 */

import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isDev = process.env.NODE_ENV !== 'production';
  const message =
    err instanceof Error ? err.message : 'An unexpected error occurred';

  console.error(
    `[ErrorHandler] ${new Date().toISOString()} — ${message}`,
    isDev && err instanceof Error ? err.stack : ''
  );

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isDev ? message : 'An unexpected error occurred. Please try again later.',
    },
    timestamp: new Date().toISOString(),
  });
}
