/**
 * PostgreSQL Request Repository — Day 06
 *
 * Implements persistent CRUD operations against PostgreSQL using parameterized queries
 * via the infrastructure connection pool (`pg.Pool`).
 * Replaces the Day 05 in-memory mock store while preserving 100% of the repository interface.
 * Aligned with docs/data-model.md and docs/architecture.md.
 */

import fs from 'fs';
import path from 'path';
import { query } from '../../infrastructure/database/pool';
import {
  ServiceRequest,
  CreateRequestDTO,
  RequestStatus,
  RequestCategory,
  RequestPriority,
} from './types';

interface ServiceRequestRow {
  id: string;
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Normalizes PostgreSQL query results into API-compliant ServiceRequest domain entities.
 * Ensures timestamps are formatted as ISO-8601 UTC strings.
 */
function mapRowToServiceRequest(row: ServiceRequestRow): ServiceRequest {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    created_at:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
    updated_at:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : new Date(row.updated_at).toISOString(),
  };
}

export const requestRepository = {
  /**
   * Retrieve all requests, optionally filtered by status.
   * Returns records ordered newest first (created_at DESC).
   */
  async findAll(status?: RequestStatus): Promise<ServiceRequest[]> {
    let sql = `
      SELECT id, title, description, category, priority, status, created_at, updated_at
      FROM service_requests
    `;
    const params: unknown[] = [];

    if (status) {
      sql += ' WHERE status = $1';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC;';

    const result = await query<ServiceRequestRow>(sql, params);
    return result.rows.map(mapRowToServiceRequest);
  },

  /**
   * Find a single request by its UUID primary key.
   * Returns null if no record is found.
   */
  async findById(id: string): Promise<ServiceRequest | null> {
    const sql = `
      SELECT id, title, description, category, priority, status, created_at, updated_at
      FROM service_requests
      WHERE id = $1;
    `;
    const result = await query<ServiceRequestRow>(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return mapRowToServiceRequest(result.rows[0]);
  },

  /**
   * Insert a new service request.
   * PostgreSQL generates the UUID primary key and default timestamps.
   */
  async create(dto: CreateRequestDTO): Promise<ServiceRequest> {
    const sql = `
      INSERT INTO service_requests (
        title,
        description,
        category,
        priority,
        status
      )
      VALUES ($1, $2, $3, $4, 'OPEN')
      RETURNING id, title, description, category, priority, status, created_at, updated_at;
    `;
    const params = [
      dto.title.trim(),
      dto.description.trim(),
      dto.category,
      dto.priority || 'MEDIUM',
    ];

    const result = await query<ServiceRequestRow>(sql, params);
    return mapRowToServiceRequest(result.rows[0]);
  },

  /**
   * Update the lifecycle status of a request.
   * The database trigger automatically updates updated_at.
   */
  async updateStatus(
    id: string,
    newStatus: RequestStatus
  ): Promise<ServiceRequest | null> {
    const sql = `
      UPDATE service_requests
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, title, description, category, priority, status, created_at, updated_at;
    `;
    const result = await query<ServiceRequestRow>(sql, [newStatus, id]);

    if (result.rows.length === 0) {
      return null;
    }

    return mapRowToServiceRequest(result.rows[0]);
  },

  /**
   * Reset store to initial seed data.
   * Re-applies the idempotent 001_seed_service_requests.sql script.
   */
  async resetToSeed(): Promise<void> {
    const candidates = [
      path.resolve(process.cwd(), 'database/seeds/001_seed_service_requests.sql'),
      path.resolve(process.cwd(), '../database/seeds/001_seed_service_requests.sql'),
      path.resolve(__dirname, '../../../../database/seeds/001_seed_service_requests.sql'),
    ];
    const seedPath = candidates.find((p) => fs.existsSync(p));

    if (seedPath) {
      const sql = fs.readFileSync(seedPath, 'utf-8');
      await query(sql);
    }
  },
};
