'use client';

import React from 'react';
import { RequestStatus, RequestCategory, RequestPriority } from '../types/request';

export type FilterStatus = RequestStatus | 'ALL';
export type FilterCategory = RequestCategory | 'ALL';
export type FilterPriority = RequestPriority | 'ALL';
export type SortOrder = 'NEWEST' | 'OLDEST';

interface RequestFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: FilterStatus;
  onStatusChange: (val: FilterStatus) => void;
  categoryFilter: FilterCategory;
  onCategoryChange: (val: FilterCategory) => void;
  priorityFilter: FilterPriority;
  onPriorityChange: (val: FilterPriority) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (val: SortOrder) => void;
  totalCount: number;
  unfilteredCount?: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

const CATEGORY_OPTIONS: { value: FilterCategory; label: string }[] = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'IT', label: 'IT' },
  { value: 'Facilities', label: 'Facilities' },
  { value: 'Other', label: 'Other' },
];

const PRIORITY_OPTIONS: { value: FilterPriority; label: string }[] = [
  { value: 'ALL', label: 'All Priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'NEWEST', label: 'Newest First' },
  { value: 'OLDEST', label: 'Oldest First' },
];

export const RequestFilters: React.FC<RequestFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  sortOrder,
  onSortOrderChange,
  totalCount,
  unfilteredCount,
  onResetFilters,
  isFiltered,
}) => {
  return (
    <div className="filter-panel-card" role="search" aria-label="Filter service requests">
      {/* ── Search Input & Controls Bar ───────────────────────────────── */}
      <div className="filter-search-row" style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div className="search-wrapper" style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '0.95rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-subtle)',
              pointerEvents: 'none',
              display: 'flex',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="search"
            className="form-input"
            placeholder="Search by ticket title, description, or keyword…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ paddingLeft: '2.6rem', paddingRight: searchQuery ? '2.5rem' : '0.85rem', height: '42px', fontSize: '0.875rem' }}
            aria-label="Search by ticket title, description, or keyword"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search input"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-xs)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '0.25rem',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Results Counter & Reset Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-subtle)',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--color-border)',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {isFiltered && typeof unfilteredCount === 'number'
              ? `Showing ${totalCount} of ${unfilteredCount}`
              : `${totalCount} ${totalCount === 1 ? 'ticket' : 'tickets'}`}
          </span>

          {isFiltered && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onResetFilters}
              aria-label="Reset all search and filter criteria"
              style={{ height: '42px', fontSize: '0.8125rem', gap: '0.4rem', color: '#B91C1C', borderColor: '#FECDD3' }}
            >
              ✕ Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Controls Grid (4 Columns) ─────────────────────────── */}
      <div className="filter-controls-grid">
        {/* Status Filter */}
        <div className="filter-control-item">
          <label htmlFor="filter-status" className="filter-control-label">
            STATUS FILTER
          </label>
          <select
            id="filter-status"
            className="form-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as FilterStatus)}
            style={{ height: '38px', fontSize: '0.84375rem' }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-control-item">
          <label htmlFor="filter-category" className="filter-control-label">
            CATEGORY FILTER
          </label>
          <select
            id="filter-category"
            className="form-select"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value as FilterCategory)}
            style={{ height: '38px', fontSize: '0.84375rem' }}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="filter-control-item">
          <label htmlFor="filter-priority" className="filter-control-label">
            PRIORITY FILTER
          </label>
          <select
            id="filter-priority"
            className="form-select"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as FilterPriority)}
            style={{ height: '38px', fontSize: '0.84375rem' }}
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-control-item">
          <label htmlFor="filter-sort" className="filter-control-label">
            SORT ORDER
          </label>
          <select
            id="filter-sort"
            className="form-select"
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
            style={{ height: '38px', fontSize: '0.84375rem' }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
