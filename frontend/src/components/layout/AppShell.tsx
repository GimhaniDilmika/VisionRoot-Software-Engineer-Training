'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { requestApi } from '../../features/requests/services/requestApi';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  pageEyebrow?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  pageAction?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  breadcrumbs,
  pageEyebrow,
  pageTitle,
  pageSubtitle,
  pageAction,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live database connectivity status via real API health endpoint
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    latency?: number;
    checking: boolean;
  }>({
    connected: false,
    checking: true,
  });

  useEffect(() => {
    let mounted = true;
    requestApi
      .checkHealth()
      .then((res) => {
        if (!mounted) return;
        if (res.success && res.data?.database?.status === 'connected') {
          setDbStatus({
            connected: true,
            latency: res.data.database.latency_ms,
            checking: false,
          });
        } else {
          setDbStatus({
            connected: false,
            checking: false,
          });
        }
      })
      .catch(() => {
        if (mounted) {
          setDbStatus({ connected: false, checking: false });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const navItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
      exact: true,
    },
    {
      href: '/requests',
      label: 'All Requests',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      exact: false,
    },
    {
      href: '/requests/new',
      label: 'New Request',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
      exact: true,
    },
  ];

  const isCurrentActive = (itemHref: string, exact: boolean) => {
    if (exact) {
      return pathname === itemHref;
    }
    if (itemHref === '/requests') {
      return pathname === '/requests' || (pathname.startsWith('/requests/') && pathname !== '/requests/new');
    }
    return pathname.startsWith(itemHref);
  };

  return (
    <div className="app-shell-root">
      {/* ── Mobile Drawer Backdrop ──────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={`app-sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}
        aria-label="Application sidebar"
      >
        {/* Brand header */}
        <div className="sidebar-brand">
          <Link href="/" className="sidebar-brand-link" onClick={() => setMobileMenuOpen(false)}>
            <div className="brand-logo-mark" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="brand-name">
                <span className="brand-accent">Vision</span>Root
              </span>
              <span className="brand-subtitle">Service Request Portal</span>
            </div>
          </Link>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation list */}
        <div className="sidebar-section">
          <span className="sidebar-section-title">NAVIGATION</span>
          <nav className="sidebar-nav" aria-label="Sidebar main navigation">
            <ul>
              {navItems.map((item) => {
                const active = isCurrentActive(item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`sidebar-nav-item ${active ? 'nav-active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Live Database Connectivity card (HCI: Visibility of System Status) */}
        <div className="sidebar-footer-card">
          <div className="system-status-indicator" style={{ color: dbStatus.connected ? 'var(--color-forest-subtle)' : 'var(--color-text-subtle)' }}>
            <span
              className="status-ping-dot"
              style={{
                backgroundColor: dbStatus.connected ? 'var(--color-primary)' : '#94A3B8',
                boxShadow: dbStatus.connected ? '0 0 0 3px var(--color-primary-mid)' : 'none',
              }}
              aria-hidden="true"
            />
            <span className="system-status-label">
              {dbStatus.checking
                ? 'Checking Database...'
                : dbStatus.connected
                ? `PostgreSQL Connected ${typeof dbStatus.latency === 'number' ? `(${dbStatus.latency}ms)` : ''}`
                : 'Database Standby'}
            </span>
          </div>
          <p className="system-status-sub">
            Database: <code>visionroot_service_requests</code>
          </p>
        </div>

        {/* Neutral Operator / Environment Profile (No Fake Admin Role) */}
        <div className="sidebar-user-profile">
          <div className="user-avatar" aria-hidden="true" style={{ backgroundColor: '#F1F5F9', color: '#16A34A' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="user-meta">
            <span className="user-name">Service Request Desk</span>
            <span className="user-role">Development Mode</span>
          </div>
        </div>
      </aside>

      {/* ── Main Area ──────────────────────────────────────────────── */}
      <div className="app-main-wrapper">
        {/* Top Header Bar */}
        <header className="app-top-header" role="banner">
          <div className="header-left">
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Breadcrumbs Bar placed below navigation */}
            <div className="header-breadcrumbs-bar">
              {breadcrumbs && breadcrumbs.length > 0 ? (
                <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
                  <ol className="breadcrumbs-list">
                    {breadcrumbs.map((crumb, idx) => {
                      const isLast = idx === breadcrumbs.length - 1;
                      return (
                        <li key={crumb.label} className="breadcrumb-item">
                          {idx > 0 && <span className="breadcrumb-separator" aria-hidden="true">/</span>}
                          {isLast || !crumb.href ? (
                            <span className="breadcrumb-current" aria-current={isLast ? 'page' : undefined}>
                              {crumb.label}
                            </span>
                          ) : (
                            <Link href={crumb.href} className="breadcrumb-link">
                              {crumb.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </nav>
              ) : (
                <span className="header-portal-title">VisionRoot Service Desk</span>
              )}
            </div>
          </div>

          <div className="header-right">
            {!pageAction && pathname !== '/requests/new' && (
              <Link href="/requests/new" className="btn btn-primary btn-sm header-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>New Request</span>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="app-content-container">
          {/* Optional Page Title Header */}
          {(pageTitle || pageEyebrow) && (
            <div className="page-header-banner">
              <div className="page-header-text">
                {pageEyebrow && (
                  <div className="page-eyebrow-badge">
                    <span className="eyebrow-hex" aria-hidden="true">⬡</span>
                    <span>{pageEyebrow}</span>
                  </div>
                )}
                {pageTitle && <h1 className="page-main-heading">{pageTitle}</h1>}
                {pageSubtitle && <p className="page-sub-heading">{pageSubtitle}</p>}
              </div>
              {pageAction && <div className="page-header-action">{pageAction}</div>}
            </div>
          )}

          {/* Children View */}
          <div className="page-body-container">{children}</div>
        </main>
      </div>
    </div>
  );
};
