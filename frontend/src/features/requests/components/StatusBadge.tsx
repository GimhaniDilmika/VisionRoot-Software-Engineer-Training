import React from 'react';
import { RequestStatus } from '../types/request';

interface StatusBadgeProps {
  status: RequestStatus;
}

const statusConfig: Record<RequestStatus, { label: string; style: React.CSSProperties }> = {
  OPEN: {
    label: 'Open',
    style: {
      color: 'var(--status-open-text)',
      backgroundColor: 'var(--status-open-bg)',
      border: '1px solid var(--status-open-border)',
    },
  },
  IN_PROGRESS: {
    label: 'In Progress',
    style: {
      color: 'var(--status-inprogress-text)',
      backgroundColor: 'var(--status-inprogress-bg)',
      border: '1px solid var(--status-inprogress-border)',
    },
  },
  RESOLVED: {
    label: 'Resolved',
    style: {
      color: 'var(--status-resolved-text)',
      backgroundColor: 'var(--status-resolved-bg)',
      border: '1px solid var(--status-resolved-border)',
    },
  },
  CLOSED: {
    label: 'Closed',
    style: {
      color: 'var(--status-closed-text)',
      backgroundColor: 'var(--status-closed-bg)',
      border: '1px solid var(--status-closed-border)',
    },
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <span className="badge" style={config.style} aria-label={`Status: ${config.label}`}>
      {config.label}
    </span>
  );
};
