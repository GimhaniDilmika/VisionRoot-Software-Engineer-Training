'use client';

import React from 'react';
import { ServiceRequest } from '../types/request';
import { RequestCard } from './RequestCard';

interface RequestListProps {
  requests: ServiceRequest[];
  isLoading: boolean;
  error: string | null;
}

/**
 * RequestList — renders loading, error, empty, or populated request cards.
 * Day 04: Uses mock data only. No backend CRUD APIs implemented yet.
 */
export const RequestList: React.FC<RequestListProps> = ({ requests, isLoading, error }) => {
  if (isLoading) {
    return (
      <div aria-live="polite" aria-busy="true" style={{ padding: '2rem 0' }}>
        {/* Skeleton placeholders for perceived performance */}
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="card"
            style={{ marginBottom: '1rem', minHeight: '120px' }}
            aria-hidden="true"
          >
            <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '0.75rem' }} />
            <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ height: '14px', width: '75%', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: '22px', width: '70px', borderRadius: '9999px' }} />
              <div className="skeleton" style={{ height: '22px', width: '55px', borderRadius: '9999px' }} />
            </div>
          </div>
        ))}
        <p className="sr-only">Loading service requests…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error" style={{ marginTop: '1.5rem' }}>
        <strong>Failed to load requests.</strong>
        <p style={{ margin: '0.25rem 0 0' }}>{error}</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div
        role="status"
        className="alert"
        style={{
          marginTop: '1.5rem',
          backgroundColor: 'var(--color-bg-subtle)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          padding: '3rem 1rem',
        }}
      >
        <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>📭</p>
        <p style={{ margin: 0, fontWeight: 500 }}>No service requests found for this filter.</p>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem' }}>
          Try a different filter or submit a new request.
        </p>
      </div>
    );
  }

  return (
    <ul
      aria-label="Service request list"
      style={{ listStyle: 'none', padding: 0, margin: 0 }}
    >
      {requests.map((request) => (
        <li key={request.id} style={{ marginBottom: '1rem' }}>
          <RequestCard request={request} />
        </li>
      ))}
    </ul>
  );
};
