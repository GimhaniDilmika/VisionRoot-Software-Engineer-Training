/**
 * Request Service — Day 05 Business Logic Layer
 * Enforces business rules, state machine transitions, input trimming.
 * Does NOT know about HTTP or Express objects.
 */

import { requestRepository } from './repository';
import {
  ServiceRequest,
  CreateRequestDTO,
  RequestStatus,
  ALLOWED_TRANSITIONS,
  VALID_STATUSES,
  VALID_CATEGORIES,
  VALID_PRIORITIES,
  ApiFieldError,
} from './types';

// Custom error classes for service layer
export class ValidationError extends Error {
  public readonly details: ApiFieldError[];
  constructor(message: string, details: ApiFieldError[]) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class InvalidStateTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStateTransitionError';
  }
}

export class InvalidIdentifierError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidIdentifierError';
  }
}

// UUID v4 regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const requestService = {
  /**
   * List all requests, optionally filtered by status.
   */
  async listRequests(statusFilter?: string): Promise<ServiceRequest[]> {
    if (statusFilter) {
      const upper = statusFilter.toUpperCase() as RequestStatus;
      if (!VALID_STATUSES.includes(upper)) {
        throw new ValidationError("Invalid query parameter 'status'", [
          {
            field: 'status',
            message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
          },
        ]);
      }
      return requestRepository.findAll(upper);
    }
    return requestRepository.findAll();
  },

  /**
   * Get a single request by ID.
   */
  async getRequestById(id: string): Promise<ServiceRequest> {
    if (!UUID_REGEX.test(id)) {
      throw new InvalidIdentifierError(
        `The provided request ID '${id}' is not a valid UUID`
      );
    }
    const request = await requestRepository.findById(id);
    if (!request) {
      throw new NotFoundError(
        `Service request with ID '${id}' was not found`
      );
    }
    return request;
  },

  /**
   * Create a new service request with comprehensive validation.
   */
  async createRequest(body: unknown): Promise<ServiceRequest> {
    const errors: ApiFieldError[] = [];

    if (!body || typeof body !== 'object') {
      throw new ValidationError('Request body must be a JSON object', [
        { field: 'body', message: 'Request body is missing or not a valid JSON object' },
      ]);
    }

    const raw = body as Record<string, unknown>;

    // Title validation
    const rawTitle = typeof raw.title === 'string' ? raw.title : '';
    const title = rawTitle.trim();
    if (!title) {
      errors.push({ field: 'title', message: 'Title is required and cannot be blank' });
    } else if (title.length < 5) {
      errors.push({
        field: 'title',
        message: `Title must be at least 5 characters long (currently ${title.length})`,
      });
    } else if (title.length > 100) {
      errors.push({
        field: 'title',
        message: `Title cannot exceed 100 characters (currently ${title.length})`,
      });
    }

    // Description validation
    const rawDesc = typeof raw.description === 'string' ? raw.description : '';
    const description = rawDesc.trim();
    if (!description) {
      errors.push({
        field: 'description',
        message: 'Description is required',
      });
    } else if (description.length < 10) {
      errors.push({
        field: 'description',
        message: `Description must be at least 10 characters long (currently ${description.length})`,
      });
    } else if (description.length > 1000) {
      errors.push({
        field: 'description',
        message: `Description cannot exceed 1000 characters (currently ${description.length})`,
      });
    }

    // Category validation
    const category = typeof raw.category === 'string' ? raw.category : '';
    if (!category) {
      errors.push({
        field: 'category',
        message: 'Category is required',
      });
    } else if (!VALID_CATEGORIES.includes(category as any)) {
      errors.push({
        field: 'category',
        message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    // Priority validation (defaults to MEDIUM if omitted)
    let priority = 'MEDIUM';
    if (raw.priority !== undefined && raw.priority !== null) {
      if (typeof raw.priority !== 'string') {
        errors.push({
          field: 'priority',
          message: `Priority must be a string`,
        });
      } else if (!VALID_PRIORITIES.includes(raw.priority as any)) {
        errors.push({
          field: 'priority',
          message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
        });
      } else {
        priority = raw.priority;
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Invalid request payload', errors);
    }

    const dto: CreateRequestDTO = {
      title,
      description,
      category: category as any,
      priority: priority as any,
    };

    return requestRepository.create(dto);
  },

  /**
   * Update the status of a request with state machine enforcement.
   */
  async updateRequestStatus(
    id: string,
    body: unknown
  ): Promise<ServiceRequest> {
    // Validate UUID
    if (!UUID_REGEX.test(id)) {
      throw new InvalidIdentifierError(
        `The provided request ID '${id}' is not a valid UUID`
      );
    }

    // Validate body
    if (!body || typeof body !== 'object') {
      throw new ValidationError('Request body must be a JSON object', [
        { field: 'body', message: 'Request body is missing or not a valid JSON object' },
      ]);
    }

    const raw = body as Record<string, unknown>;
    const newStatus = typeof raw.status === 'string' ? raw.status.toUpperCase() : '';

    if (!newStatus || !VALID_STATUSES.includes(newStatus as RequestStatus)) {
      throw new ValidationError('Invalid request payload', [
        {
          field: 'status',
          message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
        },
      ]);
    }

    // Get the current request
    const existing = await requestRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(
        `Service request with ID '${id}' was not found`
      );
    }

    const currentStatus = existing.status;
    const targetStatus = newStatus as RequestStatus;

    // Terminal state check
    if (ALLOWED_TRANSITIONS[currentStatus].length === 0) {
      throw new InvalidStateTransitionError(
        `Cannot modify a service request that is already in terminal '${currentStatus}' status.`
      );
    }

    // Transition validation
    if (!ALLOWED_TRANSITIONS[currentStatus].includes(targetStatus)) {
      const allowed = ALLOWED_TRANSITIONS[currentStatus].map((s) => `'${s}'`).join(', ');
      throw new InvalidStateTransitionError(
        `Cannot transition request from '${currentStatus}' directly to '${targetStatus}'. Allowed target statuses: ${allowed}.`
      );
    }

    const updated = await requestRepository.updateStatus(id, targetStatus);
    if (!updated) {
      throw new NotFoundError(
        `Service request with ID '${id}' was not found`
      );
    }
    return updated;
  },
};
