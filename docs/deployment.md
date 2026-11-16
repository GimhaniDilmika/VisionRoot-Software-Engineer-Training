# VisionRoot Service Request Management System — Production Build & Deployment Runbook

This operational runbook provides step-by-step guidance for setting up, building, deploying, monitoring, and troubleshooting the VisionRoot Service Request Management System in a production-like staging or self-hosted on-premise environment.

---

## 1. System Architecture & Prerequisites

### 1.1 Architecture Overview
The system is built as a **Modular Monolith** organized into npm monorepo workspaces:
- **Frontend:** Next.js 14 + React 18 + TypeScript (Client-side rendering, SSG pages, CSS Modules)
- **Backend:** Express.js + TypeScript REST API (layered controller-service-repository architecture)
- **Database:** PostgreSQL 15+ relational database with transactional migrations
- **Automated Testing:** Jest + ts-jest + Supertest test harness (193 automated tests)

### 1.2 System Prerequisites
Before deploying the application, ensure the host machine meets the following prerequisites:

| Requirement | Supported Version | Purpose | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 20.0.0` (LTS recommended) | JavaScript runtime engine | `node --version` |
| **npm** | `>= 10.0.0` | Monorepo package manager | `npm --version` |
| **PostgreSQL** | `>= 15.0` | Relational database engine | `psql --version` |
| **Operating System** | Windows Server, Linux (Ubuntu/Debian/RHEL), or macOS | Host OS | `uname -a` or `systeminfo` |

---

## 2. Repository Setup and Dependency Installation

Clone the repository and install all monorepo dependencies from the workspace root:

```bash
# 1. Clone repository
git clone https://github.com/GimhaniDilmika/VisionRoot-Software-Engineer-Training.git
cd VisionRoot-Software-Engineer-Training

# 2. Checkout the operational release branch
git checkout feature/day-09-security-deployment-operations

# 3. Install dependencies across root, backend, and frontend workspaces
npm install
```

> [!NOTE]
> Do NOT use `npm audit fix --force`, as breaking upgrades to major packages (such as Next.js or Jest) may destabilize production builds or test harnesses.

---

## 3. Environment Configuration & Secrets Safety

Environment variables must be configured before compiling or starting the services. Real secrets and passwords must **never** be committed to Git.

### 3.1 Setup Environment Files

Create the local configuration files from the sanitized templates:

**Windows PowerShell:**
```powershell
# Backend configuration
Copy-Item backend\.env.example backend\.env

# Frontend configuration
Copy-Item frontend\.env.example frontend\.env.local
```

**Bash / POSIX:**
```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env.local
```

### 3.2 Backend Configuration (`backend/.env`)

Edit `backend/.env` with your deployment environment variables:

```env
# Server Network & Runtime
PORT=5000
NODE_ENV=production

# Cross-Origin Resource Sharing (CORS)
# Must match your frontend domain or reverse proxy origin
CORS_ORIGIN=http://localhost:3000

# PostgreSQL Connection (Discrete Variables)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=visionroot_service_requests
DB_USER=postgres
DB_PASSWORD=your_actual_strong_database_password

# Connection Pool Tuning (Optional overrides)
DB_MAX_CONNECTIONS=20
DB_IDLE_TIMEOUT_MS=30000
DB_CONNECTION_TIMEOUT_MS=5000

# Consolidated Connection String (Optional - Cloud Databases)
# Takes precedence over discrete DB_* if defined
# DATABASE_URL=postgresql://postgres:password@localhost:5432/visionroot_service_requests
```

### 3.3 Frontend Configuration (`frontend/.env.local`)

Edit `frontend/.env.local` to point to the backend REST API:

```env
# Public REST API Base URL
# In production, set to your API gateway, load balancer, or reverse proxy endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> [!SECURITY]
> Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser client. Never place database passwords, API secret keys, or private certificates into `frontend/.env.local`.

---

## 4. PostgreSQL Database Setup & Migrations

### 4.1 Create Database
Connect to PostgreSQL using `psql` or an administrative client and create the dedicated database:

