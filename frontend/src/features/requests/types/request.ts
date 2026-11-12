/**
 * Service Request Domain Types and API Data Transfer Objects (DTOs)
 * Strictly aligned with docs/requirements.md, docs/data-model.md, and docs/api-contract.md.
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

export interface UpdateRequestStatusDTO {
  status: RequestStatus;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ApiFieldError[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp?: string;
}

export interface RequestFilterOptions {
  status?: RequestStatus | 'ALL';
  category?: RequestCategory | 'ALL';
  searchQuery?: string;
}
