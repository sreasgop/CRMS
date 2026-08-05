# CRMS Module 2 Specification — Attendance Management

The Attendance Management module delivers the primary value proposition of CRMS: allowing a Class Representative to mark attendance for 60 students in under 20 seconds.

---

## ⚡ High-Velocity Workflows (< 20 Seconds Benchmark)

1. **Session Initialization**:
   - Quick-select Subject, Teacher, Class, Section, Date, Time.
   - All enrolled students for the selected section auto-populate in `PRESENT` status by default.
2. **Marking Methods**:
   - **Quick Toggle Grid**: Click/tap a student card or roll pill to toggle between `PRESENT`, `ABSENT`, `LATE`, and `EXCUSED`.
   - **Search Selection**: Type roll number or last 4 digits (e.g. `42`) to jump directly to student and mark status with `Space` / `Enter`.
   - **Bulk Roll Paste**: Paste a list of absent roll numbers (e.g. `04, 12, 19, 45`) to mark them all `ABSENT` instantly.
3. **Template Output Generator**:
   - Generates formatted WhatsApp / email text summaries ready for instant copy-paste:
   ```text
   📚 Subject: Data Structures & Algorithms
   👨‍🏫 Teacher: Prof. Smith
   📅 Date: 2026-08-06 | 10:00 AM

   ✅ Present: 54
   ❌ Absent (6): 04, 12, 19, 28, 45, 52
   ```
