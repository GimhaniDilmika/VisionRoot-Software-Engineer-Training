/**
 * Mock Request Repository
 *
 * Provides an isolated, in-memory implementation of the requestRepository
 * interface for unit testing the service layer.
 *
 * Key guarantees:
 * - Never imports or initializes the real PostgreSQL pool
 * - Resets all state between tests via resetMockStore()
 * - Mirrors the exact function signatures from repository.ts
 * - Generates deterministic UUIDs for predictable assertions
 */

import {
  ServiceRequest,
  CreateRequestDTO,
  RequestStatus,
} from '../../src/modules/requests/types';

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------

let store: ServiceRequest[] = [];
let uuidCounter = 0;

/**
 * Generate a deterministic, valid UUID v4-formatted string for tests.
 * Not cryptographically random — purely for predictable test assertions.
 */
function generateTestUUID(): string {
  uuidCounter += 1;
  const hex = uuidCounter.toString(16).padStart(8, '0');
  return `${hex}-0000-4000-8000-000000000000`;
}

/**
 * Returns the current snapshot of the in-memory store (read-only copy).
 * Use in tests to assert that no extra records were created.
 */
export function getMockStore(): ServiceRequest[] {
  return [...store];
}

/**
 * Reset the in-memory store and UUID counter between tests.
 * Call in beforeEach() inside each test suite.
 */
export function resetMockStore(): void {
  store = [];
  uuidCounter = 0;
}

/**
 * Seed the mock store with a pre-built record.
 * Useful for lifecycle / state-machine tests that need an existing record.
 */
export function seedMockStore(record: ServiceRequest): void {
  store.push({ ...record });
}

// ---------------------------------------------------------------------------
// Mock repository — mirrors requestRepository from repository.ts exactly
// ---------------------------------------------------------------------------

export const mockRequestRepository = {
  async findAll(status?: RequestStatus): Promise<ServiceRequest[]> {
    if (status) {
      return store.filter((r) => r.status === status);
    }
    return [...store].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async findById(id: string): Promise<ServiceRequest | null> {
    return store.find((r) => r.id === id) ?? null;
  },

  async create(dto: CreateRequestDTO): Promise<ServiceRequest> {
    const now = new Date().toISOString();
    const record: ServiceRequest = {
      id: generateTestUUID(),
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category,
      priority: dto.priority ?? 'MEDIUM',
      status: 'OPEN',
      created_at: now,
      updated_at: now,
    };
    store.push(record);
    return { ...record };
  },

  async updateStatus(
    id: string,
    newStatus: RequestStatus
  ): Promise<ServiceRequest | null> {
    const index = store.findIndex((r) => r.id === id);
    if (index === -1) return null;
    store[index] = {
      ...store[index],
      status: newStatus,
      updated_at: new Date().toISOString(),
    };
    return { ...store[index] };
  },

  // Not used in unit tests but present for interface completeness
  async resetToSeed(): Promise<void> {
    resetMockStore();
  },
};