```sql
CREATE DATABASE visionroot_service_requests;
```

Verify connection permissions for the configured `DB_USER`:
```sql
GRANT ALL PRIVILEGES ON DATABASE visionroot_service_requests TO postgres;
```

### 4.2 Execute Transactional Schema Migrations
Run the automated schema migrations from the repository root:

```bash
npm run db:migrate
```

**What this executes:**
- Automatically ensures the `schema_migrations` tracking table exists.
- Executes `database/migrations/001_create_service_requests.sql` inside an atomic transaction.
- Creates the `service_requests` table with strict UUID primary keys, check constraints (`category`, `priority`, `status`), and automatic timestamp tracking triggers.
- Safe and idempotent: already applied migrations are skipped automatically.

### 4.3 (Optional) Seed Initial Demonstration Data
To populate initial sample service requests for verification or staging:

```bash
npm run db:seed
```

**What this executes:**
- Idempotently inserts 6 sample service requests across various statuses (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) and categories.
- Safe to re-run: duplicates are skipped via UUID conflict resolution.

---

## 5. Production Compilation and Verification

Compile TypeScript into optimized JavaScript bundles for both workspaces:

```bash
# Full monorepo production build
npm run build
```

This executes:
1. `npm run build:backend` — Compiles `backend/src/**/*.ts` into `backend/dist/` using `tsc`.
2. `npm run build:frontend` — Compiles Next.js frontend pages and assets into `frontend/.next/`.

### 5.1 Verification Checklist
Before starting the services in production mode, verify build artifacts:
- Verify `backend/dist/server.js` exists and is non-empty.
- Verify `frontend/.next/` contains compiled chunks and server routes.
- Execute automated regression test suites to guarantee code integrity:
  ```bash
  npm run test
  ```
  Expected output: **193 passed across 6 test suites**.

---

## 6. Service Startup & Process Management

### 6.1 Direct Startup Commands

To start both services in production mode:

**Terminal 1 — Backend API Service:**
```bash
npm run start:backend
```
*Expected Console Output:*
```
[VisionRoot Backend] Server initialized in production mode on port 5000
[VisionRoot Backend] Health check: http://localhost:5000/api/health
[VisionRoot Backend] API base:     http://localhost:5000/api/requests
```

**Terminal 2 — Frontend Next.js Client:**
```bash
npm run start:frontend
```
*Expected Console Output:*
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
- Environments: .env.local
✓ Ready in 450ms
```

### 6.2 Production Process Management (PM2 Recommended)
For production deployments, run the services under a process manager like **PM2** to enable auto-restart on crashes and background daemonization:

```bash
# Install PM2 globally
npm install -g pm2

# Start Backend
pm2 start backend/dist/server.js --name "visionroot-backend" --env NODE_ENV=production

# Start Frontend
pm2 start "npm" --name "visionroot-frontend" -- run start:frontend

# Save process list for system reboot recovery
pm2 save
pm2 startup
```

---

## 7. Health Endpoint Verification

Verify that the system is fully operational using `curl` or a web browser:

```bash
curl -i http://localhost:5000/api/health
```

### Expected HTTP 200 (Healthy Response):
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime_seconds": 12.4,
    "timestamp": "2026-11-16T15:30:00.000Z",
    "environment": "production",
    "database": {
      "status": "connected",
      "latency_ms": 3
    }
  }
}
```

### Verified Security Headers on Health Endpoint:
```http
HTTP/1.1 200 OK
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Content-Type: application/json; charset=utf-8
```
*(Notice: `X-Powered-By` header is completely absent).*

---

## 8. Logging, Graceful Shutdown, and Recovery

### 8.1 Logging
- All incoming HTTP requests are logged by `backend/src/middleware/request-logger.ts` with timestamp, HTTP method, URL, status code, and response latency.
- In `production` mode, internal server error stack traces are suppressed from HTTP client responses and logged exclusively to server stderr/stdout.

### 8.2 Graceful Shutdown
The Express server listens for termination signals (`SIGINT`, `SIGTERM`):
1. Stops accepting new inbound HTTP connections (`server.close()`).
2. Drains and closes all active clients in the PostgreSQL connection pool (`pool.end()`).
3. Exits with status code `0` cleanly.

