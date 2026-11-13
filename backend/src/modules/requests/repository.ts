/**
 * In-Memory Request Repository — Day 05
 * Provides CRUD operations against an in-memory data store.
 * Will be replaced with PostgreSQL queries on Day 06.
 */

import crypto from 'crypto';
import {
  ServiceRequest,
  CreateRequestDTO,
  RequestStatus,
} from './types';

// Seed data aligned with frontend mockRequests.ts
const SEED_DATA: ServiceRequest[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Flickering monitor on Desk 12',
    description:
      'The external monitor turns black intermittently when connected via HDMI cable to MacBook Pro.',
    category: 'IT',
    priority: 'HIGH',
    status: 'OPEN',
    created_at: '2026-11-12T04:10:00.000Z',
    updated_at: '2026-11-12T04:10:00.000Z',
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    title: 'Air conditioning water leak in Meeting Room B',
    description:
      'Ceiling AC unit is dripping water directly above the main conference table.',
    category: 'Facilities',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    created_at: '2026-11-12T03:30:00.000Z',
    updated_at: '2026-11-12T04:00:00.000Z',
  },
  {
    id: '7ca7b810-9dad-11d1-80b4-00c04fd430c9',
    title: 'VPN access requested for remote finance audit',
    description:
      'Require secure global VPN provisioning for the external quarterly finance auditing team.',
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

// In-memory store
let store: ServiceRequest[] = [...SEED_DATA];

export const requestRepository = {
  /**
   * Retrieve all requests, optionally filtered by status.
   * Returns newest first (created_at DESC).
   */
  async findAll(status?: RequestStatus): Promise<ServiceRequest[]> {
    let results = [...store];
    if (status) {
      results = results.filter((r) => r.status === status);
    }
    // Sort by created_at descending
    results.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return results;
  },

  /**
   * Find a single request by ID.
   */
  async findById(id: string): Promise<ServiceRequest | null> {
    const found = store.find((r) => r.id === id);
    return found ? { ...found } : null;
  },

  /**
   * Insert a new request. Returns the created entity.
   */
  async create(dto: CreateRequestDTO): Promise<ServiceRequest> {
    const now = new Date().toISOString();
    const newRequest: ServiceRequest = {
      id: crypto.randomUUID(),
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category,
      priority: dto.priority,
      status: 'OPEN',
      created_at: now,
      updated_at: now,
    };
    store.unshift(newRequest);
    return { ...newRequest };
  },

  /**
   * Update the status of a request. Returns the updated entity.
   */
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

  /**
   * Reset store to seed data (for testing).
   */
  async resetToSeed(): Promise<void> {
    store = [...SEED_DATA];
  },
};
