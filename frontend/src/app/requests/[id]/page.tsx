'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AppShell } from '../../../components/layout/AppShell';
import { StatusBadge } from '../../../features/requests/components/StatusBadge';
import { PriorityBadge } from '../../../components/ui/PriorityBadge';
import { Button } from '../../../components/ui/Button';
import { requestApi } from '../../../features/requests/services/requestApi';
import {
  ServiceRequest,
  RequestStatus,
  ALLOWED_TRANSITIONS,
} from '../../../features/requests/types/request';

// Step 4 detail-page visual styles
import '../../../styles/request-details.css';

interface RequestDetailPageProps {
  params: { id: string };
}

function formatDetailedDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/** Shorten UUID for display: first 8 chars + ellipsis */
function shortId(id: string): string {
  return id.length > 8 ? id.substring(0, 8) + '…' : id;
}

const LIFECYCLE_STEPS: { status: RequestStatus; label: string }[] = [
  { status: 'OPEN',        label: 'Open' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'RESOLVED',    label: 'Resolved' },
  { status: 'CLOSED',      label: 'Closed' },
];

/** How much of the stepper track to fill in green (for the CSS variable) */
const STEP_PROGRESS_MAP: Record<RequestStatus, string> = {
  OPEN:        '0%',
  IN_PROGRESS: '33%',
  RESOLVED:    '67%',
  CLOSED:      '100%',
};

const STATUS_ACTION_CONFIG: Record<
  RequestStatus,
  { action: string; hint: string; buttonVariant: 'primary' | 'secondary' | 'dark' | 'outline' }
