'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/requests', label: 'Requests' },
  { href: '/requests/new', label: '+ New Request' },
];

export const AppHeader: React.FC = () => {
  const pathname = usePathname();

  return (
    <header
      style={{
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
      role="banner"
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '0.875rem',
          paddingBottom: '0.875rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{
            color: '#f8fafc',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}
          aria-label="VisionRoot Service Request Management System home"
        >
          <span style={{ color: '#93c5fd' }}>VisionRoot</span> SRMS
        </Link>

        {/* Navigation */}
        <nav aria-label="Main navigation">
          <ul
            style={{
              display: 'flex',
              gap: '0.25rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              flexWrap: 'wrap',
            }}
          >
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      color: isActive ? '#93c5fd' : '#cbd5e1',
                      textDecoration: 'none',
                      padding: '0.4rem 0.875rem',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 400,
                      backgroundColor: isActive ? 'rgba(147, 197, 253, 0.1)' : 'transparent',
                      transition: 'all 0.15s',
                      display: 'block',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};
