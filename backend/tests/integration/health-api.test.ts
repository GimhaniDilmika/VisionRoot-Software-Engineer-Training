/**
 * Health API Integration Tests
 *
 * Tests GET /api/health against the real Express app (via Supertest)
 * with the database connection layer fully mocked.
 *
 * Covers:
 *   - HTTP 200 path when database is healthy (mocked connected = true)
 *   - HTTP 503 path when database is unhealthy (mocked connected = false)
 *   - Response envelope shape for both paths
 *
 * No real PostgreSQL connection is opened at any point.
 * Pattern: Arrange → Act → Assert
 */

// ---------------------------------------------------------------------------
// Module mocks — declared BEFORE all imports to satisfy Jest hoisting.
// The pool mock prevents any real pg.Pool from being created when app.ts loads.
// ---------------------------------------------------------------------------

jest.mock('../../src/infrastructure/database/pool', () => ({
  pool: { on: jest.fn(), end: jest.fn() },
  query: jest.fn(),
  // checkDatabaseConnection is used directly by app.ts health route
  checkDatabaseConnection: jest.fn(),
  closePool: jest.fn(),
}));

// Repository mock — not exercised by health tests but must be present so
// service.ts can be imported when app.ts loads requestRoutes.
jest.mock('../../src/modules/requests/repository', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { mockRequestRepository } = require('../mocks/mock-request-repository');
  return { requestRepository: mockRequestRepository };
});

import request from 'supertest';
import app from '../../src/app';
import { checkDatabaseConnection } from '../../src/infrastructure/database/pool';
import { resetMockStore } from '../mocks/mock-request-repository';

// ---------------------------------------------------------------------------
// Typed reference to the mocked checkDatabaseConnection
// ---------------------------------------------------------------------------
const mockCheckDb = checkDatabaseConnection as jest.MockedFunction<
  typeof checkDatabaseConnection
>;

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  resetMockStore();
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// GET /api/health — database connected
// ---------------------------------------------------------------------------

describe('GET /api/health — database healthy', () => {
  beforeEach(() => {
    mockCheckDb.mockResolvedValue({
      connected: true,
      latency_ms: 5,
      database: 'visionroot_service_requests_test_mock',
    });
  });

  test('returns HTTP 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  test('returns success: true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.success).toBe(true);
  });

  test('returns data.status = "healthy"', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.data.status).toBe('healthy');
  });

  test('returns data.database.status = "connected"', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.data.database.status).toBe('connected');
  });

  test('returns data.database.latency_ms as a number', async () => {
    const res = await request(app).get('/api/health');
    expect(typeof res.body.data.database.latency_ms).toBe('number');
  });

  test('returns data.uptime_seconds as a number', async () => {
    const res = await request(app).get('/api/health');
    expect(typeof res.body.data.uptime_seconds).toBe('number');
  });

  test('returns data.timestamp as an ISO string', async () => {
    const res = await request(app).get('/api/health');
    expect(typeof res.body.data.timestamp).toBe('string');
    expect(() => new Date(res.body.data.timestamp)).not.toThrow();
  });

  test('returns data.environment field', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.data.environment).toBeDefined();
  });

  test('Content-Type header is application/json', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});

// ---------------------------------------------------------------------------
// GET /api/health — database disconnected
// ---------------------------------------------------------------------------

describe('GET /api/health — database unhealthy', () => {
  beforeEach(() => {
    mockCheckDb.mockResolvedValue({
      connected: false,
      database: 'visionroot_service_requests_test_mock',
      error: 'Connection refused',
    });
  });

  test('returns HTTP 503', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(503);
  });

  test('returns success: false', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.success).toBe(false);
  });

  test('returns error.code = "SERVICE_UNAVAILABLE"', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.error.code).toBe('SERVICE_UNAVAILABLE');
  });

  test('returns error.details array with database component', async () => {
    const res = await request(app).get('/api/health');
    expect(Array.isArray(res.body.error.details)).toBe(true);
    const dbDetail = res.body.error.details.find(
      (d: { component: string }) => d.component === 'database'
    );
    expect(dbDetail).toBeDefined();
    expect(dbDetail.status).toBe('disconnected');
  });

  test('returns top-level timestamp field', async () => {
    const res = await request(app).get('/api/health');
    expect(typeof res.body.timestamp).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// GET /api/health — database outage error sanitization (SEC-02 regression)
// ---------------------------------------------------------------------------

describe('GET /api/health — production error sanitization (SEC-02)', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('sanitizes internal database exception message in production mode', async () => {
    process.env.NODE_ENV = 'production';
    mockCheckDb.mockResolvedValueOnce({
      connected: false,
      database: 'visionroot_service_requests_test_mock',
      error: 'password authentication failed for user "postgres" at 10.0.1.25:5432',
    });

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('SERVICE_UNAVAILABLE');

    const dbDetail = res.body.error.details.find(
      (d: { component: string }) => d.component === 'database'
    );
    expect(dbDetail).toBeDefined();
    expect(dbDetail.status).toBe('disconnected');
    // Verify sanitized generic message
    expect(dbDetail.error).toBe('Database connection unavailable');
    // Verify zero information leakage
    expect(dbDetail.error).not.toContain('password');
    expect(dbDetail.error).not.toContain('postgres');
    expect(dbDetail.error).not.toContain('10.0.1.25');
  });

  test('masks credentials in error message during non-production mode', async () => {
    process.env.NODE_ENV = 'development';
    mockCheckDb.mockResolvedValueOnce({
      connected: false,
      database: 'visionroot_service_requests_test_mock',
      error: 'failed to connect to postgresql://admin:superSecret999@db-internal:5432/db',
    });

    const res = await request(app).get('/api/health');

    expect(res.status).toBe(503);
    const dbDetail = res.body.error.details.find(
      (d: { component: string }) => d.component === 'database'
    );
    expect(dbDetail).toBeDefined();
    expect(dbDetail.error).not.toContain('superSecret999');
    expect(dbDetail.error).toContain(':***@');
  });
});
