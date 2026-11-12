'use client';

import React from 'react';
import { RequestStatus } from '../types/request';

const STATUS_OPTIONS: { value: RequestStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

interface RequestFiltersProps {
  activeStatus: RequestStatus | 'ALL';
  onStatusChange: (status: RequestStatus | 'ALL') => void;
  totalCount: number;
}

export const RequestFilters: React.FC<RequestFiltersProps> = ({
  activeStatus,
  onStatusChange,
  totalCount,
}) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem',
    }}
    role="group"
    aria-label="Filter requests by status"
  >
    <span
      style={{
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        marginRight: '0.25rem',
      }}
    >
      Filter:
    </span>
    {STATUS_OPTIONS.map(({ value, label }) => {
      const isActive = activeStatus === value;
      return (
        <button
          key={value}
          type="button"
          onClick={() => onStatusChange(value)}
          aria-pressed={isActive}
          style={{
            padding: '0.375rem 0.875rem',
            borderRadius: '9999px',
            border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
            backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-bg-card)',
            color: isActive ? '#ffffff' : 'var(--color-text-muted)',
            fontWeight: isActive ? 600 : 400,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {label}
        </button>
      );
    })}
    <span
      style={{
        marginLeft: 'auto',
        fontSize: '0.875rem',
        color: 'var(--color-text-subtle)',
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {totalCount} {totalCount === 1 ? 'request' : 'requests'}
    </span>
  </div>
);
