import React from 'react';
import Link from 'next/link';
import { AppHeader } from '../components/layout/AppHeader';

/**
 * Home page — landing page for the VisionRoot Service Request Management System.
 * Server component (no 'use client' needed).
 */
export default function HomePage() {
  return (
    <>
      <AppHeader />

      <main>
        {/* Hero Section */}
        <section
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #1e40af 100%)',
            color: '#ffffff',
            padding: '5rem 1rem',
            textAlign: 'center',
          }}
        >
          <div className="container" style={{ maxWidth: '720px' }}>
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                opacity: 0.8,
                marginBottom: '0.75rem',
              }}
            >
              VisionRoot Internal Tools
            </p>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                margin: '0 0 1.25rem',
              }}
            >
              Service Request Management System
            </h1>
            <p
              style={{
                fontSize: '1.125rem',
                opacity: 0.9,
                marginBottom: '2rem',
                lineHeight: 1.6,
              }}
            >
              Submit, track, and resolve workplace service requests — IT, Facilities, and more —
              from one organised platform.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="/requests"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.75rem',
                  backgroundColor: '#ffffff',
                  color: 'var(--color-primary)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  transition: 'opacity 0.15s',
                }}
              >
                View All Requests
              </Link>
              <Link
                href="/requests/new"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.75rem',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '2px solid rgba(255,255,255,0.7)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s',
                }}
              >
                Submit New Request
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Summary Cards */}
        <section style={{ padding: '4rem 1rem', backgroundColor: 'var(--color-bg-app)' }}>
          <div className="container" style={{ maxWidth: '960px' }}>
            <h2
              style={{
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '2.5rem',
                color: 'var(--color-text-main)',
              }}
            >
              How It Works
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {[
                {
                  icon: '📝',
                  title: 'Submit',
                  description:
                    'Fill in a simple form with your issue title, detailed description, category and priority level.',
                },
                {
                  icon: '🔍',
                  title: 'Track',
                  description:
                    'Monitor the status of your request from Open through In Progress to Resolved or Closed.',
                },
                {
                  icon: '✅',
                  title: 'Resolve',
                  description:
                    'Staff update request statuses so requestors always know the current progress.',
                },
              ].map(({ icon, title, description }) => (
                <div
                  key={title}
                  className="card"
                  style={{ textAlign: 'center', padding: '2rem 1.5rem' }}
                >
                  <p style={{ fontSize: '2.5rem', margin: '0 0 0.75rem' }}>{icon}</p>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem', fontWeight: 700 }}>
                    {title}
                  </h3>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick navigation footer strip */}
        <section
          style={{
            backgroundColor: 'var(--color-bg-subtle)',
            borderTop: '1px solid var(--color-border)',
            padding: '2rem 1rem',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
            VisionRoot Training Project — Day 04 Frontend UI &nbsp;·&nbsp;{' '}
            <strong>Demo Mode</strong> — no data is persisted to a database yet.
          </p>
        </section>
      </main>
    </>
  );
}
