# Pull Request: Day 05 — Backend API & Service Layer

## Summary

Implements the complete Express.js REST API backend for the VisionRoot Service Request Management System. The backend follows a strict layered architecture (Route → Controller → Service → Repository) with comprehensive validation, state machine–enforced status transitions, and centralized error handling.

**Branch:** `feature/day-05-backend-api-service-layer`
**Base:** `main`

---

## Changes

### New Files

| File | Description |
|------|-------------|
| `backend/src/app.ts` | Express app configuration with middleware pipeline, CORS, JSON parsing, health endpoint, and request route mounting |
| `backend/src/middleware/error-handler.ts` | Centralized 500 error handler (no stack trace leaking in production) |
| `backend/src/middleware/not-found.ts` | 404 catch-all for unmatched routes |
| `backend/src/middleware/request-logger.ts` | HTTP request logging with method, URL, status, and duration |
| `backend/src/modules/requests/types.ts` | TypeScript domain types, API envelope interfaces, `ALLOWED_TRANSITIONS` state machine, valid enum arrays |
| `backend/src/modules/requests/repository.ts` | In-memory CRUD with 5 seed records matching frontend mock data |
| `backend/src/modules/requests/service.ts` | Business logic layer with custom error classes, UUID validation, field validation, state machine enforcement |
| `backend/src/modules/requests/controller.ts` | HTTP boundary layer mapping service errors to HTTP status codes |
| `backend/src/modules/requests/routes.ts` | Express Router defining 4 REST endpoints |
| `evidence/Day-05/daily-log.md` | Learning log, implementation details, bug fixes, challenges |
| `evidence/Day-05/api-test-results.md` | 27/27 API integration test results with full request/response data |
| `evidence/Day-05/PR_DESCRIPTION.md` | This file |

### Modified Files

| File | Change |
|------|--------|
| `backend/src/server.ts` | Replaced Day 03 placeholder with production-ready entry point importing `app.ts`, graceful shutdown handling |
| `docs/api-contract.md` | Updated to v1.1.0 — added strict linear state machine documentation, Day 05 implementation notes |

---

## Endpoints Implemented

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/health` | ✅ | System health check with uptime and database status |
| `GET` | `/api/requests` | ✅ | List all requests (newest first), optional `?status=` filter |
| `GET` | `/api/requests/:id` | ✅ | Get single request by UUID |
| `POST` | `/api/requests` | ✅ | Create new request with validation |
| `PATCH` | `/api/requests/:id/status` | ✅ | Update status with state machine enforcement |

---

## State Machine

```
OPEN ──→ IN_PROGRESS ──→ RESOLVED ──→ CLOSED
```

- Strict linear lifecycle — no skipping states
- No backward transitions allowed
- CLOSED is terminal — no further modifications
- Invalid transitions return `400 INVALID_STATE_TRANSITION`

---

## Validation Rules

### Create Request (`POST /api/requests`)
- **title:** Required, 5–100 characters, trimmed
- **description:** Required, 10–1000 characters, trimmed
- **category:** Required, must be `IT`, `Facilities`, or `Other`
- **priority:** Optional (defaults to `MEDIUM`), must be `LOW`, `MEDIUM`, or `HIGH`

### Status Update (`PATCH /api/requests/:id/status`)
- **id:** Must be valid UUID format
- **status:** Must be valid enum value and an allowed transition from current state

---

## Error Handling

All errors follow the standard JSON envelope:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [{ "field": "...", "message": "..." }]
  },
  "timestamp": "ISO-8601"
}
```

| Error Code | HTTP | Trigger |
|-----------|------|---------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `INVALID_IDENTIFIER` | 400 | Malformed UUID |
| `INVALID_STATE_TRANSITION` | 400 | Illegal status change |
| `NOT_FOUND` | 404 | Resource not found |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled exception |

---

## Verification Results

| Check | Result |
|-------|--------|
| TypeScript type-check (`tsc --noEmit`) | ✅ 0 errors |
| Build (`tsc`) | ✅ 0 errors |
| API integration tests | ✅ 27/27 PASS |
| State machine bug fix verified | ✅ 4 invalid transitions correctly rejected |

---

## Bug Fixed

**IN_PROGRESS → CLOSED allowed (critical):** The `ALLOWED_TRANSITIONS` map originally permitted skipping `RESOLVED`. Fixed to enforce strict linear lifecycle only.

---

## Known Limitations (by design)

- In-memory persistence — data resets on restart (PostgreSQL deferred to Day 06)
- No authentication or authorization
- No pagination enforcement (`limit`/`offset` documented but not implemented)
- Frontend still operates on mock data (integration deferred to Day 07)
