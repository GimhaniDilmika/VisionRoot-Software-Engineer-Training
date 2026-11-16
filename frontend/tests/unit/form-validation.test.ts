/**
 * Frontend Request Form Validation Unit Tests
 *
 * Tests the pure validation function `validateCreateRequest()` in
 * frontend/src/features/requests/validation/requestValidation.ts.
 *
 * Requirements:
 * - Deterministic, in-memory execution
 * - No UI component rendering or browser environment
 * - No backend API requests or database connections
 * - Strict verification of validation rules, error messages, and non-mutation
 *
 * Pattern: Arrange → Act → Assert
 */

import { validateCreateRequest } from '../../src/features/requests/validation/requestValidation';
import { CreateRequestDTO, RequestCategory, RequestPriority } from '../../src/features/requests/types/request';

describe('validateCreateRequest', () => {
  const VALID_PAYLOAD: CreateRequestDTO = {
    title: 'Monitor display flickering intermittently',
    description: 'The Dell monitor on desk 14 randomly goes black for several seconds throughout the day.',
    category: 'IT',
    priority: 'MEDIUM',
  };

  // =========================================================================
  // Overall Validation & Happy Path
  // =========================================================================

  describe('Valid Inputs', () => {
    test('returns isValid: true and empty errors object for a valid payload', () => {
      // Arrange & Act
      const result = validateCreateRequest(VALID_PAYLOAD);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('does not mutate the input object', () => {
      // Arrange
      const input: Partial<CreateRequestDTO> = {
        title: '  Untrimmed Title String  ',
        description: '  Untrimmed Description String that is long enough  ',
        category: 'IT',
        priority: 'HIGH',
      };
      const originalTitle = input.title;
      const originalDescription = input.description;

      // Act
      validateCreateRequest(input);

      // Assert
      expect(input.title).toBe(originalTitle);
      expect(input.description).toBe(originalDescription);
    });
  });

  // =========================================================================
  // Title Validation
  // =========================================================================

  describe('Title Validation', () => {
    test('rejects empty title string', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, title: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required and cannot be blank.');
    });

    test('rejects whitespace-only title', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, title: '     ' });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required and cannot be blank.');
    });

    test('rejects undefined / missing title', () => {
      const { title: _, ...noTitle } = VALID_PAYLOAD;
      const result = validateCreateRequest(noTitle);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required and cannot be blank.');
    });

    test('rejects title shorter than 5 characters (4 characters)', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, title: 'Abcd' });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title must be at least 5 characters (currently 4).');
    });

    test('accepts title of exactly 5 characters', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, title: 'Abcde' });
      expect(result.errors.title).toBeUndefined();
    });

    test('accepts title of exactly 100 characters', () => {
      const title100 = 'T'.repeat(100);
      const result = validateCreateRequest({ ...VALID_PAYLOAD, title: title100 });
      expect(result.errors.title).toBeUndefined();
    });

    test('rejects title longer than 100 characters (101 characters)', () => {
      const title101 = 'T'.repeat(101);
      const result = validateCreateRequest({ ...VALID_PAYLOAD, title: title101 });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title cannot exceed 100 characters (currently 101).');
    });

    test('trims leading and trailing whitespace when evaluating length', () => {
      // 5 chars with surrounding whitespace -> trimmed length is 5 -> valid
      const result = validateCreateRequest({ ...VALID_PAYLOAD, title: '  Abcde  ' });
      expect(result.errors.title).toBeUndefined();
    });

    test('rejects title with 4 chars surrounded by whitespace', () => {
      // trimmed length is 4 -> invalid
      const result = validateCreateRequest({ ...VALID_PAYLOAD, title: '  Abcd  ' });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title must be at least 5 characters (currently 4).');
    });
  });

  // =========================================================================
  // Description Validation
  // =========================================================================

  describe('Description Validation', () => {
    test('rejects empty description string', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, description: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Description is required.');
    });

    test('rejects whitespace-only description', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, description: '          ' });
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Description is required.');
    });

    test('rejects undefined / missing description', () => {
      const { description: _, ...noDesc } = VALID_PAYLOAD;
      const result = validateCreateRequest(noDesc);
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Description is required.');
    });

    test('rejects description shorter than 10 characters (9 characters)', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, description: '123456789' });
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Description must be at least 10 characters (currently 9).');
    });

    test('accepts description of exactly 10 characters', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, description: '1234567890' });
      expect(result.errors.description).toBeUndefined();
    });

    test('accepts description of exactly 1000 characters', () => {
      const desc1000 = 'D'.repeat(1000);
      const result = validateCreateRequest({ ...VALID_PAYLOAD, description: desc1000 });
      expect(result.errors.description).toBeUndefined();
    });

    test('rejects description longer than 1000 characters (1001 characters)', () => {
      const desc1001 = 'D'.repeat(1001);
      const result = validateCreateRequest({ ...VALID_PAYLOAD, description: desc1001 });
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toBe('Description cannot exceed 1000 characters (currently 1001).');
    });

    test('trims leading and trailing whitespace when evaluating description length', () => {
      // 10 chars with whitespace -> trimmed length 10 -> valid
      const result = validateCreateRequest({ ...VALID_PAYLOAD, description: '  1234567890  ' });
      expect(result.errors.description).toBeUndefined();
    });
  });

  // =========================================================================
  // Category Validation
  // =========================================================================

  describe('Category Validation', () => {
    const validCategories: RequestCategory[] = ['IT', 'Facilities', 'Other'];

    test.each(validCategories)('accepts valid category "%s"', (category) => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, category });
      expect(result.errors.category).toBeUndefined();
    });

    test('rejects missing / undefined category', () => {
      const { category: _, ...noCat } = VALID_PAYLOAD;
      const result = validateCreateRequest(noCat);
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBe('Please select a valid service category.');
    });

    test('rejects empty string category', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, category: '' as any });
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBe('Please select a valid service category.');
    });

    test('rejects unsupported category "Hardware"', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, category: 'Hardware' as any });
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBe('Category must be IT, Facilities, or Other.');
    });

    test('rejects lowercase category "it"', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, category: 'it' as any });
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBe('Category must be IT, Facilities, or Other.');
    });
  });

  // =========================================================================
  // Priority Validation
  // =========================================================================

  describe('Priority Validation', () => {
    const validPriorities: RequestPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

    test.each(validPriorities)('accepts valid priority "%s"', (priority) => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, priority });
      expect(result.errors.priority).toBeUndefined();
    });

    test('rejects missing / undefined priority according to frontend contract', () => {
      const { priority: _, ...noPriority } = VALID_PAYLOAD;
      const result = validateCreateRequest(noPriority);
      expect(result.isValid).toBe(false);
      expect(result.errors.priority).toBe('Please select a priority level.');
    });

    test('rejects empty string priority', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, priority: '' as any });
      expect(result.isValid).toBe(false);
      expect(result.errors.priority).toBe('Please select a priority level.');
    });

    test('rejects unsupported priority "CRITICAL"', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, priority: 'CRITICAL' as any });
      expect(result.isValid).toBe(false);
      expect(result.errors.priority).toBe('Priority must be LOW, MEDIUM, or HIGH.');
    });

    test('rejects lowercase priority "medium"', () => {
      const result = validateCreateRequest({ ...VALID_PAYLOAD, priority: 'medium' as any });
      expect(result.isValid).toBe(false);
      expect(result.errors.priority).toBe('Priority must be LOW, MEDIUM, or HIGH.');
    });
  });

  // =========================================================================
  // Multi-field Error Aggregation
  // =========================================================================

  describe('Multiple Invalid Fields', () => {
    test('aggregates errors across all four fields when all are invalid', () => {
      const result = validateCreateRequest({
        title: 'Hi',
        description: 'Short',
        category: 'InvalidCat' as any,
        priority: 'InvalidPri' as any,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.description).toBeDefined();
      expect(result.errors.category).toBeDefined();
      expect(result.errors.priority).toBeDefined();
      expect(Object.keys(result.errors)).toHaveLength(4);
    });

    test('aggregates errors when payload is completely empty object', () => {
      const result = validateCreateRequest({});

      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe('Title is required and cannot be blank.');
      expect(result.errors.description).toBe('Description is required.');
      expect(result.errors.category).toBe('Please select a valid service category.');
      expect(result.errors.priority).toBe('Please select a priority level.');
    });
  });
});
