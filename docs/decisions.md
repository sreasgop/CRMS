# CRMS Architecture Decision Records (ADR)

This document records the critical architectural engineering decisions made during the bootstrapping of CRMS.

---

## ADR 001: Monorepo with pnpm Workspaces & TurboRepo

- **Context**: CRMS targets both web and mobile platforms with shared domain logic, UI tokens, database models, and validation schemas.
- **Decision**: Adopt pnpm workspaces with TurboRepo.
- **Rationale**: Monorepo layout eliminates package publishing overhead, guarantees type safety across frontend and backend boundaries, and speeds up build pipelines via Turborepo caching.

---

## ADR 002: Session-Based Attendance Model

- **Context**: Traditional simple attendance systems record a counter (e.g. `presents: 12, absents: 2`) directly on the student record. This causes loss of historical context and makes retroactively modifying past sessions impossible.
- **Decision**: Store every attendance event as an immutable `AttendanceSession` record with nested `AttendanceEntry` items.
- **Rationale**: Permanent historical auditability, custom date range filtering, export compliance, and seamless support for future analytics modules.

---

## ADR 003: Adoption of Apple Visual Language Tokens

- **Context**: Generic SaaS UI libraries (Material UI, Bootstrap) create visual clutter, heavy borders, and slow keyboard workflows.
- **Decision**: Implement a custom Apple Design System token library (`@crms/ui`) extending Tailwind CSS.
- **Rationale**: Minimal visual noise, high-contrast Action Blue `#0066cc`, SF Pro / Inter typography, pill CTAs, and optimized whitespace deliver a premium reading and marking environment.

---

## ADR 004: Client-Side + Server-Side Hybrid Fuzzy Search

- **Context**: Class Representatives need sub-20 second workflows. Waiting for backend API round-trips during live class marking slows down the user.
- **Decision**: Implement in-memory client-side fuzzy searching in `@crms/utils` using indexed student state, backed by PostgreSQL database indexes on the server.
- **Rationale**: Zero latency search experience during live attendance sessions.
