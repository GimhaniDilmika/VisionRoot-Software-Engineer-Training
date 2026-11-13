/**
 * Request Controller — Day 05
 * HTTP boundary layer. Extracts params/query/body, calls the service,
 * maps service errors to HTTP status codes and the standard API envelope.
 */

import { Request, Response, NextFunction } from 'express';
import {
  requestService,
  ValidationError,
  NotFoundError,
  InvalidStateTransitionError,
  InvalidIdentifierError,
} from './service';

function successResponse(res: Response, data: unknown, statusCode = 200): void {
  res.status(statusCode).json({ success: true, data });
}

function errorResponse(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: { field: string; message: string }[]
): void {
  const body: Record<string, unknown> = {
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(body);
}

/**
 * GET /api/requests
 */
export async function listRequests(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const requests = await requestService.listRequests(status);
    successResponse(res, requests);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/requests/:id
 */
export async function getRequestById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const request = await requestService.getRequestById(id);
    successResponse(res, request);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/requests
 */
export async function createRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const created = await requestService.createRequest(req.body);
    successResponse(res, created, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/requests/:id/status
 */
export async function updateRequestStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const updated = await requestService.updateRequestStatus(
      id,
      req.body
    );
    successResponse(res, updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Maps service-layer errors to HTTP status codes.
 * Used as an Express error-handling middleware specific to request routes,
 * or called from the centralized error handler.
 */
export function handleServiceError(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ValidationError) {
    errorResponse(res, 400, 'VALIDATION_ERROR', err.message, err.details);
    return;
  }
  if (err instanceof InvalidIdentifierError) {
    errorResponse(res, 400, 'INVALID_IDENTIFIER', err.message);
    return;
  }
  if (err instanceof InvalidStateTransitionError) {
    errorResponse(res, 400, 'INVALID_STATE_TRANSITION', err.message);
    return;
  }
  if (err instanceof NotFoundError) {
    errorResponse(res, 404, 'NOT_FOUND', err.message);
    return;
  }
  next(err);
}
