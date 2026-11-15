'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ServiceRequest, CreateRequestDTO, RequestCategory, RequestPriority } from '../types/request';
import { validateCreateRequest, FormErrors } from '../validation/requestValidation';
import { requestApi } from '../services/requestApi';
import { Button } from '../../../components/ui/Button';

interface RequestFormProps {
  onSuccess?: (request: ServiceRequest) => void;
}

const CATEGORY_OPTIONS: { value: RequestCategory; label: string; short: string }[] = [
  { value: 'IT',         label: 'IT — Hardware, Software & Network',          short: 'IT' },
  { value: 'Facilities', label: 'Facilities — Building, Lighting & Furniture', short: 'Facilities' },
  { value: 'Other',      label: 'Other — General Workplace Requests',          short: 'Other' },
];

const PRIORITY_OPTIONS: { value: RequestPriority; label: string; short: string; hint: string; chipClass: string; icon: string }[] = [
  { value: 'LOW',    label: 'Low',    short: 'Low',    hint: 'Non-urgent — address when convenient',         chipClass: 'chip-low',  icon: '↓' },
  { value: 'MEDIUM', label: 'Medium', short: 'Medium', hint: 'Standard — normal business operational priority', chipClass: 'chip-med',  icon: '•' },
  { value: 'HIGH',   label: 'High',   short: 'High',   hint: 'Urgent — business operations are impacted',    chipClass: 'chip-high', icon: '↑' },
];

const EMPTY_FORM: CreateRequestDTO = {
  title: '',
  description: '',
  category: 'IT',
  priority: 'MEDIUM',
};

