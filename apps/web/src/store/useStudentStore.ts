import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, CreateStudentInput } from '@crms/types';
import { searchStudents } from '@crms/utils';
import { SEED_STUDENTS } from '../data/seed-students';

interface StudentState {
  students: Student[];
  searchQuery: string;
  selectedSection: string;
  selectedStudentIds: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedSection: (section: string) => void;
  toggleStudentSelection: (id: string) => void;
  selectAllStudents: (ids: string[]) => void;
  clearSelection: () => void;

  addStudent: (student: CreateStudentInput) => void;
  updateStudent: (id: string, updates: Partial<CreateStudentInput>) => void;
  deleteStudent: (id: string) => void;
  bulkDeleteStudents: () => void;
  importStudents: (newStudents: CreateStudentInput[], overwrite: boolean) => { imported: number; updated: number };
  resetToSeed: () => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      students: SEED_STUDENTS,
      searchQuery: '',
      selectedSection: 'ALL',
      selectedStudentIds: [],

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedSection: (section) => set({ selectedSection: section }),

      toggleStudentSelection: (id) =>
        set((state) => ({
          selectedStudentIds: state.selectedStudentIds.includes(id)
            ? state.selectedStudentIds.filter((item) => item !== id)
            : [...state.selectedStudentIds, id],
        })),

      selectAllStudents: (ids) => set({ selectedStudentIds: ids }),
      clearSelection: () => set({ selectedStudentIds: [] }),

      addStudent: (input) =>
        set((state) => ({
          students: [
            {
              ...input,
              id: `std-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
            ...state.students,
          ],
        })),

      updateStudent: (id, updates) =>
        set((state) => ({
          students: state.students.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),

      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
          selectedStudentIds: state.selectedStudentIds.filter((item) => item !== id),
        })),

      bulkDeleteStudents: () =>
        set((state) => ({
          students: state.students.filter((s) => !state.selectedStudentIds.includes(s.id)),
          selectedStudentIds: [],
        })),

      importStudents: (newStudents, overwrite) => {
        let imported = 0;
        let updated = 0;
        const currentList = [...get().students];
        const existingRollMap = new Map(currentList.map((s) => [s.rollNumber.toLowerCase(), s]));

        const updatedList: Student[] = [...currentList];

        newStudents.forEach((input) => {
          const key = input.rollNumber.toLowerCase();
          const existing = existingRollMap.get(key);

          if (existing) {
            if (overwrite) {
              const idx = updatedList.findIndex((s) => s.id === existing.id);
              if (idx !== -1) {
                updatedList[idx] = { ...existing, ...input };
                updated++;
              }
            }
          } else {
            updatedList.push({
              ...input,
              id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              createdAt: new Date().toISOString(),
            });
            imported++;
          }
        });

        set({ students: updatedList });
        return { imported, updated };
      },

      resetToSeed: () =>
        set({
          students: SEED_STUDENTS,
          selectedStudentIds: [],
          searchQuery: '',
          selectedSection: 'ALL',
        }),
    }),
    {
      name: 'crms-student-storage',
    }
  )
);
