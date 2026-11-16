# Day 09 Daily Log — Security, Deployment and Operations

**Trainee:** Gimhani Dilmika
**Date:** November 16, 2026
**Role:** Trainee Software Engineer
**Sprint / Module:** VisionRoot 10-Day Software Engineering Training Programme
**Branch:** `feature/day-09-security-deployment-operations`

---

## 1. Daily Objectives
- Perform security and operational inspection of the monorepo codebase.
- Implement defense-in-depth Express security hardening (disable `X-Powered-By`, inject standard defensive security headers).
- Standardize environment templates (`.env.example`) and audit Git history for credential safety.
- Author an end-to-end production build and deployment runbook ([`docs/deployment.md`](file:///c:/Users/akila/Desktop/VisionRoot-Training/docs/deployment.md)).
- Verify production-like frontend and backend startup, health checks (live and mocked), request logging safety, and graceful shutdown.
- Expand automated testing suite from 180 to 203 passing tests across 7 test suites.
- Document security findings, operational verifications, and prepare the evidence screenshot checklist.

---

## 2. Structured Activity Log

### Part 01 — Security & Deployment Readiness Inspection
- Inspected Git state: HEAD at commit `39a96f4` on `feature/day-08-automated-testing-quality`. Main branch remains at `9357572`.
- Audited codebase against standard security criteria: server-side validation, UUID checks, state machine transition enforcement, SQL parameterization, CORS policy, and secret exposures.
- Identified absence of User/Admin login, registration, JWT, and RBAC as an explicit training scope boundary.
- Selected `feature/day-08-automated-testing-quality` as the base for the Day 09 operational branch.

### Part 02 — Safe Branch Creation & Minimal Security Hardening
- Created and switched to branch `feature/day-09-security-deployment-operations`.
- Hardened [`backend/src/app.ts`](file:///c:/Users/akila/Desktop/VisionRoot-Training/backend/src/app.ts):
  - `app.disable('x-powered-by')` to eliminate server fingerprinting.
  - Added global middleware setting `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- Created [`backend/tests/integration/security-headers.test.ts`](file:///c:/Users/akila/Desktop/VisionRoot-Training/backend/tests/integration/security-headers.test.ts) adding 13 Supertest integration tests verifying headers on success (200, 201), error (400, 404, 503), and CORS preflight paths.
- Baseline test count increased from 180 to 193 passing tests.

### Part 03 — Environment Configuration & Secrets Safety
- Inspected `.gitignore` and verified that actual `.env` and `.env.local` files are strictly excluded.
- Audited Git history with `git log --all -p`: verified zero private keys, access tokens, or database passwords were ever committed.
- Updated safe, comprehensive environment templates:
  - Root: [`.env.example`](file:///c:/Users/akila/Desktop/VisionRoot-Training/.env.example)
  - Backend: [`backend/.env.example`](file:///c:/Users/akila/Desktop/VisionRoot-Training/backend/.env.example)
  - Frontend: [`frontend/.env.example`](file:///c:/Users/akila/Desktop/VisionRoot-Training/frontend/.env.example)
- Added Section 8 (Environment Configuration and Secrets Governance) to [`docs/architecture.md`](file:///c:/Users/akila/Desktop/VisionRoot-Training/docs/architecture.md).

### Part 04 — Production Build & Deployment Runbook
- Authored [`docs/deployment.md`](file:///c:/Users/akila/Desktop/VisionRoot-Training/docs/deployment.md) covering prerequisites, setup, migration execution, seeding, production compilation, PM2 process management, health probing, graceful shutdown, backup/restore, troubleshooting, and security boundaries.
- Updated root [`package.json`](file:///c:/Users/akila/Desktop/VisionRoot-Training/package.json) with root startup and testing scripts: `start:backend`, `start:frontend`, and `test`.

### Part 05 — Operations, Health Probes & Production-Like Verification
- Verified compiled backend production startup on port 5098 against live PostgreSQL (`localhost:5432`): verified HTTP 200 health probe with 3ms latency and verified all defensive headers.
- Verified compiled frontend production startup on port 3098: verified HTTP 200 response with 16.8 KB rendered page.
- Created [`backend/tests/unit/operations.unit.test.ts`](file:///c:/Users/akila/Desktop/VisionRoot-Training/backend/tests/unit/operations.unit.test.ts) with 8 focused tests covering `checkDatabaseConnection` (success and failure), `closePool` graceful shutdown, production error sanitization, and request logger non-leakage.
- Total automated tests reached **201 / 201 PASS** across 7 test suites.

### Part 06 — Documentation & Evidence Preparation
- Created `evidence/Day-09/` documentation suite:
  - `security-checklist.md`
  - `deployment-verification.md`
  - `operations-test-results.md`
  - `daily-log.md`
  - `PR_DESCRIPTION.md`
- Audited and documented confirmed security finding SEC-02 regarding raw PostgreSQL exception disclosure in HTTP 503 health probe responses.
- Prepared evidence screenshot checklist.

### Part 06B — Fix Confirmed Security Finding SEC-02
- Updated [`backend/src/app.ts`](file:///c:/Users/akila/Desktop/VisionRoot-Training/backend/src/app.ts#L64-L77) to sanitize HTTP 503 error responses:
  - In `production` (`NODE_ENV === 'production'`), error details are strictly sanitized to `'Database connection unavailable'`, completely preventing raw database driver exception messages, hostnames, usernames, or connection parameters from leaking to clients.
  - In development/test mode, connection strings and credentials are sanitized via regex masking (`password=***`, `:***@`).
- Added 2 focused integration regression tests to [`backend/tests/integration/health-api.test.ts`](file:///c:/Users/akila/Desktop/VisionRoot-Training/backend/tests/integration/health-api.test.ts) verifying production error sanitization and credential masking under simulated database outages.
- Total automated tests reached **203 / 203 PASS** across 7 test suites.
- Updated `evidence/Day-09/security-checklist.md`, `evidence/Day-09/operations-test-results.md`, and `docs/deployment.md` recording SEC-02 as RESOLVED.

---

## 3. Evidence Screenshot Checklist

### Current Evidence File Status
*(Distinguishing screenshots already captured from screenshots still required).*

| Screenshot Identifier | Description | File Path | Status |
| :--- | :--- | :--- | :--- |
| `01-security-header-tests.png` | Terminal output of 13 passing security header integration tests | `evidence/Day-09/01-security-header-tests.png` | ⏳ **Required** (Not yet captured) |
| `02-operations-unit-tests.png` | Terminal output of 8 passing operational unit tests | `evidence/Day-09/02-operations-unit-tests.png` | ⏳ **Required** (Not yet captured) |
| `03-full-test-suite.png` | Full monorepo automated test run showing 203/203 passing tests | `evidence/Day-09/03-full-test-suite.png` | ⏳ **Required** (Not yet captured) |
| `04-production-builds.png` | Terminal output of `npm run build` compiling backend and frontend | `evidence/Day-09/04-production-builds.png` | ⏳ **Required** (Not yet captured) |
| `05-backend-health-endpoint.png` | `curl -i` / browser probe of `GET /api/health` showing 200 OK & security headers | `evidence/Day-09/05-backend-health-endpoint.png` | ⏳ **Required** (Not yet captured) |
| `06-frontend-production-page.png` | Browser capture of Next.js production homepage (`http://localhost:3000`) | `evidence/Day-09/06-frontend-production-page.png` | ⏳ **Required** (Not yet captured) |

> [!IMPORTANT]
> In accordance with academic and engineering integrity standards, placeholder or simulated screenshot files are **never** created. Screenshots will be captured and placed into `evidence/Day-09/` during the evidence capture step.

### Exact PowerShell Commands for Evidence Capture

```powershell
# 1. Capture Security Header Tests
npm run test:backend:integration -- -t "Security Headers"

# 2. Capture Operations Unit Tests
npm run test:backend:unit -- tests/unit/operations.unit.test.ts

# 3. Capture Full Monorepo Test Run (203 tests across 7 suites)
npm run test

# 4. Capture Production Builds (tsc + next build)
npm run build

# 5. Capture Backend Health Endpoint & Security Headers (Requires running backend)
# Terminal A:
npm run start:backend
# Terminal B:
curl.exe -i http://localhost:5000/api/health

# 6. Capture Frontend Production View (Requires running frontend)
npm run start:frontend
# Navigate to http://localhost:3000 in browser
```

---

## 4. Key Learnings & Takeaways
1. **Defense-in-Depth Header Hardening:** Disabling server fingerprinting (`X-Powered-By`) and adding defensive framing and content-type headers mitigates automated scanning and clickjacking risks with zero overhead.
2. **Secrets Safety in Git:** Proper `.gitignore` configuration combined with sanitized `.env.example` templates is essential to prevent inadvertent credential leakage.
3. **Graceful Degradation vs Information Disclosure:** Designing health probes requires balancing operational visibility for load balancers (HTTP 503) against preventing raw database exception disclosure to unauthorized callers.
4. **Deterministic Testing:** Monorepo test suites can achieve complete architectural and operational verification in seconds through clean layer separation and in-memory repository doubles.
