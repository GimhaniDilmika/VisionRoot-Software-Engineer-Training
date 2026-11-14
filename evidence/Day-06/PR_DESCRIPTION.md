# Pull Request: Day 06 — Database & Persistence Layer

## Summary

Implements PostgreSQL database persistence for the VisionRoot Service Request Management System. Replaces the temporary Day 05 in-memory array with live SQL queries using a resilient connection pool (`pg.Pool`), version-controlled migrations, and idempotent seed scripts. Preserves all existing REST API contracts, strict linear state machine transitions, validation boundaries, and error response envelopes.

**Branch:** `feature/day-06-postgresql-persistence`
**Base:** `main`

---

## Changes

### 1. Database Infrastructure & Schema Migrations
- **`database/migrations/001_create_service_requests.sql`**: Full DDL matching `docs/data-model.md` including `pgcrypto` extension, `service_requests` table with UUID primary key, check constraints (`title`, `description`, `category`, `priority`, `status`), 3 B-tree indexes, and auto-updating `updated_at` trigger.
- **`database/seeds/001_seed_service_requests.sql`**: Idempotent demo records with `ON CONFLICT (id) DO UPDATE`.
- **`backend/src/infrastructure/database/pool.ts`**: Singleton `pg.Pool` with connection pooling, parameterized query wrapper, non-crashing health probe, and graceful pool draining.
- **`backend/src/infrastructure/database/migrate.ts`**: Version-tracked migration runner using `schema_migrations` inside atomic transactions.
- **`backend/src/infrastructure/database/seed.ts`**: Idempotent seed runner populating demo records.

### 2. Repository Layer Swap
- **`backend/src/modules/requests/repository.ts`**: Replaced in-memory store with parameterized PostgreSQL queries (`SELECT`, `INSERT ... RETURNING`, `UPDATE ... RETURNING`).
- Normalized database `Date` columns to ISO-8601 UTC strings (`.toISOString()`) to preserve 100% API compatibility with client applications.

### 3. Server & Health Check
- **`backend/src/app.ts`**: Updated `/api/health` to dynamically query live database connectivity and latency (`status: "connected"`, `latency_ms`).
- **`backend/src/server.ts`**: Wired database pool draining (`closePool()`) to graceful shutdown handlers (`SIGINT`, `SIGTERM`).

### 4. Scripts & Documentation
- Added `npm run db:migrate` and `npm run db:seed` to backend and root `package.json`.
- Updated environment templates (`backend/.env.example`, `.env.example`) with `visionroot_service_requests`.
- Updated `README.md` marking Day 06 as completed with migration and setup runbooks.
- Recorded full 29/29 automated regression test results in `evidence/Day-06/database-test-results.md`.

---

## Verification & Test Results

| Check / Test | Command | Result |
| :--- | :--- | :---: |
| **Backend TypeScript Check** | `npm run type-check:backend` | ✅ 0 errors |
| **Backend Production Build** | `npm run build:backend` | ✅ 0 errors |
| **Frontend TypeScript Check** | `npm run type-check:frontend` | ✅ 0 errors |
| **Database Migrations** | `npm run db:migrate` | ✅ Verified in pgAdmin |
| **Database Seeding** | `npm run db:seed` | ✅ 5 records seeded |
| **System Health Check** | `GET /api/health` | ✅ `connected` (1ms latency) |
| **Automated Regression Suite** | `powershell .\scratch\day06-persistence-tests.ps1` | ✅ 29/29 PASS (100%) |
| **Process Restart Persistence** | Manual verification across server restart | ✅ Data preserved (ID: `8a917a28-...`) |

---

## State Machine & Data Invariants Confirmed

```
OPEN ──→ IN_PROGRESS ──→ RESOLVED ──→ CLOSED
```

- Strict linear status advancement enforced on live PostgreSQL data.
- Skipping states (`OPEN` $\rightarrow$ `CLOSED`, `IN_PROGRESS` $\rightarrow$ `CLOSED`) rejected with HTTP 400 `INVALID_STATE_TRANSITION`.
- Backward transitions and modifications to terminal `CLOSED` tickets rejected.
- All timestamps returned as standard ISO-8601 strings.
- Parameterized SQL prevents SQL injection vulnerabilities.

---

## Deliverables
- [`database/migrations/001_create_service_requests.sql`](../../database/migrations/001_create_service_requests.sql)
- [`database/seeds/001_seed_service_requests.sql`](../../database/seeds/001_seed_service_requests.sql)
- [`evidence/Day-06/daily-log.md`](daily-log.md)
- [`evidence/Day-06/database-test-results.md`](database-test-results.md)
