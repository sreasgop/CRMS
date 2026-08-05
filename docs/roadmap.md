# CRMS Product Roadmap & Future Module Architecture

CRMS is being developed in strict phases. Only **Phase 1, Phase 2, Phase 3, and Phase 4** are active for implementation in initial production release.

---

## 🎯 Active Release Phases

### Phase 1: Core Foundation & Architecture (Current)
- Monorepo bootstrapping (pnpm workspaces + TurboRepo).
- Apple Design System token library `@crms/ui`.
- Database schema modeling and Prisma ORM configuration.
- Comprehensive `/docs` system architecture source of truth.

### Phase 2: Student Database Module
- Complete Excel (.xlsx) parser & validator.
- Duplicate roll number detection engine.
- High-velocity fuzzy search (roll, name, last 4 digits, university ID, phone).
- Student profile view and bulk edit/delete operations.

### Phase 3: Attendance Management Module
- Session creation form (Subject, Teacher, Class, Section, Semester, Date, Time).
- Sub-20 second attendance marking workflow (Toggle Grid, Search-to-Mark, Bulk Paste Roll Numbers).
- Configurable template output generator.

### Phase 4: Attendance History & Export Engine
- Permanent immutable session history storage.
- Multi-timeframe filters (Daily, Weekly, Monthly, Custom Range).
- Extensible export engine for Excel (.xlsx), CSV, TXT, and JSON formats.

---

## 🔮 Future Unimplemented Modules (Architected Only)

The monorepo and API layer are structured so the following modules can be added with zero refactoring of core schemas:

1. **WhatsApp Toolkit**: Webhook hooks for sending attendance alerts via WhatsApp API.
2. **OCR Engine**: Image processing pipeline for scanning physical attendance sheets.
3. **QR Attendance**: Student QR scanner module with dynamic time-decaying tokens.
4. **Bluetooth Attendance**: BLE beacon broadcast & discovery protocol.
5. **AI Attendance Parsing**: Natural language session log parser.
6. **Analytics Suite**: Visual attendance metrics, trends, and risk warnings.
7. **Timetable Module**: Schedule grid with automated session creation prompts.
8. **Portals (Teacher & Student)**: Role-based access control (RBAC) authentication integration.
