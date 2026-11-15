# Day 07 — Full-Stack Integration & Business Workflows — Daily Log

**Date:** 2026-11-15
**Branch:** `feature/day-07-fullstack-integration`
**Author:** Trainee Software Engineer
**Objective:** Connect the Next.js 14 frontend application to the live Express.js REST API and PostgreSQL 18.6 database, retire in-memory mock data, implement the professional Green + White SaaS UI redesign across all four interfaces, enforce the complete lifecycle state machine (`OPEN` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`), and verify persistence and negative validation.

---

## 1. What I Learned

### Asynchronous API Communication & Envelope Parsing
- Integrated the Next.js client-side application with the backend using a centralized API client (`requestApi.ts`).
- Adhered strictly to the uniform JSON envelope defined in `docs/api-contract.md`: `{ success: boolean, data?: T, error?: ApiError, timestamp?: string }`.
- Learned to handle asynchronous data fetching cleanly using React hooks (`useEffect`, `useState`, `useCallback`) alongside visual loading skeletons, preventing layout shift and providing immediate feedback.

### Client-Side State Preservation During Network & Validation Failures
- Designed robust form submission error handling: when an API error or network exception occurs, user inputs (`title`, `description`, `category`, `priority`) are preserved in state.
- Form clearing (`setForm(EMPTY_FORM)`) is executed strictly upon verified API success (`response.success && response.data`).
- Mapped backend field-level validation errors (`error.details`) directly to form inputs, showing inline error messages with accessible `role="alert"` attributes and programmatic focus on the first invalid field.

### State Machine Lifecycle Governance
- Enforced the strict linear request lifecycle: `OPEN → IN_PROGRESS → RESOLVED → CLOSED`.
- Synchronized frontend transition permissions (`ALLOWED_TRANSITIONS`) with backend rules. Only legally permitted actions are displayed to the user.
- Handled the terminal state (`CLOSED`) by removing status action buttons and displaying a distinct `Request Closed` notice panel.
- Verified that illegal transitions (e.g. attempting to reopen a closed ticket) are strictly rejected with HTTP 400 `INVALID_STATE_TRANSITION`.

### PostgreSQL Database Persistence & Timestamp Governance
- Verified that client mutations directly persist in PostgreSQL 18.6 table `service_requests`.
- Confirmed that automated database triggers update `updated_at` timestamps on every status modification while preserving `created_at`.
- Replaced mock statistics on the Dashboard with live database aggregation (`totalCount`, `openCount`, `inProgressCount`, `resolvedCount`, `closedCount`), ensuring 100% telemetry accuracy.

### Cross-Origin Resource Sharing (CORS) Boundaries
- Verified that CORS headers configured on the Express backend (`Access-Control-Allow-Origin: http://localhost:3000`, `Access-Control-Allow-Credentials: true`) permit legitimate frontend requests while preventing unauthorized cross-origin requests.
- Documented single-origin configuration behavior and the requirement for `CORS_ORIGIN` environment configuration when moving between development and production environments.

---

## 2. What I Implemented

### 1. Full-Stack Integration & Decoupling from Mock Data
- Verified `frontend/.env.local` configured with `NEXT_PUBLIC_API_URL=http://localhost:5000/api` (git-ignored).
- Updated [requestApi.ts](file:///c:/Users/akila/Desktop/VisionRoot-Training/frontend/src/features/requests/services/requestApi.ts) to communicate directly with the live Express server, adding `checkHealth()` for dynamic database health probes.
- Completely removed references to `mockRequests.ts` in all application routes, leaving `mockRequests.ts` strictly as an archived reference.

### 2. UI/UX Redesign Across All Four Interfaces
- **Layout & Shell (`AppShell.tsx`):** Enterprise layout with collapsible sidebar, navigation badges, breadcrumbs, responsive top header, and dynamic PostgreSQL health indicator. Suppressed duplicate "New Request" buttons when on `/requests` and `/requests/new`.
- **Home Dashboard (`/`):** 5 live PostgreSQL metric cards (Volume, Open, In Progress, Resolved, Closed), multi-segment status distribution chart using real API data percentages, compact Recent Requests section (strictly top 4 requests), and visual lifecycle workflow explanation.
- **All Requests (`/requests`):** Professional data table with search bar, clear button, real-time results counter, 4-column filter grid (`Status`, `Category`, `Priority`, `Sort Order`), reset filters action, row index (`#1`), shortened UUID with full tooltip, glowing status pills, directional priority tags, and responsive card view for mobile.
- **New Request Form (`/requests/new`):** Structured form card with green header accent stripe, triage guidance banner, 3 labelled sections (*Request Information*, *Classification*, *Detailed Explanation*), shortened priority options (`Low`, `Medium`, `High`) preventing Windows text truncation, live character counters turning amber at 90% capacity, inline field error icons, and green success confirmation panel.
- **Request Details & Status Update (`/requests/[id]`):** Dedicated Ticket Hero card with category eyebrow, shortened UUID, and 1-click `Copy ID` button with 2-second visual feedback. 4-step lifecycle stepper with connected progress track and checkmarks (`✓`). Status update panel showing `current → next` workflow, and dedicated terminal panel for `CLOSED` tickets.

---

## 3. Verification & Test Results Summary

### Part 01: Executed End-to-End Workflow API Tests (8/8 PASS)
Executed against live backend and PostgreSQL using test record `84641b37-1895-4988-8ecf-495315da64df`:
1. `POST /api/requests` → HTTP 201 Created; status `OPEN` (**PASS**)
2. `GET /api/requests/:id` → HTTP 200 OK; initial state verified (**PASS**)
3. `PATCH .../status` (`IN_PROGRESS`) → HTTP 200 OK; status updated (**PASS**)
4. `PATCH .../status` (`RESOLVED`) → HTTP 200 OK; status updated (**PASS**)
5. `PATCH .../status` (`CLOSED`) → HTTP 200 OK; status updated (**PASS**)
6. `PATCH .../status` (`OPEN`) → HTTP 400 Bad Request; terminal invariant enforced (**PASS**)
7. `GET /api/requests/:id` → HTTP 200 OK; confirmed persisted `CLOSED` state (**PASS**)
8. `GET /api/requests` → HTTP 200 OK; verified in list, total count 9 (**PASS**)

### Part 02: Negative API Tests & Database Invariants (8/8 PASS)
1. Empty title → HTTP 400 `VALIDATION_ERROR` (**PASS**)
2. Title < 5 characters → HTTP 400 `VALIDATION_ERROR` (**PASS**)
3. Description < 10 characters → HTTP 400 `VALIDATION_ERROR` (**PASS**)
4. Invalid category enum → HTTP 400 `VALIDATION_ERROR` (**PASS**)
5. Invalid priority enum → HTTP 400 `VALIDATION_ERROR` (**PASS**)
6. Nonexistent UUID → HTTP 404 `NOT_FOUND` (**PASS**)
7. Malformed UUID → HTTP 400 `INVALID_IDENTIFIER` (**PASS**)
8. Terminal status modification → HTTP 400 `INVALID_STATE_TRANSITION` (**PASS**)
- **Database Non-Pollution:** Record count verified at exactly 9 before and after negative tests.

### Part 03: Documentation Files Created
- `evidence/Day-07/workflow-test.md` (Raw HTTP responses, UUID verification, persistence logs)
- `evidence/Day-07/negative-test-results.md` (Negative testing details, non-pollution, CORS probe)
- `evidence/Day-07/browser-verification-checklist.md` (Interface-by-interface test checklist & screenshot inventory)

---

## 4. PostgreSQL Record Count State

| Stage | Record Count | Notes |
| :--- | :---: | :--- |
| **Prior to Day 07 Testing** | 8 | 5 Day 06 demo seed records + 3 user development records |
| **After Part 01 E2E Test** | 9 | Added authorized test record `84641b37-1895-4988-8ecf-495315da64df` |
| **After Part 02 Negative Tests** | 9 | Zero database pollution; count remained at 9 |

---

## 5. Remaining Manual Browser Verification Tasks

The following manual verification steps remain pending in the browser (`http://localhost:3000`):
- Capture visual browser screenshots across all 4 redesigned interfaces.
- Perform visual validation of responsive viewports on desktop and mobile.
- Verify browser-specific clipboard permission handling for the `Copy ID` button.
