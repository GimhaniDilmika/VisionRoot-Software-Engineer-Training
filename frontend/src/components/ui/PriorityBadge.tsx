import React from 'react';
import { RequestPriority } from '../../features/requests/types/request';

interface PriorityBadgeProps {
  priority: RequestPriority;
}

const cfg: Record<
  RequestPriority,
  { label: string; textColor: string; bg: string; border: string; indicator: string }
> = {
  HIGH: {
    label: 'High',
    textColor: '#BE123C',
    bg: '#FFF1F2',
    border: '#FECDD3',
    indicator: '●',
  },
  MEDIUM: {
    label: 'Medium',
    textColor: '#92400E',
    bg: '#FFFBEB',
    border: '#FCD34D',
    indicator: '◐',
  },
  LOW: {
    label: 'Low',
    textColor: '#065F46',
    bg: '#F0FDF4',
    border: '#86EFAC',
    indicator: '○',
  },
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const c = cfg[priority];
  return (
    <span
      className="badge"
      style={{
        color: c.textColor,
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
      }}
      aria-label={`Priority: ${c.label}`}
    >
      <span aria-hidden="true" style={{ fontSize: '0.6rem' }}>{c.indicator}</span>
      {c.label}
    </span>
  );
};
