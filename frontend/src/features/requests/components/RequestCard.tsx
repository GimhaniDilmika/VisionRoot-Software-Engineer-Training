import React from 'react';
import Link from 'next/link';
import { ServiceRequest } from '../types/request';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from '../../../components/ui/PriorityBadge';

interface RequestCardProps {
  request: ServiceRequest;
  index?: number;
}

function formatShortDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * RequestCard — renders as a desktop table row (via RequestList) and as a
 * mobile-friendly card when shown in the .mobile-cards list.
 */
export const RequestCard: React.FC<RequestCardProps> = ({ request, index }) => {
  const shortId = `#${typeof index === 'number' ? index + 1 : request.id.slice(0, 4)}`;

  return (
    <>
      {/* ── Desktop table row ─────────────────────────────────────────── */}
      <tr aria-label={`Request: ${request.title}`}>
        {/* ID */}
        <td>
          <span style={{ color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 500 }}>
            {shortId}
          </span>
        </td>

        {/* Title & Description */}
        <td style={{ maxWidth: '280px' }}>
          <Link
            href={`/requests/${request.id}`}
            style={{
              display: 'block',
              fontWeight: 600,
              color: '#1E293B',
              textDecoration: 'none',
              fontSize: '0.9rem',
              marginBottom: '0.2rem',
              lineHeight: 1.35,
            }}
          >
            {request.title}
          </Link>
          <p
            style={{
              margin: 0,
              fontSize: '0.8125rem',
              color: '#64748B',
              lineHeight: 1.4,
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
        <td>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: '#475569',
              textTransform: 'uppercase',
            }}
          >
            {request.category}
          </span>
        </td>

        {/* Priority */}
        <td>
          <PriorityBadge priority={request.priority} />
        </td>

        {/* Status */}
        <td>
          <StatusBadge status={request.status} />
        </td>

        {/* Created Date */}
        <td>
          <time
            dateTime={request.created_at}
            style={{ fontSize: '0.8125rem', color: '#64748B', whiteSpace: 'nowrap' }}
          >
            {formatShortDate(request.created_at)}
          </time>
        </td>

        {/* Actions */}
        <td>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <Link
              href={`/requests/${request.id}`}
              className="btn btn-secondary btn-sm"
              aria-label={`View ${request.title}`}
              style={{ padding: '0.3rem 0.6rem' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View
            </Link>
          </div>
        </td>
      </tr>
    </>
  );
};

/**
 * RequestMobileCard — full card layout for mobile viewports
 */
export const RequestMobileCard: React.FC<RequestCardProps> = ({ request }) => (
  <div
    className="card"
    style={{ marginBottom: '0.875rem' }}
    aria-label={`Service request: ${request.title}`}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
      <Link
        href={`/requests/${request.id}`}
        style={{ fontWeight: 700, color: '#1E293B', textDecoration: 'none', fontSize: '0.9375rem', flex: 1 }}
      >
        {request.title}
      </Link>
      <StatusBadge status={request.status} />
    </div>
    <p style={{ margin: '0 0 0.75rem', color: '#64748B', fontSize: '0.875rem', lineHeight: 1.5,
      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
      {request.description}
    </p>
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <PriorityBadge priority={request.priority} />
      <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
        {request.category}
      </span>
      <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: '#94A3B8' }}>
        {formatShortDate(request.created_at)}
      </span>
    </div>
  </div>
);
