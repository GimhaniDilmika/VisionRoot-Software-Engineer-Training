# Pull Request — Day 04: Frontend Architecture and UI

**Branch:** `feature/day-04-frontend-architecture-ui`
**Merge target:** `main`
**Author:** VisionRoot Trainee — Gimhani Dilmika
**Date:** 2026-11-12

---

## Summary

Implements the complete Next.js 14 frontend for the VisionRoot Service Request Management System.
All UI uses a professional emerald-green and soft-gray enterprise brand palette with consistent
design tokens, responsive layouts, and full accessibility support.

---

## Pages Implemented

| Route | Description |
|-------|-------------|
| `/` | Home page — hero, stats strip, feature cards, DemoBanner |
| `/requests` | Request list — desktop data table, mobile cards, search bar, status filters |
| `/requests/new` | Create request form — validation, helper text, loading state, success state |
| `/requests/[id]` | Request detail — card layout, status/priority badges, metadata grid |

---

## Components Modified / Created

| File | Change |
|------|--------|
| `frontend/src/styles/globals.css` | Full design token system — emerald green `#16A34A`, dark navy `#1E293B`, soft-gray `#F8FAFC` |
| `frontend/src/components/layout/AppHeader.tsx` | White header, green active nav links, demo pill, responsive |
| `frontend/src/components/ui/Button.tsx` | Spinner loader, primary/secondary/outline/danger variants |
| `frontend/src/components/ui/Input.tsx` | Label, error icon, helper text, ARIA attributes |
| `frontend/src/components/ui/DemoBanner.tsx` | Yellow notice banner on all pages |
| `frontend/src/components/ui/PriorityBadge.tsx` | Low/Medium/High colour-coded badges |
| `frontend/src/features/requests/components/StatusBadge.tsx` | Dot indicator, four status colours, correct import path |
| `frontend/src/features/requests/components/RequestCard.tsx` | Desktop table row + `RequestMobileCard` for 375px viewports |
| `frontend/src/features/requests/components/RequestFilters.tsx` | Button group with active green accent |
| `frontend/src/features/requests/components/RequestList.tsx` | Loading skeleton, error alert, empty state, desktop table, mobile card list |
| `frontend/src/features/requests/components/RequestForm.tsx` | Full form with validation, character counters, success state |
| `frontend/src/app/page.tsx` | Hero, DemoBanner, stats, feature cards |
| `frontend/src/app/requests/page.tsx` | List page with search, filters, table |
| `frontend/src/app/requests/[id]/page.tsx` | Detail page with card, badges, metadata |

---

## Verification Results

| Check | Result |
|-------|--------|
| `npm run type-check:frontend` | ✅ 0 TypeScript errors |
| `npm run build:frontend` | ✅ Compiled successfully, 5 routes |
| `git diff --cached --check` | ✅ 0 whitespace violations |

### Production Build Routes
```
Route (app)                  Size     First Load JS
┌ ○ /                        1.38 kB  97.4 kB
├ ○ /requests                5.52 kB  102 kB
├ ƒ /requests/[id]           4.06 kB  100 kB
└ ○ /requests/new            5.56 kB  102 kB
```

---

## Screenshots Required

Capture these screenshots **manually** using your browser at `http://localhost:3000`
and save them to `evidence/Day-04/` with the exact filenames listed:

| Filename | What to capture |
|----------|-----------------|
| `home.png` | Full home page — hero heading, CTA buttons, feature cards |
| `requests-list-desktop.png` | `/requests` on a wide window (1280px) — table view with badges |
| `requests-list-mobile.png` | `/requests` at 375px width (Chrome DevTools) — mobile card view |
| `create-form-empty.png` | `/requests/new` — empty form with helper text |
| `create-form-errors.png` | `/requests/new` — click Submit on empty form to show validation errors |
| `create-form-success.png` | `/requests/new` — success banner after submitting a valid request |
| `request-detail.png` | `/requests/1` — detail card with metadata grid and badges |
| `demo-banner.png` | Any page showing the yellow DemoBanner |

**After saving screenshots**, run:
```bash
git add evidence/Day-04/
git commit -m "docs: add Day 04 UI screenshots and evidence"
```

---

## Functionality Preserved

- ✅ All mock data (5 seeded requests) works without backend
- ✅ Status filtering (All / Open / In Progress / Resolved / Closed)
- ✅ Client-side search on request list
- ✅ Form validation — title min 5, description min 10, required fields
- ✅ Demo mode — data resets on page reload (by design)
- ✅ Loading and error states on list and detail pages
- ✅ Empty state when no requests match filter
- ✅ No new npm dependencies added

---

## Design Reference

Based on enterprise SaaS reference screenshots provided during Day 04:
- VisionRoot emerald green `#16A34A` as primary brand colour
- Dark navy `#1E293B` for headings and primary text
- Soft-gray `#F8FAFC` for page backgrounds
- White cards with subtle `0 1px 3px` shadows and thin `#E2E8F0` borders
- Consistent spacing using 0.25rem scale
- Responsive via CSS grid `auto-fit` and mobile utility classes

---

> **Note:** Backend (Express API + PostgreSQL) will be implemented in Day 06.
> This frontend uses `mockRequestService` as a drop-in replacement matching the real API contract.
