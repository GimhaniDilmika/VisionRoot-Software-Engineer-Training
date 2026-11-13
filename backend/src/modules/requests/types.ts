/**
 * Service Request Domain Types — Backend
 * Aligned with docs/data-model.md and docs/api-contract.md.
 */

export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type RequestCategory = 'IT' | 'Facilities' | 'Other';
export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateRequestDTO {
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
}

export interface UpdateStatusDTO {
  status: RequestStatus;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: ApiFieldError[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
  timestamp: string;
}

/**
 * Permitted status transitions (state machine).
 * Strict linear lifecycle: OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED
 * Each status can only advance to the next state in the sequence.
 * CLOSED is terminal — no further transitions allowed.
 */
export const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
};

export const VALID_STATUSES: RequestStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
export const VALID_CATEGORIES: RequestCategory[] = ['IT', 'Facilities', 'Other'];
export const VALID_PRIORITIES: RequestPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
