'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppHeader } from '../../../components/layout/AppHeader';
import { DemoBanner } from '../../../components/ui/DemoBanner';
import { StatusBadge } from '../../../features/requests/components/StatusBadge';
import { PriorityBadge } from '../../../components/ui/PriorityBadge';
import { mockRequestService } from '../../../features/requests/services/mockRequests';
import { ServiceRequest } from '../../../features/requests/types/request';

interface RequestDetailPageProps {
  params: { id: string };
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * /requests/[id] — Request detail page.
 * Day 04: Loads from in-memory mock store. Backend not yet implemented.
 * Fulfils Day 01 US-03: "As a user I can view the details of a single request."
 */
export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    mockRequestService.getRequestById(params.id).then((result) => {
      if (!cancelled) {
        if (result) {
          setRequest(result);
        } else {
          setNotFound(true);
        }
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [params.id]);

  return (
    <>
      <AppHeader />
      <DemoBanner />

      <main>
        <div className="container" style={{ maxWidth: '760px', padding: '2rem 1rem' }}>
          {/* Back link */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Link
              href="/requests"
              style={{ color: 'var(--color-primary)', fontSize: '0.9rem', textDecoration: 'none' }}
            >
              ← Back to all requests
            </Link>
          </div>

          {/* Loading */}
          {isLoading && (
            <div aria-live="polite" aria-busy="true">
              <div className="card" style={{ minHeight: '200px' }} aria-hidden="true">
                <div className="skeleton" style={{ height: '28px', width: '55%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '14px', width: '75%', marginBottom: '1.5rem' }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '9999px' }} />
                  <div className="skeleton" style={{ height: '24px', width: '65px', borderRadius: '9999px' }} />
                </div>
              </div>
              <p className="sr-only">Loading request details…</p>
            </div>
          )}

          {/* Not found */}
          {!isLoading && notFound && (
            <div role="alert" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <p style={{ fontSize: '3rem', margin: '0 0 0.5rem' }}>🔍</p>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Request Not Found</h1>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                No service request with ID <code style={{ fontSize: '0.85rem' }}>{params.id}</code> was found.
              </p>
              <Link href="/requests" className="btn btn-primary">
                View All Requests
              </Link>
            </div>
          )}

          {/* Detail view */}
          {!isLoading && request && (
            <article>
              <div className="card" style={{ marginBottom: '1rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h1 style={{ margin: '0 0 0.75rem', fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.3 }}>
                    {request.title}
                  </h1>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <StatusBadge status={request.status} />
                    <PriorityBadge priority={request.priority} />
                    <span
                      className="badge"
                      style={{
                        backgroundColor: 'var(--color-bg-subtle)',
                        color: 'var(--color-text-muted)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {request.category}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '0 0 1.25rem' }} />

                {/* Description */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-subtle)' }}>
                    Description
                  </h2>
                  <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--color-text-main)' }}>
                    {request.description}
                  </p>
                </div>

                {/* Metadata */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    backgroundColor: 'var(--color-bg-subtle)',
                    borderRadius: '8px',
                    padding: '1rem',
                  }}
                >
                  {[
                    { label: 'Request ID', value: <code style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{request.id}</code> },
                    { label: 'Category', value: request.category },
                    { label: 'Priority', value: request.priority },
                    { label: 'Status', value: request.status.replace('_', ' ') },
                    { label: 'Created', value: formatDate(request.created_at) },
                    { label: 'Last Updated', value: formatDate(request.updated_at) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <dt style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-subtle)', marginBottom: '0.2rem' }}>
                        {label}
                      </dt>
                      <dd style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '0.9375rem' }}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link href="/requests" className="btn btn-outline">
                  ← All Requests
                </Link>
                <Link href="/requests/new" className="btn btn-primary">
                  Submit New Request
                </Link>
              </div>
            </article>
          )}
        </div>
      </main>
    </>
  );
}