### 8.3 Health Probe Degradation & Production Error Sanitization
If the PostgreSQL database connection drops while the backend is running, `GET /api/health` gracefully degrades to **HTTP 503 Service Unavailable**. In production mode (`NODE_ENV=production`), error messages are sanitized to prevent disclosing internal database connection strings, hostnames, or usernames:
```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "System health probe failed",
    "details": [
      {
        "component": "database",
        "status": "disconnected",
        "error": "Database connection unavailable"
      }
    ]
  }
}
```
This enables load balancers (e.g., AWS ALB, NGINX) to immediately route traffic away from unhealthy application nodes.

---

## 9. Backup and Rollback Guidance

### 9.1 Database Backup
Execute regular database dumps using `pg_dump`:

```bash
# Automated logical backup
pg_dump -U postgres -h localhost -d visionroot_service_requests -F c -b -v -f "visionroot_backup_$(date +%Y%m%d_%H%M%S).dump"
```

### 9.2 Database Restoration
Restore from a backup dump file:

```bash
# Restore into existing database
pg_restore -U postgres -h localhost -d visionroot_service_requests -v "visionroot_backup_YYYYMMDD_HHMMSS.dump"
```

### 9.3 Release Rollback
If a deployment defect is detected:
1. Revert to the previously verified Git commit or release tag:
   ```bash
   git checkout <previous-tag-or-commit>
   ```
2. Re-install dependencies and re-build:
   ```bash
   npm install
   npm run build
   ```
3. Restart processes via PM2 or service supervisor:
   ```bash
   pm2 restart all
   ```

---

## 10. Troubleshooting Common Setup Errors

| Issue | Symptom | Root Cause | Resolution |
| :--- | :--- | :--- | :--- |
| **Port Collision (5000 or 3000)** | `EADDRINUSE: address already in use :::5000` | Another process is occupying the port (e.g., zombie Node process or AirPlay on macOS). | Identify process using `netstat -ano \| findstr 5000` (Windows) or `lsof -i :5000` (Linux) and terminate it, or change `PORT` in `backend/.env`. |
| **Database Connection Refused** | `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL service is stopped or port is blocked by firewall. | Start PostgreSQL (`net start postgresql` on Windows, `sudo systemctl start postgresql` on Linux) and verify credentials in `backend/.env`. |
| **CORS Origin Blocked** | Browser console: `Access to fetch at ... blocked by CORS policy` | Frontend origin does not match `CORS_ORIGIN` in `backend/.env`. | Set `CORS_ORIGIN=http://localhost:3000` (or your exact frontend origin) in `backend/.env` and restart backend. |
| **Missing .env File** | Fallback defaults used or database connection fails | Developer forgot to copy `.env.example` templates. | Run `Copy-Item backend\.env.example backend\.env` and `Copy-Item frontend\.env.example frontend\.env.local`. |
| **Windows Next.js File Lock** | `EBUSY: resource locked, unlink ... .next\trace` | Windows file indexing or background process locked `.next`. | Stop development servers, delete `.next/` directory (`Remove-Item -Recurse -Force frontend\.next`), and re-run `npm run build:frontend`. |

---

## 11. Security Limitations & Safe Deployment Boundaries

1. **Authentication & Authorization Boundary:**
   - In accordance with the training syllabus, User/Admin login, JWT, sessions, and RBAC are **not implemented**.
   - Do NOT expose this application directly to the public internet without an authenticating reverse proxy (e.g., NGINX with OAuth2 Proxy or Cloudflare Access).
2. **Reverse Proxy & TLS Termination:**
   - Always run behind a reverse proxy (NGINX, Caddy, or AWS ALB) with valid HTTPS/TLS certificates.
   - Configure HTTPS redirection and HTTP Strict Transport Security (`HSTS`).
3. **Database Security:**
   - Never use default or empty database passwords in staging or production.
   - Isolate PostgreSQL in a private subnet or localhost loopback interface (`127.0.0.1`).
