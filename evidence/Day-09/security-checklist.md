# Day 09 — Security Checklist & Vulnerability Assessment

**Project:** VisionRoot Service Request Management System
**Branch:** `feature/day-09-security-deployment-operations`
**Date:** November 16, 2026
**Auditor:** Trainee Software Engineer (VisionRoot Training Programme)

---

## 1. Executive Summary
During Day 09, the VisionRoot Service Request Management System underwent a comprehensive security review and defense-in-depth hardening. Minimal, non-breaking architectural hardening was applied to the Express backend (`backend/src/app.ts`), sanitized environment templates were established across workspaces, Git history was audited for secrets, and operational logging was verified for non-leakage.

This document details the security controls implemented, verifies defensive test coverage, and transparently documents known architectural security limitations and dependency risks.

---

## 2. Security Controls Matrix

| Category | Security Control | Implementation Location | Verification Status |
| :--- | :--- | :--- | :--- |
| **HTTP Headers** | Disable `X-Powered-By` | `backend/src/app.ts` (`app.disable('x-powered-by')`) | **PASS** (13 integration tests in `security-headers.test.ts`) |
| **HTTP Headers** | `X-Content-Type-Options: nosniff` | `backend/src/app.ts` (global middleware) | **PASS** (verified on 200, 201, 400, 404, 503 responses) |
| **HTTP Headers** | `X-Frame-Options: DENY` | `backend/src/app.ts` (clickjacking defense) | **PASS** (verified on all endpoints and error routes) |
| **HTTP Headers** | `Referrer-Policy: strict-origin-when-cross-origin` | `backend/src/app.ts` (leakage prevention) | **PASS** (verified on all endpoints and error routes) |
| **Network CORS** | Explicit Origin & Credentials | `backend/src/app.ts` (`cors({ origin: CORS_ORIGIN, credentials: true })`) | **PASS** (preflight 204 & origin reflection verified) |
| **Input Validation** | Strict Server-Side Validation | `backend/src/modules/requests/service.ts` | **PASS** (39 unit tests in `request-validation.unit.test.ts`) |
| **UUID Validation** | RFC 4122 v4 Path Validation | `backend/src/modules/requests/service.ts` | **PASS** (rejects malformed UUIDs with HTTP 400 `INVALID_IDENTIFIER`) |
| **State Machine** | Strict Transition Enforcement | `backend/src/modules/requests/service.ts` | **PASS** (all 16 state combinations enforced; terminal `CLOSED` state locked) |
| **SQL Injection** | Parameterized SQL Queries | `backend/src/modules/requests/repository.ts` | **PASS** (all queries use `$1, $2, ...`; zero string concatenation) |
| **Information Leakage** | Production Stack Suppression | `backend/src/middleware/error-handler.ts` | **PASS** (sanitizes error envelope when `NODE_ENV=production`) |
| **Secrets Safety** | Git Exclusion of Secrets | `.gitignore` (excludes `.env`, `.env.*`, `.env.local`) | **PASS** (git audit verified zero secrets in version control) |
| **Logging Security** | Metadata-Only Request Logging | `backend/src/middleware/request-logger.ts` | **PASS** (verified request bodies and headers are not logged) |

---

## 3. Detailed Security Findings

### Finding SEC-01 (HIGH RISK — Known Assignment Scope Boundary)
- **Description:** Complete absence of Authentication, Authorization, Session Tokens, and Role-Based Access Control (RBAC).
- **Impact:** Any user or external client with network access to the API or frontend can create tickets, list all internal requests, and transition ticket statuses across all lifecycle stages.
- **Root Cause:** In accordance with the official VisionRoot 10-day training curriculum, user authentication and RBAC were deliberately excluded to focus on clean software architecture, database design, full-stack integration, and automated testing.
- **Mitigation & Deployment Boundary:**
  - **Do NOT expose this application directly to the public internet.**
  - In staging or on-premise production, place the application behind an authenticating reverse proxy (e.g., NGINX with OAuth2-Proxy, Cloudflare Access, or an API Gateway enforcing OIDC/JWT).

---

### Finding SEC-02 (RESOLVED — Health Endpoint Error Sanitization)
- **Description:** `GET /api/health` previously exposed raw database driver exception messages upon connection failure.
- **Original Vulnerability:** In `backend/src/app.ts`, `dbHealth.error` was forwarded directly to the HTTP 503 response envelope, potentially exposing usernames, hostnames, or connection strings.
- **Remediation Implemented (Day 09 Part 06B):**
  - Updated [`backend/src/app.ts`](file:///c:/Users/akila/Desktop/VisionRoot-Training/backend/src/app.ts#L64-L77) with environment-aware error sanitization:
    - In `production` (`NODE_ENV === 'production'`), error details are strictly masked to `'Database connection unavailable'`, eliminating any information disclosure to unauthenticated clients.
    - In development/test mode, connection strings and credentials are sanitized via regex masking (`password=***`, `:***@`) before being returned for debugging.
- **Status:** **RESOLVED & VERIFIED**
- **Automated Verification:** Added 2 focused integration tests in [`backend/tests/integration/health-api.test.ts`](file:///c:/Users/akila/Desktop/VisionRoot-Training/backend/tests/integration/health-api.test.ts) verifying production sanitization and credential masking under simulated database outages.

---

### Finding SEC-03 (LOW RISK — Dependency Vulnerability Audit)
- **Description:** `npm audit` reports 21 vulnerabilities (1 low, 18 moderate, 1 high, 1 critical).
- **Audit Breakdown:**
  - **`next` (<14.2.35):** Critical & high advisories regarding SSR/Server Actions and image optimizer DoS.
  - **`postcss` (<=8.5.22):** High advisory regarding XSS in sourceMappingURL comments.
  - **`glob`, `minimatch`, `deepmerge`:** Moderate advisories within `jest` and build tooling.
- **Remediation Assessment:**
  - Running `npm audit fix --force` attempts to install `next@16.4.6` and `jest@29.7.0`.
  - Upgrading to Next.js 16 is a major breaking change that destabilizes the App Router layout, TypeScript configuration, and monorepo workspace resolution.
  - Downgrading Jest to v29 introduces breaking configuration incompatibilities with `ts-jest` v29.4 and `@types/jest` v30.
- **Recommended Action:**
  - Do NOT run `npm audit fix --force`.
  - Schedule an isolated dependency upgrade spike in a dedicated release branch with full regression test verification before deploying to public networks.

---

## 4. Verification Evidence Reference
- Supertest Security Headers Suite: [`backend/tests/integration/security-headers.test.ts`](file:///c:/Users/akila/Desktop/VisionRoot-Training/backend/tests/integration/security-headers.test.ts) (13 tests PASS).
- Operational Error & Logging Safety Suite: [`backend/tests/unit/operations.unit.test.ts`](file:///c:/Users/akila/Desktop/VisionRoot-Training/backend/tests/unit/operations.unit.test.ts) (8 tests PASS).
- Health API Sanitization Regression Suite: [`backend/tests/integration/health-api.test.ts`](file:///c:/Users/akila/Desktop/VisionRoot-Training/backend/tests/integration/health-api.test.ts) (16 tests PASS).
- Full Test Suite Execution: 203 / 203 automated tests passing across 7 test suites.
