# Daily Evidence Record — Day 02: Architecture and System Design

**Date:** 2026-11-12  
**Day / topic:** Day 02 — Architecture and System Design  
**Objective:** Design the system before implementing features across multiple layers.  

---

### What I learned:
- **Modular Monolith Principles:** Learned why a modular monolith provides the ideal balance between rapid development, transactional consistency, and architectural maintainability for a small engineering team, avoiding the premature network and operational complexities of microservices.
- **Layered Responsibilities & Dependency Rule:** Explored the unidirectional flow of dependencies: Controller $\rightarrow$ Service $\rightarrow$ Repository $\rightarrow$ Database. Understood why controllers must not contain business rules or SQL, why services must remain independent of HTTP frameworks (`req`/`res`), and why repositories exist solely for persistence.
- **Where Architecture Concerns Belong:**
  - *Validation:* Syntactic and schema validation belongs at the HTTP controller/schema boundary (Zod); domain invariant validation belongs in the Service layer.
  - *Business Rules:* Reside exclusively in the Service layer (state machine transitions, invariant enforcement).
  - *Persistence:* Resides strictly in the Repository layer (SQL queries, parameterization, transaction management).
- **Relational Data Modeling:** Designed an entity schema adhering to 3NF, utilizing UUID primary keys, check constraints, enum domains, index optimization strategies, and PostgreSQL triggers for timestamp management.
- **Contract-First API Engineering:** Documented RESTful API contracts with explicit request/response envelopes, HTTP status codes (200, 201, 400, 404, 500, 503), and structured error schemas before writing code.
- **Architecture Decision Records (ADRs):** Learned how to capture technical decisions, context, trade-offs, consequences, and review triggers using the industry-standard ADR template.

---

### What I implemented:
1. **System Architecture Specification ([`docs/architecture.md`](../../docs/architecture.md)):**
   - C4 Context and Container diagrams illustrating interactions between Next.js, Express.js API Gateway, and PostgreSQL.
   - Comprehensive layered architecture diagram with module boundaries (`src/modules/requests/`).
   - Detailed 9-step request flow trace mapping a UI submit click through to the database and back.
   - Complete folder structure specification matching the VisionRoot training guide.
   - Explicit "Owns vs Avoids" table for every architectural layer.
2. **Data Model & Persistence Specification ([`docs/data-model.md`](../../docs/data-model.md)):
   - Mermaid ER diagram showing `service_requests` (the sole MVP entity) and an explicit Post-MVP extension point (`request_audit_logs_post_mvp`).
   - Column specifications, constraints, enum definitions, and B-tree indexing strategy.
   - Comprehensive PostgreSQL DDL design reference with trigger for automated `updated_at` management (with executable migration files reserved for Day 06 per roadmap).
3. **REST API Contract & Specification ([`docs/api-contract.md`](../../docs/api-contract.md)):
   - Unified success (`{ success: true, data: ... }`) and error (`{ success: false, error: ... }`) JSON response envelopes.
   - Full specifications for all 5 endpoints:
     - `POST /api/requests` (201 Created / 400 Bad Request)
     - `GET /api/requests` (200 OK with `?status=` filtering / 400 Bad Request)
     - `GET /api/requests/:id` (200 OK / 400 Bad Request / 404 Not Found)
     - `PATCH /api/requests/:id/status` (200 OK / 400 Invalid State Transition / 404 Not Found)
     - `GET /api/health` (200 OK Healthy / 503 Service Unavailable)
4. **Architecture Decision Record ([`docs/decisions/ADR-001-architecture.md`](../../docs/decisions/ADR-001-architecture.md)):**
   - Authored ADR-001 justifying the Modular Monolith approach over Microservices, Traditional Horizontal Monolith, and Serverless architectures.
5. **Pull Request Documentation ([`evidence/Day-02/PR_DESCRIPTION.md`](PR_DESCRIPTION.md)):**
   - Prepared pull request description according to Appendix A template.

---

### Files / folders changed:
- `docs/architecture.md` (System architecture, C4 diagrams, request flow, layer boundaries)
- `docs/data-model.md` (Data dictionary, ER diagram, DDL script, indexing strategy)
- `docs/api-contract.md` (REST API endpoints, request/response JSON schemas, error codes)
- `docs/decisions/ADR-001-architecture.md` (ADR-001 on Modular Monolith vs alternatives)
- `evidence/Day-02/daily-log.md` (Day 02 daily evidence record)
- `evidence/Day-02/PR_DESCRIPTION.md` (Pull request documentation)
- `README.md` (Updated roadmap tracker with Day 02 deliverables)

