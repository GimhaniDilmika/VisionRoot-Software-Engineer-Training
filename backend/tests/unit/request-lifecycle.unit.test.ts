/**
 * Request Lifecycle / State Machine Unit Tests
 *
 * Tests the updateRequestStatus() state machine in service.ts for all
 * 16 status-to-status combinations, UUID validation, and not-found handling.
 *
 * No PostgreSQL connection is used — the repository is replaced by the
 * in-memory mockRequestRepository throughout all tests.
 *
 * Pattern: Arrange → Act → Assert
 */

// ---------------------------------------------------------------------------
// Module mocks — declared BEFORE imports to satisfy Jest hoisting.
// Lazy require() inside the factory avoids the TDZ initialization error.
// ---------------------------------------------------------------------------

jest.mock('../../src/infrastructure/database/pool', () => ({
  pool: { on: jest.fn(), end: jest.fn() },
  query: jest.fn(),
  checkDatabaseConnection: jest.fn(),
  closePool: jest.fn(),
}));

jest.mock('../../src/modules/requests/repository', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { mockRequestRepository } = require('../mocks/mock-request-repository');
  return { requestRepository: mockRequestRepository };
});

import {
  requestService,
  InvalidStateTransitionError,
  InvalidIdentifierError,
  NotFoundError,
} from '../../src/modules/requests/service';
import {
  RequestStatus,
  ALLOWED_TRANSITIONS,
  VALID_STATUSES,
} from '../../src/modules/requests/types';
import {
  mockRequestRepository,
  resetMockStore,
  seedMockStore,
} from '../mocks/mock-request-repository';

// ---------------------------------------------------------------------------
// Shared test fixtures
// ---------------------------------------------------------------------------

const VALID_UUID = '00000001-0000-4000-8000-000000000000';
const NONEXISTENT_UUID = 'ffffffff-ffff-4fff-bfff-ffffffffffff';

/** Build a ServiceRequest fixture in a given status for seeding the mock store. */
function makeFixture(status: RequestStatus, id = VALID_UUID) {
  return {
    id,
    title: 'Test request title',
    description: 'A test description that is long enough.',
    category: 'IT' as const,
    priority: 'MEDIUM' as const,
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
});

// ---------------------------------------------------------------------------
// UUID validation
// ---------------------------------------------------------------------------

describe('updateRequestStatus — UUID validation', () => {
  test('rejects plain string "not-a-uuid"', async () => {
    await expect(
      requestService.updateRequestStatus('not-a-uuid', { status: 'IN_PROGRESS' })
    ).rejects.toThrow(InvalidIdentifierError);
  });

  test('rejects short hex string without dashes', async () => {
    await expect(
      requestService.updateRequestStatus('12345678', { status: 'IN_PROGRESS' })
    ).rejects.toThrow(InvalidIdentifierError);
  });

  test('rejects empty string', async () => {
    await expect(
      requestService.updateRequestStatus('', { status: 'IN_PROGRESS' })
    ).rejects.toThrow(InvalidIdentifierError);
  });

  test('rejects UUID with wrong segment lengths', async () => {
    await expect(
      requestService.updateRequestStatus('12345-6789-abcd-ef01-234567890abc', {
        status: 'IN_PROGRESS',
      })
    ).rejects.toThrow(InvalidIdentifierError);
  });

  test('accepts a well-formed UUID v4 string', async () => {
    // Seed a record so the service can find it
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    const result = await requestService.updateRequestStatus(VALID_UUID, {
      status: 'IN_PROGRESS',
    });
    expect(result.status).toBe('IN_PROGRESS');
  });
});

// ---------------------------------------------------------------------------
// Not-found handling
// ---------------------------------------------------------------------------

