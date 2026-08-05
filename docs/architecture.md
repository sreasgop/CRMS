# CRMS Software Architecture & Monorepo Design

CRMS follows **Clean Architecture** and **SOLID principles** inside a modern monorepo. It isolates business domain rules from UI frameworks, database adapters, and external infrastructure.

---

## 🏗 System Layering

```text
+-------------------------------------------------------------------+
|                        Presentation Layer                         |
|     apps/web (React/Vite)              apps/mobile (Expo RN)     |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                        Application Layer                          |
|    Use Cases (Student Manager, Attendance Session Engine, Export) |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                          Domain Layer                             |
|       packages/types (Zod Schemas, Domain Entities, Enums)       |
|       packages/utils (Fuzzy Search, Date Helpers, Math Stats)     |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                       Infrastructure Layer                        |
|       packages/database (Prisma ORM, PostgreSQL Client)          |
|       apps/server (NestJS REST API Controllers & Modules)         |
+-------------------------------------------------------------------+
```

---

## 🧱 Monorepo Packages

1. `apps/web`: Responsive web dashboard providing single-click attendance marking and student database management.
2. `apps/mobile`: React Native app with touch-first quick-toggle attendance grid.
3. `apps/server`: NestJS REST application serving CRUD endpoints, bulk upload parsing, and export generation.
4. `packages/ui`: Design system components enforcing Apple tokens (`Button`, `Card`, `Input`, `Table`).
5. `packages/database`: Single source of database schema truth via Prisma ORM (`prisma/schema.prisma`).
6. `packages/types`: Type definitions and Zod validation schemas shared between web, mobile, and server.
7. `packages/utils`: Domain logic helpers including fuzzy searching algorithms and date utilities.
8. `packages/config`: Common ESLint, Prettier, and TypeScript configuration bases.

---

## 🛡 SOLID & Extensibility Principles

- **Single Responsibility (SRP)**: Data fetching, state management (Zustand), and presentation rendering are decoupled.
- **Open/Closed (OCP)**: The Export engine is closed for modification but open for extension through format strategy implementations (`CsvExporter`, `ExcelExporter`, `JsonExporter`).
- **Dependency Inversion (DIP)**: Core application services depend on abstract interfaces, allowing seamless swapping of PostgreSQL, Supabase, or SQLite persistence engines.
