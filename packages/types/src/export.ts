import { z } from 'zod';

export const ExportFormatSchema = z.enum(['EXCEL', 'CSV', 'TXT', 'JSON']);
export type ExportFormat = z.infer<typeof ExportFormatSchema>;

export const ExportFilterRangeSchema = z.enum(['DAY', 'WEEK', 'MONTH', 'CUSTOM']);
export type ExportFilterRange = z.infer<typeof ExportFilterRangeSchema>;

export const ExportQuerySchema = z.object({
  format: ExportFormatSchema,
  range: ExportFilterRangeSchema,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  subject: z.string().optional(),
  teacher: z.string().optional(),
  section: z.string().optional(),
  semester: z.number().optional(),
});

export type ExportQuery = z.infer<typeof ExportQuerySchema>;
