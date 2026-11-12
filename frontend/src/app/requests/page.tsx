'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AppHeader } from '../../components/layout/AppHeader';
import { DemoBanner } from '../../components/ui/DemoBanner';
import { RequestFilters } from '../../features/requests/components/RequestFilters';
import { RequestList } from '../../features/requests/components/RequestList';
import { mockRequestService } from '../../features/requests/services/mockRequests';
import { ServiceRequest, RequestStatus } from '../../features/requests/types/request';

type FilterValue = RequestStatus | 'ALL';

export default function RequestsPage() {
  const [allRequests, setAllRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadRequests = useCallback(async (filter: FilterValue) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mockRequestService.getRequests(filter === 'ALL' ? undefined : filter);
      setAllRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests(activeFilter);
  }, [activeFilter, loadRequests]);

  // Client-side text search over loaded results
  const filteredRequests = searchQuery.trim()
    ? allRequests.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allRequests;

  return (
    <>
      <AppHeader />
      <DemoBanner />

      <main style={{ minHeight: '80vh' }}>
        <div className="container" style={{ padding: '2rem 1.5rem' }}>

          {/* Page header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <p className="page-eyebrow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Request Management Console
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ margin: '0 0 0.3rem', fontSize: 'clamp(1.4rem, 3vw, 1.875rem)', fontWeight: 800 }}>
                  Organization Service Requests
                </h1>
                <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>
                  Review, filter, and track all submitted IT and Facilities service requests.
                </p>
              </div>
              <Link href="/requests/new" className="btn btn-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Request
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div
            style={{
              backgroundColor: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <div className="search-wrapper" style={{ flex: 1 }}>
              <span className="search-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
              <input
                type="search"
                className="form-input"
                placeholder="Search by request title or description…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search requests"
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {/* search is live */}}
              aria-label="Search"
              style={{ flexShrink: 0 }}
            >
              Search
            </button>
          </div>

          {/* Filters row */}
          <RequestFilters
            activeStatus={activeFilter}
            onStatusChange={setActiveFilter}
            totalCount={filteredRequests.length}
          />

          {/* Results */}
          <RequestList
            requests={filteredRequests}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </>
  );
}
