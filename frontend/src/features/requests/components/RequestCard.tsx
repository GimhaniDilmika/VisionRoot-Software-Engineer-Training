import React from 'react';
import Link from 'next/link';
import { ServiceRequest } from '../types/request';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from '../../../components/ui/PriorityBadge';

interface RequestCardProps {
  request: ServiceRequest;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const RequestCard: React.FC<RequestCardProps> = ({ request }) => (
  <article
    className="card"
    style={{ marginBottom: '0.875rem', transition: 'box-shadow 0.15s' }}
    aria-label={`Service request: ${request.title}`}
  >
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '0.75rem',
        marginBottom: '0.625rem',
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--color-text-main)',
          flex: '1 1 200px',
        }}
      >
        <Link
          href={`/requests/${request.id}`}
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          {request.title}
        </Link>
      </h3>
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
        <StatusBadge status={request.status} />
        <PriorityBadge priority={request.priority} />
      </div>
    </div>

    <p
      style={{
        margin: '0 0 0.75rem',
        color: 'var(--color-text-muted)',
        fontSize: '0.9rem',
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}
    >
      {request.description}
    </p>

    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.8rem',
        color: 'var(--color-text-subtle)',
      }}
    >
      <span>
        <strong>Category:</strong> {request.category}
      </span>
      <span>
        <strong>Submitted:</strong>{' '}
        <time dateTime={request.created_at}>{formatDate(request.created_at)}</time>
      </span>
      <span>
        <strong>ID:</strong>{' '}
        <code style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
          {request.id.slice(0, 8)}…
        </code>
      </span>
    </div>
  </article>
);
