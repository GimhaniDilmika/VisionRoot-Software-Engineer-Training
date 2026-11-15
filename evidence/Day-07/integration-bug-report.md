# Day 07 — Integration Bug & Technical Investigation Report

**Date:** 2026-11-15
**Project:** VisionRoot Service Request Management System
**Branch:** `feature/day-07-fullstack-integration`
**Scope:** Technical investigation of issues encountered during Day 07 full-stack integration and UI refinements.

---

## 1. Overview & Classification Summary

This report documents the actual integration, runtime, and development environment issues observed during Day 07 full-stack development. In accordance with strict engineering standards, runtime environment conditions are clearly distinguished from application code defects, and unconfirmed root causes are explicitly identified.

| Bug / Issue ID | Summary | Classification | Impact | Status |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-D07-001** | Duplicate backend startup causing `EADDRINUSE` on port 5000 | Runtime / Environment | High (Blocked backend startup) | **RESOLVED** (Process management) |
| **BUG-D07-002** | Next.js server/client error: `TypeError: e[0] is not a function` | Client / Fast-Refresh (Unconfirmed) | Medium (Transient rendering error) | **RESOLVED / UNCONFIRMED** |
| **BUG-D07-003** | Windows file lock (`EPERM`) on `.next/trace` during `next build` | OS Filesystem / Environment | Medium (Blocked production build during dev) | **RESOLVED** (Build workflow guideline) |

---

## 2. Detailed Technical Investigations

### Issue 1: Port Collision on Backend Initialization (`EADDRINUSE`)

- **Issue Identifier:** `BUG-D07-001`
- **Component:** Express Backend (`backend/src/server.ts`)
- **Classification:** Runtime / Process Environment (Not an application code bug)
- **Observed Symptoms:**
  When attempting to start the Express development server via `npm run dev` in `backend`, the Node process crashed with:
  ```text
  Error: listen EADDRINUSE: address already in use :::5000
      at Server.setupListenHandle [as _listen2] (node:net:1898:16)
      at listenInCluster (node:net:1946:12)
      at Server.listen (node:net:2044:7)
  ```
- **Investigation:**
  1. Ran PowerShell diagnostic `Get-NetTCPConnection -LocalPort 5000` to inspect listening sockets.
  2. Identified that an orphaned background `node.exe` process (from a prior command session or task) was already holding an active TCP listener on port 5000.
  3. `server.ts` does not contain any code fault; it correctly attempts to bind to `process.env.PORT || 5000`.
- **Resolution & Mitigation:**
  - Terminated the orphaned process holding port 5000 prior to launching `ts-node-dev`.
  - Added operational checks in verification runbooks: always check `Get-NetTCPConnection -LocalPort 5000` before spawning new server processes.
  - Verified backend listener initializes cleanly on port 5000 and responds to `/api/health`.

---

### Issue 2: Next.js Fast-Refresh / Client Error (`TypeError: e[0] is not a function`)

- **Issue Identifier:** `BUG-D07-002`
- **Component:** Next.js Frontend Client Layer
- **Classification:** Transient Client-Side / Hot Module Replacement (HMR) Artifact (**Root Cause Unconfirmed**)
- **Observed Symptoms:**
  During interactive frontend development and component reloads in the browser, Next.js logged:
  ```text
  TypeError: e[0] is not a function
  ```
  This appeared during component mounting/updating under Fast Refresh.
- **Investigation:**
  1. Conducted an exhaustive static analysis of all frontend component hooks (`useState`, `useEffect`, `useCallback`) across `AppShell.tsx`, `RequestForm.tsx`, `RequestList.tsx`, `RequestCard.tsx`, `RequestFilters.tsx`, and `requests/[id]/page.tsx`.
  2. Verified that all custom callbacks and prop signatures are strongly typed in TypeScript:
     - `onSuccess?: (request: ServiceRequest) => void`
     - `onChange?: (e: React.ChangeEvent<...>) => void`
     - `onClick?: () => void`
  3. Verified that no array destructuring was performed on objects or non-iterable return values.
  4. Executed `npx tsc --noEmit` across the entire frontend: **0 errors**.
  5. Ran Next.js production build (`npm run build`): all pages compiled cleanly into static/dynamic bundles with zero compiler errors.
- **Root Cause Assessment:**
  **UNCONFIRMED.** Static code inspection and compiler diagnostics found no invalid function invocation or incorrect destructuring in the current codebase. The error likely stemmed from a transient Hot Module Replacement (HMR) state where an updated component definition was evaluated while an older React fiber tree held an incompatible prop reference during live file edits.
- **Current Status:**
  No active code defect found. The current application builds and runs cleanly without generating this error.

---

### Issue 3: Windows Filesystem File Lock (`EPERM`) on `.next/trace`

- **Issue Identifier:** `BUG-D07-003`
- **Component:** Next.js Build System (`next build`) on Windows OS
- **Classification:** Operating System Filesystem Environment (Windows Exclusive File Handle Locking)
- **Observed Symptoms:**
  Executing `npm run build` while `npm run dev` was actively running in another shell resulted in the build failing with:
  ```text
  npm : uncaughtException [Error: EPERM: operation not permitted, open 'C:\Users\akila\Desktop\VisionRoot-Training\frontend\.next\trace'] {
    errno: -4048,
    code: 'EPERM',
    syscall: 'open',
    path: 'C:\\Users\\akila\\Desktop\\VisionRoot-Training\\frontend\\.next\\trace'
  }
  ```
- **Investigation:**
  1. Investigated the file path `frontend/.next/trace`.
  2. Identified that Next.js dev server writes telemetry and performance trace events to `.next/trace`.
  3. On Windows operating systems, active processes open files with mandatory sharing restrictions that prevent other processes from overwriting or clearing active directories.
  4. When `next build` starts, it attempts to clean and write to `.next/`. Because the dev server held an open file descriptor on `.next/trace`, the OS denied write access (`EPERM -4048`).
- **Resolution & Operational Guideline:**
  - **Not a code defect.**
  - Type checking can always be verified without file collisions using `npx tsc --noEmit` (which operates purely in-memory and does not touch `.next/trace`).
  - To execute a full Next.js production build (`npm run build`), the development server process must be stopped first to release the Windows file lock.
  - Verified: Once the dev server is stopped, `npm run build` completes successfully with exit code 0 and prerenders all 6 routes.
