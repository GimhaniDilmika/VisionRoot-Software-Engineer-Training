# Day 05 — Backend API & Service Layer — Daily Log

**Date:** 2026-11-13
**Branch:** `feature/day-05-backend-api-service-layer`
**Author:** Trainee Software Engineer
**Objective:** Implement the complete Express.js REST API backend with layered architecture, state machine enforcement, comprehensive validation, and centralized error handling.

---

## What I Learned

### Layered Architecture (Route → Controller → Service → Repository)
- **Routes** (`routes.ts`): Define HTTP method + path mappings and attach middleware. Routes know nothing about business logic.
- **Controller** (`controller.ts`): The HTTP boundary layer. Extracts `req.params`, `req.query`, `req.body`, calls the service, and maps service-layer errors to HTTP status codes via a `handleServiceError` error-handling middleware.
- **Service** (`service.ts`): Contains all business logic — input validation, state machine enforcement, UUID format checks. Throws typed custom errors (`ValidationError`, `NotFoundError`, `InvalidStateTransitionError`, `InvalidIdentifierError`). Does NOT know about HTTP, Express, `req`, or `res`.
- **Repository** (`repository.ts`): Pure data access layer. In-memory CRUD for Day 05; will be swapped with PostgreSQL queries on Day 06 without changing the service layer.

### State Machine Pattern
- Defined `ALLOWED_TRANSITIONS` as a `Record<RequestStatus, RequestStatus[]>` in `types.ts`.
- Strict linear lifecycle: `OPEN → IN_PROGRESS → RESOLVED → CLOSED`.
- Each status can only advance to the **next** state. No skipping, no backward transitions.
- `CLOSED` is terminal — `ALLOWED_TRANSITIONS['CLOSED']` is an empty array.
- The service validates the requested transition before the repository updates anything.

### Express Error Handling Middleware
- Four-argument middleware `(err, req, res, next)` is how Express recognizes error handlers.
- The `handleServiceError` middleware in the controller maps domain errors to HTTP responses.
- The centralized `errorHandler` in `middleware/error-handler.ts` catches anything unhandled and returns a safe 500 with no stack trace leaking in production.

### TypeScript Strict Mode Lessons
- `req.params.id` has type `string | string[]` in strict Express typings. Resolved with `String(req.params.id)` instead of unsafe `as string` or `@ts-ignore`.
- Using `as any` for validated enum assignments (e.g., after confirming `category` is in `VALID_CATEGORIES`) is acceptable when the type system can't infer narrowing from `.includes()`.

---

## What I Implemented

### Backend Files Created/Modified

| File | Purpose |
|------|---------|
| `backend/src/app.ts` | Express app setup, middleware pipeline, health endpoint, route mounting |
| `backend/src/server.ts` | HTTP listener entry point with graceful shutdown (modified from Day 03) |
| `backend/src/middleware/error-handler.ts` | Centralized 500 error handler, no stack leaking |
| `backend/src/middleware/not-found.ts` | 404 catch-all for unmatched routes |
| `backend/src/middleware/request-logger.ts` | HTTP method/URL/status/duration logger |
| `backend/src/modules/requests/types.ts` | Domain types, state machine, valid enums |
| `backend/src/modules/requests/repository.ts` | In-memory CRUD with 5 seed records |
| `backend/src/modules/requests/service.ts` | Business logic, validation, custom errors |
| `backend/src/modules/requests/controller.ts` | HTTP boundary, error-to-status mapping |
| `backend/src/modules/requests/routes.ts` | Express Router with 4 endpoint mappings |
| `docs/api-contract.md` | Updated to v1.1.0 with strict lifecycle and Day 05 notes |

### API Endpoints Implemented

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/health` | System health check |
| `GET` | `/api/requests` | List all requests (with optional `?status=` filter) |
| `GET` | `/api/requests/:id` | Get single request by UUID |
| `POST` | `/api/requests` | Create new service request |
| `PATCH` | `/api/requests/:id/status` | Update request status (state machine enforced) |

---

## Bugs Found and Fixed

### Critical Bug: Invalid State Transitions Allowed
- **Symptom:** A request in `IN_PROGRESS` could be updated directly to `CLOSED`, skipping `RESOLVED`.
- **Root Cause:** `ALLOWED_TRANSITIONS` in `types.ts` had `IN_PROGRESS: ['RESOLVED', 'CLOSED']` and `OPEN: ['IN_PROGRESS', 'CLOSED']`.
- **Fix:** Changed to strict linear lifecycle:
  ```typescript
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: ['CLOSED'],
  CLOSED: [],
  ```
- **Verified:** 4 invalid transition tests confirm the fix.

### TypeScript Error: TS2345 on controller.ts
- **Symptom:** `req.params.id` type `string | string[]` not assignable to `string`.
- **Fix:** Wrapped with `String(req.params.id)` on lines 61 and 94.

---

## Test Results

**27/27 tests PASS** — see `evidence/Day-05/api-test-results.md` for full results.

| Section | Tests | Result |
|---------|-------|--------|
| Basic Endpoints (health, list, get-by-id) | 3 | ✅ All PASS |
| Create Request (valid + default priority) | 2 | ✅ All PASS |
| Validation Errors (8 scenarios) | 8 | ✅ All PASS |
| ID Validation (invalid UUID, unknown UUID) | 4 | ✅ All PASS |
| Valid Status Lifecycle (OPEN→…→CLOSED) | 3 | ✅ All PASS |
| Invalid Transitions (bug fix verification) | 4 | ✅ All PASS |
| Filters & Route 404 | 3 | ✅ All PASS |

### Build Verification
- `npm run type-check --workspace=backend` → **0 errors** ✅
- `npm run build --workspace=backend` → **0 errors** ✅

---

## Challenges

1. **PowerShell + curl.exe quoting:** Single-quoted JSON bodies are not properly parsed on Windows. Solved by writing JSON to a temp file and using `curl.exe -d @file`.
2. **PowerShell Invoke-WebRequest error handling:** Cannot reliably read response bodies from 4xx HTTP errors. Switched to `curl.exe` for test automation.
3. **TypeScript strict mode:** Express type definitions require careful handling of `req.params` and enum narrowing.

---

## Current Limitations (by design for Day 05)

- **In-memory persistence only** — data resets on server restart. PostgreSQL integration is Day 06.
- **No authentication or authorization** — all endpoints are publicly accessible.
- **No pagination** — `limit` and `offset` parameters documented but not enforced.
- **No automated unit tests** — tested via HTTP integration tests only.
- **Frontend still uses mock data** — frontend-backend integration is Day 07.

---

## Next Steps (Day 06+)

- Day 06: Replace in-memory repository with PostgreSQL + Knex/Prisma
- Day 07: Connect Next.js frontend to live backend API
- Future: Add authentication, pagination, rate limiting, and automated unit tests
