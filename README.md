# VisionRoot Software Engineering Training: Service Request Management System

[![Training Duration](https://img.shields.io/badge/Duration-2%20Weeks%20%2F%2010%20Days-blue.svg)](https://github.com)
[![Role](https://img.shields.io/badge/Role-Trainee%20Software%20Engineer-green.svg)](https://github.com)
[![Architecture](https://img.shields.io/badge/Architecture-Modular%20Monolith-orange.svg)](https://github.com)
[![Status](https://img.shields.io/badge/Status-Day%2001%20Completed-brightgreen.svg)](https://github.com)

Welcome to the **VisionRoot Trainee Software Engineer** 10-day onboarding repository. This project follows a structured, learn-by-building pathway focused on practical web application development, software architecture, clean code, API engineering, database design, automated testing, security, and technical documentation.

---

## 🎯 Engineering Principle

> **"Do not only make the feature work. Make it understandable, testable, secure, maintainable and documented."**

---

## 📋 Project Overview: Service Request Management System

An internal full-stack web application enabling organization employees to submit, track, and manage IT and Facilities service requests. The system enforces domain business rules, validates state transitions, provides robust error handling, and persists records securely.

### Core Tech Stack
- **Frontend**: Next.js (React), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Architecture**: Modular Monolith with layered separation (Controller -> Service -> Repository -> Database)
- **Database**: PostgreSQL with schema migrations
- **Validation**: Zod / class-validator
- **Testing**: Jest / Supertest (Unit & Integration)
- **Documentation**: Markdown, Architecture Decision Records (ADRs), OpenAPI/API contracts

---

## 🗓️ 10-Day Training Roadmap & Progress Tracker

| Day | Topic | Status | Evidence / Deliverables |
| :--- | :--- | :---: | :--- |
| **Day 01** | **Requirements and SDLC** | ✅ Completed | [docs/requirements.md](docs/requirements.md), [evidence/Day-01/daily-log.md](evidence/Day-01/daily-log.md) |
| **Day 02** | **Architecture and System Design** | ⏳ Planned | `docs/architecture.md`, `docs/data-model.md`, `docs/api-contract.md`, ADR-001 |
| **Day 03** | **GitHub Workflow & Environment Setup** | ⏳ Planned | Project scaffolding, scripts, `.env.example`, lint/format setup |
| **Day 04** | **Frontend Architecture & UI** | ⏳ Planned | Next.js screens, forms, state management, UI evidence |
| **Day 05** | **Backend API & Service Layer** | ⏳ Planned | Express modules, controllers, services, error handling |
| **Day 06** | **Database & Persistence** | ⏳ Planned | PostgreSQL schema, migrations, repository integration |
| **Day 07** | **Full-Stack Integration & Business Workflows**| ⏳ Planned | End-to-end integration, status transition enforcement |
| **Day 08** | **Automated Testing, Debugging & Quality** | ⏳ Planned | Unit tests, integration tests, bug log |
| **Day 09** | **Security, Deployment & Operations** | ⏳ Planned | Security audit, health check, deployment notes |
| **Day 10** | **Final Review, Demo & Handover** | ⏳ Planned | Demo video/notes, final checklist, release handover |

---

## 📁 Repository Structure

```text
VisionRoot-Training/
├── README.md                           # Project root documentation and roadmap
├── .gitignore                          # Standard git exclusion rules
├── docs/                               # Architectural and requirement specifications
│   ├── requirements.md                 # Problem statement, personas, user stories, backlog
│   ├── architecture.md                 # (Day 02) Context/container & component diagrams
│   ├── data-model.md                   # (Day 02) Database schema and ER diagrams
│   ├── api-contract.md                 # (Day 02) Endpoint contracts and status codes
│   ├── deployment.md                   # (Day 09) Deployment guide and runbooks
│   └── decisions/                      # Architecture Decision Records (ADRs)
│       └── ADR-001-architecture.md     # (Day 02) Initial architecture decision
├── frontend/                           # (Day 04) Next.js web client
├── backend/                            # (Day 05) Express.js modular monolith backend
├── tests/                              # (Day 08) Automated test suites
│   ├── unit/                           # Unit tests
│   └── integration/                    # Integration & API tests
├── database/                           # (Day 06) Database migrations & seed scripts
│   └── migrations/
└── evidence/                           # Daily proof-of-work and learning logs
    ├── Day-01/                         # Day 01: Requirements, user stories, backlog
    │   ├── daily-log.md
    │   ├── backlog-board.md
    │   └── sdlc-learning-notes.md
    ├── Day-02/                         # Day 02: Architecture artifacts
    └── ...                             # Days 03 - 10
```

---

## 🚀 Day 01 Summary

- **Problem Definition & Persona Identification**: Documented pain points of manual email/chat based service tracking and identified key user personas (`Requester`, `Support Agent`, `System Administrator`).
- **User Stories & Acceptance Criteria**: Authored 7 granular user stories with strict Given-When-Then acceptance criteria covering submission, filtering, details view, status workflow transitions, and system health.
- **Product Backlog & MoSCoW Prioritization**: Defined MVP vs Post-MVP future enhancements to maintain realistic scope.
- **Definition of Done (DoD) & Verification Matrix**: Established rigorous standards for testability, code quality, and peer review.
- **Daily Evidence Record**: Detailed daily learning notes and submission log stored under [`evidence/Day-01/daily-log.md`](evidence/Day-01/daily-log.md).
