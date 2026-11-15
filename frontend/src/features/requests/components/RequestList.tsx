'use client';

import React from 'react';
import Link from 'next/link';
import { ServiceRequest } from '../types/request';
import { RequestCard, RequestMobileCard } from './RequestCard';

interface RequestListProps {
  requests: ServiceRequest[];
  isLoading: boolean;
  error: string | null;
  onResetFilters?: () => void;
  isFiltered?: boolean;
}

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  isLoading,
  error,
  onResetFilters,
  isFiltered = false,
}) => {
  if (isLoading) {
    return (
      <div className="table-wrapper" aria-live="polite" aria-busy="true">
        <div style={{ padding: '0.95rem 1.25rem', borderBottom: '1.5px solid var(--color-border)', display: 'flex', gap: '2rem' }}>
          {['8%', '34%', '12%', '12%', '14%', '10%'].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: '14px', width: w, flexShrink: 0 }} />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div className="skeleton" style={{ height: '24px', width: '8%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: '16px', width: '70%', marginBottom: '0.45rem' }} />
              <div className="skeleton" style={{ height: '12px', width: '90%' }} />
            </div>
            <div className="skeleton" style={{ height: '18px', width: '10%' }} />
            <div className="skeleton" style={{ height: '22px', width: '65px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ height: '24px', width: '90px', borderRadius: '9999px' }} />
            <div className="skeleton" style={{ height: '30px', width: '85px', borderRadius: '6px' }} />
          </div>
        ))}
        <p className="sr-only">Loading service requests…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error" style={{ margin: '1rem 0' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: '2px' }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <strong>Failed to load service requests:</strong>
          <p style={{ margin: '0.2rem 0 0' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
        }}
        role="status"
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            border: '1px solid var(--color-primary-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.125rem',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <h3 style={{ margin: '0 0 0.4rem', fontWeight: 700, color: 'var(--color-navy)', fontSize: '1.1rem' }}>
          No service requests match your criteria
        </h3>
        <p style={{ margin: '0 0 1.5rem', color: 'var(--color-text-subtle)', fontSize: '0.875rem', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          {isFiltered
            ? 'Try broadening your search keywords or resetting your active filter selections to view all tickets.'
            : 'No service requests exist in the database yet. You can submit the first request now.'}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isFiltered && onResetFilters && (
            <button type="button" className="btn btn-outline" onClick={onResetFilters}>
              Reset All Filters
            </button>
          )}
          <Link href="/requests/new" className="btn btn-primary">
            + Submit New Request
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop Professional Table ───────────────────────────────── */}
      <div className="table-wrapper hide-mobile">
        <table className="data-table" aria-label="Organization service requests">
          <thead>
            <tr>
              <th style={{ width: '85px' }}>INDEX / ID</th>
              <th>TICKET TITLE &amp; PREVIEW</th>
              <th>CATEGORY</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th>SUBMITTED</th>
              <th style={{ textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, i) => (
              <RequestCard key={req.id} request={req} index={i} />
            ))}
          </tbody>
        </table>

        {/* Footer Info Bar */}
        <div className="table-footer">
          <span>
            Showing <strong>{requests.length}</strong> {requests.length === 1 ? 'ticket' : 'tickets'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="status-ping-dot" style={{ width: '6px', height: '6px', boxShadow: 'none' }} aria-hidden="true" />
            <span>PostgreSQL Persistence Live</span>
          </span>
        </div>
      </div>

      {/* ── Mobile Responsive Stacked Cards ─────────────────────────── */}
      <div className="mobile-cards">
        {requests.map((req, i) => (
          <RequestMobileCard key={req.id} request={req} index={i} />
        ))}
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-subtle)', textAlign: 'center', marginTop: '1rem' }}>
          Showing {requests.length} {requests.length === 1 ? 'ticket' : 'tickets'}
        </p>
      </div>
    </>
  );
};