/** Format short UUID for display */
function shortId(id: string): string {
  return id.length > 8 ? id.substring(0, 8) + '…' : id;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onSuccess }) => {
  const [form, setForm]               = useState<CreateRequestDTO>(EMPTY_FORM);
  const [errors, setErrors]           = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = useState<ServiceRequest | null>(null);

  const titleLen = form.title.trim().length;
  const descLen  = form.description.trim().length;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    // Frontend validation — mirrors backend rules
    const { isValid, errors: validationErrors } = validateCreateRequest(form);
    if (!isValid) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      el?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await requestApi.createRequest(form);
      if (response.success && response.data) {
        setCreatedRequest(response.data);
        setForm(EMPTY_FORM);
        setErrors({});
        onSuccess?.(response.data);
      } else {
        // Surface backend field-level errors if provided
        if (response.error?.details && response.error.details.length > 0) {
          const fieldErrors: FormErrors = {};
          response.error.details.forEach((d) => {
            if (d.field) fieldErrors[d.field as keyof FormErrors] = d.message;
          });
          setErrors(fieldErrors);
        }
        setSubmitError(
          response.error?.message || 'Failed to submit request. Please check your inputs.'
        );
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Network error communicating with the backend.'
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

  /* ─────────────────────────────────────────────────────────────────────────────
     SUCCESS STATE
  ───────────────────────────────────────────────────────────────────────────── */
  if (createdRequest) {
    const selectedPriority = PRIORITY_OPTIONS.find((p) => p.value === createdRequest.priority);
    return (
      <div className="form-success-panel" role="status" aria-live="polite" aria-label="Request submitted successfully">
        {/* Success Header */}
        <div className="form-success-header">
          <div className="form-success-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <h2 className="form-success-title">Service Request Submitted!</h2>
            <p className="form-success-subtitle">
              Ticket persisted to PostgreSQL with status <strong>OPEN</strong> and assigned ID:{' '}
              <code title={`Full UUID: ${createdRequest.id}`}>{shortId(createdRequest.id)}</code>
            </p>
          </div>
        </div>

        {/* Ticket Preview */}
        <div className="form-success-body">
          <div className="form-success-ticket">
            <div className="form-success-ticket-header">
              <h3 className="form-success-ticket-title">{createdRequest.title}</h3>
              <span className="status-pill status-pill-open" aria-label="Status: Open">
                <span className="status-dot" aria-hidden="true" />
                <span>Open</span>
              </span>
            </div>

            <p className="form-success-ticket-desc">{createdRequest.description}</p>

            <div className="form-success-ticket-meta">
              <span className="form-success-ticket-meta-item">
                <strong>Category:</strong> {createdRequest.category}
              </span>
              <span className="form-success-ticket-meta-item">
                <strong>Priority:</strong>
                {selectedPriority && (
                  <span
                    className={`priority-hint-chip ${selectedPriority.chipClass}`}
                    style={{ marginLeft: '0.25rem' }}
                  >
                    {selectedPriority.icon} {selectedPriority.short}
                  </span>
                )}
              </span>
              <span className="form-success-ticket-meta-item" title={`Full ID: ${createdRequest.id}`}>
                <strong>Ticket ID:</strong>
                <code style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-navy)', marginLeft: '0.25rem' }}>
                  {shortId(createdRequest.id)}
                </code>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-success-actions">
            <Link
              href={`/requests/${createdRequest.id}`}
              className="btn btn-primary"
              aria-label={`View details for ticket ${shortId(createdRequest.id)}`}
            >
              View Request Details →
            </Link>
            <Button variant="outline" onClick={handleReset} aria-label="Clear and submit another request">
              Submit Another Request
            </Button>
            <Link href="/requests" className="btn btn-outline" aria-label="Go to All Requests list">
              All Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────────
     FORM STATE
  ───────────────────────────────────────────────────────────────────────────── */
  return (
    <div className="form-card">
      {/* Card Header */}
      <div className="form-card-header" aria-hidden="true">
        <div className="form-card-header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        </div>
        <div className="form-card-header-text">
          <h2>Service Request Details</h2>
          <p>Fields marked with <span style={{ color: '#DC2626' }}>*</span> are required</p>
        </div>
      </div>

      {/* Card Body — the actual form */}
      <form onSubmit={handleSubmit} noValidate aria-label="Submit service request form">
        <div className="form-card-body">

          {/* Triage Guidance Banner */}
          <div className="form-guidance-banner" role="note">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              <strong>Triage Guidance:</strong> Provide accurate hardware location or reproduction steps. Tickets are routed to support technicians based on Category and Priority.
            </span>
          </div>

          {/* Global Error Banner */}
          {submitError && (
            <div role="alert" className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: '1px' }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <strong>Submission Failed:</strong> {submitError}
              </div>
            </div>
          )}

          {/* ── SECTION: Request Information ───────────────────────────────── */}
          <div className="form-section-label">Request Information</div>

          {/* Field: Request Title */}
          <div className="form-field">
            <label htmlFor="field-title" className="form-label">
              Request Title <span className="form-required-star" aria-hidden="true">*</span>
            </label>
            <input
              id="field-title"
              name="title"
              type="text"
              className={`form-input-lg ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Flickering external monitor on Desk 14"
              value={form.title}
              onChange={handleChange}
              disabled={isSubmitting}
              maxLength={100}
              autoComplete="off"
              spellCheck={true}
              aria-required="true"
              aria-invalid={errors.title ? 'true' : 'false'}
              aria-describedby={errors.title ? 'title-error' : 'title-hint'}
            />
            <div className="form-field-meta">
              {errors.title ? (
                <span id="title-error" role="alert" className="form-field-error">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2"/></svg>
                  {errors.title}
                </span>
              ) : (
                <span id="title-hint" className="form-field-hint">
                  Clear summary of the problem (5–100 characters)
                </span>
              )}
              <span className={`form-field-counter ${titleLen > 90 ? 'counter-warning' : ''}`} aria-live="polite" aria-label={`${titleLen} of 100 characters used`}>
                {titleLen}&thinsp;/&thinsp;100
              </span>
            </div>
          </div>

          {/* ── SECTION: Classification ─────────────────────────────────────── */}
          <div className="form-section-label" style={{ marginTop: '1.5rem' }}>Classification</div>

          {/* Two-column: Category + Priority */}
          <div className="form-row-2col">
            {/* Field: Category */}
            <div className="form-field" style={{ marginBottom: 0 }}>
              <label htmlFor="field-category" className="form-label">
                Category <span className="form-required-star" aria-hidden="true">*</span>
              </label>
              <select
                id="field-category"
                name="category"
                className={`form-select-lg ${errors.category ? 'input-error' : ''}`}
                value={form.category}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={errors.category ? 'true' : 'false'}
                aria-describedby={errors.category ? 'cat-error' : 'cat-hint'}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.category ? (
                <p id="cat-error" role="alert" className="form-field-error" style={{ marginTop: '0.3rem' }}>
                  {errors.category}
                </p>
              ) : (
                <p id="cat-hint" className="form-field-hint" style={{ marginTop: '0.3rem' }}>
                  IT · Facilities · Other
                </p>
              )}
            </div>

            {/* Field: Priority */}
            <div className="form-field" style={{ marginBottom: 0 }}>
              <label htmlFor="field-priority" className="form-label">
                Priority <span className="form-required-star" aria-hidden="true">*</span>
              </label>
              <select
                id="field-priority"
                name="priority"
                className="form-select-lg"
                value={form.priority}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-required="true"
                aria-describedby="priority-hint"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <div id="priority-hint" className="priority-hint-row" aria-label="Priority levels: Low, Medium, High">
                {PRIORITY_OPTIONS.map((p) => (
                  <span
                    key={p.value}
                    className={`priority-hint-chip ${p.chipClass} ${form.priority === p.value ? '' : ''}`}
                    style={{ opacity: form.priority === p.value ? 1 : 0.45 }}
                    aria-current={form.priority === p.value ? 'true' : undefined}
                  >
                    {p.icon} {p.short}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION: Description ────────────────────────────────────────── */}
          <div className="form-section-label" style={{ marginTop: '1.5rem' }}>Detailed Explanation</div>

          {/* Field: Description */}
          <div className="form-field">
            <label htmlFor="field-description" className="form-label">
              Problem Description <span className="form-required-star" aria-hidden="true">*</span>
            </label>
            <textarea
              id="field-description"
              name="description"
              className={`form-textarea-lg ${errors.description ? 'input-error' : ''}`}
              rows={6}
              placeholder="Describe what occurred, any error messages seen, the hardware location, and steps already tried to resolve it…"
              value={form.description}
              onChange={handleChange}
              disabled={isSubmitting}
              maxLength={1000}
              spellCheck={true}
              aria-required="true"
              aria-invalid={errors.description ? 'true' : 'false'}
              aria-describedby={errors.description ? 'desc-error' : 'desc-hint'}
            />
            <div className="form-field-meta">
              {errors.description ? (
                <span id="desc-error" role="alert" className="form-field-error">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2"/></svg>
                  {errors.description}
                </span>
              ) : (
                <span id="desc-hint" className="form-field-hint">
                  Comprehensive details help technicians diagnose faster (10–1000 characters)
                </span>
              )}
              <span
                className={`form-field-counter ${descLen > 900 ? 'counter-warning' : ''}`}
                aria-live="polite"
                aria-label={`${descLen} of 1000 characters used`}
              >
                {descLen}&thinsp;/&thinsp;1000
              </span>
            </div>
          </div>

        </div>{/* /form-card-body */}

        {/* ── Submit Bar ─────────────────────────────────────────────────────── */}
        <div className="form-submit-bar">
          <span className="required-note" aria-hidden="true">
            <span style={{ color: '#DC2626' }}>*</span> Required fields
          </span>

          {isSubmitting && (
            <span className="form-submitting-note" aria-live="polite" role="status">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true">
                <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
              Submitting…
            </span>
          )}

          <Link
            href="/requests"
            className="btn btn-outline"
            style={{ border: 'none', color: 'var(--color-text-subtle)' }}
            aria-label="Cancel and return to All Requests"
            tabIndex={isSubmitting ? -1 : 0}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            aria-label="Submit the service request"
            aria-disabled={isSubmitting}
          >
            Submit Service Request
          </Button>
        </div>

      </form>
    </div>
  );
};
