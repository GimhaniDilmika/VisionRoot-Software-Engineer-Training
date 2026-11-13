'use client';

import React from 'react';
import { ServiceRequest } from '../types/request';
import { RequestCard, RequestMobileCard } from './RequestCard';

interface RequestListProps {
  requests: ServiceRequest[];
  isLoading: boolean;
  error: string | null;
}

export const RequestList: React.FC<RequestListProps> = ({ requests, isLoading, error }) => {
  if (isLoading) {
    return (
      <div aria-live="polite" aria-busy="true">
        {/* Desktop skeleton table */}
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.07)',
          }}
        >
          <div style={{ padding: '0.625rem 1rem', borderBottom: '1.5px solid #E2E8F0', display: 'flex', gap: '2rem' }}>
            {['5%', '30%', '12%', '10%', '12%', '11%'].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: '12px', width: w, flexShrink: 0 }} />
            ))}
          </div>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div className="skeleton" style={{ height: '14px', width: '5%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: '14px', width: '70%', marginBottom: '0.4rem' }} />
                <div className="skeleton" style={{ height: '11px', width: '90%' }} />
              </div>
              <div className="skeleton" style={{ height: '12px', width: '10%' }} />
              <div className="skeleton" style={{ height: '22px', width: '55px', borderRadius: '9999px' }} />
              <div className="skeleton" style={{ height: '22px', width: '75px', borderRadius: '9999px' }} />
              <div className="skeleton" style={{ height: '12px', width: '10%' }} />
            </div>
          ))}
        </div>
        <p className="sr-only">Loading service requests…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-error" style={{ marginTop: '1rem' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <div>
          <strong>Failed to load requests.</strong>
          <p style={{ margin: '0.2rem 0 0' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          backgroundColor: '#fff',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
        }}
        role="status"
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <p style={{ margin: '0 0 0.3rem', fontWeight: 700, color: '#1E293B', fontSize: '1rem' }}>
          No requests found
        </p>
        <p style={{ margin: 0, color: '#64748B', fontSize: '0.875rem' }}>
          No service requests match the current filter. Try a different status or submit a new request.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop table ──────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.07)',
        }}
        className="hide-mobile"
      >
        <table className="data-table" aria-label="Service requests">
          <thead>
            <tr>
              <th style={{ width: '48px' }}>ID</th>
              <th>TITLE &amp; DESCRIPTION</th>
              <th>CATEGORY</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th>CREATED DATE</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, i) => (
              <RequestCard key={req.id} request={req} index={i} />
            ))}
          </tbody>
        </table>

        {/* Footer count */}
        <div
          style={{
            padding: '0.625rem 1rem',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>
            Showing {requests.length} {requests.length === 1 ? 'request' : 'requests'}
          </span>
        </div>
      </div>

      {/* ── Mobile cards ───────────────────────────────────────────────── */}
      <div className="mobile-cards">
        {requests.map((req) => (
          <RequestMobileCard key={req.id} request={req} />
        ))}
        <p style={{ fontSize: '0.8125rem', color: '#94A3B8', textAlign: 'center', marginTop: '0.75rem' }}>
          {requests.length} {requests.length === 1 ? 'request' : 'requests'}
        </p>
      </div>
    </>
  );
};
