import { ServiceRequest, CreateRequestDTO, RequestStatus } from '../types/request';

/**
 * Initial mock dataset for Day 04 Frontend UI development.
 * Strictly adheres to the schema defined in docs/data-model.md.
 * Clearly labeled as mock/demo data — NOT persisted to PostgreSQL.
 */
export const INITIAL_MOCK_REQUESTS: ServiceRequest[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Flickering monitor on Desk 12',
    description: 'The external monitor turns black intermittently when connected via HDMI cable to MacBook Pro.',
    category: 'IT',
    priority: 'HIGH',
    status: 'OPEN',
    created_at: '2026-11-12T04:10:00.000Z',
    updated_at: '2026-11-12T04:10:00.000Z',
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    title: 'Air conditioning water leak in Meeting Room B',
    description: 'Ceiling AC unit is dripping water directly above the main conference table.',
    category: 'Facilities',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    created_at: '2026-11-12T03:30:00.000Z',
    updated_at: '2026-11-12T04:00:00.000Z',
  },
  {
    id: '7ca7b810-9dad-11d1-80b4-00c04fd430c9',
    title: 'VPN access requested for remote finance audit',
    description: 'Require secure global VPN provisioning for the external quarterly finance auditing team.',
    category: 'IT',
    priority: 'MEDIUM',
    status: 'OPEN',
    created_at: '2026-11-12T02:15:00.000Z',
    updated_at: '2026-11-12T02:15:00.000Z',
  },
  {
    id: '8da7b810-9dad-11d1-80b4-00c04fd430d0',
    title: 'Ergonomic keyboard replacement for workstation 4',
    description: 'Spacebar key sticking repeatedly on existing wireless keyboard.',
    category: 'Other',
    priority: 'LOW',
    status: 'RESOLVED',
    created_at: '2026-11-11T10:00:00.000Z',
    updated_at: '2026-11-12T01:00:00.000Z',
  },
  {
    id: '9ea7b810-9dad-11d1-80b4-00c04fd430d1',
    title: 'Cafeteria microwave door latch broken',
    description: 'Upper floor cafeteria microwave door fails to latch securely shut.',
    category: 'Facilities',
    priority: 'LOW',
    status: 'CLOSED',
    created_at: '2026-11-10T08:00:00.000Z',
    updated_at: '2026-11-11T16:00:00.000Z',
  },
];

// In-memory mock store for Day 04 UI demo interactions
let memoryStore: ServiceRequest[] = [...INITIAL_MOCK_REQUESTS];

export const mockRequestService = {
  async getRequests(status?: RequestStatus | 'ALL'): Promise<ServiceRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate brief UI network delay
    if (!status || status === 'ALL') {
      return [...memoryStore];
    }
    return memoryStore.filter((r) => r.status === status);
  },

  async getRequestById(id: string): Promise<ServiceRequest | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const found = memoryStore.find((r) => r.id === id);
    return found ? { ...found } : null;
  },

  async createRequest(dto: CreateRequestDTO): Promise<ServiceRequest> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const now = new Date().toISOString();
    const newRequest: ServiceRequest = {
      id: `demo-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category,
      priority: dto.priority,
      status: 'OPEN',
      created_at: now,
      updated_at: now,
    };
    memoryStore = [newRequest, ...memoryStore];
    return newRequest;
  },

  async resetToDefaults(): Promise<void> {
    memoryStore = [...INITIAL_MOCK_REQUESTS];
  },
};
