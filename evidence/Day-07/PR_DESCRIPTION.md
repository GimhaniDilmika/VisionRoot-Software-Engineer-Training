# Pull Request: Day 07 — Full-Stack Integration & Business Workflows

## Summary

This pull request completes Day 07 of the VisionRoot Trainee Software Engineer Training program. It connects the Next.js 14 frontend directly to the live Express.js REST API and PostgreSQL 18.6 database, completely replacing mock data while preserving 100% of the Day 01–06 architecture and database schema. It implements the approved VisionRoot Green + White SaaS UI redesign across all four interfaces, enforces the strict linear request lifecycle state machine (`OPEN → IN_PROGRESS → RESOLVED → CLOSED`), and validates end-to-end database persistence and error handling.

**Branch:** `feature/day-07-fullstack-integration`
**Base Branch:** `main`
**Database Schema Status:** **No new database migrations were required for Day 07.** The existing PostgreSQL schema from Day 06 (`database/migrations/001_create_service_requests.sql`) fully satisfied all domain requirements.

---

## Changes Implemented

### 1. Full-Stack API & Database Integration
- **Direct API Client (`requestApi.ts`):** Wired Next.js frontend to `process.env.NEXT_PUBLIC_API_URL` (`http://localhost:5000/api`). Removed mock data dependencies from all active pages. Added `checkHealth()` for dynamic backend/database health probes.
- **Environment Configuration:** Configured `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:5000/api` (git-ignored).
- **PostgreSQL Persistence:** All request submissions, queries, and status updates directly target the PostgreSQL `service_requests` table via the Express service layer.

### 2. Frontend HCI UI/UX Redesign (Green + White Design System)
- **Shared AppShell Layout (`AppShell.tsx`):**
  - Collapsible sidebar with navigation items, status pills, and live PostgreSQL connection telemetry.
  - Page header with breadcrumbs and contextual page actions.
  - Duplicate "New Request" buttons eliminated on `/requests` and `/requests/new`.
- **Home Dashboard (`/`):**
  - 5 live metric cards: Volume, Open, In Progress, Resolved, and Closed (backed by live PostgreSQL aggregation).
  - Status Distribution multi-segment chart reflecting real database percentages.
  - Compact Recent Requests feed showing strictly top 4 recently created tickets.
  - Visual linear lifecycle progression card (`OPEN → IN_PROGRESS → RESOLVED → CLOSED`).
- **All Requests (`/requests`):**
  - Enterprise table with column indexing (`#1`), shortened UUIDs with hover tooltips, glowing status dots, and directional priority badges.
  - Search bar with clear button (`✕`), real-time match counter (`Showing X of Y requests`), and one-click `Reset Filters` control.
  - Responsive layout transforming into stacked cards on mobile viewports (<768px).
- **New Request Form (`/requests/new`):**
  - Structured form card with green accent header stripe and triage guidance banner.
  - Input field styling with live character counters (`X / 100`, `X / 1000`) turning amber at 90% capacity.
  - Shortened priority options (`Low`, `Medium`, `High`) with helper text below to prevent Windows text truncation.
  - Accessible success confirmation panel with assigned UUID and direct `View Request Details →` link.
  - Zero data loss: form values are strictly preserved in state upon validation or network errors.
- **Request Details & Lifecycle Update (`/requests/[id]`):**
  - Dedicated Ticket Hero card displaying category eyebrow, title in page header, and a `Copy ID` button with 2-second visual feedback.
  - 4-node lifecycle stepper with connecting track and checkmarks (`✓`) on completed stages.
  - Status update panel with `current → next` workflow guidance and full-width action buttons.
  - Terminal state panel for `CLOSED` tickets disabling further modifications.
  - Dedicated 404 Not Found panel for invalid or missing UUIDs.

---

## Verification & Test Results

### 1. Static Type Checking & Production Build
| Check | Command | Result |
| :--- | :--- | :---: |
| **Frontend TypeScript Check** | `cd frontend && npx tsc --noEmit` | ✅ 0 errors |
| **Frontend Production Build** | `cd frontend && npm run build` (with dev server stopped) | ✅ 6 routes compiled |
| **Backend TypeScript Check** | `cd backend && npm run type-check` | ✅ 0 errors |

### 2. Executed End-to-End Workflow API Suite (Part 01)
Tested on live Express backend and PostgreSQL using authorized test record `84641b37-1895-4988-8ecf-495315da64df`:

| # | Step | Endpoint & Method | HTTP Status | Result |
| :-: | :--- | :--- | :-: | :---: |
| 1 | Create test request | `POST /api/requests` | **201 Created** | ✅ PASS |
| 2 | Verify initial state | `GET /api/requests/:id` | **200 OK** (`status: "OPEN"`) | ✅ PASS |
| 3 | Advance to IN_PROGRESS | `PATCH /api/requests/:id/status` | **200 OK** (`status: "IN_PROGRESS"`) | ✅ PASS |
| 4 | Advance to RESOLVED | `PATCH /api/requests/:id/status` | **200 OK** (`status: "RESOLVED"`) | ✅ PASS |
| 5 | Advance to CLOSED | `PATCH /api/requests/:id/status` | **200 OK** (`status: "CLOSED"`) | ✅ PASS |
| 6 | Enforce terminal invariant | `PATCH /api/requests/:id/status` (`OPEN`) | **400 Bad Request** (`INVALID_STATE_TRANSITION`) | ✅ PASS |
| 7 | Confirm persistence | `GET /api/requests/:id` | **200 OK** (`updated_at > created_at`) | ✅ PASS |
| 8 | Verify in list | `GET /api/requests` | **200 OK** (Total count: 9) | ✅ PASS |

### 3. Executed Negative & Error Handling Suite (Part 02)
- Empty title → HTTP 400 `VALIDATION_ERROR` (✅ PASS)
- Title < 5 characters → HTTP 400 `VALIDATION_ERROR` (✅ PASS)
- Description < 10 characters → HTTP 400 `VALIDATION_ERROR` (✅ PASS)
- Invalid category enum → HTTP 400 `VALIDATION_ERROR` (✅ PASS)
- Invalid priority enum → HTTP 400 `VALIDATION_ERROR` (✅ PASS)
- Nonexistent UUID → HTTP 404 `NOT_FOUND` (✅ PASS)
- Malformed UUID → HTTP 400 `INVALID_IDENTIFIER` (✅ PASS)
- Modification on closed ticket → HTTP 400 `INVALID_STATE_TRANSITION` (✅ PASS)
- Database record count stayed strictly at 9 (0 garbage records created).
- CORS `OPTIONS` preflight verified (`Access-Control-Allow-Origin: http://localhost:3000`).

---

## Known Limitations & Pending Evidence

1. **Manual Browser Screenshots:** While all API integrations and static code paths passed 100%, manual browser screenshots in `evidence/Day-07/` are pending visual capture by the trainee at `http://localhost:3000`.
2. **Single-Origin CORS Configuration:** The backend CORS configuration is set to `http://localhost:3000`. Deployments targeting other origins must set `CORS_ORIGIN` in environment configuration.
3. **Windows File Lock:** Executing `npm run build` on Windows while `npm run dev` is running causes an `EPERM` file lock on `.next/trace`. The dev server must be stopped before running production builds.
