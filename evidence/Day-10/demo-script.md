# Day 10 — Project Demonstration Script

**Project:** VisionRoot Service Request Management System  
**Trainee:** Gimhani Dilmika  
**Date:** 2026-11-16  
**Duration:** 7–10 minutes  
**Branch:** `feature/day-10-final-review-handover`

---

## Overview

This script guides a structured walkthrough of the completed VisionRoot Service Request Management System. It covers requirements, architecture, a live end-to-end workflow, automated test evidence, security hardening, and known limitations.

---

## Segment 1 — Requirements and Problem Domain (1 minute)

**Talking points:**

- VisionRoot staff need a way to submit, track, and resolve internal IT and Facilities service requests.
- The system supports the full request lifecycle: **OPEN → IN_PROGRESS → RESOLVED → CLOSED**.
- Key non-functional requirements: validated input, consistent API responses, test coverage, secure configuration, and clear documentation.
- Built over 10 days following a structured training programme with one feature branch per day.

**Show:** `README.md` — Project Overview and Core Application Features section.

---

## Segment 2 — Architecture Walkthrough (1.5 minutes)

**Talking points:**

- **Architecture pattern:** Modular Monolith with npm workspaces (backend + frontend co-located).
- **Frontend:** Next.js 14 App Router + React 18 + TypeScript. Pages: request list, create form, request detail view.
- **Backend:** Express.js + TypeScript, layered as Controller → Service → Repository → PostgreSQL.
- **Database:** PostgreSQL 15, schema migrations via `ts-node`, optional seed data.
- **Security hardening:** HTTP security headers, environment secrets governance, production error sanitization.

**Show:** `docs/architecture.md` — Mermaid architecture diagram (Section 1–3).

**Key ports:**
| Environment | Backend | Frontend |
|---|---|---|
| Development | 5000 | 3000 |
| Production-like test | 5098 | 3098 |

---

## Segment 3 — Live End-to-End Workflow (3 minutes)

> **Setup:** Backend running on port 5000, frontend on port 3000, PostgreSQL active.

### Step 1 — Health Check
```
GET http://localhost:5000/api/health
```
Expected: `HTTP 200`, `{ status: "healthy", database: { connected: true } }`

### Step 2 — Create a New Service Request
Navigate to **http://localhost:3000** → Click **"New Request"**.

Fill in:
- **Title:** `Projector not working in Meeting Room 3`
- **Description:** `The projector in Meeting Room 3 fails to connect via HDMI to any laptop. Issue affects all daily stand-up meetings.`
- **Category:** `Facilities`
- **Priority:** `HIGH`

Submit → Expect redirect to request list showing new entry with status **OPEN**.

### Step 3 — View Request Detail
Click the new request → Confirm all fields displayed correctly with **OPEN** status badge.

### Step 4 — Status Transition via API
```
PATCH http://localhost:5000/api/requests/{id}/status
Content-Type: application/json

{ "status": "IN_PROGRESS" }
```
Expected: `HTTP 200`, status updated to **IN_PROGRESS**.

### Step 5 — Demonstrate Validation
```
POST http://localhost:5000/api/requests
Content-Type: application/json

{ "title": "Hi", "description": "Short" }
```
Expected: `HTTP 400` with `error.code: "VALIDATION_ERROR"` and `error.details` array listing field-level failures.

### Step 6 — Demonstrate Invalid Transition
```
PATCH http://localhost:5000/api/requests/{id}/status
{ "status": "CLOSED" }
```
Expected: `HTTP 400` — `INVALID_STATE_TRANSITION` (must pass through RESOLVED first).

---

## Segment 4 — Automated Test Evidence (1.5 minutes)

**Show:** Terminal output of `npm run test`.

| Suite | Tests | Result |
|---|---|---|
| `request-validation.unit.test.ts` | 39 | ✅ PASS |
| `request-lifecycle.unit.test.ts` | 38 | ✅ PASS |
| `operations.unit.test.ts` | 8 | ✅ PASS |
| `request-api.integration.test.ts` | 54 | ✅ PASS |
| `health-api.integration.test.ts` | 16 | ✅ PASS |
| `security-headers.integration.test.ts` | 13 | ✅ PASS |
| `form-validation.unit.test.ts` (frontend) | 35 | ✅ PASS |
| **Total** | **203** | **✅ 203/203 PASS** |

**Key points to mention:**
- Zero test failures, zero skipped tests.
- All database-touching tests use isolated mocks — no test data in PostgreSQL.
- TypeScript strict mode: `tsc --noEmit` exits 0 on both backend and frontend.
- Production builds pass: `tsc` (backend) and `next build` (frontend).

---

## Segment 5 — Security Hardening (1 minute)

**Show:** `evidence/Day-09/security-checklist.md`

**Key security measures implemented:**

| Control | Implementation |
|---|---|
| `X-Powered-By` suppressed | `app.disable('x-powered-by')` |
| `X-Content-Type-Options: nosniff` | Global middleware in `app.ts` |
| `X-Frame-Options: DENY` | Global middleware in `app.ts` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| Health endpoint sanitization (SEC-02) | Production: generic message, no stack/DB details |
| Environment secrets | `.env` files git-ignored; `.env.example` templates only |
| Parameterized SQL | All repository queries use `$1, $2…` placeholders |

---

## Segment 6 — Known Limitations (30 seconds)

| Risk | Severity | Note |
|---|---|---|
| No authentication or RBAC (SEC-01) | HIGH | Training scope boundary — not in requirements |
| npm audit vulnerabilities (SEC-03) | Moderate | 21 findings; `--force` fix would break builds |
| Single-origin CORS | Low | One `CORS_ORIGIN` env var — sufficient for training |
| Windows SIGTERM | Low | Graceful shutdown via SIGINT; production Linux/macOS unaffected |

**Close with:** "This project demonstrates end-to-end delivery of a full-stack TypeScript application with layered architecture, database persistence, automated testing, security hardening, and deployment documentation — all within a 10-day structured training programme."

---

## Post-Demo Q&A Topics

- How would you add authentication? → JWT middleware, `users` table, `created_by` FK on requests.
- How would you scale the database? → Connection pooling (already implemented via `pg.Pool`), read replicas, indexed queries.
- How are migrations managed? → `ts-node` migration runner in `database/migrations/`; numbered sequentially.
- What monitoring would you add in production? → Structured JSON logging, APM (Datadog/New Relic), PostgreSQL slow query log.
