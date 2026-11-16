/**
 * Service Validation Unit Tests
 *
 * Tests the createRequest() and listRequests() validation logic in
 * src/modules/requests/service.ts without touching PostgreSQL.
 *
 * Strategy:
 *   - jest.mock() intercepts the repository import before any module loads.
 *   - mockRequestRepository replaces every pg call with in-memory operations.
 *   - resetMockStore() clears state between tests for full isolation.
 *
 * Pattern: Arrange → Act → Assert
 */

// ---------------------------------------------------------------------------
// Module mocks — declared BEFORE any imports so Jest hoisting works correctly.
// The factory functions are closures that lazily reference the mock module,
// avoiding the "Cannot access before initialization" TDZ error.
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

import { requestService, ValidationError } from '../../src/modules/requests/service';
import {
  VALID_CATEGORIES,
  VALID_PRIORITIES,
} from '../../src/modules/requests/types';
import {
  resetMockStore,
  getMockStore,
} from '../mocks/mock-request-repository';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_BODY = {
  title: 'Valid title here',
  description: 'A valid description that is long enough.',
  category: 'IT',
  priority: 'HIGH',
} as const;

function makeTitle(length: number): string {
  return 'A'.repeat(length);
}

function makeDescription(length: number): string {
  return 'B'.repeat(length);
}

/**
 * Convenience: call createRequest and expect a ValidationError with at least
 * one error on the given field.
 */
async function expectValidationError(
  body: unknown,
  expectedField: string
): Promise<void> {
  await expect(requestService.createRequest(body)).rejects.toThrow(
    ValidationError
  );
  try {
    await requestService.createRequest(body);
  } catch (err) {
    expect(err).toBeInstanceOf(ValidationError);
    const ve = err as ValidationError;
    const fields = ve.details.map((d) => d.field);
    expect(fields).toContain(expectedField);
  }
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  resetMockStore();
});

// ---------------------------------------------------------------------------
// Title validation
// ---------------------------------------------------------------------------

describe('createRequest — title validation', () => {
  test('rejects empty title (empty string)', async () => {
    await expectValidationError({ ...VALID_BODY, title: '' }, 'title');
  });

  test('rejects title that is only whitespace', async () => {
    await expectValidationError({ ...VALID_BODY, title: '     ' }, 'title');
  });

  test('rejects title shorter than 5 characters (4 chars after trim)', async () => {
    await expectValidationError({ ...VALID_BODY, title: 'Abcd' }, 'title');
  });

  test('accepts title of exactly 5 characters', async () => {
    const result = await requestService.createRequest({
      ...VALID_BODY,
      title: 'Abcde',
    });
    expect(result.title).toBe('Abcde');
    expect(result.status).toBe('OPEN');
  });

  test('accepts title of exactly 100 characters', async () => {
    const t100 = makeTitle(100);
    const result = await requestService.createRequest({
      ...VALID_BODY,
      title: t100,
    });
    expect(result.title).toBe(t100);
  });

  test('rejects title longer than 100 characters (101 chars)', async () => {
    await expectValidationError(
      { ...VALID_BODY, title: makeTitle(101) },
      'title'
    );
  });

  test('trims leading and trailing whitespace from title', async () => {
    const result = await requestService.createRequest({
      ...VALID_BODY,
      title: '  My trimmed title  ',
    });
    expect(result.title).toBe('My trimmed title');
  });

  test('error message for short title includes the character count', async () => {
    try {
      await requestService.createRequest({ ...VALID_BODY, title: 'Hi' });
    } catch (err) {
      const ve = err as ValidationError;
      const titleError = ve.details.find((d) => d.field === 'title');
      expect(titleError?.message).toMatch(/2/);
    }
  });

  test('error message for long title includes the character count', async () => {
    try {
      await requestService.createRequest({
        ...VALID_BODY,
        title: makeTitle(101),
      });
    } catch (err) {
      const ve = err as ValidationError;
      const titleError = ve.details.find((d) => d.field === 'title');
      expect(titleError?.message).toMatch(/101/);
    }
  });
});

// ---------------------------------------------------------------------------
// Description validation
// ---------------------------------------------------------------------------

describe('createRequest — description validation', () => {
  test('rejects empty description', async () => {
    await expectValidationError({ ...VALID_BODY, description: '' }, 'description');
  });

  test('rejects description that is only whitespace', async () => {
    await expectValidationError(
      { ...VALID_BODY, description: '         ' },
      'description'
    );
  });

  test('rejects description shorter than 10 characters (9 chars)', async () => {
    await expectValidationError(
      { ...VALID_BODY, description: '123456789' },
      'description'
    );
  });

  test('accepts description of exactly 10 characters', async () => {
    const result = await requestService.createRequest({
      ...VALID_BODY,
      description: '1234567890',
    });
    expect(result.description).toBe('1234567890');
  });

  test('accepts description of exactly 1000 characters', async () => {
    const d1000 = makeDescription(1000);
    const result = await requestService.createRequest({
      ...VALID_BODY,
      description: d1000,
    });
    expect(result.description).toBe(d1000);
  });

  test('rejects description longer than 1000 characters (1001 chars)', async () => {
    await expectValidationError(
      { ...VALID_BODY, description: makeDescription(1001) },
      'description'
    );
  });

  test('trims leading/trailing whitespace from description', async () => {
    const result = await requestService.createRequest({
      ...VALID_BODY,
      description: '  Trimmed description text  ',
    });
    expect(result.description).toBe('Trimmed description text');
  });
});

