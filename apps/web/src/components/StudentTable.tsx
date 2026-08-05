import React from 'react';
import { Student } from '@crms/types';
import { Badge } from '@crms/ui';
import { Edit2, Trash2, User } from 'lucide-react';
import { useStudentStore } from '../store/useStudentStore';

interface StudentTableProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
}) => {
  const { selectedStudentIds, toggleStudentSelection, selectAllStudents, clearSelection, deleteStudent } =
    useStudentStore();

  const allSelected = students.length > 0 && students.every((s) => selectedStudentIds.includes(s.id));

  const handleHeaderCheckboxChange = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAllStudents(students.map((s) => s.id));
    }
  };

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e0e0e0] p-8 sm:p-12 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#7a7a7a] mb-3">
          <User className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-[#1d1d1f]">No students found</h4>
        <p className="text-xs text-[#7a7a7a] mt-1 max-w-sm">
          No records match your search query. Try clearing filters or import your class roster Excel file.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Card List View (< sm screens) */}
      <div className="block sm:hidden space-y-2.5">
        <div className="flex items-center justify-between px-2 py-1 text-xs text-[#7a7a7a]">
          <label className="flex items-center gap-2 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleHeaderCheckboxChange}
              className="rounded border-[#e0e0e0] text-[#0066cc]"
            />
            Select All ({students.length})
          </label>
        </div>

        {students.map((student) => {
          const isSelected = selectedStudentIds.includes(student.id);
          return (
            <div
              key={student.id}
              className={`bg-white border rounded-2xl p-4 transition-all space-y-2 ${
                isSelected ? 'border-[#0066cc] bg-[#0066cc]/5' : 'border-[#e0e0e0]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleStudentSelection(student.id)}
                    className="rounded border-[#e0e0e0] text-[#0066cc] shrink-0"
                  />
                  <span className="text-xs font-bold font-mono text-[#0066cc] bg-[#0066cc]/10 px-2 py-0.5 rounded-full shrink-0">
                    Roll {student.rollNumber}
                  </span>
                  <Badge variant={student.section.includes('II') || student.section.includes('2') ? 'amber' : 'blue'}>
                    {student.section}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditStudent(student)}
                    className="p-1.5 rounded-lg hover:bg-[#e0e0e0] text-[#7a7a7a]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteStudent(student.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onSelectStudent(student)}
                  className="text-sm font-bold text-[#1d1d1f] hover:underline text-left block break-words"
                >
                  {student.name}
                </button>
                {student.universityId && (
                  <p className="text-[11px] text-[#7a7a7a] font-mono mt-0.5">ID: {student.universityId}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (>= sm screens) */}
      <div className="hidden sm:block bg-white rounded-2xl border border-[#e0e0e0] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafc] border-b border-[#e0e0e0] text-xs font-semibold text-[#7a7a7a] tracking-tight">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleHeaderCheckboxChange}
                    className="rounded border-[#e0e0e0] text-[#0066cc] focus:ring-[#0066cc] cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-semibold text-[#1d1d1f]">Roll No</th>
                <th className="py-3.5 px-4 font-semibold text-[#1d1d1f]">Student Name</th>
                <th className="py-3.5 px-4 font-semibold text-[#1d1d1f]">Student ID</th>
                <th className="py-3.5 px-4 font-semibold text-[#1d1d1f]">Group / Section</th>
                <th className="py-3.5 px-4 font-semibold text-[#1d1d1f] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0f0] text-sm">
              {students.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                return (
                  <tr
                    key={student.id}
                    className={`group hover:bg-[#f5f5f7]/60 transition-colors ${
                      isSelected ? 'bg-[#0066cc]/5' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="rounded border-[#e0e0e0] text-[#0066cc] focus:ring-[#0066cc] cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#0066cc]">
                      {student.rollNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#1d1d1f]">
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="hover:underline text-left"
                      >
                        {student.name}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-[#7a7a7a] font-mono text-xs">
                      {student.universityId || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={student.section.includes('II') || student.section.includes('2') ? 'amber' : 'blue'}>
                        {student.section}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditStudent(student)}
                          className="p-1.5 rounded-lg hover:bg-[#e0e0e0] text-[#7a7a7a] hover:text-[#1d1d1f]"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 text-[#7a7a7a] hover:text-rose-600"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
