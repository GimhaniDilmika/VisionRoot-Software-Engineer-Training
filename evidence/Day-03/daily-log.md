# Daily Evidence Record — Day 03: GitHub Workflow and Environment Setup

**Date:** 2026-11-12  
**Day / topic:** Day 03 — GitHub Workflow and Environment Setup  
**Objective:** Make the project reproducible and establish a professional contribution workflow.  

---

### What I learned:
- **Monorepo & Workspace Orchestration:** Learned how `npm` workspaces unite frontend (Next.js) and backend (Express) within a single repository, enabling one-command dependency installation (`npm install`) and centralized script execution (`npm run build`, `npm run type-check`) without coupling runtime code.
- **Dependency Management & Hygiene:** Explored minimal dependency principles. Kept dependencies strictly lean: Express, CORS, and Dotenv for backend; Next.js 14 and React 18 for frontend; with TypeScript and type definitions in devDependencies. Resolved a security advisory by pinning Next.js to patched version `^14.2.35`.
- **Environment Security & Secret Protection:** Understood the necessity of defense-in-depth secret management. Enhanced `.gitignore` to strictly forbid `.env`, `.env.*`, and `.env.local` files while explicitly allowing `.env.example` templates (`!.env.example`). Verified that no private keys, passwords, or credentials exist in git history.
- **Reproducible Engineering Runbooks:** Practiced writing developer documentation in `README.md` that allows any new team member on Windows PowerShell or macOS/Linux to clone the repository, install dependencies, configure environment variables, and run the applications with zero guesswork.

---

### What I implemented:
1. **Git Branch & Baseline Verification:**
   - Verified that Day 02 Pull Request #2 was merged into `origin/main` (`f695a22`).
   - Synchronized local `main` via safe fast-forward pull.
   - Created clean feature branch: `feature/day-03-github-environment-setup`.
2. **Workspace & Scaffolding Configuration:**
   - Root `package.json` configured with npm workspaces: `["backend", "frontend"]`.
   - Root unified `.env.example` documenting all configuration keys.
   - Tightened root `.gitignore` protecting credentials, logs, and build artifacts.
3. **Backend Scaffolding (`backend/`):**
   - Configured `backend/package.json` and strict `backend/tsconfig.json` (ES2022).
   - Created minimal Express bootstrap server in `backend/src/server.ts` with CORS, JSON body parser, root status route (`GET /`), and basic health check probe (`GET /api/health`).
   - Created `backend/.env.example` with documented network and PostgreSQL parameters.
4. **Frontend Scaffolding (`frontend/`):**
   - Configured `frontend/package.json`, `frontend/tsconfig.json`, and `frontend/next.config.js`.
   - Created minimal Next.js App Router landing layout (`frontend/src/app/layout.tsx`) and page (`frontend/src/app/page.tsx`).
   - Created `frontend/.env.example` documenting `NEXT_PUBLIC_API_URL`.
5. **Developer Documentation (`README.md`):**
   - Added complete setup runbook for Windows PowerShell, environment variable setup, dev scripts, verification steps, and troubleshooting.
6. **Pull Request Description (`evidence/Day-03/PR_DESCRIPTION.md`):**
   - Created PR documentation following Appendix A template.

---

### Files / folders changed:
- `.gitignore` (Enhanced credential protection and whitelist for `.env.example`)
- `.env.example` (Root consolidated environment variable template)
- `package.json` (Root monorepo workspace orchestration)
- `package-lock.json` (Lockfile capturing exact dependency tree)
- `README.md` (Updated with complete developer runbook, scripts, and Day 03 progress)
- `backend/package.json` (Backend dependencies and scripts)
- `backend/tsconfig.json` (Strict TypeScript compiler options)
- `backend/.env.example` (Backend environment template)
- `backend/src/server.ts` (Express server bootstrap and health probe)
- `frontend/package.json` (Frontend dependencies and scripts)
- `frontend/tsconfig.json` (Next.js TypeScript configuration)
- `frontend/next.config.js` (Next.js configuration)
- `frontend/.env.example` (Frontend environment template)
- `frontend/src/app/layout.tsx` (Root HTML layout)
- `frontend/src/app/page.tsx` (Environment verification page)
- `evidence/Day-03/daily-log.md` (This daily evidence record)
- `evidence/Day-03/PR_DESCRIPTION.md` (Pull request documentation)

---

### Verification commands and actual results:

#### 1. Tool Version Check:
```powershell
node -v      # Result: v20.20.2
npm -v       # Result: 10.8.2
git --version # Result: git version 2.49.0.windows.1
Get-Service *postgres* # Result: Running (postgresql-x64-18)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" --version # Result: psql (PostgreSQL) 18.6
```

#### 2. TypeScript Static Type Checks:
```powershell
npm run type-check:backend
# Output:
# > backend@1.0.0 type-check
# > tsc --noEmit
# Exit Code: 0 (Success, 0 errors)

npm run type-check:frontend
# Output:
# > frontend@1.0.0 type-check
# > tsc --noEmit
# Exit Code: 0 (Success, 0 errors)
```

