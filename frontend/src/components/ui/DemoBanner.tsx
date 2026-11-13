import React from 'react';

export const DemoBanner: React.FC = () => (
  <div
    role="status"
    style={{
      backgroundColor: '#FFFBEB',
      borderBottom: '1px solid #FCD34D',
      padding: '0.5rem 0',
    }}
  >
    <div
      className="container"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8125rem',
        color: '#92400E',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <span>
        <strong>Demo Mode:</strong> All data is stored in memory only and resets on page reload.
        No database connection is active until Day 06.
      </span>
    </div>
  </div>
);