---

### How I tested it:
- **Diagram Syntax Verification:** Validated all Mermaid diagrams (C4 flowcharts, ER diagrams, sequence diagrams) in markdown viewers to ensure zero rendering errors.
- **State Machine Permutation Check:** Verified that all status transitions documented in the API contract strictly match the state transition matrix established in Day 01 (`docs/requirements.md`).
- **SQL DDL Syntax Validation:** Cross-checked PostgreSQL DDL scripts against PostgreSQL 15 syntax standards (UUID generation, check constraints, indexes, triggers).
- **API Schema Consistency Audit:** Ensured that request/response payloads in `docs/api-contract.md` exactly align with data model column names and types in `docs/data-model.md`.

---

### Evidence links (screenshots, tests, diagrams):
- [Architecture Document (docs/architecture.md)](../../docs/architecture.md)
- [Data Model & ER Diagram (docs/data-model.md)](../../docs/data-model.md)
- [API Contract Specification (docs/api-contract.md)](../../docs/api-contract.md)
- [ADR-001: Modular Monolith (docs/decisions/ADR-001-architecture.md)](../../docs/decisions/ADR-001-architecture.md)
- [Day 02 PR Description (evidence/Day-02/PR_DESCRIPTION.md)](PR_DESCRIPTION.md)

---

### Architectural Trade-off and Known Risk:
- **Trade-off:**
  - *Decision:* Modular Monolith rather than Distributed Microservices.
  - *Benefit:* Eliminates network latency, removes distributed transaction failure modes, drastically simplifies local developer testing, and accelerates MVP delivery.
  - *Trade-off:* All backend modules execute within the same Node.js process and share memory and CPU.
- **Known Risk:**
  - *Risk:* Architectural boundary degradation where engineers bypass service or repository layers.
  - *Mitigation:* Explicit TypeScript interfaces (`types.ts`), strict PR reviewer checklists, and ESLint boundary rules.

---

### Problem encountered:
Determining how to handle request status transitions cleanly without leaking business workflow decisions into the controller or scattering status checks into the repository queries.

---

### How I investigated it:
Reviewed the VisionRoot training guide Section 3.2 ("Layer / component responsibilities") and compared options:
1. Handling transitions in controller switch statements.
2. Handling transitions via SQL `WHERE` clauses.
3. Encapsulating a finite state machine in a pure domain/service function (`service.ts`).

---

### Root cause:
Placing state machine rules in controllers bloats HTTP routing with business logic and prevents automated unit testing without HTTP mocks. Placing it in SQL queries makes workflow rules implicit and hard to debug.

---

### How I fixed it:
Explicitly assigned status transition validation to the **Service Layer**. The service layer receives the current status and target status, checks the transition against a defined transition table, and returns an `INVALID_STATE_TRANSITION` domain error before invoking the repository.

---

### What I would improve:
In Day 03 (GitHub Workflow & Environment Setup), establish TypeScript configuration, ESLint rules, and project directory scaffolding that programmatically enforce these architectural boundaries.

---

### GitHub branch:
`feature/day-02-architecture-and-design`

---

### Pull request:
Pull request prepared from `feature/day-02-architecture-and-design` into `main` using the standard PR template.

---

### Commit hash:
`8419ded35d9e670c8e7e3002fdc05dc0b1a6e305` (Short: `8419ded`)

---

### End-of-Day Review:
> **Question:** *Can the trainee explain where validation, business rules and persistence belong?*  
> **Answer:**  
> - **Validation:** Belongs at the **Controller / Schema Layer** (using Zod) to validate incoming HTTP payload shapes, types, and required fields before any business logic executes.
> - **Business Rules:** Belong exclusively in the **Service Layer** (e.g., state transition matrix invariants, trimming, and lifecycle checks), completely decoupled from HTTP frameworks and SQL queries.
> - **Persistence:** Belongs strictly in the **Repository Layer**, which manages SQL queries, parameterization, database connection pooling, and entity mapping.

---

### Blockers / questions for supervisor:
None. System design and architectural contracts are completely specified and ready for Day 03 environment setup.
