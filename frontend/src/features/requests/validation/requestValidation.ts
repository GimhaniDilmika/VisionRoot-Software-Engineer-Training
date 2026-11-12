import { CreateRequestDTO, RequestCategory, RequestPriority } from '../types/request';

export interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

const ALLOWED_CATEGORIES: RequestCategory[] = ['IT', 'Facilities', 'Other'];
const ALLOWED_PRIORITIES: RequestPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

/**
 * Validates the Create Request form input adhering to Day 01 specifications:
 * - title: 5 - 100 characters, whitespace trimmed, required
 * - description: 10 - 1000 characters, whitespace trimmed, required
 * - category: 'IT' | 'Facilities' | 'Other', required
 * - priority: 'LOW' | 'MEDIUM' | 'HIGH', required
 */
export function validateCreateRequest(values: Partial<CreateRequestDTO>): ValidationResult {
  const errors: FormErrors = {};

  // Title validation
  const rawTitle = values.title ?? '';
  const trimmedTitle = rawTitle.trim();
  if (!trimmedTitle) {
    errors.title = 'Title is required and cannot be blank.';
  } else if (trimmedTitle.length < 5) {
    errors.title = `Title must be at least 5 characters (currently ${trimmedTitle.length}).`;
  } else if (trimmedTitle.length > 100) {
    errors.title = `Title cannot exceed 100 characters (currently ${trimmedTitle.length}).`;
  }

  // Description validation
  const rawDesc = values.description ?? '';
  const trimmedDesc = rawDesc.trim();
  if (!trimmedDesc) {
    errors.description = 'Description is required.';
  } else if (trimmedDesc.length < 10) {
    errors.description = `Description must be at least 10 characters (currently ${trimmedDesc.length}).`;
  } else if (trimmedDesc.length > 1000) {
    errors.description = `Description cannot exceed 1000 characters (currently ${trimmedDesc.length}).`;
  }

  // Category validation
  if (!values.category) {
    errors.category = 'Please select a valid service category.';
  } else if (!ALLOWED_CATEGORIES.includes(values.category)) {
    errors.category = 'Category must be IT, Facilities, or Other.';
  }

  // Priority validation
  if (!values.priority) {
    errors.priority = 'Please select a priority level.';
  } else if (!ALLOWED_PRIORITIES.includes(values.priority)) {
    errors.priority = 'Priority must be LOW, MEDIUM, or HIGH.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
