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

/**
 * /requests — Request list page.
 * Shows all service requests with status filter tabs.
 * Day 04: Uses mockRequestService — no backend CRUD API yet.
 */
export default function RequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');

  const loadRequests = useCallback(async (filter: FilterValue) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mockRequestService.getRequests(filter === 'ALL' ? undefined : filter);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests(activeFilter);
  }, [activeFilter, loadRequests]);

  const handleFilterChange = (filter: FilterValue) => {
    setActiveFilter(filter);
  };

  return (
    <>
      <AppHeader />
      <DemoBanner />

      <main>
        <div className="container" style={{ maxWidth: '900px', padding: '2rem 1rem' }}>
          {/* Page header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.75rem',
            }}
          >
            <div>
              <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.75rem', fontWeight: 800 }}>
                Service Requests
              </h1>
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
                Browse and filter all submitted service requests.
              </p>
            </div>
            <Link href="/requests/new" className="btn btn-primary">
              + New Request
            </Link>
          </div>

          {/* Filters */}
          <RequestFilters
            activeStatus={activeFilter}
            onStatusChange={handleFilterChange}
            totalCount={requests.length}
          />

          {/* Request list (handles loading/error/empty/data states internally) */}
          <RequestList
            requests={requests}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </>
  );
}
