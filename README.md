
# VisionRoot Software Engineering Training
## Service Request Management System

![Training Duration](https://img.shields.io/badge/Duration-2%20Weeks%20%2F%2010%20Days-blue)
![Role](https://img.shields.io/badge/Role-Trainee%20Software%20Engineer-green)
![Architecture](https://img.shields.io/badge/Architecture-Modular%20Monolith-orange)
![Status](https://img.shields.io/badge/Status-Day%2005%20Implemented-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

Welcome to the **VisionRoot Trainee Software Engineer Training Project**.

This repository documents a structured, 10-working-day software engineering training program focused on requirements analysis, system architecture, frontend development, backend API engineering, database design, testing, security, GitHub collaboration, and technical documentation.

The main project is a **Service Request Management System** designed for managing organizational IT and Facilities service requests.

---

## 1. Engineering Principle

> Do not only make the feature work. Make it understandable, testable, secure, maintainable, and documented.

This project follows a learn-by-building approach with daily development tasks, GitHub commits, technical documentation, and verification evidence.

---

## 2. Project Overview

The Service Request Management System is an internal web application designed to allow organization staff to:

- Submit IT and Facilities service requests.
- View submitted requests.
- Search and filter requests.
- View individual request details.
- Assign request priorities.
- Track request statuses.
- Update request statuses according to defined business rules.
- Receive validation feedback and consistent error responses.

### Current Implementation Status

**Day 01–05 implementation completed.**

The application currently contains:

- A responsive Next.js frontend.
- An Express.js REST API backend.
- Request creation, listing, retrieval, and status-update endpoints.
- Server-side input validation.
- Service-layer business rules.
- Centralized error handling.
- Temporary in-memory request storage.

**Important:** PostgreSQL persistence is not yet implemented. Database integration is scheduled for Day 06, and full frontend-backend integration is scheduled for Day 07.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 14 | Web application framework |
| UI Library | React 18 | User interface components |
| Programming Language | TypeScript | Type-safe application development |
| Backend | Node.js | JavaScript runtime |
| API Framework | Express.js | REST API development |
| Database | PostgreSQL | Planned persistent storage (Day 06) |
| Package Management | npm Workspaces | Frontend and backend management |
| Version Control | Git | Source code versioning |
| Repository Hosting | GitHub | Collaboration and evidence |
| API Testing | PowerShell Invoke-RestMethod | HTTP request and response verification |
| Development Environment | Antigravity / VS Code | Application development |

### Architecture Pattern

**Modular Monolith**

The frontend and backend are developed as separate applications within a single repository.

Backend responsibilities are divided into:

1. Routes
2. Controllers
3. Services
4. Repositories
5. Middleware

This structure supports maintainability, separation of concerns, and future database integration.

---

## 4. Repository Structure

```text
VisionRoot-Training/
│
├── README.md
├── package.json
├── package-lock.json
├── .gitignore
├── .env.example
│
├── .github/
│   └── pull_request_template.md
│
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── data-model.md
│   ├── api-contract.md
│   └── decisions/
│       └── ADR-001-architecture.md
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       │
│       ├── middleware/
│       │   ├── error-handler.ts
│       │   ├── not-found.ts
│       │   └── request-logger.ts
│       │
│       └── modules/
│           └── requests/
│               ├── routes.ts
│               ├── controller.ts
│               ├── service.ts
│               ├── repository.ts
│               └── types.ts
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── requests/
│       │       ├── page.tsx
│       │       ├── new/
│       │       │   └── page.tsx
│       │       └── [id]/
│       │           └── page.tsx
│       │
│       ├── components/
│       │   ├── layout/
│       │   └── ui/
│       │
│       └── features/
│           └── requests/
│               ├── components/
│               ├── services/
│               ├── types/
│               └── validation/
│
└── evidence/
    ├── Day-01/
    ├── Day-02/
    ├── Day-03/
    ├── Day-04/
    └── Day-05/
        ├── api-test-results.md
        ├── daily-log.md
        └── PR_DESCRIPTION.md
```

---

## 5. Installation and Environment Setup

### Prerequisites

Install the following tools:

- Node.js 20 or newer
- npm 10 or newer
- Git
- Visual Studio Code or Antigravity
- PostgreSQL (required for Day 06)

### Step 1 – Clone the Repository

```powershell
git clone https://github.com/GimhaniDilmika/VisionRoot-Software-Engineer-Training.git
cd VisionRoot-Software-Engineer-Training
```

### Step 2 – Install Dependencies

```powershell
npm install
```

The repository uses npm workspaces to manage both the frontend and backend.

### Step 3 – Configure Environment Variables

Copy the environment templates where available:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env.local
```

Configure the local environment according to the provided templates.

Never commit real passwords, API keys, or local environment files.

---

## 6. Running the Application

### Start the Backend

```powershell
npm run dev:backend
```

Default backend address:

```text
http://localhost:5000
```

### Start the Frontend

Open another terminal and run:

```powershell
npm run dev:frontend
```

Default frontend address:

```text
http://localhost:3000
```

### Development Commands

| Command | Purpose |
|---|---|
| `npm run dev:frontend` | Start Next.js development server |
| `npm run dev:backend` | Start Express development server |
| `npm run type-check:frontend` | Check frontend TypeScript |
| `npm run type-check --workspace=backend` | Check backend TypeScript |
| `npm run build:frontend` | Build Next.js application |
| `npm run build --workspace=backend` | Compile Express backend |
| `npm run --workspace=backend` | Display available backend scripts |

### Current Testing Limitation

The backend currently does not have a configured npm `test` script.

Day 05 API functionality was verified using HTTP request and response testing. An automated unit and regression testing suite is planned for further testing work.

---

## 7. Frontend Application – Day 04

The frontend was developed using Next.js, React, and TypeScript.

It uses a professional white-and-green VisionRoot interface with responsive layouts.

### Available Pages

| Route | Description |
|---|---|
| `/` | Home Page |
| `/requests` | Request List |
| `/requests/new` | Create Request Form |
| `/requests/[id]` | Request Details Page |

### Frontend Features

- Responsive navigation.
- Request statistics on the Home Page.
- Request listing and status filtering.
- Search functionality.
- Request category and priority badges.
- Individual Request Details page.
- Create Request Form.
- Required-field validation.
- Field-level error messages.
- Loading, empty, and error states.
- Mobile-friendly request cards.
- Demo Mode information.

### Responsive Design

The application has been visually checked on desktop and mobile screen sizes.

Mobile layout improvements include:

- Responsive request cards.
- Proper text wrapping.
- Mobile-friendly form fields.
- Readable status and priority badges.
- Responsive buttons and navigation.

### Demo Mode

The Day 04 frontend currently uses mock data.

Frontend operations are not yet connected to the Day 05 backend API.

Full frontend-backend integration is planned for Day 07.

### Frontend Verification

The following commands completed successfully:

```powershell
npm run type-check:frontend
npm run build:frontend
```

### Day 04 Evidence

- [Daily Work Log](evidence/Day-04/daily-log.md)
- [PR Description](evidence/Day-04/PR_DESCRIPTION.md)
- [Home Page Screenshot](evidence/Day-04/home-page.png)
- [Request List Screenshot](evidence/Day-04/request-list-desktop.png)
- [Create Request Screenshot](evidence/Day-04/create-request-form.png)
- [Validation Screenshot](evidence/Day-04/validation-error.png)
- [Mobile Responsive Screenshot](evidence/Day-04/mobile-responsive.png)
- [Request Details Screenshot](evidence/Day-04/request-details.png)

---

## 8. Backend API Development – Day 05

Day 05 focused on implementing a maintainable REST API using Express.js and TypeScript.

The backend supports service request operations independently from the frontend.

### Backend Architecture

The application follows this request processing flow:

```text
HTTP Client
     |
     v
Express Route
     |
     v
Controller
     |
     v
Service
     |
     v
Repository
     |
     v
In-Memory Request Store
```

### Layer Responsibilities

#### Routes

Defines HTTP endpoints and maps requests to controller functions.

File:

```text
backend/src/modules/requests/routes.ts
```

#### Controllers

Handles HTTP requests, route parameters, and API responses.

File:

```text
backend/src/modules/requests/controller.ts
```

#### Services

Implements request validation and business rules, including status transition validation.

File:

```text
backend/src/modules/requests/service.ts
```

#### Repository

Handles request data access using temporary in-memory storage.

File:

```text
backend/src/modules/requests/repository.ts
```

#### Middleware

Provides centralized error handling, not-found handling, and request logging.

Files:

```text
backend/src/middleware/
```

---

## 9. REST API Endpoints

The following endpoints were implemented during Day 05.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/requests` | Retrieve service requests |
| GET | `/api/requests/:id` | Retrieve a request by ID |
| POST | `/api/requests` | Create a service request |
| PATCH | `/api/requests/:id/status` | Update a request status |

See the complete API specification:

[API Contract Documentation](docs/api-contract.md)

### 9.1 Health Check

```http
GET /api/health
```

Expected successful response contains:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": {
      "status": "not_configured"
    }
  }
}
```

Additional environment, timestamp, and uptime fields are included in the actual response.

### 9.2 List Service Requests

```http
GET /api/requests
```

Returns a list of service requests.

The API also supports the implemented status-filtering behavior.

Example:

```http
GET /api/requests?status=OPEN
```

### 9.3 Get Request by ID

```http
GET /api/requests/:id
```

Returns details about an individual service request.

### 9.4 Create Service Request

```http
POST /api/requests
Content-Type: application/json
```

Example request body:

```json
{
  "title": "Laptop keyboard not working",
  "description": "Several keys on the office laptop are not responding.",
  "category": "IT",
  "priority": "HIGH"
}
```

Expected successful status:

```text
201 Created
```

New requests receive:

- A unique request ID.
- Default status `OPEN`.
- Creation timestamp.
- Updated timestamp.

The priority defaults to `MEDIUM` when a valid request omits the priority field.

### 9.5 Update Request Status

```http
PATCH /api/requests/:id/status
Content-Type: application/json
```

Example:

```json
{
  "status": "IN_PROGRESS"
}
```

The backend verifies the requested status transition before updating the record.

---

## 10. Request Status Workflow

The request lifecycle follows the agreed strict sequential workflow:

```text
OPEN
  |
  v
IN_PROGRESS
  |
  v
RESOLVED
  |
  v
CLOSED
```

### Allowed Status Transitions

| Current Status | Allowed Next Status |
|---|---|
| OPEN | IN_PROGRESS |
| IN_PROGRESS | RESOLVED |
| RESOLVED | CLOSED |
| CLOSED | None |

Invalid transitions are rejected by the backend service layer.

Examples:

```text
OPEN -> IN_PROGRESS       ALLOWED
IN_PROGRESS -> RESOLVED   ALLOWED
RESOLVED -> CLOSED        ALLOWED

OPEN -> CLOSED            REJECTED
IN_PROGRESS -> CLOSED     REJECTED
CLOSED -> OPEN            REJECTED
```

These business rules prevent requests from skipping required workflow stages.

---

## 11. Server-Side Validation and Error Handling

The backend validates incoming data before processing request operations.

Validation includes:

- Required title.
- Required description.
- Title and description length limits.
- Valid request categories.
- Valid priority values.
- Valid request IDs.
- Valid status values.
- Allowed status transitions.

### HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Request created |
| 400 | Invalid request or business rule violation |
| 404 | Resource or endpoint not found |
| 500 | Unexpected server error |

### Example Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "title",
        "message": "Title is required and cannot be blank"
      }
    ]
  }
}
```

Actual error responses also include a timestamp.

Error handling is centralized to provide consistent and safe JSON responses.

---

## 12. Backend API Testing – Day 05

The Day 05 backend was tested independently using PowerShell HTTP requests.

### Test Health API

```powershell
Invoke-RestMethod http://localhost:5000/api/health |
ConvertTo-Json -Depth 5
```

### Test Request Listing

```powershell
Invoke-RestMethod http://localhost:5000/api/requests |
ConvertTo-Json -Depth 6
```

### Test Request Creation

```powershell
$body = @{
    title = "Laptop keyboard not working"
    description = "Several keys on the office laptop are not responding."
    category = "IT"
    priority = "HIGH"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:5000/api/requests" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body |
ConvertTo-Json -Depth 6
```

### Test Invalid Input

```powershell
$invalidBody = @{
    description = "Testing missing title validation"
    category = "IT"
    priority = "HIGH"
} | ConvertTo-Json

try {
    Invoke-RestMethod `
        -Uri "http://localhost:5000/api/requests" `
        -Method POST `
        -ContentType "application/json" `
        -Body $invalidBody
}
catch {
    Write-Host "HTTP Status:" ([int]$_.Exception.Response.StatusCode)
    Write-Host "Error Response:" $_.ErrorDetails.Message
}
```

Expected status:

```text
400 Bad Request
```

### API Verification Results

The Day 05 evidence report records:

| Result | Count |
|---|---:|
| PASS | 27 |
| FAIL | 0 |
| Total | 27 |

The reported scenarios cover successful API requests, server-side validation, error responses, and status transition rules.

This is HTTP API verification evidence, not a claim that a separate automated regression test suite has been configured.

Complete results:

[Day 05 API Test Results](evidence/Day-05/api-test-results.md)

### Backend Build Verification

The following checks completed successfully:

```powershell
npm run type-check --workspace=backend
npm run build --workspace=backend
```

Both completed without TypeScript compilation errors.

---

## 13. Current Data Storage

Day 05 uses a temporary in-memory repository.

The repository includes initial demo request records.

New requests and status changes are stored in application memory during execution.

### Limitations

- Data is not stored in PostgreSQL yet.
- In-memory updates are not durable.
- Application restarts may reset data to the initial seed records.
- The frontend still uses its own mock request service.
- Full frontend-backend integration is scheduled for Day 07.

PostgreSQL schema creation, migrations, and persistent repositories are planned for Day 06.

---

## 14. GitHub Workflow

The project follows a feature-branch and pull-request workflow.

### Typical Workflow

```powershell
git switch main
git pull --ff-only origin main
git switch -c feature/day-XX-task-name
```

After implementing and verifying work:

```powershell
git status
git add .
git diff --cached --check
git commit -m "feat: describe completed work"
git push -u origin feature/day-XX-task-name
```

Only stage reviewed files. Avoid accidentally committing secrets or generated artifacts.

Create a Pull Request against `main`.

Include:

- Work completed.
- Testing performed.
- Evidence files.
- Known limitations.
- Remaining work.

Merge after the required review and verification.

---

## 15. Ten-Day Training Roadmap

| Day | Training Topic | Current Status |
|---|---|---|
| Day 01 | Requirements and SDLC | Completed |
| Day 02 | Architecture and System Design | Completed |
| Day 03 | GitHub Workflow and Environment Setup | Completed |
| Day 04 | Frontend Architecture and UI | Completed |
| Day 05 | Backend API and Service Layer | Implemented and API-verified |
| Day 06 | Database and Persistence | Planned |
| Day 07 | Full-Stack Integration and Business Workflows | Planned |
| Day 08 | Automated Testing, Debugging and Quality | Planned |
| Day 09 | Security, Deployment and Operations | Planned |
| Day 10 | Final Review, Demo and Handover | Planned |

---

## 16. Daily Training Summaries

### Day 01 – Requirements and SDLC

- Defined the Service Request Management System problem.
- Identified the main users and system requirements.
- Developed user stories and acceptance criteria.
- Created the initial product backlog.
- Documented functional and non-functional requirements.

Evidence:

[Day 01 Daily Log](evidence/Day-01/daily-log.md)

### Day 02 – Architecture and System Design

- Designed the modular monolith architecture.
- Defined frontend, backend, service, and repository responsibilities.
- Designed the proposed database ER model.
- Prepared the REST API contract.
- Documented architecture decisions in ADR-001.

Evidence:

[Day 02 Daily Log](evidence/Day-02/daily-log.md)

### Day 03 – GitHub Workflow and Environment Setup

- Configured the GitHub repository and branching workflow.
- Initialized the Next.js and Express.js projects.
- Configured TypeScript and npm workspaces.
- Added environment templates.
- Installed dependencies.
- Verified frontend and backend development environments.
- Recorded setup evidence and screenshots.

Evidence:

[Day 03 Daily Log](evidence/Day-03/daily-log.md)

### Day 04 – Frontend Architecture and UI Development

- Developed the responsive frontend using Next.js and TypeScript.
- Created the Home Page, Request List, Create Request Form, and Request Details page.
- Added reusable interface components.
- Implemented search and status filtering.
- Added form validation and clear error messages.
- Fixed Request Details navigation.
- Improved mobile responsiveness.
- Completed frontend TypeScript checking and production build.
- Uploaded UI screenshots and evidence to GitHub.

Evidence:

[Day 04 Daily Log](evidence/Day-04/daily-log.md)

### Day 05 – Backend API and Service Layer

- Developed Express.js REST APIs using TypeScript.
- Created modular routes, controllers, services, and repositories.
- Implemented service request creation, listing, retrieval, and status updates.
- Added server-side input validation.
- Implemented consistent JSON error responses.
- Added centralized error-handling middleware.
- Fixed invalid status transitions.
- Enforced the strict sequential request lifecycle.
- Successfully completed backend TypeScript checking and build.
- Documented 27 passing API test scenarios.
- Updated the API contract.
- Created Day 05 evidence and daily documentation.
- Committed and pushed the implementation to GitHub.

Evidence:

- [Day 05 Daily Log](evidence/Day-05/daily-log.md)
- [Day 05 API Test Results](evidence/Day-05/api-test-results.md)
- [Day 05 PR Description](evidence/Day-05/PR_DESCRIPTION.md)

---

## 17. Next Development Steps

### Day 06 – Database and Persistence

Planned tasks:

- Create the PostgreSQL database schema.
- Implement migration scripts.
- Configure the database connection.
- Replace temporary in-memory repository operations with PostgreSQL persistence.
- Verify database constraints.
- Verify data remains stored after application restart.
- Document database setup and migration steps.

### Day 07 – Full-Stack Integration

Planned tasks:

- Connect the Next.js frontend to the Express API.
- Replace mock frontend requests with real API operations.
- Implement complete request creation and retrieval workflows.
- Connect status update functionality.
- Verify frontend-backend error handling.

### Day 08 – Automated Testing

Planned tasks:

- Implement focused unit tests.
- Implement integration tests.
- Add regression tests for business rules.
- Verify validation and error handling.
- Document test execution and failures.

### Day 09 – Security and Deployment

Planned tasks:

- Review application security.
- Verify configuration and secret management.
- Review authorization requirements.
- Prepare deployment documentation.
- Verify environment configurations.

### Day 10 – Final Review and Handover

Planned tasks:

- Review the completed application.
- Prepare a demonstration.
- Document system architecture and results.
- Finalize technical documentation.
- Complete the training handover.

---

## 18. Troubleshooting

### Port 5000 Already in Use

If the backend reports:

```text
EADDRINUSE: address already in use :::5000
```

Identify the process:

```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen |
Select-Object LocalPort, OwningProcess
```

Inspect the owning process before stopping it:

```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen |
ForEach-Object {
    Get-CimInstance Win32_Process -Filter "ProcessId = $($_.OwningProcess)" |
    Select-Object ProcessId, Name, CommandLine
}
```

If the existing process is your intended backend server, use it instead of launching another instance.

### Next.js Build Permission Error

If a build fails because the `.next` directory is locked:

1. Stop the frontend development server.
2. Remove generated build artifacts.

```powershell
Remove-Item -Recurse -Force .\frontend\.next
```

3. Rebuild the frontend.

```powershell
npm run build:frontend
```

### PostgreSQL Not Connected

During Day 05, this status is expected:

```json
{
  "database": {
    "status": "not_configured"
  }
}
```

Database integration is planned for Day 06.

---

## 19. Evidence and Documentation

Daily work is documented in the `evidence/` directory.

Each completed training day includes development notes, implementation information, testing results, and GitHub evidence where applicable.

### Available Evidence

| Day | Documentation |
|---|---|
| Day 01 | [Daily Log](evidence/Day-01/daily-log.md) |
| Day 02 | [Daily Log](evidence/Day-02/daily-log.md) |
| Day 03 | [Daily Log](evidence/Day-03/daily-log.md) |
| Day 04 | [Daily Log](evidence/Day-04/daily-log.md) |
| Day 05 | [Daily Log](evidence/Day-05/daily-log.md) |
| Day 05 | [API Test Results](evidence/Day-05/api-test-results.md) |

### Project Documentation

- [Requirements](docs/requirements.md)
- [System Architecture](docs/architecture.md)
- [Data Model](docs/data-model.md)
- [API Contract](docs/api-contract.md)
- [Architecture Decision Record](docs/decisions/ADR-001-architecture.md)

---

## 20. Current Project Limitations

The following features are not yet fully implemented:

- PostgreSQL persistent storage.
- Full frontend-backend integration.
- Complete automated regression testing.
- Production deployment and security verification.

These items are planned for subsequent training days.

The repository represents a progressive training implementation and should not be treated as a production-ready system.

---

## 21. Conclusion

The VisionRoot Service Request Management System has completed its initial requirements, architectural design, development environment setup, frontend implementation, and backend API implementation stages.

Through Day 05, the project demonstrates:

- Layered application architecture.
- Professional responsive UI development.
- Type-safe backend development.
- REST API implementation.
- Server-side validation.
- Business rule enforcement.
- Error handling.
- API verification.
- GitHub-based development and documentation.

Further development will focus on persistent database storage, full-stack integration, automated testing, security, and final handover.

---

**Project:** VisionRoot Service Request Management System

**Training Program:** Trainee Software Engineer – 10 Working Days

**Repository:** https://github.com/GimhaniDilmika/VisionRoot-Software-Engineer-Training

**Current Progress:** Day 05 Implemented and API-Verified

**Next Stage:** Day 06 – Database and Persistence
