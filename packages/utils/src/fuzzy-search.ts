import { Student } from '@crms/types';

/**
 * Perform high-velocity fuzzy matching across student records.
 * Matches against:
 * 1. Full name
 * 2. Roll number
 * 3. Last four digits of Roll Number or Phone
 * 4. University ID
 * 5. Phone
 * 6. Email
 */
export function searchStudents(students: Student[], query: string): Student[] {
  if (!query || query.trim() === '') return students;

  const normalized = query.trim().toLowerCase();
  const digitsOnly = normalized.replace(/\D/g, '');

  return students.filter((student) => {
    // Exact or partial match on Roll Number
    const roll = student.rollNumber.toLowerCase();
    if (roll.includes(normalized)) return true;

    // Last 4 digits match on roll number or phone
    if (digitsOnly.length >= 2 && digitsOnly.length <= 4) {
      if (roll.endsWith(digitsOnly)) return true;
      if (student.phone && student.phone.endsWith(digitsOnly)) return true;
    }

    // Name match
    if (student.name.toLowerCase().includes(normalized)) return true;

    // University ID match
    if (student.universityId && student.universityId.toLowerCase().includes(normalized)) return true;

    // Phone match
    if (student.phone && student.phone.includes(normalized)) return true;

    // Email match
    if (student.email && student.email.toLowerCase().includes(normalized)) return true;

    return false;
  });
}