#### 3. Build Verification:
```powershell
npm run build:backend
# Output:
# > backend@1.0.0 build
# > tsc
# Exit Code: 0 (Compiled dist/server.js successfully)

npm run build:frontend
# Output:
# > frontend@1.0.0 build
# > next build
#   ▲ Next.js 14.2.35
#  ✓ Compiled successfully
#  ✓ Generating static pages (4/4)
#  ✓ Finalizing page optimization
# Exit Code: 0 (Success)
```

#### 4. Live Server & Endpoint Verification:
```powershell
# Tested live Express server response:
Invoke-RestMethod -Uri "http://localhost:5000/"
# Output:
# {
#   "success": true,
#   "message": "VisionRoot Service Request Management System API is running",
#   "environment": "development",
#   "timestamp": "2026-11-12T04:32:16.659Z"
# }

Invoke-RestMethod -Uri "http://localhost:5000/api/health"
# Output:
# {
#   "success": true,
#   "data": {
#     "status": "healthy",
#     "uptime_seconds": 96,
#     "timestamp": "2026-11-12T04:32:17.179Z",
#     "environment": "development"
#   }
# }
```

#### 5. Trainee Manual Verification Results:
- **Frontend UI (`http://localhost:3000`):** Manually accessed the Next.js client via web browser. Verified that the landing page renders cleanly, displays the VisionRoot project header, shows "Frontend Environment Status: Initialized", and produces zero runtime or console errors.
- **Backend API Health Probe (`http://localhost:5000/api/health`):** Manually requested the health endpoint via browser. Verified that the Express backend returns a valid `200 OK` JSON response with `status: "healthy"`, server uptime, and timestamp.

#### 6. Tracked Files & Secret Scan:
```powershell
git ls-files | Select-String "\.env"
# Result: Only .env.example templates tracked (.env.example, backend/.env.example, frontend/.env.example)
# Zero credentials or secret keys tracked.
```

---

### Screenshot & Visual Evidence References:

Visual proof-of-work captures for Day 03 verification are stored in this directory:
- **Frontend Running Verification:** [frontend-localhost-3000.png](frontend-localhost-3000.png)  
  *Captures Next.js frontend rendering at `http://localhost:3000`.*
- **Backend Health Check Verification:** [backend-health-endpoint.png](backend-health-endpoint.png)  
  *Captures Express API returning healthy JSON response at `http://localhost:5000/api/health`.*
- **Repository Tree Directory Trace:**
  ```powershell
  Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch "node_modules|\.next|dist|\.git" } | Select-Object -ExpandProperty FullName
  ```
  *Confirms clean physical folder structure without unneeded empty placeholders.*

---

### Problems investigated and real fixes:
1. **Next.js Security Advisory:**
   - *Problem:* Initial install of `next@14.2.15` warned of high/critical vulnerabilities.
   - *Investigation:* Queried npm registry tags (`npm view next dist-tags`) and identified that the Next.js 14 LTS branch released patched version `14.2.35`.
   - *Fix:* Pinned `"next": "^14.2.35"` in `frontend/package.json` and updated `package-lock.json`.
2. **PostgreSQL Binary Path on Windows:**
   - *Problem:* Running `psql` directly threw `CommandNotFoundException`.
   - *Investigation:* Checked Windows services and file system; discovered PostgreSQL 18 service (`postgresql-x64-18`) was actively running, with the binary installed at `C:\Program Files\PostgreSQL\18\bin\psql.exe`, but not included in user PATH.
   - *Fix:* Documented the full path and PATH configuration instructions in `README.md` for team developers.

---

### Decisions made:
- Selected **npm workspaces** to orchestrate both `frontend` and `backend` under one repository root. This guarantees atomic builds and shared lockfile reproducibility while maintaining architectural separation.
- Did not implement any request management features or database tables; kept Day 03 strictly focused on reproducible environment scaffolding.

---

### Risks and Mitigations:
- **Risk:** New developers forgetting to copy `.env.example` to `.env` or `.env.local`.
- **Mitigation:** Fallback defaults are configured in `server.ts` (`PORT=5000`, `NODE_ENV='development'`), and setup instructions are prominently placed at the top of `README.md`.

---

### Next steps:
- Move to **Day 04 — Frontend Architecture and UI**: Implement responsive UI components, request creation form, request list, and state management in Next.js.

---

### GitHub branch:
`feature/day-03-github-environment-setup`

---

### Pull request:
Prepared for supervisor review (`feature/day-03-github-environment-setup` $\rightarrow$ `main`).

---

### Commit hash:
- `94028b5a0fb7042562ec872da104b281cfc6fe5d` (Short: `94028b5` — Scaffolding, dependencies & environment templates)
- `a649c7ee1cf401d5dd5ea391ad31509b80c1d1ff` (Short: `a649c7e` — README runbooks & Day 03 evidence)

---

### End-of-Day Review:
> **Question:** *Can another developer clone the repository and follow the README to prepare the environment?*  
> **Answer:** **Yes.** A new developer can clone `https://github.com/GimhaniDilmika/VisionRoot-Software-Engineer-Training`, run `npm install` at the root, copy `.env.example` templates, and execute `npm run dev:backend` and `npm run dev:frontend` to have the complete stack running locally within 2 minutes.

---

### Blockers / questions for supervisor:
None. Environment setup and contribution workflows are completely verified and ready for Day 04 frontend UI implementation.
