# CRMS Module 1 Specification — Student Database

The Student Database module provides complete student roster management with high-velocity search, bulk operations, and Excel file ingestion.

---

## 🎯 Key Capabilities

1. **Excel (.xlsx) Import**:
   - Drag-and-drop file ingestion.
   - Column auto-mapping (`Roll No`, `Full Name`, `University ID`, `Phone`, `Email`, `Section`, `Semester`).
2. **Duplicate Detection Engine**:
   - Pre-validation screen flagging existing roll numbers or university IDs.
   - User choices: Skip duplicate, Overwrite existing, or Cancel import.
3. **High-Velocity Fuzzy Search**:
   - Sub-10ms matching against:
     - Full Name
     - Roll Number
     - Last 4 digits of Roll or Phone
     - University ID
     - Phone / Email
4. **Student Profile & Bulk Operations**:
   - Detailed individual student modal with attendance participation stats.
   - Multi-select bulk edit (change section/semester) and bulk delete.
