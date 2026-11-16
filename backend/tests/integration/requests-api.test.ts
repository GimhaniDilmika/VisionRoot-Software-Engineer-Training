/**
 * Service Request API Integration Tests
 *
 * Tests the full HTTP stack:
 *   Express router → controller → requestService → mockRequestRepository
 *
 * Routes exercised:
 *   GET    /api/requests
 *   GET    /api/requests/:id
 *   POST   /api/requests
 *   PATCH  /api/requests/:id/status
 *
 * Database isolation guarantee:
 *   - jest.mock() replaces the pg pool before any module is imported.
 *   - The in-memory mockRequestRepository replaces all PostgreSQL calls.
 *   - resetMockStore() clears state between every test.
 *   - No real connection to visionroot_service_requests is opened.
 *
 * Pattern: Arrange → Act → Assert
 */

// ---------------------------------------------------------------------------
// Module mocks — declared BEFORE all imports (Jest hoisting requirement).
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
import {
  resetMockStore,
  seedMockStore,
  getMockStore,
} from '../mocks/mock-request-repository';
import { ServiceRequest } from '../../src/modules/requests/types';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const VALID_UUID = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
const NONEXISTENT_UUID = 'ffffffff-ffff-4fff-bfff-ffffffffffff';
const INVALID_UUID = 'not-a-valid-uuid';

const VALID_POST_BODY = {
  title: 'Printer not working on Floor 3',
  description: 'The network printer on Floor 3 stopped responding after the update.',
  category: 'IT',
  priority: 'HIGH',
};

function makeFixture(
  status: ServiceRequest['status'] = 'OPEN',
  id = VALID_UUID
): ServiceRequest {
  return {
    id,
    title: 'Test service request title',
    description: 'A test description that is long enough.',
    category: 'IT',
    priority: 'MEDIUM',
    status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  resetMockStore();
  jest.clearAllMocks();
});

// ===========================================================================
// GET /api/requests
// ===========================================================================

