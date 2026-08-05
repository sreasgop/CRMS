import * as XLSX from 'xlsx';
import { CreateStudentInput } from '@crms/types';

export interface ParseExcelResult {
  students: CreateStudentInput[];
  className?: string;
  errors: string[];
  totalRowsParsed: number;
}

/**
 * Intelligently parse university student Excel roster files.
 * Handles files with title headers (e.g. 'BCA 3F' in row 0), varying column names,
 * and extracts Roll Number, University ID, Name, Section, and Group.
 */
export function parseStudentExcelBuffer(buffer: ArrayBuffer | Uint8Array): ParseExcelResult {
  const result: ParseExcelResult = {
    students: [],
    errors: [],
    totalRowsParsed: 0,
  };

  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      result.errors.push('Excel file has no worksheets');
      return result;
    }

    const sheet = workbook.Sheets[firstSheetName];
    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (!rawRows || rawRows.length === 0) {
      result.errors.push('Excel worksheet is empty');
      return result;
    }

    // Step 1: Detect Title / Class name if present in top rows
    if (rawRows[0] && rawRows[0][0] && typeof rawRows[0][0] === 'string' && rawRows[0].length === 1) {
      result.className = rawRows[0][0].trim();
    }

    // Step 2: Find column header row
    let headerRowIdx = -1;
    let rollColIdx = -1;
    let studentIdColIdx = -1;
    let nameColIdx = -1;
    let sectionColIdx = -1;

    for (let r = 0; r < Math.min(rawRows.length, 10); r++) {
      const row = rawRows[r];
      if (!row || !Array.isArray(row)) continue;

      for (let c = 0; c < row.length; c++) {
        const val = String(row[c] || '').trim().toLowerCase();
        if (val.includes('sl') || val.includes('roll') || val.includes('s.no') || val.includes('sl. no')) {
          rollColIdx = c;
        } else if (val.includes('student id') || val.includes('univ id') || val.includes('university id')) {
          studentIdColIdx = c;
        } else if (val.includes('name') || val.includes('student name')) {
          nameColIdx = c;
        } else if (val.includes('group') || val.includes('section') || val.includes('sec')) {
          if (sectionColIdx === -1) sectionColIdx = c;
        }
      }

      if (nameColIdx !== -1 && (rollColIdx !== -1 || studentIdColIdx !== -1)) {
        headerRowIdx = r;
        break;
      }
    }

    // Fallbacks if header wasn't explicitly found
    if (headerRowIdx === -1) {
      headerRowIdx = 0;
      rollColIdx = 0;
      studentIdColIdx = 1;
      nameColIdx = 2;
      sectionColIdx = 3;
    }

    // Step 3: Parse data rows
    for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!row || row.length === 0) continue;

      const rawRoll = rollColIdx !== -1 ? String(row[rollColIdx] || '').trim() : '';
      const rawUnivId = studentIdColIdx !== -1 ? String(row[studentIdColIdx] || '').trim() : '';
      const rawName = nameColIdx !== -1 ? String(row[nameColIdx] || '').trim() : '';
      const rawSection = sectionColIdx !== -1 ? String(row[sectionColIdx] || '').trim() : 'Group I';

      // Skip invalid header/footer/empty rows
      if (!rawName || rawName.toLowerCase().includes('name') || rawName.toLowerCase().includes('total')) {
        continue;
      }

      // Roll number fallback to serial number or university ID suffix if empty
      const rollNumber = rawRoll || (rawUnivId ? rawUnivId.slice(-4) : `R-${r}`);

      result.students.push({
        rollNumber: rollNumber,
        name: rawName,
        universityId: rawUnivId || undefined,
        section: rawSection || 'Group I',
        semester: 3,
        phone: '',
        email: '',
      });
    }

    result.totalRowsParsed = result.students.length;
  } catch (err: any) {
    result.errors.push(`Failed to parse Excel file: ${err.message}`);
  }

  return result;
}
