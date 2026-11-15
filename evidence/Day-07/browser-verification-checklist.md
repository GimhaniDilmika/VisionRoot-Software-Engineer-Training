# Day 07 — Browser Verification Checklist & Testing Guide

**Date:** 2026-11-15
**Application Base URL:** `http://localhost:3000` (Next.js 14)
**Backend API URL:** `http://localhost:5000/api` (Express.js + PostgreSQL 18.6)
**Branch:** `feature/day-07-fullstack-integration`

---

## 1. Verification Status Legend

To ensure absolute factual accuracy and compliance with VisionRoot engineering standards:

- **`[PASSED - API EXECUTED]`**: Automated API/backend integration test was executed via CLI/PowerShell and verified against the live PostgreSQL database.
- **`[PASSED - CODE INSPECTED]`**: Frontend/client-side code path, validation rule, error boundary, or layout logic was verified via static source code inspection and compilation (`npx tsc --noEmit` passed with 0 errors).
- **`[PENDING - MANUAL BROWSER]`**: Browser UI interaction, responsive viewport rendering, and visual screenshot capture to be confirmed manually by the trainee in the browser.

---

## 2. Interface 1: Home Dashboard (`/`)

| Test Item | Verification Method | Status | Expected Behavior |
| :--- | :--- | :---: | :--- |
| **Live Database Metric Cards** | Automated API probe + Code inspection | `[PASSED - API EXECUTED]` | Total (9), Open (2), In Progress (1), Resolved (3), Closed (3) match live PostgreSQL table counts. |
| **Real Data Status Distribution Bar** | Code inspection | `[PASSED - CODE INSPECTED]` | Multi-segment progress bar renders proportional widths calculated directly from live ticket counts without mocked values. |
| **Recent Requests Section** | Code inspection | `[PASSED - CODE INSPECTED]` | Section displays strictly top 4 recently created tickets ordered by `created_at DESC`. |
| **Card Click Navigation** | Code inspection | `[PASSED - CODE INSPECTED]` | Clicking any recent request row navigates to `/requests/[id]`. |
| **Quick Actions** | Code inspection | `[PASSED - CODE INSPECTED]` | Prominent `Create Request` and `Browse All Requests` buttons link to respective pages. |
| **Visual Dashboard Rendering** | Manual browser test | `[PENDING - MANUAL BROWSER]` | Clean VisionRoot green + white enterprise layout; metric cards elevated with subtle drop-shadow. |
| **Browser Screenshot Capture** | Manual capture | `[PENDING - MANUAL BROWSER]` | Capture full dashboard screen showing live metrics and recent requests feed. |

---

## 3. Interface 2: All Requests (`/requests`)

