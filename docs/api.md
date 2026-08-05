# CRMS REST API Specification

All backend endpoints are hosted on `http://localhost:4000/api` (or environment configured host) and return standardized JSON responses.

---

## 👥 Student Database Endpoints

### `GET /api/students`
- **Query Params**: `query` (string), `semester` (int), `section` (string), `limit` (int), `offset` (int)
- **Response**: `{ success: true, data: Student[], total: number }`

### `POST /api/students`
- **Body**: `CreateStudentInput`
- **Response**: `{ success: true, data: Student }`

### `POST /api/students/bulk-import`
- **Body**: `{ students: CreateStudentInput[], overwriteDuplicates: boolean }`
- **Response**: `{ success: true, importedCount: number, duplicateCount: number, errors: string[] }`

### `PUT /api/students/:id`
- **Body**: `Partial<CreateStudentInput>`
- **Response**: `{ success: true, data: Student }`

### `DELETE /api/students/:id`
- **Response**: `{ success: true, id: string }`

---

## 📋 Attendance Endpoints

### `POST /api/attendance/sessions`
- **Body**: `CreateAttendanceSessionInput`
- **Response**: `{ success: true, data: AttendanceSession }`

### `GET /api/attendance/sessions`
- **Query Params**: `startDate` (string), `endDate` (string), `subject` (string), `teacher` (string)
- **Response**: `{ success: true, data: AttendanceSession[] }`

### `GET /api/attendance/sessions/:id`
- **Response**: `{ success: true, data: AttendanceSession }`

### `PUT /api/attendance/sessions/:id`
- **Body**: `Partial<CreateAttendanceSessionInput>`
- **Response**: `{ success: true, data: AttendanceSession }`

---

## 📤 Export Endpoints

### `GET /api/export`
- **Query Params**: `format` (EXCEL|CSV|TXT|JSON), `range` (DAY|WEEK|MONTH|CUSTOM), `startDate`, `endDate`, `subject`
- **Response**: File stream (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `text/csv`, `application/json`)
