import React from 'react';

export default function HomePage() {
  return (
    <main style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
      <header style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ color: '#0f172a', margin: 0 }}>VisionRoot Service Request Management System</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem' }}>
          Trainee Software Engineer Onboarding — Day 03: Environment Setup
        </p>
      </header>
      
      <section style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ color: '#1e293b', marginTop: 0 }}>Frontend Environment Status: Initialized</h2>
        <p>
          The Next.js and TypeScript frontend client scaffolding has been successfully verified.
        </p>
        <ul style={{ color: '#334155' }}>
          <li><strong>Architecture:</strong> Modular Monolith Client</li>
          <li><strong>Framework:</strong> Next.js 14 (App Router)</li>
          <li><strong>Type Safety:</strong> TypeScript Strict Mode</li>
          <li><strong>Next Phase (Day 04):</strong> UI Components, Forms, and Request List implementation</li>
        </ul>
      </section>
    </main>
  );
}

