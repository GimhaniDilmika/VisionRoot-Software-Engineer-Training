'use client';

import React from 'react';
import { RequestStatus } from '../types/request';

type FilterValue = RequestStatus | 'ALL';

interface RequestFiltersProps {
  activeStatus: FilterValue;
  onStatusChange: (status: FilterValue) => void;
  totalCount: number;
}

const STATUS_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'ALL',         label: 'All Statuses' },
  { value: 'OPEN',        label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED',    label: 'Resolved' },
  { value: 'CLOSED',      label: 'Closed' },
];

/**
 * RequestFilters — dropdown-style status selector matching the reference UI.
 * Also shows the live request count.
 */
export const RequestFilters: React.FC<RequestFiltersProps> = ({
  activeStatus,
  onStatusChange,
  totalCount,
}) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center',
      marginBottom: '1.25rem',
    }}
  >
    {/* Status filter dropdown */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <label
        htmlFor="status-filter"
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#94A3B8',
        }}
      >
        Status Filter
      </label>
      <select
        id="status-filter"
        className="form-select"
        value={activeStatus}
        onChange={(e) => onStatusChange(e.target.value as FilterValue)}
        style={{ width: '170px', fontSize: '0.875rem', padding: '0.4rem 2rem 0.4rem 0.75rem' }}
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>

    {/* Live count badge */}
    <div
      style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end' }}
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        style={{
          fontSize: '0.8125rem',
          color: '#64748B',
          backgroundColor: '#F1F5F9',
          border: '1px solid #E2E8F0',
          borderRadius: '9999px',
          padding: '0.2rem 0.65rem',
          fontWeight: 500,
        }}
      >
        {totalCount} {totalCount === 1 ? 'result' : 'results'}
      </span>
    </div>
  </div>
);
