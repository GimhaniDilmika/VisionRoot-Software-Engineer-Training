/**
 * Request Routes — Day 05
 * Defines REST endpoint mappings for the requests module.
 */

import { Router } from 'express';
import {
  listRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  handleServiceError,
} from './controller';

const router = Router();

// GET    /api/requests            — List and filter
router.get('/', listRequests);

// POST   /api/requests            — Create new request
router.post('/', createRequest);

// GET    /api/requests/:id        — Get by ID
router.get('/:id', getRequestById);

// PATCH  /api/requests/:id/status — Update status
router.patch('/:id/status', updateRequestStatus);

// Attach service-level error handler for this router
router.use(handleServiceError);

export default router;