describe('updateRequestStatus — not-found handling', () => {
  test('throws NotFoundError for a valid UUID that does not exist in the store', async () => {
    // Store is empty; no record seeded
    await expect(
      requestService.updateRequestStatus(NONEXISTENT_UUID, {
        status: 'IN_PROGRESS',
      })
    ).rejects.toThrow(NotFoundError);
  });

  test('error message contains the nonexistent UUID', async () => {
    try {
      await requestService.updateRequestStatus(NONEXISTENT_UUID, {
        status: 'IN_PROGRESS',
      });
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError);
      expect((err as NotFoundError).message).toContain(NONEXISTENT_UUID);
    }
  });

  test('throws NotFoundError if repository.updateStatus returns null despite record existing initially (defensive branch)', async () => {
    // Arrange: seed valid OPEN record so findById succeeds initially
    seedMockStore(makeFixture('OPEN', VALID_UUID));
    const updateSpy = jest
      .spyOn(mockRequestRepository, 'updateStatus')
      .mockResolvedValueOnce(null);

    // Act
    let thrownError: unknown;
    try {
      await requestService.updateRequestStatus(VALID_UUID, {
        status: 'IN_PROGRESS',
      });
    } catch (err) {
      thrownError = err;
    }

    // Assert: error class, name, and exact message
    expect(thrownError).toBeInstanceOf(NotFoundError);
    expect((thrownError as NotFoundError).name).toBe('NotFoundError');
    expect((thrownError as NotFoundError).message).toBe(
      `Service request with ID '${VALID_UUID}' was not found`
    );
    expect(updateSpy).toHaveBeenCalledWith(VALID_UUID, 'IN_PROGRESS');

    updateSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Valid transitions
// ---------------------------------------------------------------------------

describe('updateRequestStatus — valid transitions', () => {
  test('OPEN → IN_PROGRESS succeeds and returns updated record', async () => {
    seedMockStore(makeFixture('OPEN'));
    const result = await requestService.updateRequestStatus(VALID_UUID, {
      status: 'IN_PROGRESS',
    });
    expect(result.status).toBe('IN_PROGRESS');
    expect(result.id).toBe(VALID_UUID);
  });

  test('IN_PROGRESS → RESOLVED succeeds and returns updated record', async () => {
    seedMockStore(makeFixture('IN_PROGRESS'));
    const result = await requestService.updateRequestStatus(VALID_UUID, {
      status: 'RESOLVED',
    });
    expect(result.status).toBe('RESOLVED');
    expect(result.id).toBe(VALID_UUID);
  });

  test('RESOLVED → CLOSED succeeds and returns updated record', async () => {
    seedMockStore(makeFixture('RESOLVED'));
    const result = await requestService.updateRequestStatus(VALID_UUID, {
      status: 'CLOSED',
    });
    expect(result.status).toBe('CLOSED');
    expect(result.id).toBe(VALID_UUID);
  });
});

// ---------------------------------------------------------------------------
// All 16 status combinations — systematic coverage
// ---------------------------------------------------------------------------

describe('updateRequestStatus — all 16 status combinations', () => {
  const allStatuses = VALID_STATUSES as RequestStatus[];

  for (const from of allStatuses) {
    for (const to of allStatuses) {
      const isAllowed = ALLOWED_TRANSITIONS[from].includes(to);
      const isTerminal = ALLOWED_TRANSITIONS[from].length === 0;

      if (isAllowed) {
        test(`PASS  ${from} → ${to} (allowed transition)`, async () => {
          resetMockStore();
          seedMockStore(makeFixture(from));
          const result = await requestService.updateRequestStatus(VALID_UUID, {
            status: to,
          });
          expect(result.status).toBe(to);
        });
      } else if (isTerminal) {
        test(`BLOCK ${from} → ${to} (terminal state — cannot modify CLOSED)`, async () => {
          resetMockStore();
          seedMockStore(makeFixture(from));
          await expect(
            requestService.updateRequestStatus(VALID_UUID, { status: to })
          ).rejects.toThrow(InvalidStateTransitionError);
        });
      } else {
        test(`BLOCK ${from} → ${to} (invalid transition)`, async () => {
          resetMockStore();
          seedMockStore(makeFixture(from));
          await expect(
            requestService.updateRequestStatus(VALID_UUID, { status: to })
          ).rejects.toThrow(InvalidStateTransitionError);
        });
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Terminal state — CLOSED
// ---------------------------------------------------------------------------

describe('updateRequestStatus — terminal CLOSED state', () => {
  test('CLOSED → OPEN throws InvalidStateTransitionError', async () => {
    seedMockStore(makeFixture('CLOSED'));
    await expect(
      requestService.updateRequestStatus(VALID_UUID, { status: 'OPEN' })
    ).rejects.toThrow(InvalidStateTransitionError);
  });

  test('CLOSED → IN_PROGRESS throws InvalidStateTransitionError', async () => {
    seedMockStore(makeFixture('CLOSED'));
    await expect(
      requestService.updateRequestStatus(VALID_UUID, { status: 'IN_PROGRESS' })
    ).rejects.toThrow(InvalidStateTransitionError);
  });

  test('CLOSED → RESOLVED throws InvalidStateTransitionError', async () => {
    seedMockStore(makeFixture('CLOSED'));
    await expect(
      requestService.updateRequestStatus(VALID_UUID, { status: 'RESOLVED' })
    ).rejects.toThrow(InvalidStateTransitionError);
  });

  test('CLOSED → CLOSED throws InvalidStateTransitionError (self-transition blocked)', async () => {
    seedMockStore(makeFixture('CLOSED'));
    await expect(
      requestService.updateRequestStatus(VALID_UUID, { status: 'CLOSED' })
    ).rejects.toThrow(InvalidStateTransitionError);
  });

  test('error name is "InvalidStateTransitionError" for terminal state', async () => {
    seedMockStore(makeFixture('CLOSED'));
    try {
      await requestService.updateRequestStatus(VALID_UUID, { status: 'OPEN' });
    } catch (err) {
      expect((err as Error).name).toBe('InvalidStateTransitionError');
    }
  });

  test('error message mentions "CLOSED" for terminal state', async () => {
    seedMockStore(makeFixture('CLOSED'));
    try {
      await requestService.updateRequestStatus(VALID_UUID, { status: 'OPEN' });
    } catch (err) {
      expect((err as Error).message).toContain('CLOSED');
    }
  });
});

// ---------------------------------------------------------------------------
// Invalid status value in body
// ---------------------------------------------------------------------------

describe('updateRequestStatus — invalid status value in body', () => {
  test('throws ValidationError for unknown status "PENDING"', async () => {
    seedMockStore(makeFixture('OPEN'));
    const { ValidationError } = await import('../../src/modules/requests/service');
    await expect(
      requestService.updateRequestStatus(VALID_UUID, { status: 'PENDING' })
    ).rejects.toThrow(ValidationError);
  });

  test('throws ValidationError for empty status string', async () => {
    seedMockStore(makeFixture('OPEN'));
    const { ValidationError } = await import('../../src/modules/requests/service');
    await expect(
      requestService.updateRequestStatus(VALID_UUID, { status: '' })
    ).rejects.toThrow(ValidationError);
  });

  test('throws ValidationError for missing status field (empty body object)', async () => {
    seedMockStore(makeFixture('OPEN'));
    const { ValidationError } = await import('../../src/modules/requests/service');
    await expect(
      requestService.updateRequestStatus(VALID_UUID, {})
    ).rejects.toThrow(ValidationError);
  });

  test('throws ValidationError for null body', async () => {
    seedMockStore(makeFixture('OPEN'));
    const { ValidationError } = await import('../../src/modules/requests/service');
    await expect(
      requestService.updateRequestStatus(VALID_UUID, null)
    ).rejects.toThrow(ValidationError);
  });
});

// ---------------------------------------------------------------------------
// Return value correctness
// ---------------------------------------------------------------------------

describe('updateRequestStatus — return value correctness', () => {
  test('returned record preserves id, title, description, category, priority', async () => {
    const fixture = makeFixture('OPEN');
    seedMockStore(fixture);
    const result = await requestService.updateRequestStatus(VALID_UUID, {
      status: 'IN_PROGRESS',
    });
    expect(result.id).toBe(fixture.id);
    expect(result.title).toBe(fixture.title);
    expect(result.description).toBe(fixture.description);
    expect(result.category).toBe(fixture.category);
    expect(result.priority).toBe(fixture.priority);
  });

  test('returned record status equals the requested target status', async () => {
    seedMockStore(makeFixture('IN_PROGRESS'));
    const result = await requestService.updateRequestStatus(VALID_UUID, {
      status: 'RESOLVED',
    });
    expect(result.status).toBe('RESOLVED');
  });
});
