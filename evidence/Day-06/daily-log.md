# Day 06 — Database & Persistence — Daily Log

**Date:** 2026-11-14
**Branch:** `feature/day-06-postgresql-persistence`
**Author:** Trainee Software Engineer
**Objective:** Replace Day 05 in-memory storage with PostgreSQL persistence, implement version-controlled migrations and idempotent seeds, connect the repository layer using `pg.Pool`, and verify persistence across server restarts and regression tests.

---

## What I Learned

### Connection Pooling Architecture (`pg.Pool`)
- Rather than opening and closing a direct TCP connection on every incoming HTTP request (which causes high latency, connection churn, and exhaustion under concurrency), a connection pool (`pg.Pool`) maintains a warmed pool of reusable connections.
- Parameterized pool configuration (`DB_MAX_CONNECTIONS`, `DB_IDLE_TIMEOUT_MS`, `DB_CONNECTION_TIMEOUT_MS`) provides fine-grained control over resource limits.
- Unexpected client errors in the pool must be handled via `pool.on('error', ...)` to prevent unhandled node process termination when idle connections drop or timeout.
- Graceful shutdown handles draining the connection pool with `closePool()` during server shutdown signals (`SIGINT`, `SIGTERM`).

### Version-Controlled Migrations & Version Tracking
- Built repeatable, version-controlled SQL migrations under `database/migrations/`.
- Designed a version-tracking mechanism using a dedicated `schema_migrations (id, name, applied_at)` table.
- Each migration script is executed inside an atomic database transaction (`BEGIN` ... `COMMIT`). If an error occurs, the transaction rolls back (`ROLLBACK`), preventing dirty or partial database states.
- Running `npm run db:migrate` repeatedly is completely safe (idempotent); already applied migrations are automatically detected and skipped.

### Idempotent Database Seeding
- Seed scripts under `database/seeds/001_seed_service_requests.sql` populate the 5 standard demo records.
- Using `ON CONFLICT (id) DO UPDATE SET ...` allows repeated seed executions without failing on primary key collisions or creating duplicate records.

### PostgreSQL Driver Data Normalization
- The `pg` driver automatically parses PostgreSQL `TIMESTAMPTZ` columns into JavaScript `Date` instances.
- To prevent serialization discrepancies with frontend clients and preserve Day 05 API contracts, the repository maps Date objects to standard UTC ISO-8601 strings (`.toISOString()`).
- Parameterized SQL queries (`$1`, `$2`, etc.) strictly separate query structure from user inputs, preventing SQL injection vulnerabilities.

---

## What I Implemented

### Files Created or Modified

| File | Purpose |
|------|---------|
| `backend/src/infrastructure/database/pool.ts` | Singleton connection pool, query execution wrapper, dynamic connection health check probe |
| `database/migrations/001_create_service_requests.sql` | PostgreSQL DDL from `docs/data-model.md`: `pgcrypto`, `service_requests` table, check constraints, B-tree indexes, auto `updated_at` trigger |
| `database/seeds/001_seed_service_requests.sql` | Idempotent demo records matching Day 04 and Day 05 frontend mock records |
| `backend/src/infrastructure/database/migrate.ts` | Repeatable migration runner tracking applied migrations in `schema_migrations` |
| `backend/src/infrastructure/database/seed.ts` | Repeatable seed runner populating demo records |
| `backend/src/modules/requests/repository.ts` | Swapped in-memory array with live PostgreSQL parameterized queries |
| `backend/src/app.ts` | Updated `GET /api/health` to dynamically query PostgreSQL connectivity and latency |
| `backend/src/server.ts` | Added graceful pool draining (`closePool()`) to shutdown sequence |
| `backend/.env.example` & `.env.example` | Documented PostgreSQL configuration and target database `visionroot_service_requests` |
| `backend/package.json` & `package.json` | Added `db:migrate` and `db:seed` scripts |
| `scratch/day06-persistence-tests.ps1` | Comprehensive 29-test automated regression suite testing live persistence, filtering, state transitions, and validation |
| `evidence/Day-06/database-test-results.md` | Full 29/29 test execution evidence report |
| `evidence/Day-06/PR_DESCRIPTION.md` | Pull Request description for Day 06 |
| `README.md` | Updated roadmap, status badge, directory tree, setup guide, and migration instructions |

---

## Verification & Test Results

### 1. Manual Verification
- Verified empty `public` schema in pgAdmin 4 before migration.
- Executed `npm run db:migrate` $\rightarrow$ Created `schema_migrations` and `service_requests` with indexes, constraints, and trigger.
- Executed `npm run db:seed` $\rightarrow$ Seeded 5 standard demo records.
- Verified live persistence: Created ticket `8a917a28-3d72-4729-b2cb-e3038a27e712` via API, updated status to `IN_PROGRESS`, restarted backend server, and re-fetched the ticket. All fields and timestamps survived server restart.

### 2. Automated Regression Test Suite
Executed all 29 automated integration tests:
- **Total Tests:** 29
- **Passed:** 29 (100%)
- **Failed:** 0
- Captured in `evidence/Day-06/database-test-results.md`.

### 3. Build & Type Checks
- `npm run type-check:backend` $\rightarrow$ **0 errors (PASS)**
- `npm run build:backend` $\rightarrow$ **0 errors (PASS)**
- `npm run type-check:frontend` $\rightarrow$ **0 errors (PASS)**

---

## Challenges & Solutions

1. **Timestamp Normalization:** PostgreSQL returns `Date` objects which when serialized by certain JSON serializers can format differently than client expectations. Implemented `mapRowToServiceRequest` in the repository layer to normalize all timestamps to ISO-8601 UTC strings.
2. **Migration Repeatability:** Running raw SQL scripts multiple times can fail with "relation already exists" or duplicate rows. Solved by implementing an atomic `schema_migrations` tracking table and using `ON CONFLICT DO UPDATE` for seeds.
3. **Graceful Shutdown:** Stopping the Express server leaves idle database connections open if not drained. Connected `closePool()` to `server.close()` inside SIGINT/SIGTERM handlers.

---

## Next Steps (Day 07)

- Connect the Next.js frontend client to live Express API endpoints (`/api/requests`).
- Replace mock request service on frontend with live API client.
- Test end-to-end user workflows from browser UI to PostgreSQL database.
