'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  {
    href: '/requests',
    label: 'All Requests',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/requests/new',
    label: 'New Request',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
];

/**
 * AppHeader — VisionRoot top navigation bar.
 * White background, emerald green active links, dark navy brand text.
 * Matches the reference screenshot design language.
 */
export const AppHeader: React.FC = () => {
  const pathname = usePathname();

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
      }}
      role="banner"
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{ textDecoration: 'none', flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}
          aria-label="VisionRoot home"
        >
          <span
            style={{
              color: '#1E293B',
              fontWeight: 800,
              fontSize: '1.125rem',
              letterSpacing: '-0.03em',
            }}
          >
            <span style={{ color: '#16A34A' }}>Vision</span>Root
          </span>
          <span
            style={{
              color: '#94A3B8',
              fontWeight: 400,
              fontSize: '0.8rem',
              letterSpacing: '0',
            }}
          >
            Service Request Portal
          </span>
        </Link>

        {/* Navigation */}
        <nav aria-label="Main navigation" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <ul
            style={{
              display: 'flex',
              gap: '0.25rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {navLinks.map(({ href, label, icon }) => {
              const isActive = pathname === href || (href === '/requests' && pathname.startsWith('/requests'));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      color: isActive ? '#16A34A' : '#64748B',
                      textDecoration: 'none',
                      padding: '0.4rem 0.875rem',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                      backgroundColor: isActive ? '#F0FDF4' : 'transparent',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {icon}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right side — demo user pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: 'right', display: 'none' }} className="hide-mobile">
            <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: '#1E293B', lineHeight: 1.2 }}>
              Demo User
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.2 }}>
              demo@visionroot.com
            </p>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#16A34A',
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              borderRadius: '9999px',
              padding: '0.2rem 0.65rem',
              letterSpacing: '0.03em',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                flexShrink: 0,
              }}
            />
            DEMO
          </span>
        </div>
      </div>
    </header>
  );
};
