import React from 'react';
import Link from 'next/link';
import { ServiceRequest } from '../types/request';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from '../../../components/ui/PriorityBadge';

interface RequestCardProps {
  request: ServiceRequest;
  index?: number;
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, index }) => {
  const rowNumber = typeof index === 'number' ? `#${index + 1}` : '#—';
  const shortUuid = request.id.length > 8 ? `${request.id.slice(0, 8)}…` : request.id;

  return (
    <tr aria-label={`Request: ${request.title}`}>
      {/* Visual Row Index + Full UUID distinction */}
      <td style={{ width: '85px', verticalAlign: 'top', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-navy)' }}>
            {rowNumber}
          </span>
          <code
            title={`Full UUID: ${request.id}`}
            style={{
              fontSize: '0.6875rem',
              color: 'var(--color-text-xs)',
              fontFamily: 'monospace',
              letterSpacing: '-0.02em',
            }}
          >
            {shortUuid}
          </code>
        </div>
      </td>

      {/* Title & Readable Description Preview */}
      <td style={{ maxWidth: '360px', verticalAlign: 'top', paddingTop: '1rem' }}>
        <Link
          href={`/requests/${request.id}`}
          style={{
            display: 'block',
            fontWeight: 700,
            color: 'var(--color-navy)',
            textDecoration: 'none',
            fontSize: '0.90625rem',
            marginBottom: '0.25rem',
            lineHeight: 1.35,
            transition: 'color 0.15s ease',
          }}
          className="table-row-title-link"
        >
          {request.title}
        </Link>
        <p
          style={{
            margin: 0,
            fontSize: '0.8125rem',
            color: 'var(--color-text-subtle)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {request.description}
        </p>
      </td>

      {/* Category */}
      <td style={{ verticalAlign: 'top', paddingTop: '1.1rem' }}>
        <span
          style={{
            fontSize: '0.71875rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: 'var(--color-text-muted)',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border)',
            padding: '0.2rem 0.55rem',
            borderRadius: '4px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {request.category}
        </span>
      </td>

      {/* Priority */}
      <td style={{ verticalAlign: 'top', paddingTop: '1rem' }}>
        <PriorityBadge priority={request.priority} />
      </td>

      {/* Status */}
      <td style={{ verticalAlign: 'top', paddingTop: '1rem' }}>
        <StatusBadge status={request.status} />
      </td>

      {/* Created Date */}
      <td style={{ verticalAlign: 'top', paddingTop: '1.1rem', whiteSpace: 'nowrap' }}>
        <time
          dateTime={request.created_at}
          style={{ fontSize: '0.8125rem', color: 'var(--color-text-subtle)', fontWeight: 500 }}
        >
          {formatDate(request.created_at)}
        </time>
      </td>

      {/* Actions */}
      <td style={{ textAlign: 'right', verticalAlign: 'top', paddingTop: '0.95rem' }}>
        <Link
          href={`/requests/${request.id}`}
          className="btn btn-secondary btn-sm"
          style={{
            padding: '0.35rem 0.75rem',
            fontSize: '0.78125rem',
            gap: '0.35rem',
            fontWeight: 600,
          }}
          aria-label={`View details for ticket: ${request.title}`}
        >
          <span>View Details</span>
          <span aria-hidden="true">→</span>
        </Link>
      </td>
    </tr>
  );
};

export const RequestMobileCard: React.FC<RequestCardProps> = ({ request, index }) => {
  const rowNumber = typeof index === 'number' ? `#${index + 1}` : '#—';
  const shortUuid = request.id.length > 8 ? `${request.id.slice(0, 8)}…` : request.id;

  return (
    <div
      className="card"
      style={{
        marginBottom: '0.875rem',
        padding: '1.25rem',
        borderLeft: '3px solid var(--color-primary)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '0.78125rem', fontWeight: 800, color: 'var(--color-navy)' }}>
            {rowNumber}
          </span>
          <code style={{ fontSize: '0.6875rem', color: 'var(--color-text-xs)', fontFamily: 'monospace' }}>
            ({shortUuid})
          </code>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <Link
        href={`/requests/${request.id}`}
        style={{
          display: 'block',
          fontWeight: 700,
          color: 'var(--color-navy)',
          textDecoration: 'none',
          fontSize: '0.9375rem',
          lineHeight: 1.35,
          marginBottom: '0.4rem',
        }}
      >
        {request.title}
      </Link>

      <p
        style={{
          margin: '0 0 0.85rem',
          color: 'var(--color-text-subtle)',
          fontSize: '0.84375rem',
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
          gap: '0.65rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <span
          style={{
            fontSize: '0.71875rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
          }}
        >
          {request.category}
        </span>
        <PriorityBadge priority={request.priority} />
        <span style={{ marginLeft: 'auto', fontSize: '0.78125rem', color: 'var(--color-text-xs)' }}>
          {formatDate(request.created_at)}
        </span>
        <Link
          href={`/requests/${request.id}`}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};
