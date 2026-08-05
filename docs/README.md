# CRMS Documentation Index

Welcome to the official technical documentation repository for **CRMS (Class Representative Management System)**.

CRMS is engineered to be the most elegant productivity application ever built for university Class Representatives. It prioritizes extreme velocity, Apple design aesthetics, and a resilient monorepo clean architecture.

---

## 📚 Master Document Catalogue

| Document | Purpose & Description |
|---|---|
| [**architecture.md**](./architecture.md) | Monorepo layout, SOLID principles, Clean Architecture layers, system boundaries, and code-sharing strategy. |
| [**design.md**](./design.md) | Apple Visual Language Specification: color palette (`#0066cc`), typography scale, radius rules, elevation, micro-interactions. |
| [**database.md**](./database.md) | PostgreSQL schema, Prisma ORM entity models, indexing strategy, UUID policy, and session-based audit traits. |
| [**coding-guidelines.md**](./coding-guidelines.md) | Code quality standards, TypeScript best practices, linting rules, naming conventions, and file structure guidelines. |
| [**roadmap.md**](./roadmap.md) | Active release phases (Phases 1-4) and architectural preparation for future modules (WhatsApp, OCR, QR, AI Parsing, etc.). |
| [**api.md**](./api.md) | REST API specs for Student Database, Attendance Sessions, History Queries, and Export endpoints. |
| [**decisions.md**](./decisions.md) | Architecture Decision Records (ADRs) capturing key architectural choices and trade-offs. |
| [**student-module.md**](./student-module.md) | Specification for Student Database: Excel import pipeline, validation, duplicate handling, and fuzzy search rules. |
| [**attendance-module.md**](./attendance-module.md) | Specification for Attendance Management: session creation, sub-20s marking workflow, and template rendering. |
| [**history-module.md**](./history-module.md) | Specification for Attendance History: permanent session storage, date filtering, and historical session edits. |
| [**export-module.md**](./export-module.md) | Specification for Export Engine: multi-format support (Excel, CSV, TXT, JSON), custom range filters, and templates. |

---

## 🚀 Quick Workspace Overview

```text
/
├── apps/
│   ├── web/          # React + Vite + Tailwind CSS Web Application
│   ├── mobile/       # React Native + Expo Mobile Application
│   └── server/       # Node.js + NestJS Backend Service
├── packages/
│   ├── ui/           # Apple Design System UI Components & Tokens
│   ├── database/     # Prisma Schema & Database Client Export
│   ├── types/        # Shared Zod Schemas & TypeScript Types
│   ├── utils/        # Shared Utilities (Fuzzy Search, Date, Export Engine)
│   └── config/       # Shared TSConfig, ESLint & Prettier Rules
└── docs/             # Technical Source of Truth Documentation
```
