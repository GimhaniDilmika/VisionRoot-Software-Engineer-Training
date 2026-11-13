import React from 'react';
import { RequestStatus } from '../types/request';

interface StatusBadgeProps {
  status: RequestStatus;
}

const statusConfig: Record<
  RequestStatus,
  { label: string; dotColor: string; textColor: string; bg: string; border: string }
> = {
  OPEN: {
    label: 'Open',
    dotColor: '#3B82F6',
    textColor: '#1D4ED8',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dotColor: '#F59E0B',
    textColor: '#92400E',
    bg: '#FFFBEB',
    border: '#FCD34D',
  },
  RESOLVED: {
    label: 'Resolved',
    dotColor: '#10B981',
    textColor: '#065F46',
    bg: '#ECFDF5',
    border: '#6EE7B7',
  },
  CLOSED: {
    label: 'Closed',
    dotColor: '#94A3B8',
    textColor: '#475569',
    bg: '#F1F5F9',
    border: '#CBD5E1',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = statusConfig[status];
  return (
    <span
      className="badge"
      style={{
        color: cfg.textColor,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
      aria-label={`Status: ${cfg.label}`}
    >
      <span
        className="badge-dot"
        style={{ backgroundColor: cfg.dotColor }}
        aria-hidden="true"
      />
      {cfg.label}
    </span>
  );
};