describe('GET /api/requests', () => {
  test('returns HTTP 200', async () => {
    const res = await request(app).get('/api/requests');
    expect(res.status).toBe(200);
  });

  test('returns success: true', async () => {
    const res = await request(app).get('/api/requests');
    expect(res.body.success).toBe(true);
  });

  test('returns data as an array', async () => {
    const res = await request(app).get('/api/requests');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('returns empty array when no records exist', async () => {
    const res = await request(app).get('/api/requests');
    expect(res.body.data).toHaveLength(0);
  });

  test('returns seeded records when mock store is populated', async () => {
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    seedMockStore(makeFixture('IN_PROGRESS', NONEXISTENT_UUID));
    const res = await request(app).get('/api/requests');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  test('each record has required fields: id, title, description, category, priority, status, created_at, updated_at', async () => {
    seedMockStore(makeFixture());
    const res = await request(app).get('/api/requests');
    const record = res.body.data[0];
    expect(record).toHaveProperty('id');
    expect(record).toHaveProperty('title');
    expect(record).toHaveProperty('description');
    expect(record).toHaveProperty('category');
    expect(record).toHaveProperty('priority');
    expect(record).toHaveProperty('status');
    expect(record).toHaveProperty('created_at');
    expect(record).toHaveProperty('updated_at');
  });

  test('filters by status=OPEN query parameter', async () => {
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    seedMockStore(makeFixture('RESOLVED', NONEXISTENT_UUID));
    const res = await request(app).get('/api/requests?status=OPEN');
    expect(res.status).toBe(200);
    expect(res.body.data.every((r: ServiceRequest) => r.status === 'OPEN')).toBe(true);
  });

  test('returns 400 for invalid status filter value', async () => {
    const res = await request(app).get('/api/requests?status=INVALID');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('Content-Type header is application/json', async () => {
    const res = await request(app).get('/api/requests');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});

// ===========================================================================
// GET /api/requests/:id
// ===========================================================================

describe('GET /api/requests/:id', () => {
  test('returns HTTP 200 for an existing UUID', async () => {
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    const res = await request(app).get(`/api/requests/${VALID_UUID}`);
    expect(res.status).toBe(200);
  });

  test('returns success: true and correct data for existing UUID', async () => {
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    const res = await request(app).get(`/api/requests/${VALID_UUID}`);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(VALID_UUID);
    expect(res.body.data.status).toBe('OPEN');
  });

  test('returns HTTP 404 for a valid UUID that does not exist', async () => {
    // Store is empty — no record for NONEXISTENT_UUID
    const res = await request(app).get(`/api/requests/${NONEXISTENT_UUID}`);
    expect(res.status).toBe(404);
  });

  test('returns error.code = "NOT_FOUND" for nonexistent UUID', async () => {
    const res = await request(app).get(`/api/requests/${NONEXISTENT_UUID}`);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  test('returns HTTP 400 for an invalid (malformed) UUID', async () => {
    const res = await request(app).get(`/api/requests/${INVALID_UUID}`);
    expect(res.status).toBe(400);
  });

  test('returns error.code = "INVALID_IDENTIFIER" for malformed UUID', async () => {
    const res = await request(app).get(`/api/requests/${INVALID_UUID}`);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_IDENTIFIER');
  });

  test('error response includes top-level timestamp', async () => {
    const res = await request(app).get(`/api/requests/${NONEXISTENT_UUID}`);
    expect(typeof res.body.timestamp).toBe('string');
  });
});

// ===========================================================================
// POST /api/requests
// ===========================================================================

describe('POST /api/requests', () => {
  // ── Success path ───────────────────────────────────────────────────────────

  test('returns HTTP 201 for valid input', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send(VALID_POST_BODY);
    expect(res.status).toBe(201);
  });

  test('returns success: true and data object', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send(VALID_POST_BODY);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  test('new request has OPEN status', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send(VALID_POST_BODY);
    expect(res.body.data.status).toBe('OPEN');
  });

  test('new request has a generated id (UUID format)', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send(VALID_POST_BODY);
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(res.body.data.id).toMatch(uuidRegex);
  });

  test('title is trimmed in the response', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, title: '  Trimmed title  ' });
    expect(res.body.data.title).toBe('Trimmed title');
  });

  test('defaults priority to MEDIUM when omitted', async () => {
    const { priority: _, ...bodyWithoutPriority } = VALID_POST_BODY;
    const res = await request(app)
      .post('/api/requests')
      .send(bodyWithoutPriority);
    expect(res.status).toBe(201);
    expect(res.body.data.priority).toBe('MEDIUM');
  });

  test('persists the new request in the mock store', async () => {
    await request(app).post('/api/requests').send(VALID_POST_BODY);
    expect(getMockStore()).toHaveLength(1);
  });

  // ── Title validation errors ────────────────────────────────────────────────

  test('returns HTTP 400 for empty title', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, title: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('returns HTTP 400 for title shorter than 5 characters', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, title: 'Hi' });
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toContain('title');
  });

  test('returns HTTP 400 for title longer than 100 characters', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, title: 'A'.repeat(101) });
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toContain('title');
  });

  // ── Description validation errors ──────────────────────────────────────────

  test('returns HTTP 400 for empty description', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, description: '' });
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toContain('description');
  });

  test('returns HTTP 400 for description shorter than 10 characters', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, description: 'Too short' });
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toContain('description');
  });

  test('returns HTTP 400 for description longer than 1000 characters', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, description: 'B'.repeat(1001) });
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toContain('description');
  });

  // ── Category validation errors ─────────────────────────────────────────────

  test('returns HTTP 400 for missing category', async () => {
    const { category: _, ...bodyNoCategory } = VALID_POST_BODY;
    const res = await request(app)
      .post('/api/requests')
      .send(bodyNoCategory);
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toContain('category');
  });

  test('returns HTTP 400 for invalid category "Hardware"', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, category: 'Hardware' });
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toContain('category');
  });

  // ── Priority validation errors ─────────────────────────────────────────────

  test('returns HTTP 400 for invalid priority "URGENT"', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, priority: 'URGENT' });
    expect(res.status).toBe(400);
    const fields = res.body.error.details.map((d: { field: string }) => d.field);
    expect(fields).toContain('priority');
  });

  // ── Validation error response shape ────────────────────────────────────────

  test('validation error response has success: false, error.code, error.details, timestamp', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, title: '' });
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(res.body.error.details)).toBe(true);
    expect(typeof res.body.timestamp).toBe('string');
  });

  test('failed POST does not persist a record in the mock store', async () => {
    await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, title: '' });
    expect(getMockStore()).toHaveLength(0);
  });

  test('error details array contains field and message properties', async () => {
    const res = await request(app)
      .post('/api/requests')
      .send({ ...VALID_POST_BODY, title: '' });
    const detail = res.body.error.details[0];
    expect(detail).toHaveProperty('field');
    expect(detail).toHaveProperty('message');
  });
});

