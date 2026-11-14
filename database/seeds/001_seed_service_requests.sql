-- ==============================================================================
-- VisionRoot Service Request Management System — Database Seed Script
-- File: 001_seed_service_requests.sql
-- Description: Inserts the 5 standard demo service request records matching
--              frontend mock data and Day 05 test specifications.
-- Safety Invariant: Idempotent (ON CONFLICT DO UPDATE) safe to execute repeatedly.
-- ==============================================================================

INSERT INTO service_requests (
    id,
    title,
    description,
    category,
    priority,
    status,
    created_at,
    updated_at
)
VALUES
    (
        '550e8400-e29b-41d4-a716-446655440000',
        'Flickering monitor on Desk 12',
        'The external monitor turns black intermittently when connected via HDMI cable to MacBook Pro.',
        'IT',
        'HIGH',
        'OPEN',
        '2026-11-12T04:10:00.000Z',
        '2026-11-12T04:10:00.000Z'
    ),
    (
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        'Air conditioning water leak in Meeting Room B',
        'Ceiling AC unit is dripping water directly above the main conference table.',
        'Facilities',
        'HIGH',
        'IN_PROGRESS',
        '2026-11-12T03:30:00.000Z',
        '2026-11-12T04:00:00.000Z'
    ),
    (
        '7ca7b810-9dad-11d1-80b4-00c04fd430c9',
        'VPN access requested for remote finance audit',
        'Require secure global VPN provisioning for the external quarterly finance auditing team.',
        'IT',
        'MEDIUM',
        'OPEN',
        '2026-11-12T02:15:00.000Z',
        '2026-11-12T02:15:00.000Z'
    ),
    (
        '8da7b810-9dad-11d1-80b4-00c04fd430d0',
        'Ergonomic keyboard replacement for workstation 4',
        'Spacebar key sticking repeatedly on existing wireless keyboard.',
        'Other',
        'LOW',
        'RESOLVED',
        '2026-11-11T10:00:00.000Z',
        '2026-11-12T01:00:00.000Z'
    ),
    (
        '9ea7b810-9dad-11d1-80b4-00c04fd430d1',
        'Cafeteria microwave door latch broken',
        'Upper floor cafeteria microwave door fails to latch securely shut.',
        'Facilities',
        'LOW',
        'CLOSED',
        '2026-11-10T08:00:00.000Z',
        '2026-11-11T16:00:00.000Z'
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    priority = EXCLUDED.priority,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;
