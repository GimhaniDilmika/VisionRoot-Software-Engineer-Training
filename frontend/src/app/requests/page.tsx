'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '../../components/layout/AppShell';
import {
  RequestFilters,
  FilterStatus,
  FilterCategory,
  FilterPriority,
  SortOrder,
} from '../../features/requests/components/RequestFilters';
import { RequestList } from '../../features/requests/components/RequestList';
import { requestApi } from '../../features/requests/services/requestApi';
import { ServiceRequest } from '../../features/requests/types/request';

export default function RequestsPage() {
  const [allRequests, setAllRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('ALL');
  const [sortOrder, setSortOrder] = useState<SortOrder>('NEWEST');

  const loadRequests = useCallback(async (status: FilterStatus) => {
    setIsLoading(true);
    setError(null);
    const response = await requestApi.getRequests(status === 'ALL' ? undefined : status);
    if (response.success && response.data) {
      setAllRequests(response.data);
    } else {
      setError(response.error?.message || 'Failed to load requests from PostgreSQL database.');
      setAllRequests([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadRequests(statusFilter);
  }, [statusFilter, loadRequests]);

  const isFiltered = Boolean(
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    sortOrder !== 'NEWEST'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setPriorityFilter('ALL');
    setSortOrder('NEWEST');
  };

  // Combined client-side filtering and sorting for multi-criteria triage
  const filteredAndSortedRequests = useMemo(() => {
    let result = [...allRequests];

    // Search query filter (title or description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      result = result.filter((r) => r.category === categoryFilter);
    }

    // Priority filter
    if (priorityFilter !== 'ALL') {
      result = result.filter((r) => r.priority === priorityFilter);
    }

    // Sort order (created_at timestamp)
    result.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [allRequests, searchQuery, categoryFilter, priorityFilter, sortOrder]);

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'All Requests' },
      ]}
      pageEyebrow="SERVICE REQUEST CONSOLE"
      pageTitle="Organization Service Requests"
      pageSubtitle="Search, filter, and track IT and facilities service requests across their lifecycle."
      pageAction={
        <Link href="/requests/new" className="btn btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Submit New Request</span>
        </Link>
      }
    >
      {/* ── Multi-Criteria Filters ─────────────────────────────────────── */}
      <RequestFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        totalCount={filteredAndSortedRequests.length}
        unfilteredCount={allRequests.length}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* ── Requests Table View ────────────────────────────────────────── */}
      <RequestList
        requests={filteredAndSortedRequests}
        isLoading={isLoading}
        error={error}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />
    </AppShell>
  );
}
