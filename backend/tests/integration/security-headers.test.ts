/**
 * Security Headers Integration Tests — Day 09
 *
 * Exercises the Express HTTP middleware pipeline using Supertest to verify:
 * 1. Server technology banner (X-Powered-By) is disabled.
 * 2. Standard defensive HTTP security headers are enforced:
 *    - X-Content-Type-Options: nosniff
 *    - X-Frame-Options: DENY
 *    - Referrer-Policy: strict-origin-when-cross-origin
 * 3. Security headers are present on all response categories:
 *    - Successful API responses (HTTP 200, 201)
 *    - Client error responses (HTTP 400, 404)
 *    - Service unavailable responses (HTTP 503)
 * 4. Cross-Origin Resource Sharing (CORS) behavior is preserved.
 *
 * Isolation:
 * - Uses in-memory mock repository and mocked database health check.
 * - Zero real PostgreSQL queries or connections.
 *
 * Pattern: Arrange → Act → Assert
 */

// ---------------------------------------------------------------------------
// Module mocks — declared BEFORE all imports (Jest hoisting requirement)
// ---------------------------------------------------------------------------

jest.mock('../../src/infrastructure/database/pool', () => ({
  pool: { on: jest.fn(), end: jest.fn() },
  query: jest.fn(),
  checkDatabaseConnection: jest.fn().mockResolvedValue({
    connected: true,
    latency_ms: 1,
    database: 'visionroot_service_requests_test_mock',
  }),
  closePool: jest.fn(),
}));

jest.mock('../../src/modules/requests/repository', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { mockRequestRepository } = require('../mocks/mock-request-repository');
  return { requestRepository: mockRequestRepository };
});

import request from 'supertest';
import app from '../../src/app';
import { checkDatabaseConnection } from '../../src/infrastructure/database/pool';
import { resetMockStore } from '../mocks/mock-request-repository';

const mockCheckDb = checkDatabaseConnection as jest.MockedFunction<
  typeof checkDatabaseConnection
>;

beforeEach(() => {
  resetMockStore();
  jest.clearAllMocks();
  mockCheckDb.mockResolvedValue({
    connected: true,
    latency_ms: 1,
    database: 'visionroot_service_requests_test_mock',
  });
});

describe('Express Security Hardening — Defensive Headers', () => {
  // =========================================================================
  // 1. Server Banner Disabling (X-Powered-By)
  // =========================================================================

  describe('Server Technology Masking', () => {
    test('X-Powered-By header is absent on successful root response', async () => {
      const res = await request(app).get('/');
      expect(res.headers['x-powered-by']).toBeUndefined();
    });

    test('X-Powered-By header is absent on /api/health response', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['x-powered-by']).toBeUndefined();
    });

    test('X-Powered-By header is absent on /api/requests response', async () => {
      const res = await request(app).get('/api/requests');
      expect(res.headers['x-powered-by']).toBeUndefined();
    });

    test('X-Powered-By header is absent on error responses', async () => {
      const res = await request(app).get('/api/non-existent-endpoint');
      expect(res.headers['x-powered-by']).toBeUndefined();
    });
  });

  // =========================================================================
  // 2. Defensive Security Headers on Successful Responses
  // =========================================================================

  describe('Defensive Headers on Successful Responses (HTTP 200 / 201)', () => {
    test('GET /api/requests includes all defensive security headers', async () => {
      const res = await request(app).get('/api/requests');
      expect(res.status).toBe(200);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });

    test('GET /api/health includes all defensive security headers', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });

    test('POST /api/requests includes all defensive security headers on HTTP 201', async () => {
      const res = await request(app)
        .post('/api/requests')
        .send({
          title: 'Defensive header verification ticket',
          description: 'Verifying headers are present on newly created request responses.',
          category: 'IT',
          priority: 'MEDIUM',
        });

      expect(res.status).toBe(201);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });
  });

  // =========================================================================
  // 3. Defensive Security Headers on Error Responses
  // =========================================================================

  describe('Defensive Headers on Error Responses (HTTP 400 / 404 / 503)', () => {
    test('HTTP 400 Validation Error retains all defensive security headers', async () => {
      const res = await request(app)
        .post('/api/requests')
        .send({ title: '', description: '' });

      expect(res.status).toBe(400);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });

    test('HTTP 400 Malformed UUID retains all defensive security headers', async () => {
      const res = await request(app).get('/api/requests/not-a-uuid');

      expect(res.status).toBe(400);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });

    test('HTTP 404 Not Found retains all defensive security headers', async () => {
      const res = await request(app).get('/api/route-that-does-not-exist');

      expect(res.status).toBe(404);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });

    test('HTTP 503 Service Unavailable retains all defensive security headers', async () => {
      mockCheckDb.mockResolvedValueOnce({
        connected: false,
        database: 'visionroot_service_requests_test_mock',
        error: 'Simulated database outage',
      });

      const res = await request(app).get('/api/health');

      expect(res.status).toBe(503);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('DENY');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });
  });

  // =========================================================================
  // 4. CORS Preservation
  // =========================================================================

  describe('CORS Behavior Preservation', () => {
    test('returns Access-Control-Allow-Origin matching configured origin', async () => {
      const res = await request(app)
        .get('/api/requests')
        .set('Origin', 'http://localhost:3000');

      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });

    test('OPTIONS pre-flight request responds with permitted CORS headers', async () => {
      const res = await request(app)
        .options('/api/requests')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type');

      expect(res.status).toBe(204);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });
  });
});
