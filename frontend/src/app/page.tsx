'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppHeader } from '../components/layout/AppHeader';
import { DemoBanner } from '../components/ui/DemoBanner';
import { mockRequestService } from '../features/requests/services/mockRequests';
import { ServiceRequest } from '../features/requests/types/request';

export default function HomePage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    mockRequestService.getRequests().then(setRequests);
  }, []);

  const total      = requests.length;
  const open       = requests.filter((r) => r.status === 'OPEN').length;
  const inProgress = requests.filter((r) => r.status === 'IN_PROGRESS').length;
  const resolved   = requests.filter((r) => r.status === 'RESOLVED').length;

  const stats = [
    { value: total,      label: 'Total Requests',  color: '#16A34A' },
    { value: open,       label: 'Open',             color: '#3B82F6' },
    { value: inProgress, label: 'In Progress',      color: '#F59E0B' },
    { value: resolved,   label: 'Resolved',         color: '#10B981' },
  ];

  return (
    <>
      <AppHeader />
      <DemoBanner />

      <main>
        {/* ── Hero section ─────────────────────────────────────────── */}
        <section
          style={{
            backgroundColor: '#fff',
            borderBottom: '1px solid #E2E8F0',
            padding: '3.5rem 1.5rem 3rem',
          }}
        >
          <div className="container" style={{ maxWidth: '860px' }}>
            <p className="page-eyebrow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              VisionRoot Internal Platform
            </p>

            <h1
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.625rem)',
                fontWeight: 800,
                color: '#1E293B',
                marginBottom: '1rem',
                lineHeight: 1.15,
              }}
            >
              Service Request<br />
              <span style={{ color: '#16A34A' }}>Management System</span>
            </h1>

            <p
              style={{
                fontSize: '1.0625rem',
                color: '#475569',
                marginBottom: '2rem',
                lineHeight: 1.65,
                maxWidth: '580px',
              }}
            >
              Submit, track, and resolve IT and Facilities service requests from a
              single organised platform. Clear priorities, transparent status tracking
              and fast resolution.
            </p>

            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              <Link href="/requests" className="btn btn-primary btn-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                View All Requests
              </Link>
              <Link href="/requests/new" className="btn btn-secondary btn-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Submit New Request
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats strip ──────────────────────────────────────────── */}
        <section style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <div className="container" style={{ padding: '1.5rem 1.5rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0',
                backgroundColor: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
              }}
            >
              {stats.map(({ value, label, color }, i, arr) => (
                <div
                  key={label}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRight: i < arr.length - 1 ? '1px solid #E2E8F0' : 'none',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ margin: '0 0 0.2rem', fontSize: '1.75rem', fontWeight: 800, color, lineHeight: 1 }}>
                    {value}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.78rem', color: '#94A3B8', textAlign: 'center' }}>
              Counts reflect demo data only — not persisted to a database.
            </p>
          </div>
        </section>

        {/* ── Feature cards ────────────────────────────────────────── */}
        <section style={{ padding: '3rem 1.5rem' }}>
          <div className="container">
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                color: '#1E293B',
                textAlign: 'center',
              }}
            >
              How It Works
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {[
                {
                  icon: '📝',
                  title: 'Submit',
                  desc: 'Fill in a simple form with your issue details, category, and priority level.',
                  color: '#EFF6FF',
                  border: '#BFDBFE',
                  href: '/requests/new',
                  cta: 'Submit a request →',
                },
                {
                  icon: '🔍',
                  title: 'Track',
                  desc: 'Monitor your requests from Open through In Progress to Resolved or Closed.',
                  color: '#F0FDF4',
                  border: '#86EFAC',
                  href: '/requests',
                  cta: 'View all requests →',
                },
                {
                  icon: '✅',
                  title: 'Resolve',
                  desc: 'Support staff update statuses so requestors always see current progress.',
                  color: '#FFFBEB',
                  border: '#FCD34D',
                  href: '/requests',
                  cta: 'See resolved requests →',
                },
              ].map(({ icon, title, desc, color, border, href, cta }) => (
                <div
                  key={title}
                  style={{
                    border: `1px solid ${border}`,
                    borderRadius: '10px',
                    padding: '1.5rem',
                    backgroundColor: color,
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.75rem' }}>
                    {icon}
                  </span>
                  <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
                    {title}
                  </h3>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, flex: 1 }}>
                    {desc}
                  </p>
                  <Link
                    href={href}
                    style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#16A34A', textDecoration: 'none' }}
                  >
                    {cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer strip ─────────────────────────────────────────── */}
        <section
          style={{
            borderTop: '1px solid #E2E8F0',
            padding: '1.25rem 1.5rem',
            backgroundColor: '#F8FAFC',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#94A3B8' }}>
            VisionRoot Training Project — Day 04 Frontend UI &nbsp;·&nbsp;
            Built with Next.js 14 &amp; TypeScript
          </p>
        </section>
      </main>
    </>
  );
}
