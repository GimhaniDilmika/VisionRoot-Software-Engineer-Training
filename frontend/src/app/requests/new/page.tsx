'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '../../../components/layout/AppShell';
import { RequestForm } from '../../../features/requests/components/RequestForm';

// Step 3 form-specific visual styles
import '../../../styles/form-new-request.css';

export default function NewRequestPage() {
  return (
    <AppShell
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'All Requests', href: '/requests' },
        { label: 'New Request' },
      ]}
      pageEyebrow="NEW SERVICE TICKET"
      pageTitle="Submit Service Request"
      pageSubtitle="Open an operational, IT hardware, or facilities request. All fields marked with * are required."
      pageAction={
        <Link href="/requests" className="btn btn-outline btn-sm" aria-label="Return to All Requests list">
          ← Back to All Requests
        </Link>
      }
    >
      <div className="form-page-wrapper">
        <RequestForm />
      </div>
    </AppShell>
  );
}
