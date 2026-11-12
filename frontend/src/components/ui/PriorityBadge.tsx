import React from 'react';
import { RequestPriority } from '../../features/requests/types/request';

interface PriorityBadgeProps {
  priority: RequestPriority;
}

const priorityConfig: Record<RequestPriority, { label: string; style: React.CSSProperties }> = {
  HIGH: {
    label: '↑ High',
    style: {
      color: 'var(--priority-high-text)',
      backgroundColor: 'var(--priority-high-bg)',
      border: '1px solid var(--priority-high-border)',
    },
  },
  MEDIUM: {
    label: '→ Medium',
    style: {
      color: 'var(--priority-med-text)',
      backgroundColor: 'var(--priority-med-bg)',
      border: '1px solid var(--priority-med-border)',
    },
  },
  LOW: {
    label: '↓ Low',
    style: {
      color: 'var(--priority-low-text)',
      backgroundColor: 'var(--priority-low-bg)',
      border: '1px solid var(--priority-low-border)',
    },
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = priorityConfig[priority];
  return (
    <span className="badge" style={config.style} aria-label={`Priority: ${priority}`}>
      {config.label}
    </span>
  );
};
