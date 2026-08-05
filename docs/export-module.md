# CRMS Module 4 Specification — Multi-Format Export Engine

The Export Engine converts attendance records into formal academic spreadsheets and reports.

---

## 📤 Supported Export Formats

1. **Excel (.xlsx)**: Formatted worksheet complete with header metadata, color-coded status cells, student roll numbers, and total attendance percentages.
2. **CSV (.csv)**: Clean comma-separated format for import into university portals or spreadsheets.
3. **TXT (.txt)**: Plain-text copyable summary for posting to class announcement groups.
4. **JSON (.json)**: Machine-readable payload for external software integrations.

---

## ⚙ Export Filter Dimensions

Exports can be scoped across:
- **Time Range**: Specific day, current week, current month, or custom date range.
- **Subject**: Single subject or all subjects aggregate sheet.
- **Teacher**: Filter sessions by professor.
- **Section / Semester**: Export by specific class section.

---

## 🔌 Extensible Strategy Pattern Architecture

The export engine utilizes the Strategy pattern:
```typescript
export interface ExportStrategy {
  export(sessions: AttendanceSession[], options: ExportQuery): Promise<Buffer | string>;
}
```
Adding new export formats (e.g. PDF generation, HTML reports) requires creating a new strategy class implementing `ExportStrategy` without altering core business services.
