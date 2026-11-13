# Daily Evidence Record — Day 04: Frontend Architecture and UI

**Date:** 2026-11-12
**Day / Topic:** Day 04 — Frontend Architecture and UI
**Branch:** `feature/day-04-frontend-architecture-ui`
**Objective:** Build a professional, responsive, accessible Next.js 14 frontend with feature-based architecture, covering the full request lifecycle (list, create, detail) using explicitly labelled mock data.

---

## What I Learned

- **Next.js 14 App Router:** Understood the difference between Server Components (no `'use client'`) and Client Components (`'use client'` required for `useState`, `useEffect`, event handlers). The root `layout.tsx` is a server component; interactive pages opt-in individually.
- **Feature-Based Frontend Architecture:** Learned why grouping code by domain feature (`features/requests/`) produces more maintainable software than grouping by technical layer. Each feature owns its types, validation, services, and components.
- **TypeScript Strict Mode in React:** Practiced writing fully-typed props, state, and function signatures. Discovered that incorrect relative import paths (`../../features/requests/types/request` from inside `features/requests/components/`) produce `TS2307` errors that are caught early by `tsc --noEmit`.
- **Accessible Form Design:** Implemented `aria-invalid`, `aria-describedby`, `aria-live`, `aria-pressed`, `aria-busy`, and `htmlFor`/`id` linkage. Keyboard focus is programmatically moved to the first errored field on failed submission.
- **Mock Data Strategy:** Understood the professional pattern of an in-memory mock service (`mockRequestService`) that mirrors the real API contract (`requestApi`) exactly, so Day 07 integration only requires swapping the call site — not rewriting components.
- **CSS Design Tokens:** Used CSS custom properties (`--color-primary`, `--status-open-bg`, etc.) as a design token system. This avoids hard-coding colours in component files and makes future theming straightforward.
- **Git Whitespace Hygiene:** Learned that `git diff --cached --check` detects trailing whitespace and blank-line-at-EOF violations. All files must be clean before committing for a professional repository.

---

## What I Implemented

### New Files Created

#### Pages (Next.js App Router)
| File | Purpose |
|------|---------|
| `frontend/src/app/page.tsx` | Landing home page with hero, CTA buttons, feature summary cards |
| `frontend/src/app/requests/page.tsx` | Request list page with status filter tabs and loading/empty/error states |
| `frontend/src/app/requests/new/page.tsx` | Create new request page with form card and breadcrumb |
| `frontend/src/app/requests/[id]/page.tsx` | Request detail page (US-03) with full metadata display and skeleton loading |

#### Reusable UI Components (`components/`)
| File | Purpose |
|------|---------|
| `components/layout/AppHeader.tsx` | Sticky navigation header with active-page highlighting using `usePathname()` |
| `components/ui/Button.tsx` | Multi-variant button (primary/secondary/outline/danger) with `isLoading` spinner |
| `components/ui/Input.tsx` | Accessible text input with label, error message, helper text, aria attributes |
| `components/ui/DemoBanner.tsx` | Warning banner clearly marking all pages as Demo Mode |
| `components/ui/PriorityBadge.tsx` | Colour-coded badge for HIGH/MEDIUM/LOW priority |

#### Feature Components (`features/requests/components/`)
| File | Purpose |
|------|---------|
| `StatusBadge.tsx` | Colour-coded badge for OPEN/IN\_PROGRESS/RESOLVED/CLOSED status |
| `RequestCard.tsx` | Linked article card with truncated description, badges, date, short ID |
| `RequestFilters.tsx` | Filter button group with `aria-pressed` and live count announcement |
| `RequestList.tsx` | Handles loading (skeleton), error, empty, and populated list states |
| `RequestForm.tsx` | Full create-request form with field validation, success/error states |

#### Services & Data (`features/requests/services/`)
| File | Purpose |
|------|---------|
| `mockRequests.ts` | In-memory mock service with 5 seed records, simulated async delay |
| `requestApi.ts` | Production API client ready for Day 07 integration with Express backend |

#### Types & Validation
| File | Purpose |
|------|---------|
| `features/requests/types/request.ts` | Domain types: `ServiceRequest`, DTOs, enums, `ApiResponse<T>`, `ApiError` |
| `features/requests/validation/requestValidation.ts` | `validateCreateRequest()` enforcing Day 01 data dictionary rules |

#### Styles
| File | Purpose |
|------|---------|
| `styles/globals.css` | Full CSS design token system with status/priority colours, component classes, responsive breakpoints, `@keyframes spin` and `shimmer` |

#### Updated Files
| File | Change |
|------|--------|
| `frontend/src/app/layout.tsx` | Added `import '../styles/globals.css'` to apply design tokens globally |

---

## Verification Results

### TypeScript Type Check
```
npm run type-check:frontend

> frontend@1.0.0 type-check
> tsc --noEmit

[No output = 0 errors ✅]
```

**Result: PASSED — 0 TypeScript errors**

**Notable fix during verification:**
- `StatusBadge.tsx` had incorrect import path `../../features/requests/types/request` (resolved to wrong directory). Fixed to `../types/request`. Confirmed by re-running type-check.
- `Button.tsx` contained `<style jsx>` tag (styled-jsx requires a Next.js-specific package and causes TS errors). Removed it; `@keyframes spin` moved to `globals.css`.

### Git Whitespace Check
```
git diff --cached --check
[Exit code 0 = no warnings ✅]
```

**Fixed in 20 files:**
- 15 files had a blank line at EOF (removed)
- `requestApi.ts` line 18 had trailing whitespace (removed)
- `globals.css` had trailing whitespace on 11 lines inside `:root {}` (removed)

