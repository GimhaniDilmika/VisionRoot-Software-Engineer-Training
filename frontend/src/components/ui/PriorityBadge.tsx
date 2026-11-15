import React from 'react';
import { RequestPriority } from '../../features/requests/types/request';

interface PriorityBadgeProps {
  priority: RequestPriority;
  className?: string;
}

const cfg: Record<
  RequestPriority,
  { label: string; badgeClass: string; icon: string }
> = {
  HIGH: {
    label: 'High',
    badgeClass: 'priority-high',
    icon: '↑',
  },
  MEDIUM: {
    label: 'Medium',
    badgeClass: 'priority-medium',
    icon: '•',
  },
  LOW: {
    label: 'Low',
    badgeClass: 'priority-low',
    icon: '↓',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const c = cfg[priority] || {
    label: priority,
    badgeClass: 'priority-medium',
    icon: '•',
  };

  return (
    <span
      className={`priority-tag ${c.badgeClass} ${className}`.trim()}
      aria-label={`Priority: ${c.label}`}
    >
      <span aria-hidden="true" style={{ fontSize: '0.75rem', fontWeight: 800 }}>{c.icon}</span>
      <span>{c.label}</span>
    </span>
  );
};
