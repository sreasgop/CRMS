import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.string().uuid(),
  rollNumber: z.string().min(1, 'Roll number is required'),
  name: z.string().min(1, 'Student name is required'),
  universityId: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  section: z.string().default('A'),
  semester: z.number().int().positive().default(1),
  createdAt: z.date().or(z.string()).optional(),
  updatedAt: z.date().or(z.string()).optional(),
});

export type Student = z.infer<typeof StudentSchema>;

export const CreateStudentSchema = StudentSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;

export const BulkImportStudentSchema = z.array(CreateStudentSchema);
export type BulkImportStudentInput = z.infer<typeof BulkImportStudentSchema>;

export const StudentSearchQuerySchema = z.object({
  query: z.string().optional(),
  semester: z.number().optional(),
  section: z.string().optional(),
  limit: z.number().default(50),
  offset: z.number().default(0),
});

export type StudentSearchQuery = z.infer<typeof StudentSearchQuerySchema>;
