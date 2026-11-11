# Daily Evidence Record — Day 01: Requirements and SDLC

**Date:** 2026-11-11  
**Day / topic:** Day 01 — Requirements and SDLC  
**Objective:** Understand the problem and define what successful completion means.  

---

### What I learned:
- **Software Development Lifecycle (SDLC):** Explored the 6 core engineering phases (Requirements, Design, Build, Test, Release, Maintenance). Understood why starting with rigorous requirements and architecture prevents costly rework in later phases.
- **Requirements Engineering:** Learned the distinction between Functional Requirements (FR - system behaviors and rules) and Non-Functional Requirements (NFR - performance, security, reliability, maintainability).
- **User Stories & INVEST Framework:** Practiced structuring user stories from the perspective of real user personas, adhering to the INVEST principles (Independent, Negotiable, Valuable, Estimable, Small, Testable).
- **Verifiable Acceptance Criteria:** Formatted acceptance criteria using Gherkin Given-When-Then syntax to explicitly specify preconditions, triggers, and expected assertions for both happy and negative paths.
- **Scope Management & Definition of Done (DoD):** Applied MoSCoW prioritization to defend the MVP boundary, and established explicit DoD criteria that separate merely "working locally" from "production-ready engineering".

---

### What I implemented:
1. **Problem Statement & Persona Definition:** Articulated the challenges of ad-hoc internal service requests and defined three distinct personas: Employee/Requester, Support Agent, and Manager/Auditor.
2. **Comprehensive Requirements Specification:** Authored `docs/requirements.md` containing:
   - 6 Core Functional Requirements (FR-01 to FR-06).
   - 5 Non-Functional Requirements (Performance, Data Integrity, Security, Usability, Clean Architecture).
   - 7 User Stories with full Given-When-Then acceptance criteria.
   - Formal State Machine and State Transition Matrix enforcing valid workflows (`OPEN` -> `IN_PROGRESS` -> `RESOLVED` -> `CLOSED`).
   - Data Dictionary with type constraints and invariants matching the recommended data model.
   - Requirement Verification & Traceability Matrix mapping each requirement to concrete test cases.
3. **Sprint Backlog Board:** Created `evidence/Day-01/backlog-board.md` detailing user story estimations (Story Points), sprint status columns, and a roadmap Gantt chart.
4. **SDLC Learning Guide:** Authored `evidence/Day-01/sdlc-learning-notes.md` documenting core SDLC concepts, INVEST criteria, and Definition of Done.
5. **Project Baseline:** Established root `README.md` and `.gitignore`.

---

### Files / folders changed:
- `README.md` (Project overview, roadmap tracker, repository directory structure)
- `.gitignore` (Exclusions for Node, build artifacts, environments, secrets, OS caches)
- `docs/requirements.md` (Complete requirements, personas, user stories, acceptance criteria, DoD)
- `evidence/Day-01/daily-log.md` (This daily evidence record)
- `evidence/Day-01/backlog-board.md` (Sprint backlog board, story points, Gantt execution roadmap)
- `evidence/Day-01/sdlc-learning-notes.md` (Deep dive on SDLC phases, INVEST, and verification)

---

### How I tested it:
- **INVEST Checklist Verification:** Audited each of the 7 user stories against INVEST criteria to ensure every story is independent, estimable, and testable.
- **State Transition Matrix Validation:** Verified all 16 state pair permutations (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) to guarantee illegal transitions are mathematically caught and documented with HTTP 400 responses.
- **Traceability Matrix Review:** Cross-referenced every functional requirement to an exact automated verification test method.
- **Formatting & Markdown Linting:** Verified that all tables, Mermaid flowcharts, state diagrams, and code snippets render without syntax errors.

---

### Evidence links (screenshots, tests, diagrams):
- [Requirements Specification (docs/requirements.md)](../../docs/requirements.md)
- [Sprint Backlog Board (evidence/Day-01/backlog-board.md)](backlog-board.md)
- [SDLC Learning Notes (evidence/Day-01/sdlc-learning-notes.md)](sdlc-learning-notes.md)
- [Project Readme (README.md)](../../README.md)

---

### Problem encountered:
During initial backlog grooming, there was a temptation to include complex peripheral features such as email notifications, OAuth2 single sign-on, and image/attachment uploads within the initial 2-week scope.

---

### How I investigated it:
Reviewed the 10-day training roadmap in Section 5 of the onboarding guide against the practical project constraints (Section 4.1). Calculated total story points and developer velocity needed for the core modular monolith architecture, database persistence, and automated test suite.

---

### Root cause:
Scope creep early in the project before foundational architecture, database schemas, and automated testing are established.

---

### How I fixed it:
Applied MoSCoW prioritization. Categorized peripheral items (attachments, third-party email webhooks, OAuth2) into Post-MVP / Future Improvements (US-07 and US-08), preserving focus on building a robust, fully-tested, and clean modular monolith MVP.

---

### What I would improve:
For Day 02 (Architecture and System Design), ensure the state machine and data model defined in `docs/requirements.md` translate seamlessly into C4 diagrams, PostgreSQL DDL schemas, and OpenAPI/REST contracts with zero conceptual mismatches.

---

### GitHub branch:
`feature/day-01-requirements-and-sdlc`

---

### Pull request:
Pull request prepared from `feature/day-01-requirements-and-sdlc` into `main` using the standard PR template.

---

### Commit hash:
`2a848aeaeb9b10c37752e43b808ed3100bc51cd0` (Short: `2a848ae`)

---

### Blockers / questions for supervisor:
None at this time. Requirements and MVP scope are unambiguously defined, and the project is positioned to begin Day 02 Architecture and System Design.
