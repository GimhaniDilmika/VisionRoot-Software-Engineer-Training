/**
 * 404 Not Found Handler — Catches any unmatched routes.
 */

import { Request, Response } from 'express';

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `The requested endpoint ${_req.method} ${_req.originalUrl} does not exist`,
    },
    timestamp: new Date().toISOString(),
  });
}
