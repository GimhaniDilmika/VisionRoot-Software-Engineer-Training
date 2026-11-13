'use client';

import React from 'react';
import Link from 'next/link';
import { AppHeader } from '../../../components/layout/AppHeader';
import { DemoBanner } from '../../../components/ui/DemoBanner';
import { RequestForm } from '../../../features/requests/components/RequestForm';

/**
 * /requests/new — Create new service request page.
 * Day 04: Submits to in-memory mock store. Backend not yet implemented.
 */
export default function NewRequestPage() {
  return (
    <>
      <AppHeader />
      <DemoBanner />

      <main>
        <div className="container" style={{ maxWidth: '680px', padding: '2rem 1rem' }}>
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol
              style={{
                display: 'flex',
                gap: '0.5rem',
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
              }}
            >
              <li>
                <Link
                  href="/"
                  style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/requests"
                  style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                >
                  Requests
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" style={{ color: 'var(--color-text-subtle)' }}>
                New Request
              </li>
            </ol>
          </nav>

          {/* Page title */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: 800 }}>
              Submit New Service Request
            </h1>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Describe your issue clearly so it can be assigned and resolved efficiently. Fields
              marked <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span> are required.
            </p>
          </div>

          {/* Form card */}
          <div className="card">
            <RequestForm />
          </div>

          {/* Back link */}
          <div style={{ marginTop: '1.5rem' }}>
            <Link
              href="/requests"
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              ← Back to all requests
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
