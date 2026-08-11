import { z } from 'zod';

export const AttendanceStatusSchema = z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']);
export type AttendanceStatus = z.infer<typeof AttendanceStatusSchema>;

export const AttendanceEntrySchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  studentId: z.string(),
  studentRollNumber: z.string(),
  studentName: z.string(),
  universityId: z.string().optional(),
  status: AttendanceStatusSchema,
  remarks: z.string().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type AttendanceEntry = z.infer<typeof AttendanceEntrySchema>;

export const SessionTypeSchema = z.enum(['LECTURE', 'LAB', 'TUTORIAL', 'EVENT']);
export type SessionType = z.infer<typeof SessionTypeSchema>;

export const AttendanceSessionSchema = z.object({
  id: z.string(),
  subject: z.string().min(1, 'Subject name is required'),
  teacher: z.string().min(1, 'Teacher name is required'),
  sessionType: SessionTypeSchema,
  section: z.string(),
  semester: z.number().int().positive(),
  date: z.string(), // YYYY-MM-DD
  startTime: z.string(), // HH:mm
  endTime: z.string().optional(),
  isCompleted: z.boolean(),
  entries: z.array(AttendanceEntrySchema),
  createdAt: z.string().datetime().optional(),
});
export type AttendanceSession = z.infer<typeof AttendanceSessionSchema>;

export const CreateAttendanceSessionInputSchema = z.object({
  subject: z.string().min(1, 'Subject name is required'),
  teacher: z.string().min(1, 'Teacher name is required'),
  sessionType: SessionTypeSchema,
  section: z.string(),
  semester: z.number().int().positive().default(3),
  date: z.string(),
  startTime: z.string(),
});
export type CreateAttendanceSessionInput = z.infer<typeof CreateAttendanceSessionInputSchema>;
