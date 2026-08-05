# CRMS Module 3 Specification — Attendance History

The Attendance History module provides permanent, immutable storage of all recorded class sessions with retroactive editing and statistics.

---

## 📊 Core Features

1. **Permanent History Log**:
   - Every submitted session remains permanently stored in `AttendanceSession` and `AttendanceEntry`.
2. **Multi-Timeframe Filtering**:
   - Daily history view
   - Weekly history summary
   - Monthly aggregate view
   - Custom Date Range filter (`startDate` to `endDate`)
   - Subject & Teacher filters
3. **Session Audit & Modification**:
   - CR can open any past session and edit individual student statuses (e.g. updating `ABSENT` to `EXCUSED` upon medical slip submission).
   - Every update maintains an `updatedAt` timestamp for audit compliance.
4. **Attendance Analytics**:
   - Class attendance percentage per subject.
   - Individual student attendance rate.
   - Low attendance warning thresholds (< 75%).
