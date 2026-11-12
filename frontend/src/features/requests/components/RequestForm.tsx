'use client';

import React, { useState } from 'react';
import { ServiceRequest, CreateRequestDTO, RequestCategory, RequestPriority } from '../types/request';
import { validateCreateRequest, FormErrors } from '../validation/requestValidation';
import { mockRequestService } from '../services/mockRequests';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface RequestFormProps {
  onSuccess?: (request: ServiceRequest) => void;
}

const CATEGORY_OPTIONS: { value: RequestCategory; label: string }[] = [
  { value: 'IT', label: 'IT — Hardware, Software, Network' },
  { value: 'Facilities', label: 'Facilities — Building, Equipment' },
  { value: 'Other', label: 'Other — General Requests' },
];

const PRIORITY_OPTIONS: { value: RequestPriority; label: string }[] = [
  { value: 'LOW', label: 'Low — Non-urgent, resolve when possible' },
  { value: 'MEDIUM', label: 'Medium — Normal priority (default)' },
  { value: 'HIGH', label: 'High — Urgent, requires prompt attention' },
];

const EMPTY_FORM: CreateRequestDTO = {
  title: '',
  description: '',
  category: 'IT',
  priority: 'MEDIUM',
};

/**
 * RequestForm — validated create-request form for Day 04 frontend.
 * Submits to mockRequestService (in-memory). Backend CRUD not yet implemented.
 * Validation rules per docs/requirements.md Day 01 data dictionary.
 */
export const RequestForm: React.FC<RequestFormProps> = ({ onSuccess }) => {
  const [form, setForm] = useState<CreateRequestDTO>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = useState<ServiceRequest | null>(null);

  const titleLen = form.title.trim().length;
  const descLen = form.description.trim().length;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear individual field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate before hitting mock API
    const { isValid, errors: validationErrors } = validateCreateRequest(form);
    if (!isValid) {
      setErrors(validationErrors);
      // Focus the first errored field
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      el?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await mockRequestService.createRequest(form);
      setCreatedRequest(created);
      setForm(EMPTY_FORM);
      setErrors({});
      onSuccess?.(created);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitError(null);
    setCreatedRequest(null);
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (createdRequest) {
    return (
      <div role="status" aria-live="polite">
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <strong>✅ Request submitted successfully! (Demo Mode)</strong>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
            Your request has been created in the demo data store. It will not persist after a page
            reload because the backend database is not yet implemented.
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
            <strong>Request ID:</strong>{' '}
            <code style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{createdRequest.id}</code>
          </p>
        </div>

        <div
          className="card"
          style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}
        >
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{createdRequest.title}</h3>
          <p style={{ margin: '0 0 0.75rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            {createdRequest.description}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ backgroundColor: 'var(--status-open-bg)', color: 'var(--status-open-text)', border: '1px solid var(--status-open-border)' }}>
              {createdRequest.status}
            </span>
            <span className="badge" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
              {createdRequest.category}
            </span>
            <span className="badge" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
              {createdRequest.priority}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={handleReset}>
            Submit Another Request
          </Button>
          <a href="/requests" className="btn btn-outline">
            View All Requests
          </a>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Submit new service request">
      {/* Demo notice */}
      <div
        className="alert alert-warning"
        role="note"
        style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}
      >
        ⚠ <strong>Demo Mode:</strong> Submissions are stored in memory only and will not persist to
        a database. The backend API is not yet implemented (Day 06).
      </div>

      {/* Global submit error */}
      {submitError && (
        <div role="alert" className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <strong>Submission failed:</strong> {submitError}
        </div>
      )}

      {/* Title */}
      <Input
        id="field-title"
        name="title"
        label="Title"
        required
        value={form.title}
        onChange={handleChange}
        error={errors.title}
        helperText={`${titleLen} / 100 characters (minimum 5)`}
        placeholder="e.g. Monitor flickering on Desk 12"
        maxLength={100}
        disabled={isSubmitting}
      />

      {/* Description */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="field-description" className="form-label">
          Description <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
        </label>
        <textarea
          id="field-description"
          name="description"
          className={`form-textarea${errors.description ? ' input-error' : ''}`}
          rows={4}
          required
          value={form.description}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Describe the issue in detail so it can be resolved efficiently…"
          maxLength={1000}
          aria-describedby="desc-help desc-error"
          aria-invalid={errors.description ? 'true' : 'false'}
          style={{
            width: '100%',
            padding: '0.625rem 0.75rem',
            border: `1px solid ${errors.description ? '#dc2626' : 'var(--color-border)'}`,
            borderRadius: '6px',
            fontSize: '0.9375rem',
            lineHeight: 1.5,
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {errors.description ? (
          <p id="desc-error" role="alert" style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#dc2626' }}>
            {errors.description}
          </p>
        ) : (
          <p id="desc-help" style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--color-text-subtle)' }}>
            {descLen} / 1000 characters (minimum 10)
          </p>
        )}
      </div>

      {/* Category */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="field-category" className="form-label">
          Category <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
        </label>
        <select
          id="field-category"
          name="category"
          className={`form-select${errors.category ? ' input-error' : ''}`}
          required
          value={form.category}
          onChange={handleChange}
          disabled={isSubmitting}
          aria-invalid={errors.category ? 'true' : 'false'}
          aria-describedby={errors.category ? 'cat-error' : undefined}
          style={{
            width: '100%',
            padding: '0.625rem 0.75rem',
            border: `1px solid ${errors.category ? '#dc2626' : 'var(--color-border)'}`,
            borderRadius: '6px',
            fontSize: '0.9375rem',
            fontFamily: 'inherit',
            backgroundColor: 'var(--color-bg-card)',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
        >
          {CATEGORY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {errors.category && (
          <p id="cat-error" role="alert" style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#dc2626' }}>
            {errors.category}
          </p>
        )}
      </div>

      {/* Priority */}
      <div className="form-group" style={{ marginBottom: '1.75rem' }}>
        <label htmlFor="field-priority" className="form-label">
          Priority
        </label>
        <select
          id="field-priority"
          name="priority"
          className="form-select"
          value={form.priority}
          onChange={handleChange}
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '0.625rem 0.75rem',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            fontSize: '0.9375rem',
            fontFamily: 'inherit',
            backgroundColor: 'var(--color-bg-card)',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
        >
          {PRIORITY_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--color-text-subtle)' }}>
          Defaults to Medium. Select High only for urgent operational issues.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Submit Request
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={handleReset}
        >
          Clear Form
        </Button>
      </div>
    </form>
  );
};