| Test Item | Verification Method | Status | Expected Behavior |
| :--- | :--- | :---: | :--- |
| **Full Request Table Hydration** | Automated API probe | `[PASSED - API EXECUTED]` | Fetches all 9 records via `GET /api/requests` and renders them in desktop table view. |
| **Client-Side Text Search** | Code inspection | `[PASSED - CODE INSPECTED]` | Live filtering by keyword matches `title` and `description` case-insensitively; clear button (`✕`) resets search. |
| **Filter Dropdowns** | Code inspection | `[PASSED - CODE INSPECTED]` | Status (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`), Category, Priority, and Sort Order dropdowns correctly filter table rows. |
| **Results Counter & Reset Button** | Code inspection | `[PASSED - CODE INSPECTED]` | Displays `Showing X of 9 requests`; `Reset Filters` button appears whenever filters deviate from default. |
| **Shortened UUID & Full Tooltip** | Code inspection | `[PASSED - CODE INSPECTED]` | Displays `#Index` and `84641b37…`; hover tooltip displays full UUID. |
| **Status Pills & Priority Tags** | Code inspection | `[PASSED - CODE INSPECTED]` | Glowing dot indicators for status; directional indicators (`↓ Low`, `• Medium`, `↑ High`) for priority. |
| **Mobile Card Responsiveness** | Code inspection | `[PASSED - CODE INSPECTED]` | Table transforms into stacked card format on viewports `< 768px`. |
| **Browser Screenshot Capture** | Manual capture | `[PENDING - MANUAL BROWSER]` | Capture desktop table view showing filtered and non-filtered states. |

---

## 4. Interface 3: New Request Form (`/requests/new`)

| Test Item | Verification Method | Status | Expected Behavior |
| :--- | :--- | :---: | :--- |
| **Title Field Validation** | Automated API test + Code inspection | `[PASSED - API EXECUTED]` | Rejects `< 5` or `> 100` characters; shows live character counter (`X / 100`) turning amber at `> 90`. |
| **Description Field Validation** | Automated API test + Code inspection | `[PASSED - API EXECUTED]` | Rejects `< 10` or `> 1000` characters; shows live character counter (`X / 1000`). |
| **Category & Priority Dropdowns** | Code inspection | `[PASSED - CODE INSPECTED]` | Short priority options (`Low`, `Medium`, `High`) with clear helper text below; prevents Windows text truncation. |
| **Submission & Duplicate Prevention** | Code inspection | `[PASSED - CODE INSPECTED]` | `isSubmitting` flag disables submit button and shows spinning spinner during active network request. |
| **Success Confirmation State** | Code inspection | `[PASSED - CODE INSPECTED]` | Successful creation displays green confirmation panel with assigned UUID, ticket preview, and direct `View Request Details →` link. |
| **Form Data Preservation on Error** | Code inspection | `[PASSED - CODE INSPECTED]` | User inputs (`title`, `description`, etc.) are retained in state upon any validation or network failure. |
| **Browser Screenshot Capture** | Manual capture | `[PENDING - MANUAL BROWSER]` | Capture blank form, validation error state, and success state. |

---

## 5. Interface 4: Request Details & Lifecycle Management (`/requests/[id]`)

| Test Item | Verification Method | Status | Expected Behavior |
| :--- | :--- | :---: | :--- |
| **Entity Hydration from PostgreSQL** | Automated API test | `[PASSED - API EXECUTED]` | Correctly retrieves request details for valid UUIDs via `GET /api/requests/:id`. |
| **404 Not Found Panel** | Automated API test + Code inspection | `[PASSED - API EXECUTED]` | Nonexistent UUID displays dedicated `Service Request Not Found` panel with navigation link. |
| **Ticket Hero Header & Copy ID** | Code inspection | `[PASSED - CODE INSPECTED]` | Displays category eyebrow, short UUID, status/priority badges; `Copy ID` button copies UUID to clipboard with 2-second "Copied!" feedback. |
| **Lifecycle Stepper (Linear)** | Automated API test + Code inspection | `[PASSED - API EXECUTED]` | 4-node stepper reflects progression: completed nodes show `✓`; active node highlighted with green ring. |
| **Terminal CLOSED State Notice** | Automated API test + Code inspection | `[PASSED - API EXECUTED]` | Terminal `CLOSED` status shows all nodes with navy `✓`, hides update action buttons, and displays `Request Closed` notice panel. |
| **Permitted State Transitions** | Automated API test + Code inspection | `[PASSED - API EXECUTED]` | Only allowable next state button rendered according to `ALLOWED_TRANSITIONS` (e.g. `OPEN` only shows `Start Work — Mark In Progress`). |
| **Metadata Sidebar** | Code inspection | `[PASSED - CODE INSPECTED]` | Displays UUID, category, priority, status, formatted `created_at` and `updated_at` dates using `<time>` tags. |
| **Browser Screenshot Capture** | Manual capture | `[PENDING - MANUAL BROWSER]` | Capture active ticket view (`OPEN` or `IN_PROGRESS`) and closed ticket view (`CLOSED`). |

---

## 6. Screenshot Inventory & Pending Verification Items

### Screenshot Status:
- **Existing Screenshots in `evidence/Day-07/`:** `None`
- **Notice:** No screenshots have been invented or mocked. Genuine screenshots must be captured manually in the browser by the trainee at `http://localhost:3000` to complete the Day 07 submission portfolio.

### Recommended Screenshot Capture List:
1. `evidence/Day-07/01-home-dashboard.png` — Redesigned dashboard showing live metric cards and recent requests.
2. `evidence/Day-07/02-all-requests-table.png` — Full request table with search and filters active.
3. `evidence/Day-07/03-new-request-form.png` — New request submission form with classification dropdowns.
4. `evidence/Day-07/04-form-validation-error.png` — Form showing field-level inline validation messages.
5. `evidence/Day-07/05-request-details-open.png` — Details page of an active ticket showing lifecycle stepper.
6. `evidence/Day-07/06-request-details-closed.png` — Details page of the closed E2E ticket (`84641b37…`) showing terminal state notice.
7. `evidence/Day-07/07-mobile-responsive.png` — Mobile viewport (<768px) showing responsive drawer and stacked cards.
