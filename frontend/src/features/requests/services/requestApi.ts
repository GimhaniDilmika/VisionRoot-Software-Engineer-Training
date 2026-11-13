import {
  ServiceRequest,
  CreateRequestDTO,
  UpdateRequestStatusDTO,
  RequestStatus,
  ApiResponse,
  ApiError,
} from '../types/request';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Standard fetch wrapper with strict JSON envelope parsing and error handling
 * matching docs/api-contract.md specifications.
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorPayload: ApiError = data?.error || {
        code: `HTTP_${response.status}`,
        message: data?.message || `Request failed with status ${response.status} (${response.statusText})`,
        details: data?.details,
      };

      return {
        success: false,
        error: errorPayload,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: data?.data ?? data,
      timestamp: data?.timestamp || new Date().toISOString(),
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown network failure';
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: `Unable to connect to backend service at ${API_BASE_URL}. Ensure the Express API is running. (${errorMessage})`,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Production REST API Client for Service Requests
 * Ready for Day 07 Full-Stack Integration.
 */
export const requestApi = {
  /**
   * GET /api/requests?status=...
   * Lists and filters requests.
   */
  async getRequests(status?: RequestStatus | 'ALL'): Promise<ApiResponse<ServiceRequest[]>> {
    const query = status && status !== 'ALL' ? `?status=${encodeURIComponent(status)}` : '';
    return apiFetch<ServiceRequest[]>(`/requests${query}`, {
      method: 'GET',
    });
  },

  /**
   * GET /api/requests/:id
   * Retrieves full details for a single request.
   */
  async getRequestById(id: string): Promise<ApiResponse<ServiceRequest>> {
    return apiFetch<ServiceRequest>(`/requests/${encodeURIComponent(id)}`, {
      method: 'GET',
    });
  },

  /**
   * POST /api/requests
   * Submits a new service request.
   */
  async createRequest(dto: CreateRequestDTO): Promise<ApiResponse<ServiceRequest>> {
    return apiFetch<ServiceRequest>('/requests', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * PATCH /api/requests/:id/status
   * Transitions request status according to state machine rules.
   */
  async updateRequestStatus(id: string, status: RequestStatus): Promise<ApiResponse<ServiceRequest>> {
    const payload: UpdateRequestStatusDTO = { status };
    return apiFetch<ServiceRequest>(`/requests/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
