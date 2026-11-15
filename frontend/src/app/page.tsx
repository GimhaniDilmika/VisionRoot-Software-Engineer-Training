'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '../components/layout/AppShell';
import { requestApi } from '../features/requests/services/requestApi';
import { ServiceRequest } from '../features/requests/types/request';
import { StatusBadge } from '../features/requests/components/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';

function formatShortDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export default function HomePage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    requestApi.getRequests().then((res) => {
      if (res.success && res.data) {
        setRequests(res.data);
      } else {
        setError(res.error?.message || 'Failed to connect to backend service.');
      }
      setIsLoading(false);
    });
  }, []);

  // Five live PostgreSQL-backed metric counts
  const totalCount = requests.length;
  const openCount = requests.filter((r) => r.status === 'OPEN').length;
  const inProgressCount = requests.filter((r) => r.status === 'IN_PROGRESS').length;
  const resolvedCount = requests.filter((r) => r.status === 'RESOLVED').length;
  const closedCount = requests.filter((r) => r.status === 'CLOSED').length;

  // Real data status distribution percentages
  const openPct = totalCount > 0 ? Math.round((openCount / totalCount) * 100) : 0;
  const inProgressPct = totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0;
  const resolvedPct = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;
  const closedPct = totalCount > 0 ? Math.max(0, 100 - openPct - inProgressPct - resolvedPct) : 0;

  // Compact recent activity (strictly maximum 4 requests per user instructions)
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return (
    <AppShell breadcrumbs={[{ label: 'Dashboard' }]}>
      {/* ── Dashboard Welcome Hero Banner ─────────────────────────────── */}
      <section className="dashboard-welcome-banner" aria-label="Dashboard overview banner">
        <div className="welcome-content">
          <div className="welcome-eyebrow">
            <span aria-hidden="true">⬡</span>
            <span>SERVICE DESK OVERVIEW</span>
          </div>
          <h1 className="welcome-heading">Operations &amp; Request Dashboard</h1>
          <p className="welcome-description">
            Live telemetry, status distribution, and quick resolution workflows backed by PostgreSQL.
          </p>
        </div>

        <div className="welcome-actions">
          <Link href="/requests/new" className="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Create Request</span>
          </Link>
          <Link href="/requests" className="btn btn-outline">
            <span>Browse All Requests →</span>
          </Link>
        </div>
      </section>

      {/* ── Five Live PostgreSQL Metric Cards ───────────────────────── */}
      <section aria-label="Request statistics metrics" className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {/* 1. Total Requests */}
        <div className="metric-card-pro">
          <div className="metric-card-stripe" style={{ backgroundColor: '#0F172A' }} />
          <div className="metric-card-header">
            <div className="metric-icon-bubble" style={{ backgroundColor: '#F1F5F9', color: '#0F172A' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <span className="metric-share-tag" style={{ backgroundColor: '#F1F5F9', color: '#0F172A' }}>
              Volume
            </span>
          </div>
          <p className="metric-number-big">{isLoading ? '—' : totalCount}</p>
          <p className="metric-title-sub">Total Requests</p>
        </div>

        {/* 2. Open */}
        <div className="metric-card-pro">
          <div className="metric-card-stripe" style={{ backgroundColor: '#F59E0B' }} />
          <div className="metric-card-header">
            <div className="metric-icon-bubble" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <span className="metric-share-tag" style={{ backgroundColor: '#FFFBEB', color: '#B45309' }}>
              {openPct}% share
            </span>
          </div>
          <p className="metric-number-big">{isLoading ? '—' : openCount}</p>
          <p className="metric-title-sub">Open</p>
        </div>

        {/* 3. In Progress */}
        <div className="metric-card-pro">
          <div className="metric-card-stripe" style={{ backgroundColor: '#06B6D4' }} />
          <div className="metric-card-header">
            <div className="metric-icon-bubble" style={{ backgroundColor: '#ECFEFF', color: '#0891B2' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </div>
            <span className="metric-share-tag" style={{ backgroundColor: '#ECFEFF', color: '#0E7490' }}>
              {inProgressPct}% share
            </span>
          </div>
          <p className="metric-number-big">{isLoading ? '—' : inProgressCount}</p>
          <p className="metric-title-sub">In Progress</p>
        </div>

        {/* 4. Resolved */}
        <div className="metric-card-pro">
          <div className="metric-card-stripe" style={{ backgroundColor: '#10B981' }} />
          <div className="metric-card-header">
            <div className="metric-icon-bubble" style={{ backgroundColor: '#ECFDF5', color: '#16A34A' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="metric-share-tag" style={{ backgroundColor: '#ECFDF5', color: '#047857' }}>
              {resolvedPct}% share
            </span>
          </div>
          <p className="metric-number-big">{isLoading ? '—' : resolvedCount}</p>
          <p className="metric-title-sub">Resolved</p>
        </div>

        {/* 5. Closed */}
        <div className="metric-card-pro">
          <div className="metric-card-stripe" style={{ backgroundColor: '#94A3B8' }} />
          <div className="metric-card-header">
            <div className="metric-icon-bubble" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <span className="metric-share-tag" style={{ backgroundColor: '#F1F5F9', color: '#475569' }}>
              {closedPct}% share
            </span>
          </div>
          <p className="metric-number-big">{isLoading ? '—' : closedCount}</p>
          <p className="metric-title-sub">Closed</p>
        </div>
      </section>

      {/* ── Main Two-Column Layout ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Compact Recent Activity (Maximum 4 requests) */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.125rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                  Recent Requests
                </h2>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.78125rem', color: 'var(--color-text-subtle)' }}>
                  Latest 4 service requests by submission date
                </p>
              </div>
              <Link href="/requests" className="btn btn-outline btn-sm">
                View All Requests →
              </Link>
            </div>

            {isLoading && (
              <div style={{ padding: '1.5rem' }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="skeleton" style={{ height: '24px', width: '24px', borderRadius: '6px' }} />
                    <div className="skeleton" style={{ height: '14px', flex: 1 }} />
                    <div className="skeleton" style={{ height: '18px', width: '70px', borderRadius: '9999px' }} />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && error && (
              <div style={{ padding: '1.25rem' }}>
                <div role="alert" className="alert alert-error">
                  <span>⚠</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {!isLoading && !error && recentRequests.length === 0 && (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--color-text-subtle)', fontSize: '0.875rem' }}>
                No service requests recorded yet.
              </div>
            )}

            {!isLoading && !error && recentRequests.length > 0 && (
              <div className="activity-feed-list">
                {recentRequests.map((req, i) => (
                  <Link
                    key={req.id}
                    href={`/requests/${req.id}`}
                    className="activity-feed-item"
                    title={`View ticket: ${req.title}`}
                  >
                    <div className="activity-index-badge" aria-hidden="true">
                      #{i + 1}
                    </div>

                    <div className="activity-meta-main">
                      <span className="activity-title">{req.title}</span>
                      <span className="activity-desc">{req.description}</span>
                    </div>

                    <div className="activity-badges-right">
                      <span style={{ fontSize: '0.71875rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }} className="hide-mobile">
                        {req.category}
                      </span>
                      <PriorityBadge priority={req.priority} />
                      <StatusBadge status={req.status} />
                      <span style={{ fontSize: '0.78125rem', color: 'var(--color-text-xs)' }} className="hide-mobile">
                        {formatShortDate(req.created_at)}
                      </span>
                      <div className="activity-arrow-btn" aria-hidden="true">
                        →
                      </div>
                    </div>
                  </Link>
                ))}

                <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid var(--color-border)', backgroundColor: '#FAFAFA' }}>
                  <span style={{ fontSize: '0.78125rem', color: 'var(--color-text-subtle)' }}>
                    Displaying <strong>{recentRequests.length}</strong> of <strong>{totalCount}</strong> recorded requests
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Status Overview Chart & Compact Workflow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Real Data Status Distribution Overview Chart */}
          <div className="card">
            <div className="card-header-clean" style={{ marginBottom: '1rem' }}>
              <div>
                <h2 className="card-title-clean" style={{ fontSize: '0.9375rem' }}>
                  Status Distribution
                </h2>
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                  Breakdown across {totalCount} live requests
                </p>
              </div>
              <span className="badge" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                PostgreSQL Live
              </span>
            </div>

            {totalCount > 0 ? (
              <>
                {/* Visual Multi-Segment Bar */}
                <div
                  style={{
                    height: '10px',
                    width: '100%',
                    backgroundColor: '#F1F5F9',
                    borderRadius: '9999px',
                    display: 'flex',
                    overflow: 'hidden',
                    marginBottom: '1.25rem',
                  }}
                  aria-label={`Status distribution: ${openPct}% Open, ${inProgressPct}% In Progress, ${resolvedPct}% Resolved, ${closedPct}% Closed`}
                >
                  {openPct > 0 && (
                    <div style={{ width: `${openPct}%`, backgroundColor: '#F59E0B' }} title={`Open: ${openCount} (${openPct}%)`} />
                  )}
                  {inProgressPct > 0 && (
                    <div style={{ width: `${inProgressPct}%`, backgroundColor: '#06B6D4' }} title={`In Progress: ${inProgressCount} (${inProgressPct}%)`} />
                  )}
                  {resolvedPct > 0 && (
                    <div style={{ width: `${resolvedPct}%`, backgroundColor: '#10B981' }} title={`Resolved: ${resolvedCount} (${resolvedPct}%)`} />
                  )}
                  {closedPct > 0 && (
                    <div style={{ width: `${closedPct}%`, backgroundColor: '#94A3B8' }} title={`Closed: ${closedCount} (${closedPct}%)`} />
                  )}
                </div>

                {/* Meter rows with individual progress lines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Open */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.3rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, color: 'var(--color-navy)' }}>
                        <span className="status-dot" style={{ backgroundColor: '#F59E0B' }} />
                        Open
                      </span>
                      <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.75rem' }}>
                        <strong>{openCount}</strong> tickets ({openPct}%)
                      </span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${openPct}%`, height: '100%', backgroundColor: '#F59E0B', borderRadius: '2px' }} />
                    </div>
                  </div>

                  {/* In Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.3rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, color: 'var(--color-navy)' }}>
                        <span className="status-dot" style={{ backgroundColor: '#06B6D4' }} />
                        In Progress
                      </span>
                      <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.75rem' }}>
                        <strong>{inProgressCount}</strong> tickets ({inProgressPct}%)
                      </span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${inProgressPct}%`, height: '100%', backgroundColor: '#06B6D4', borderRadius: '2px' }} />
                    </div>
                  </div>

                  {/* Resolved */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.3rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, color: 'var(--color-navy)' }}>
                        <span className="status-dot" style={{ backgroundColor: '#10B981' }} />
                        Resolved
                      </span>
                      <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.75rem' }}>
                        <strong>{resolvedCount}</strong> tickets ({resolvedPct}%)
                      </span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${resolvedPct}%`, height: '100%', backgroundColor: '#10B981', borderRadius: '2px' }} />
                    </div>
                  </div>

                  {/* Closed */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.3rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, color: 'var(--color-navy)' }}>
                        <span className="status-dot" style={{ backgroundColor: '#94A3B8' }} />
                        Closed
                      </span>
                      <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.75rem' }}>
                        <strong>{closedCount}</strong> tickets ({closedPct}%)
                      </span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${closedPct}%`, height: '100%', backgroundColor: '#94A3B8', borderRadius: '2px' }} />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-subtle)' }}>
                No request data recorded in PostgreSQL yet.
              </p>
            )}
          </div>

          {/* Compact Lifecycle Workflow Card */}
          <div className="card" style={{ backgroundColor: '#F8FAFC' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-navy)' }}>
              Lifecycle Workflow
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <span className="status-pill status-pill-open" style={{ padding: '0.15rem 0.5rem', fontSize: '0.71875rem' }}>OPEN</span>
              <span style={{ color: 'var(--color-text-xs)' }}>→</span>
              <span className="status-pill status-pill-inprogress" style={{ padding: '0.15rem 0.5rem', fontSize: '0.71875rem' }}>IN PROGRESS</span>
              <span style={{ color: 'var(--color-text-xs)' }}>→</span>
              <span className="status-pill status-pill-resolved" style={{ padding: '0.15rem 0.5rem', fontSize: '0.71875rem' }}>RESOLVED</span>
              <span style={{ color: 'var(--color-text-xs)' }}>→</span>
              <span className="status-pill status-pill-closed" style={{ padding: '0.15rem 0.5rem', fontSize: '0.71875rem' }}>CLOSED</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-subtle)', lineHeight: 1.45 }}>
              Strict linear progression. Closed requests cannot transition further.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
