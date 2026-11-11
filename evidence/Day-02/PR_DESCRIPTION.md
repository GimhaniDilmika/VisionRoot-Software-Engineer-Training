## What changed?
- Created `docs/architecture.md`: Comprehensive system architecture specification including C4 Context/Container diagrams, modular monolith layer diagram, end-to-end request flow walkthrough, and layer responsibility boundaries ("Owns vs Avoids").
- Created `docs/data-model.md`: Database persistence specification including Mermaid ER diagram, table schemas, column invariants, enum checks, indexing strategy, and complete PostgreSQL DDL migration script.
- Created `docs/api-contract.md`: REST API contract specifying request/response JSON schemas, unified success/error envelopes, error codes dictionary, and detailed specifications for all 5 endpoints (`POST /api/requests`, `GET /api/requests`, `GET /api/requests/:id`, `PATCH /api/requests/:id/status`, `GET /api/health`).
- Created `docs/decisions/ADR-001-architecture.md`: Architecture Decision Record justifying the Modular Monolith approach and comparing against Microservices, Traditional Layered Monolith, and Serverless.
- Created `evidence/Day-02/daily-log.md`: Detailed daily evidence record covering learning notes, completed tasks, trade-off and known risk explanations, problem resolution, and the Day 02 review question.
- Updated `README.md` to record Day 02 completion and document links.

## Why is this needed?
- Fulfills Day 02 onboarding deliverables: design the system thoroughly across all layers (Frontend, Controller, Service, Repository, Database) before writing code, guaranteeing clear boundaries, data integrity, and API contracts.

## How was it tested?
- [x] Manual verification (audited state transitions, DDL script syntax, and REST contract schemas against Day 01 requirements)
- [x] Lint / format checks (verified all Mermaid diagrams, tables, and Markdown code blocks render cleanly)

## Evidence
- Architecture Spec: `docs/architecture.md`
- Data Model & DDL: `docs/data-model.md`
- API Contract: `docs/api-contract.md`
- ADR-001: `docs/decisions/ADR-001-architecture.md`
- Daily Evidence: `evidence/Day-02/daily-log.md`

## Risks and limitations
- Discipline must be maintained in Day 03 and Day 05 to ensure developers do not bypass the Service or Repository layers. TypeScript interfaces and PR reviews will enforce this boundary.

## Reviewer checklist
- [x] Responsibilities remain in the correct layers
- [x] Server-side validation and errors are handled (defined in API contract)
- [x] No secrets or debug code are included
- [x] Documentation and evidence are updated
