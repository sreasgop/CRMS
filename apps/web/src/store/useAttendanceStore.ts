import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AttendanceSession, AttendanceEntry, AttendanceStatus, CreateAttendanceSessionInput, Student } from '@crms/types';

interface AttendanceState {
  activeSession: AttendanceSession | null;
  historySessions: AttendanceSession[];

  // Actions
  startSession: (input: CreateAttendanceSessionInput, students: Student[]) => void;
  updateEntryStatus: (studentId: string, status: AttendanceStatus) => void;
  toggleEntryStatus: (studentId: string) => void;
  markAllPresent: () => void;
  markAllAbsent: () => void;
  markBulkAbsentByRollNumbers: (rollInput: string) => { markedAbsent: number; notFound: string[] };
  completeSession: () => void;
  cancelActiveSession: () => void;
  deleteSession: (id: string) => void;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      activeSession: null,
      historySessions: [],

      startSession: (input, students) => {
        // Precise Group filtering so Group I loads ONLY Group I (43 students) and Group II loads ONLY Group II (42 students)
        let enrolled: Student[] = [];

        if (input.section === 'Group I') {
          enrolled = students.filter((s) => s.section.includes('Group I') && !s.section.includes('Group II'));
        } else if (input.section === 'Group II') {
          enrolled = students.filter((s) => s.section.includes('Group II') || s.section.includes('Group 2'));
        } else {
          enrolled = students; // Entire Class (All Groups)
        }

        const sessionId = `sess-${Date.now()}`;
        const entries: AttendanceEntry[] = enrolled.map((s) => ({
          id: `entry-${sessionId}-${s.id}`,
          sessionId: sessionId,
          studentId: s.id,
          studentRollNumber: s.rollNumber,
          studentName: s.name,
          status: 'PRESENT',
        }));

        const newSession: AttendanceSession = {
          id: sessionId,
          subject: input.subject,
          teacher: input.teacher,
          sessionType: input.sessionType,
          section: input.section,
          semester: input.semester || 3,
          date: input.date,
          startTime: input.startTime,
          isCompleted: false,
          entries: entries,
          createdAt: new Date().toISOString(),
        };

        set({ activeSession: newSession });
      },

      updateEntryStatus: (studentId, status) => {
        const active = get().activeSession;
        if (!active) return;

        const updatedEntries = active.entries.map((e) =>
          e.studentId === studentId ? { ...e, status } : e
        );

        set({
          activeSession: {
            ...active,
            entries: updatedEntries,
          },
        });
      },

      toggleEntryStatus: (studentId) => {
        const active = get().activeSession;
        if (!active) return;

        const updatedEntries = active.entries.map((e) => {
          if (e.studentId === studentId) {
            const nextStatus: AttendanceStatus =
              e.status === 'PRESENT' ? 'ABSENT' : 'PRESENT';
            return { ...e, status: nextStatus };
          }
          return e;
        });

        set({
          activeSession: {
            ...active,
            entries: updatedEntries,
          },
        });
      },

      markAllPresent: () => {
        const active = get().activeSession;
        if (!active) return;

        const updatedEntries = active.entries.map((e) => ({ ...e, status: 'PRESENT' as AttendanceStatus }));
        set({ activeSession: { ...active, entries: updatedEntries } });
      },

      markAllAbsent: () => {
        const active = get().activeSession;
        if (!active) return;

        const updatedEntries = active.entries.map((e) => ({ ...e, status: 'ABSENT' as AttendanceStatus }));
        set({ activeSession: { ...active, entries: updatedEntries } });
      },

      markBulkAbsentByRollNumbers: (rollInput) => {
        const active = get().activeSession;
        if (!active) return { markedAbsent: 0, notFound: [] };

        // Parse roll numbers from free text input
        const rawTokens = rollInput.split(/[\s,;\n]+/);
        const targetRolls = rawTokens
          .map((t) => t.trim().replace(/^#/, ''))
          .filter(Boolean);

        let markedCount = 0;
        const notFound: string[] = [];
        const activeRollSet = new Set(active.entries.map((e) => e.studentRollNumber));

        targetRolls.forEach((roll) => {
          if (!activeRollSet.has(roll)) {
            notFound.push(roll);
          }
        });

        const targetRollSet = new Set(targetRolls);

        const updatedEntries = active.entries.map((e) => {
          if (targetRollSet.has(e.studentRollNumber)) {
            markedCount++;
            return { ...e, status: 'ABSENT' as AttendanceStatus };
          }
          return e;
        });

        set({ activeSession: { ...active, entries: updatedEntries } });
        return { markedAbsent: markedCount, notFound };
      },

      completeSession: () => {
        const active = get().activeSession;
        if (!active) return;

        const completedSession: AttendanceSession = {
          ...active,
          isCompleted: true,
        };

        set((state) => ({
          activeSession: null,
          historySessions: [completedSession, ...state.historySessions],
        }));
      },

      cancelActiveSession: () => set({ activeSession: null }),

      deleteSession: (id) =>
        set((state) => ({
          historySessions: state.historySessions.filter((s) => s.id !== id),
        })),
    }),
    {
      name: 'crms-attendance-store',
    }
  )
);
