# CRMS Engineering & Coding Guidelines

To maintain code readability and prevent technical debt over a 5-year lifecycle, all contributions must strictly adhere to the following standards.

---

## 📜 Core Coding Rules

1. **TypeScript Strict Mode**: Never use `any`. Always use explicit types or infer from Zod schemas.
2. **Immutability & Pure Functions**: Prefer immutability and pure functions for data transformations (e.g. searching, filtering, exporting).
3. **No God Components**: React components must not exceed 200 lines. Break UI into focused sub-components.
4. **Zod Validation at Boundaries**: All user input, route parameters, and API request payloads must pass through Zod parsing.
5. **No Ad-Hoc Styling**: All styles must reference Apple design tokens defined in `@crms/ui` or Tailwind extend tokens.

---

## 📁 Naming Conventions

- **Files & Directories**: Kebab-case (e.g., `student-list.tsx`, `fuzzy-search.ts`).
- **React Components**: PascalCase (e.g., `StudentTable.tsx`, `AttendanceGrid.tsx`).
- **Interfaces & Types**: PascalCase (e.g., `Student`, `AttendanceSession`).
- **Variables & Functions**: camelCase (e.g., `searchStudents`, `formatDisplayDate`).
- **Database Tables & Columns**: snake_case in PostgreSQL, mapped via Prisma `@map` and `@@map`.

---

## 🧪 Testing Standards

- **Unit Tests**: Place alongside source code as `*.spec.ts` using Vitest.
- **Component Tests**: Test React primitives using React Testing Library.
- **E2E Tests**: Critical user flows (sub-20s attendance marking, Excel import) are validated via Playwright in `apps/web/tests/e2e`.
