# Service Request Management System — Backlog Board & Sprint Planning

**Sprint Horizon:** 2-Week Engineering Training (10 Working Days)  
**Board Type:** Kanban / Scrum Hybrid Backlog Board  
**Target:** MVP Delivery by Day 10  

---

## 1. Visual Backlog & Sprint Kanban Board

```
+--------------------------------------------------------------------------------------------------------------------+
|                                              SPRINT KANBAN BOARD (DAY 01)                                          |
+------------------------------------+--------------------------+-----------------------+----------------------------+
|        PRODUCT BACKLOG             |   SPRINT READY / TODO    |      IN PROGRESS      |            DONE            |
+------------------------------------+--------------------------+-----------------------+----------------------------+
| [FUTURE] US-07: Internal Comments  | [MVP] US-01: Create      |                       | [DAY 01] Define Problem    |
|   Points: 5 | Priority: Low        |   Service Request        |                       |   Statement & Users        |
|                                    |   Points: 3 | Priority: High|                       |                            |
| [FUTURE] US-08: Authentication     |                          |                       | [DAY 01] Write 8 Detailed  |
|   & RBAC                           | [MVP] US-02: List &      |                       |   User Stories & Criteria  |
|   Points: 8 | Priority: Med        |   Filter Requests        |                       |                            |
|                                    |   Points: 3 | Priority: High|                       | [DAY 01] Prioritize MVP vs |
| [FUTURE] US-09: Notifications      |                          |                       |   Future Improvements      |
|   Points: 5 | Priority: Low        | [MVP] US-03: View Single |                       |                            |
|                                    |   Request Details        |                       | [DAY 01] Establish DoD and |
| [FUTURE] US-10: File Attachments   |   Points: 2 | Priority: High|                       |   Verification Matrix      |
|   Points: 5 | Priority: Low        |                          |                       |                            |
|                                    | [MVP] US-04: Governed    |                       |                            |
|                                    |   Status Workflow        |                       |                            |
|                                    |   Points: 5 | Priority: High|                       |                            |
|                                    |                          |                       |                            |
|                                    | [MVP] US-05: Server-Side |                       |                            |
|                                    |   Validation & Error     |                       |                            |
|                                    |   Points: 3 | Priority: High|                       |                            |
|                                    |                          |                       |                            |
|                                    | [MVP] US-06: Health Check|                       |                            |
|                                    |   Endpoint               |                       |                            |
|                                    |   Points: 1 | Priority: Med |                       |                            |
+------------------------------------+--------------------------+-----------------------+----------------------------+
```

---

## 2. Backlog Item Detail & Estimation

| Item ID | User Story Title | Estimation (SP) | Target Day | Scope Category | Complexity Driver |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **US-01** | Submit New Service Request | 3 SP | Day 04-05 | **MVP (Must Have)** | Form validation, POST API, DB insert |
| **US-02** | View and Filter Requests by Status | 3 SP | Day 04-05 | **MVP (Must Have)** | UI list, query parameters, SQL filter |
| **US-03** | View Single Request Details | 2 SP | Day 04-05 | **MVP (Must Have)** | Dynamic route, 404 handling |
| **US-04** | Status Transition Workflow Engine | 5 SP | Day 05-07 | **MVP (Must Have)** | State machine validation, PATCH endpoint |
| **US-05** | Server-Side Input Validation Schema | 3 SP | Day 05 | **MVP (Must Have)** | Zod schema validation, error response format |
| **US-06** | System Health Check (`/api/health`) | 1 SP | Day 05 | **MVP (Must Have)** | PostgreSQL ping, uptime report |
| **US-07** | Internal Notes & Activity Log | 5 SP | Post-MVP | **Future Improvement** | Multi-table join, timestamped audit log |
| **US-08** | Authentication & RBAC | 8 SP | Post-MVP | **Future Improvement** | JWT/session auth, password hashing, role guard |

**Total MVP Story Points:** 17 SP  
**Total Future Scope:** 13 SP  

---

## 3. Backlog Execution Roadmap

```mermaid
gantt
    title Service Request Management System - Training Execution Schedule
    dateFormat  YYYY-MM-DD
    section Phase 1: Planning & Design
    Day 01: Requirements & Backlog       :done,    d1, 2026-11-11, 1d
    Day 02: Architecture & ADR           :active,  d2, after d1, 1d
    Day 03: Git Workflow & Tooling Setup :         d3, after d2, 1d
    section Phase 2: Implementation
    Day 04: Next.js Frontend UI          :         d4, after d3, 1d
    Day 05: Express Backend & API        :         d5, after d4, 1d
    Day 06: PostgreSQL & Migrations      :         d6, after d5, 1d
    Day 07: Full-Stack Integration       :         d7, after d6, 1d
    section Phase 3: Quality & Release
    Day 08: Automated Testing Suite      :         d8, after d7, 1d
    Day 09: Security & Deployment        :         d9, after d8, 1d
    Day 10: Demo, Review & Handover      :         d10, after d9, 1d
```