> = {
  IN_PROGRESS: {
    action: 'Start Work — Mark In Progress',
    hint: 'Assign this ticket and begin work on the reported issue.',
    buttonVariant: 'primary',
  },
  RESOLVED: {
    action: 'Mark as Resolved',
    hint: 'Confirm the issue has been resolved and is pending closure.',
    buttonVariant: 'primary',
  },
  CLOSED: {
    action: 'Close Request',
    hint: 'Permanently close this ticket. No further transitions are possible after closing.',
    buttonVariant: 'dark',
  },
  OPEN: {
    action: 'Reopen Ticket',
    hint: 'Reopen this ticket if the issue has recurred or was not resolved.',
    buttonVariant: 'outline',
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  IT: '💻',
  Facilities: '🏢',
  Other: '📋',
};

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const [request, setRequest]     = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [notFound, setNotFound]   = useState(false);

  const [isUpdating, setIsUpdating]       = useState(false);
  const [updateError, setUpdateError]     = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [copied, setCopied]               = useState(false);

  const loadRequest = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    setNotFound(false);

    const response = await requestApi.getRequestById(params.id);

    if (response.success && response.data) {
      setRequest(response.data);
    } else {
      if (response.error?.code === 'NOT_FOUND' || response.error?.code === 'HTTP_404') {
        setNotFound(true);
      } else {
        setFetchError(
          response.error?.message || 'Failed to load request details from the backend database.'
        );
      }
    }
    setIsLoading(false);
  }, [params.id]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const handleStatusUpdate = async (nextStatus: RequestStatus) => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    const response = await requestApi.updateRequestStatus(params.id, nextStatus);

    if (response.success && response.data) {
      setRequest(response.data);
      const label = response.data.status.replace('_', ' ');
      setUpdateSuccess(`Status successfully transitioned to "${label}".`);
    } else {
      setUpdateError(
        response.error?.message || 'Failed to update status. State machine rules enforced by backend.'
      );
    }
    setIsUpdating(false);
  };

  const handleCopyId = async () => {
    if (!request) return;
    try {
      await navigator.clipboard.writeText(request.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — silently ignore
    }
  };

  const nextStatuses   = request ? ALLOWED_TRANSITIONS[request.status] || [] : [];
  const currentStepIdx = request ? LIFECYCLE_STEPS.findIndex((s) => s.status === request.status) : 0;
  const isClosed       = request?.status === 'CLOSED';

  /* ─────────────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────────────── */
  return (
    <AppShell
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'All Requests', href: '/requests' },
        { label: request ? shortId(request.id) : 'Ticket Details' },
      ]}
      pageEyebrow="SERVICE TICKET DETAILS"
      pageTitle={
        request
          ? request.title
          : isLoading
            ? 'Loading ticket…'
            : 'Request Not Found'
      }
      pageSubtitle={
        request
          ? `Ticket · ${request.category} · ${request.priority} Priority`
          : 'Inspect ticket details and manage the lifecycle workflow.'
      }
      pageAction={
        <Link href="/requests" className="btn btn-outline btn-sm" aria-label="Back to All Requests">
          ← All Requests
        </Link>
      }
    >

      {/* ══════════════════════════════════════════════════════════════════════
          LOADING SKELETON
      ════════════════════════════════════════════════════════════════════════ */}
      {isLoading && (
        <div className="detail-skeleton-layout" aria-busy="true" aria-live="polite">
          <div>
            {/* Hero skeleton */}
            <div className="ticket-hero" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
              <div className="skeleton" style={{ height: '12px', width: '25%', marginBottom: '0.75rem', borderRadius: '4px' }} />
              <div className="skeleton" style={{ height: '28px', width: '80%', marginBottom: '0.75rem' }} />
              <div className="skeleton" style={{ height: '12px', width: '55%' }} />
            </div>
            {/* Stepper skeleton */}
            <div className="stepper-card" style={{ marginBottom: '1.25rem' }}>
              <div className="skeleton" style={{ height: '36px', width: '100%', borderRadius: '20px' }} />
            </div>
            {/* Description skeleton */}
            <div className="issue-desc-card">
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.6rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '95%', marginBottom: '0.6rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '75%' }} />
              </div>
            </div>
          </div>
          <div>
            <div className="meta-card" style={{ padding: '1.25rem' }}>
              {[80, 60, 70, 65, 65].map((w, i) => (
                <div key={i} className="skeleton" style={{ height: '12px', width: `${w}%`, marginBottom: '1rem' }} />
              ))}
            </div>
          </div>
          <p className="sr-only">Loading ticket details…</p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          FETCH ERROR
      ════════════════════════════════════════════════════════════════════════ */}
      {!isLoading && fetchError && (
        <div role="alert" className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong>Error loading ticket:</strong> {fetchError}
            <div style={{ marginTop: '0.75rem' }}>
              <Button variant="outline" size="sm" onClick={loadRequest} aria-label="Retry loading ticket">
                Retry Loading
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          404 NOT FOUND
      ════════════════════════════════════════════════════════════════════════ */}
      {!isLoading && notFound && (
        <div className="not-found-panel" role="alert">
          <span className="not-found-icon" aria-hidden="true">🔍</span>
          <h2 className="not-found-title">Service Request Not Found</h2>
          <p className="not-found-desc">
            No service request with ID{' '}
            <code style={{ fontSize: '0.8rem', background: '#F1F5F9', padding: '0.1em 0.4em', borderRadius: '4px' }}>
              {params.id}
            </code>{' '}
            exists in the database. The ticket may have been removed or the URL is incorrect.
          </p>
          <Link href="/requests" className="btn btn-primary" aria-label="Return to All Requests">
            ← Return to All Requests
          </Link>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ACTIVE TICKET
      ════════════════════════════════════════════════════════════════════════ */}
      {!isLoading && request && (
        <>
          {/* ── Ticket Hero Header ──────────────────────────────────────── */}
          <div className="ticket-hero">
            <div className="ticket-hero-top">
              <div className="ticket-hero-title-block">
                <div className="ticket-hero-eyebrow" aria-hidden="true">
                  <span>{CATEGORY_ICONS[request.category] || '📋'}</span>
                  <span>SERVICE REQUEST</span>
                  <span style={{ color: 'var(--color-border)' }}>·</span>
                  <span>{request.category}</span>
                  <span style={{ color: 'var(--color-border)' }}>·</span>
                  <span>{request.priority} Priority</span>
                  <span style={{ color: 'var(--color-border)' }}>·</span>
                  <span>Submitted {formatDetailedDate(request.created_at)}</span>
                </div>
                <div className="ticket-hero-id-row">
                  <span className="ticket-id-label">Ticket ID:</span>
                  <span className="ticket-id-value" title={`Full UUID: ${request.id}`}>
                    {shortId(request.id)}
                  </span>
                  <button
                    type="button"
                    className="ticket-copy-btn"
                    onClick={handleCopyId}
                    aria-label={copied ? 'ID copied to clipboard' : 'Copy full ticket ID to clipboard'}
                    title={copied ? 'Copied!' : `Copy full ID: ${request.id}`}
                  >
                    {copied ? (
                      <>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy ID
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="ticket-hero-badges" aria-label={`Status: ${request.status}, Priority: ${request.priority}`}>
                <StatusBadge status={request.status} />
                <PriorityBadge priority={request.priority} />
              </div>
            </div>
          </div>

          {/* ── Main Two-Column Layout ───────────────────────────────────── */}
          <div className="detail-layout">

            {/* LEFT COLUMN */}
            <div>

              {/* Lifecycle Stepper */}
              <div className="stepper-card" aria-label="Ticket lifecycle progress">
                <div className="stepper-card-header">
                  <h2 className="stepper-card-title">Lifecycle Progress</h2>
                  <span className="stepper-card-status-label">
                    State machine · <strong>{request.status.replace('_', ' ')}</strong>
                  </span>
                </div>

                <div
                  className="stepper-v2"
                  role="list"
                  aria-label="Lifecycle steps"
                  style={{ '--stepper-progress': STEP_PROGRESS_MAP[request.status] } as React.CSSProperties}
                >
                  {LIFECYCLE_STEPS.map(({ status, label }, idx) => {
                    const isCompleted = idx < currentStepIdx;
                    const isActive    = idx === currentStepIdx;
                    const isTerminal  = isClosed && idx === LIFECYCLE_STEPS.length - 1;

                    let nodeClass = 'sv-upcoming';
                    if (isTerminal)       nodeClass = 'sv-terminal';
                    else if (isCompleted) nodeClass = 'sv-completed';
                    else if (isActive)    nodeClass = 'sv-active';

                    return (
                      <div
                        key={status}
                        className={`stepper-v2-step ${nodeClass}`}
                        role="listitem"
                        aria-label={
                          isTerminal  ? `${label}: Completed and closed`
                          : isCompleted ? `${label}: Completed`
                          : isActive    ? `${label}: Current status`
                          : `${label}: Pending`
                        }
                        aria-current={isActive ? 'step' : undefined}
                      >
                        <div className="stepper-v2-node" aria-hidden="true">
                          {isCompleted || isTerminal ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : isActive && isClosed ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span className="stepper-v2-label">{label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Transition feedback banners */}
                {updateSuccess && (
                  <div className="update-banner update-banner-success" role="status" aria-live="polite">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>{updateSuccess}</span>
                  </div>
                )}

                {updateError && (
                  <div className="update-banner update-banner-error" role="alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span><strong>Update failed:</strong> {updateError}</span>
                  </div>
                )}
              </div>

              {/* Issue Description Card */}
              <div className="issue-desc-card">
                <div className="issue-desc-header">
                  <h2 className="issue-desc-title">Issue Description</h2>
                  <div className="issue-desc-badges">
                    <StatusBadge status={request.status} />
                    <PriorityBadge priority={request.priority} />
                  </div>
                </div>
                <div className="issue-desc-body">
                  {request.description}
                </div>
              </div>

            </div>{/* /LEFT COLUMN */}

            {/* RIGHT COLUMN */}
            <div>

              {/* Status Update Panel */}
              {!isClosed ? (
                <div className="status-update-panel">
                  <div className="status-update-panel-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                    <h3 className="status-update-panel-title">Status Workflow</h3>
                  </div>
                  <div className="status-update-panel-body">
                    {nextStatuses.length > 0 && nextStatuses.map((nextStatus) => {
                      const cfg = STATUS_ACTION_CONFIG[nextStatus];
                      return (
                        <div key={nextStatus}>
                          <div className="status-transition-flow" aria-label={`Transition from ${request.status} to ${nextStatus}`}>
                            <span className="status-transition-from">
                              {request.status.replace('_', ' ')}
                            </span>
                            <span className="status-transition-arrow" aria-hidden="true">→</span>
                            <StatusBadge status={nextStatus} />
                          </div>
                          <p className="status-update-hint">{cfg.hint}</p>
                          <div className="status-update-actions">
                            <Button
                              variant={cfg.buttonVariant}
                              isLoading={isUpdating}
                              onClick={() => handleStatusUpdate(nextStatus)}
                              aria-label={`${cfg.action}: transition from ${request.status} to ${nextStatus}`}
                              aria-disabled={isUpdating}
                              style={{ width: '100%', justifyContent: 'center' }}
                            >
                              {cfg.action}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Terminal CLOSED state notice */
                <div className="status-terminal-panel" role="note">
                  <div className="status-terminal-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="status-terminal-text">
                    <h4>Request Closed</h4>
                    <p>
                      This ticket has reached its terminal lifecycle state. No further status transitions are permitted by the state machine.
                    </p>
                  </div>
                </div>
              )}

              {/* Ticket Metadata Card */}
              <div className="meta-card">
                <div className="meta-card-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-xs)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <h3 className="meta-card-title">Ticket Metadata</h3>
                </div>
                <div className="meta-card-body">
                  <div className="meta-row">
                    <span className="meta-row-label">Ticket ID</span>
                    <span className="meta-row-value">
                      <code title={`Full UUID: ${request.id}`}>{request.id}</code>
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-row-label">Category</span>
                    <span className="meta-row-value">
                      {CATEGORY_ICONS[request.category] || ''} {request.category}
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-row-label">Priority</span>
                    <span className="meta-row-value">
                      <PriorityBadge priority={request.priority} />
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-row-label">Current Status</span>
                    <span className="meta-row-value">
                      <StatusBadge status={request.status} />
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-row-label">Created At</span>
                    <span className="meta-row-value">
                      <time dateTime={request.created_at}>{formatDetailedDate(request.created_at)}</time>
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-row-label">Last Updated</span>
                    <span className="meta-row-value">
                      <time dateTime={request.updated_at}>{formatDetailedDate(request.updated_at)}</time>
                    </span>
                  </div>
                </div>
              </div>

            </div>{/* /RIGHT COLUMN */}

          </div>{/* /detail-layout */}
        </>
      )}

    </AppShell>
  );
}