// ===========================================================================
// PATCH /api/requests/:id/status
// ===========================================================================

describe('PATCH /api/requests/:id/status', () => {
  // ── Valid transitions ──────────────────────────────────────────────────────

  test('OPEN → IN_PROGRESS returns HTTP 200 and updated status', async () => {
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'IN_PROGRESS' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('IN_PROGRESS');
  });

  test('IN_PROGRESS → RESOLVED returns HTTP 200 and updated status', async () => {
    seedMockStore(makeFixture('IN_PROGRESS', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'RESOLVED' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('RESOLVED');
  });

  test('RESOLVED → CLOSED returns HTTP 200 and updated status', async () => {
    seedMockStore(makeFixture('RESOLVED', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'CLOSED' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('CLOSED');
  });

  // ── Invalid / skipped transitions ─────────────────────────────────────────

  test('OPEN → RESOLVED (skipped step) returns HTTP 400', async () => {
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'RESOLVED' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_STATE_TRANSITION');
  });

  test('OPEN → CLOSED (skipped two steps) returns HTTP 400', async () => {
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'CLOSED' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_STATE_TRANSITION');
  });

  test('OPEN → OPEN (self-transition) returns HTTP 400', async () => {
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'OPEN' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_STATE_TRANSITION');
  });

  test('IN_PROGRESS → OPEN (backward) returns HTTP 400', async () => {
    seedMockStore(makeFixture('IN_PROGRESS', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'OPEN' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_STATE_TRANSITION');
  });

  test('RESOLVED → IN_PROGRESS (backward) returns HTTP 400', async () => {
    seedMockStore(makeFixture('RESOLVED', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'IN_PROGRESS' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_STATE_TRANSITION');
  });

  // ── Terminal CLOSED state ──────────────────────────────────────────────────

  test('CLOSED → OPEN returns HTTP 400 (terminal state)', async () => {
    seedMockStore(makeFixture('CLOSED', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'OPEN' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_STATE_TRANSITION');
  });

  test('CLOSED → IN_PROGRESS returns HTTP 400 (terminal state)', async () => {
    seedMockStore(makeFixture('CLOSED', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'IN_PROGRESS' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_STATE_TRANSITION');
  });

  test('CLOSED → CLOSED returns HTTP 400 (terminal state, self)', async () => {
    seedMockStore(makeFixture('CLOSED', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'CLOSED' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_STATE_TRANSITION');
  });

  // ── UUID and ID validation ─────────────────────────────────────────────────

  test('returns HTTP 400 for malformed UUID in path', async () => {
    const res = await request(app)
      .patch(`/api/requests/${INVALID_UUID}/status`)
      .send({ status: 'IN_PROGRESS' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_IDENTIFIER');
  });

  test('returns HTTP 404 for valid UUID that does not exist', async () => {
    // Store is empty
    const res = await request(app)
      .patch(`/api/requests/${NONEXISTENT_UUID}/status`)
      .send({ status: 'IN_PROGRESS' });
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  // ── Missing / invalid body ─────────────────────────────────────────────────

  test('returns HTTP 400 for unknown status value "PENDING"', async () => {
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'PENDING' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('returns HTTP 400 when status field is missing from body', async () => {
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({});
    expect(res.status).toBe(400);
  });

  // ── Response shape ─────────────────────────────────────────────────────────

  test('successful PATCH returns data with all required record fields', async () => {
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    const res = await request(app)
      .patch(`/api/requests/${VALID_UUID}/status`)
      .send({ status: 'IN_PROGRESS' });
    const d = res.body.data;
    expect(d).toHaveProperty('id');
    expect(d).toHaveProperty('title');
    expect(d).toHaveProperty('description');
    expect(d).toHaveProperty('category');
    expect(d).toHaveProperty('priority');
    expect(d).toHaveProperty('status');
    expect(d).toHaveProperty('created_at');
    expect(d).toHaveProperty('updated_at');
  });

  test('error response includes success: false, error.code, timestamp', async () => {
    const res = await request(app)
      .patch(`/api/requests/${NONEXISTENT_UUID}/status`)
      .send({ status: 'IN_PROGRESS' });
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBeDefined();
    expect(typeof res.body.timestamp).toBe('string');
  });
});

// ===========================================================================
// 404 for unknown routes
// ===========================================================================

describe('Unknown routes', () => {
  test('GET /api/unknown returns HTTP 404', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    expect(res.status).toBe(404);
  });

  test('unknown route returns success: false and NOT_FOUND code', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