### Production Build
```
npm run build:frontend

> frontend@1.0.0 build
> next build

▲ Next.js 14.2.35
✓ Compiled successfully
✓ Generating static pages (6/6)

Route (app)                    Size     First Load JS
┌ ○ /                          944 B          96.9 kB
├ ○ /_not-found                873 B          88.1 kB
├ ○ /requests                  4.19 kB         100 kB
├ ƒ /requests/[id]             3.74 kB        99.7 kB
└ ○ /requests/new              5.25 kB         101 kB
```

**Result: PASSED — 0 build errors** ✅

---

## Decisions Made

1. **Mock service over real API:** `mockRequestService` is used in all pages because the Express backend CRUD endpoints are not implemented until Day 07. `requestApi` is kept ready but not wired to pages yet.
2. **No Tailwind CSS:** The existing design token system using native CSS custom properties was sufficient and consistent with Day 03 choices. No new styling dependencies introduced.
3. **Detail page included:** `requests/[id]/page.tsx` was implemented because Day 01 User Story US-03 explicitly requires viewing a single request's details.
4. **DemoBanner on every page:** Every page including the list and detail pages shows the demo banner so the user always knows data is not persisted to a real database.
5. **`globals.css` import in layout.tsx:** Styles are imported once at the root layout, making them available to all pages without per-component imports.

---

## Problems and Fixes

| Problem | Fix |
|---------|-----|
| `StatusBadge.tsx` import path `../../features/requests/types/request` resolved to wrong dir | Changed to `../types/request` |
| `Button.tsx` used `<style jsx>` which requires styled-jsx package | Removed JSX style block; `@keyframes spin` added to `globals.css` |
| 15 files had trailing blank line at EOF | Fixed via PowerShell script stripping trailing newlines |
| `requestApi.ts:18` had trailing whitespace | Fixed in same PowerShell pass |
| `globals.css` had trailing whitespace on `:root {}` blank separator lines | Fixed in same PowerShell pass |
| PowerShell glob with `[id]` path treated `[id]` as regex character class | Used `-LiteralPath` parameter to handle the bracket path literally |

---

## How to Run and Test Manually

### Start the development server
```powershell
cd c:\Users\akila\Desktop\VisionRoot-Training
npm run dev:frontend
```

### Test these routes in your browser

| URL | What to verify |
|-----|---------------|
| `http://localhost:3000` | Home page loads. Hero section visible. Two CTA buttons navigate to list and form. |
| `http://localhost:3000/requests` | 5 mock requests shown. Filter buttons (All/Open/In Progress/Resolved/Closed) work. Count updates. Loading skeleton appears briefly. |
| `http://localhost:3000/requests/new` | Create form renders with Title, Description, Category, Priority fields. Submit with empty fields shows field-level validation errors. Enter valid data and submit — success state shows with request ID. |
| `http://localhost:3000/requests/[any-request-id]` | Copy an ID from the list page. Paste into URL. Detail page shows all fields, status and priority badges, timestamps. |
| Mobile layout | Open DevTools → Toggle Device Toolbar → 375px width. Verify all pages are usable. |

### Screenshots required (save manually)
Save the following files to `evidence/Day-04/` **before this evidence is committed**:

| Filename | What to capture |
|----------|----------------|
| `request-list-desktop.png` | `/requests` with all 5 requests visible |
| `create-request-form.png` | `/requests/new` form page |
| `validation-error.png` | Submit empty form — show field errors highlighted in red |
| `mobile-responsive.png` | Any page at 375px width in browser DevTools |

> **Note:** Evidence commit is intentionally held until screenshots are saved so that the supervisor sees real, non-fabricated UI evidence.

---

## Completed Tasks Checklist

- [x] Feature-based folder structure (`features/requests/`, `components/ui/`, `components/layout/`)
- [x] Domain types and enums (`request.ts`)
- [x] Field validation with Day 01 rules (`requestValidation.ts`)
- [x] In-memory mock service (`mockRequests.ts`) with 5 seed records
- [x] Production API client (`requestApi.ts`) matching `docs/api-contract.md`
- [x] CSS design token system (`globals.css`)
- [x] Reusable Button, Input, PriorityBadge, StatusBadge, AppHeader, DemoBanner
- [x] RequestCard, RequestFilters, RequestList, RequestForm components
- [x] Landing home page (`/`)
- [x] Request list page with status filtering (`/requests`)
- [x] Create request page with form (`/requests/new`)
- [x] Request detail page (`/requests/[id]`)
- [x] Loading states (skeleton animation)
- [x] Error states (alert banners)
- [x] Empty states (friendly message with emoji)
- [x] Success state (created request confirmation with ID)
- [x] Keyboard accessibility (labels, aria attributes, focus management)
- [x] Mobile responsive design (CSS grid auto-fit, responsive padding)
- [x] CSS design token system updated — emerald green `#16A34A` brand, soft-gray `#F8FAFC` background, dark navy `#1E293B` headings
- [x] StatusBadge import path corrected (`../types/request` — fixed TS2307 error)
- [x] Home page duplicate `backgroundColor` property removed (fixed TS1117 error)
- [x] DemoBanner added to home page (`/`)
- [x] TypeScript strict type-check: **0 errors** (verified 2026-11-12)
- [x] Production build: **✓ Compiled successfully**, 5 routes generated
  - `/` — 1.38 kB (97.4 kB first load)
  - `/requests` — 5.52 kB (102 kB first load)
  - `/requests/[id]` — 4.06 kB (100 kB first load)
  - `/requests/new` — 5.56 kB (102 kB first load)
- [ ] Screenshots (pending manual capture)
- [ ] Final evidence commit (pending screenshots)
