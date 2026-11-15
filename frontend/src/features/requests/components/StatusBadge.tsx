import React from 'react';
import { RequestStatus } from '../types/request';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const statusConfig: Record<
  RequestStatus,
  { label: string; pillClass: string }
> = {
  OPEN: {
    label: 'Open',
    pillClass: 'status-pill-open',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    pillClass: 'status-pill-inprogress',
  },
  RESOLVED: {
    label: 'Resolved',
    pillClass: 'status-pill-resolved',
  },
  CLOSED: {
    label: 'Closed',
    pillClass: 'status-pill-closed',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const cfg = statusConfig[status] || {
    label: status,
    pillClass: 'status-pill-open',
  };

  return (
    <span
      className={`status-pill ${cfg.pillClass} ${className}`.trim()}
      aria-label={`Status: ${cfg.label}`}
    >
      <span className="status-dot" aria-hidden="true" />
      <span>{cfg.label}</span>
    </span>
  );
};
