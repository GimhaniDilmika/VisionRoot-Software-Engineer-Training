/**
 * PostgreSQL Connection Pool — Day 06 Database Infrastructure
 *
 * Provides a resilient, singleton connection pool using `pg.Pool`.
 * Strictly adheres to parameterized queries, graceful shutdown,
 * and sanitized error logging (no exposed credentials).
 * Aligned with docs/architecture.md and docs/data-model.md.
 */

import { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Build pool configuration from environment variables.
 * Prefers DATABASE_URL if provided; otherwise falls back to discrete DB_* variables.
 */
function buildPoolConfig(): PoolConfig {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      max: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '5000', 10),
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'visionroot_service_requests',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '5000', 10),
  };
}

const poolConfig = buildPoolConfig();
export const pool = new Pool(poolConfig);

// Log unexpected idle client errors without crashing the entire process
pool.on('error', (err: Error) => {
  console.error('[PostgreSQL Pool Unexpected Error]:', err.message);
});

/**
 * Execute a parameterized SQL query against the connection pool.
 * Parameterization prevents SQL injection vulnerabilities.
 */
export async function query<R extends QueryResultRow = any>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<R>> {
  const start = Date.now();
  try {
    const res = await pool.query<R>(text, params);
    return res;
  } catch (err: any) {
    const duration = Date.now() - start;
    // Log query execution error safely without leaking sensitive payload data
    console.error(`[PostgreSQL Query Error] (${duration}ms):`, err.message);
    throw err;
  }
}

export interface DatabaseHealthResult {
  connected: boolean;
  latency_ms?: number;
  database?: string;
  error?: string;
}

/**
 * Lightweight probe used by GET /api/health to verify PostgreSQL responsiveness.
 * Returns latency in milliseconds without throwing unhandled exceptions.
 */
export async function checkDatabaseConnection(): Promise<DatabaseHealthResult> {
  const start = Date.now();
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1 AS health');
      const latency_ms = Date.now() - start;
      return {
        connected: true,
        latency_ms,
        database: process.env.DB_NAME || 'visionroot_service_requests',
      };
    } finally {
      client.release();
    }
  } catch (err: any) {
    return {
      connected: false,
      database: process.env.DB_NAME || 'visionroot_service_requests',
      error: err.message || 'Database connection probe failed',
    };
  }
}

/**
 * Gracefully close all active clients in the connection pool.
 */
export async function closePool(): Promise<void> {
  try {
    await pool.end();
  } catch (err: any) {
    console.error('[PostgreSQL Pool Close Error]:', err.message);
  }
}
