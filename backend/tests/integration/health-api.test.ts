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