// ---------------------------------------------------------------------------
// Category validation
// ---------------------------------------------------------------------------

describe('createRequest — category validation', () => {
  test.each(VALID_CATEGORIES)(
    'accepts valid category "%s"',
    async (cat) => {
      const result = await requestService.createRequest({
        ...VALID_BODY,
        category: cat,
      });
      expect(result.category).toBe(cat);
    }
  );

  test('rejects empty category', async () => {
    await expectValidationError({ ...VALID_BODY, category: '' }, 'category');
  });

  test('rejects unknown category "Hardware"', async () => {
    await expectValidationError(
      { ...VALID_BODY, category: 'Hardware' },
      'category'
    );
  });

  test('rejects category "it" (case-sensitive check)', async () => {
    await expectValidationError({ ...VALID_BODY, category: 'it' }, 'category');
  });

  test('rejects category "FACILITIES" (case-sensitive check)', async () => {
    await expectValidationError(
      { ...VALID_BODY, category: 'FACILITIES' },
      'category'
    );
  });

  test('error message for invalid category lists all valid values', async () => {
    try {
      await requestService.createRequest({ ...VALID_BODY, category: 'INVALID' });
    } catch (err) {
      const ve = err as ValidationError;
      const catError = ve.details.find((d) => d.field === 'category');
      VALID_CATEGORIES.forEach((c) => {
        expect(catError?.message).toContain(c);
      });
    }
  });
});

// ---------------------------------------------------------------------------
// Priority validation
// ---------------------------------------------------------------------------

describe('createRequest — priority validation', () => {
  test.each(VALID_PRIORITIES)(
    'accepts valid priority "%s"',
    async (pri) => {
      const result = await requestService.createRequest({
        ...VALID_BODY,
        priority: pri,
      });
      expect(result.priority).toBe(pri);
    }
  );

  test('defaults priority to MEDIUM when omitted (undefined)', async () => {
    const body = { title: VALID_BODY.title, description: VALID_BODY.description, category: VALID_BODY.category };
    const result = await requestService.createRequest(body);
    expect(result.priority).toBe('MEDIUM');
  });

  test('defaults priority to MEDIUM when explicitly null', async () => {
    const result = await requestService.createRequest({
      ...VALID_BODY,
      priority: null,
    });
    expect(result.priority).toBe('MEDIUM');
  });

  test('rejects invalid priority "URGENT"', async () => {
    await expectValidationError(
      { ...VALID_BODY, priority: 'URGENT' },
      'priority'
    );
  });

  test('rejects invalid priority "low" (case-sensitive)', async () => {
    await expectValidationError(
      { ...VALID_BODY, priority: 'low' },
      'priority'
    );
  });

  test('rejects non-string priority (number 1)', async () => {
    await expectValidationError({ ...VALID_BODY, priority: 1 }, 'priority');
  });
});

// ---------------------------------------------------------------------------
// Initial status
// ---------------------------------------------------------------------------

describe('createRequest — initial status', () => {
  test('new request receives OPEN status', async () => {
    const result = await requestService.createRequest({ ...VALID_BODY });
    expect(result.status).toBe('OPEN');
  });

  test('new request is persisted to the store (repository.create called)', async () => {
    await requestService.createRequest({ ...VALID_BODY });
    const store = getMockStore();
    expect(store).toHaveLength(1);
    expect(store[0].status).toBe('OPEN');
  });
});

// ---------------------------------------------------------------------------
// Invalid body structure
// ---------------------------------------------------------------------------

describe('createRequest — invalid body structure', () => {
  test('rejects null body', async () => {
    await expect(requestService.createRequest(null)).rejects.toThrow(
      ValidationError
    );
  });

  test('rejects non-object body (string)', async () => {
    await expect(requestService.createRequest('some string')).rejects.toThrow(
      ValidationError
    );
  });

  test('collects multiple field errors in one pass', async () => {
    // Both title and description invalid — expect both errors in details
    await expect(
      requestService.createRequest({ title: '', description: '', category: 'IT' })
    ).rejects.toThrow(ValidationError);
    try {
      await requestService.createRequest({ title: '', description: '', category: 'IT' });
    } catch (err) {
      const ve = err as ValidationError;
      const fields = ve.details.map((d) => d.field);
      expect(fields).toContain('title');
      expect(fields).toContain('description');
    }
  });
});

// ---------------------------------------------------------------------------
// Store isolation guard
// ---------------------------------------------------------------------------

describe('createRequest — no pollution on validation failure', () => {
  test('failed validation does not create a database record', async () => {
    try {
      await requestService.createRequest({ title: '', description: '', category: 'IT' });
    } catch {
      // expected
    }
    expect(getMockStore()).toHaveLength(0);
  });
});
