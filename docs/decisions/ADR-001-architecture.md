# ADR-001: Modular Monolith Architecture for Service Request Management System

**Status:** Accepted  
**Date:** 2026-11-12  
**Deciders:** Trainee Software Engineer, Engineering Lead  
**Technical Scope:** Core System Architecture  

---

## Context
What problem or constraint needs a decision?

VisionRoot requires an internal **Service Request Management System** enabling staff to submit, track, and manage IT and Facilities requests. The application must support server-side validation, strict workflow state transitions, reliable relational database persistence, automated testing, and technical documentation within a 10-day engineering onboarding cycle.

Key constraints:
1. **Engineering Velocity & Team Size:** The system is being built and maintained initially by an individual trainee engineer. Excessive distributed infrastructure overhead would subtract time from software quality, automated testing, and clean domain design.
2. **Data Consistency:** Service requests depend on strict transactional status transitions (`OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`). Partial state updates or distributed split-brain inconsistencies cannot be tolerated.
3. **Operational Simplicity:** The project must run reliably in local development environments and support reproducible deployments without requiring complex Kubernetes orchestration, service meshes, or distributed tracing infrastructure.

---

## Decision
What approach are we choosing?

We choose a **Modular Monolith** architecture implemented with:
- **Frontend:** Next.js (React) single-page application with TypeScript and Tailwind CSS.
- **Backend:** Node.js with Express.js and TypeScript, organized into domain modules (`src/modules/requests/`).
- **Persistence:** PostgreSQL 15+ relational database accessed via a dedicated repository layer using parameterized SQL queries.

Within the backend, we enforce strict unidirectional layer separation:
$$\text{Routes / Controller} \longrightarrow \text{Validation Schema} \longrightarrow \text{Service / Business Rules} \longrightarrow \text{Repository} \longrightarrow \text{PostgreSQL}$$

Each layer has explicit ownership:
- Controllers manage HTTP serialization and status codes.
- Services own domain invariants and state transition rules.
- Repositories own database queries.

---

## Alternatives Considered
What other reasonable options were considered?

### Alternative 1: Distributed Microservices Architecture
- **Description:** Decomposing the system into independent microservices (e.g. `request-service`, `notification-service`, `user-service`, `gateway-service`), each with its own repository and database.
- **Why Rejected:** 
  - Introduces distributed systems complexities (network latency, partial failures, circuit breakers, distributed transaction sagas).
  - Unnecessary operational overhead for a system with low-to-medium internal transaction volume.
  - Per the VisionRoot engineering principle: *"Do not split into microservices just to appear advanced."*

### Alternative 2: Traditional Layered Monolith ("Horizontal Slicing" / Anemic Domain)
- **Description:** Grouping all controllers into one global folder (`/controllers`), all models in another (`/models`), and all services in another (`/services`) without bounded modular domains.
- **Why Rejected:**
  - Leads to high coupling across unrelated entities over time.
  - As features grow, files become bloated and cross-dependencies become tangled ("Spaghetti Monolith").
  - Feature-based modular monolith slicing (`/src/modules/requests/`) provides superior cohesion and isolates domain changes.

### Alternative 3: Serverless / Cloud Functions (AWS Lambda / Vercel Serverless Functions)
- **Description:** Implementing endpoints as individual stateless serverless functions.
- **Why Rejected:**
  - Cold starts introduce unpredictable latency for internal staff.
  - Managing relational database connection pools across transient serverless invocations requires external proxies (e.g. PgBouncer or AWS RDS Proxy).
  - Complicates local offline automated integration testing.

---

## Consequences
What becomes easier, harder or more expensive?

### What Becomes Easier:
- **Single Deployment & CI/CD Pipeline:** Build, lint, test, and release can be executed in a unified, deterministic pipeline.
- **ACID Transactions & Data Integrity:** Relational database transactions operate in-process with full ACID guarantees.
- **Local Developer Experience:** Developers can spin up the entire application stack using a single local database instance and standard npm scripts.
- **Automated Testing:** Integration tests run rapidly using Supertest against the Express server in memory without mocking external HTTP networks.
- **Clear Extraction Path:** Because modules are bounded (`src/modules/requests/`), if a module later requires independent scaling, it can be extracted into an independent microservice with minimal refactoring.

### What Becomes Harder or More Expensive:
- **Discipline Enforcement:** Because all backend code resides in one repository and process, developers must actively maintain boundary discipline and not bypass the service/repository layers.
- **Shared Compute Resources:** High memory or CPU utilization in one module affects the entire server process.

---

## Review Trigger
What future requirement would make us reconsider this decision?

We will re-evaluate this architectural decision if:
1. System traffic exceeds 500,000 requests/day, causing CPU/memory scaling bottlenecks that require separate horizontal scaling for specific subcomponents.
2. The engineering organization scales to multiple autonomous teams (e.g., 3+ squads) requiring independent release cadences and decoupled repository ownership.
3. Complex long-running asynchronous background processing (such as high-volume video processing or machine learning inference) demands isolated worker runtimes.
