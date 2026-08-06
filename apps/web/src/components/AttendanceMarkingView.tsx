import React, { useState } from 'react';
import { Button, Badge } from '@crms/ui';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  CheckCheck,
  XSquare,
  ClipboardPaste,
  Share2,
  Save,
} from 'lucide-react';
import { AttendanceStatus } from '@crms/types';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { useStudentStore } from '../store/useStudentStore';
import { BulkAbsentModal } from './BulkAbsentModal';
import { WhatsAppSummaryModal } from './WhatsAppSummaryModal';

export const AttendanceMarkingView: React.FC = () => {
  const {
    activeSession,
    updateEntryStatus,
    toggleEntryStatus,
    markAllPresent,
    markAllAbsent,
    completeSession,
  } = useAttendanceStore();

  const { students } = useStudentStore();

  const [search, setSearch] = useState('');
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  if (!activeSession) return null;

  const total = activeSession.entries.length;
  const presentCount = activeSession.entries.filter((e) => e.status === 'PRESENT').length;
  const absentCount = activeSession.entries.filter((e) => e.status === 'ABSENT').length;

  const presentPercentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  // Map student university ID for search matching
  const studentMap = new Map(students.map((s) => [s.id, s]));

  const filteredEntries = activeSession.entries.filter((e) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;
    const studentObj = studentMap.get(e.studentId);
    const univId = studentObj?.universityId || '';
    return (
      e.studentRollNumber.toLowerCase().includes(query) ||
      e.studentName.toLowerCase().includes(query) ||
      univId.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Session Top Bar Card */}
      <div className="bg-white border border-[#e0e0e0] rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="blue">{activeSession.sessionType}</Badge>
            <Badge variant="gray">{activeSession.section}</Badge>
            <span className="text-xs text-[#7a7a7a]">
              {activeSession.date} • {activeSession.startTime}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight break-words">
            {activeSession.subject}
          </h2>
          <p className="text-xs text-[#7a7a7a]">
            Faculty: <span className="font-semibold text-[#1d1d1f]">{activeSession.teacher}</span>
          </p>
        </div>

        {/* Responsive Live Counters Grid */}
        <div className="grid grid-cols-3 gap-2 bg-[#fafafc] p-3 rounded-xl border border-[#f0f0f0] shrink-0 text-center">
          <div className="px-1">
            <span className="text-[11px] text-[#7a7a7a] font-medium block">Enrolled</span>
            <span className="text-base sm:text-lg font-bold text-[#1d1d1f]">{total}</span>
          </div>
          <div className="px-1 border-x border-[#e0e0e0]">
            <span className="text-[11px] text-emerald-600 font-medium block">Present</span>
            <span className="text-base sm:text-lg font-bold text-emerald-600">
              {presentCount} <span className="text-[10px] hidden sm:inline">({presentPercentage}%)</span>
            </span>
          </div>
          <div className="px-1">
            <span className="text-[11px] text-rose-600 font-medium block">Absent</span>
            <span className="text-base sm:text-lg font-bold text-rose-600">{absentCount}</span>
          </div>
        </div>
      </div>

      {/* Top Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search & Bulk Utilities */}
        <div className="flex items-center gap-2 flex-1 w-full max-w-full">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#7a7a7a]" />
            <input
              type="text"
              placeholder="Search roll no, name, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-3 text-xs bg-white border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0066cc]"
            />
          </div>
          <Button variant="pearl" size="sm" onClick={() => setIsBulkOpen(true)} className="shrink-0 text-xs px-3">
            <ClipboardPaste className="w-3.5 h-3.5 mr-1 text-[#0066cc]" />
            Paste Absents
          </Button>
        </div>

        {/* Mobile-Responsive Top Action Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          <Button
            variant="pearl"
            size="sm"
            onClick={markAllPresent}
            className="flex-1 sm:flex-initial text-xs px-2.5 py-2 justify-center"
            title="Mark all enrolled students as Present"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
            All Present
          </Button>

          <Button
            variant="pearl"
            size="sm"
            onClick={markAllAbsent}
            className="flex-1 sm:flex-initial text-xs px-2.5 py-2 justify-center"
            title="Mark all students as Absent (useful for low attendance classes)"
          >
            <XSquare className="w-3.5 h-3.5 mr-1 text-rose-600 shrink-0" />
            All Absent
          </Button>

          <Button
            variant="pearl"
            size="sm"
            onClick={() => setIsWhatsAppOpen(true)}
            className="flex-1 sm:flex-initial text-xs px-2.5 py-2 justify-center"
          >
            <Share2 className="w-3.5 h-3.5 mr-1 text-[#25D366] shrink-0" />
            WhatsApp
          </Button>

          {/* Top Finish Session Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={completeSession}
            className="w-full sm:w-auto text-xs px-4 py-2 justify-center"
          >
            <Save className="w-3.5 h-3.5 mr-1 shrink-0" />
            Finish Session
          </Button>
        </div>
      </div>

      {/* Student Marking Cards Mobile-Optimized Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
        {filteredEntries.map((entry) => {
          const isPresent = entry.status === 'PRESENT';
          const isAbsent = entry.status === 'ABSENT';

          return (
            <div
              key={entry.id}
              onClick={() => toggleEntryStatus(entry.studentId)}
              className={`cursor-pointer border rounded-2xl p-2.5 sm:p-3.5 transition-all duration-150 relative select-none flex flex-col justify-between h-32 sm:h-36 ${
                isPresent
                  ? 'bg-white border-[#e0e0e0] hover:border-[#0066cc]'
                  : 'bg-rose-50/70 border-rose-300 hover:border-rose-500 shadow-sm'
              }`}
            >
              {/* Roll Number Top Header */}
              <div className="flex items-center justify-between gap-1">
                <span
                  className={`text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full font-mono ${
                    isPresent
                      ? 'bg-[#0066cc]/10 text-[#0066cc]'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {entry.studentRollNumber}
                </span>

                {isPresent ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                )}
              </div>

              {/* Student Name */}
              <div className="my-1">
                <h4 className="text-[11px] sm:text-xs font-semibold text-[#1d1d1f] line-clamp-2 leading-tight break-words">
                  {entry.studentName}
                </h4>
              </div>

              {/* Touch-Friendly Status Action Buttons */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-black/5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => updateEntryStatus(entry.studentId, 'PRESENT')}
                  className={`flex-1 text-[11px] font-bold py-1.5 rounded-md transition-all ${
                    isPresent
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-black/5 text-[#7a7a7a] active:bg-emerald-200 hover:bg-emerald-100 hover:text-emerald-700'
                  }`}
                >
                  P
                </button>
                <button
                  onClick={() => updateEntryStatus(entry.studentId, 'ABSENT')}
                  className={`flex-1 text-[11px] font-bold py-1.5 rounded-md transition-all ${
                    isAbsent
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-black/5 text-[#7a7a7a] active:bg-rose-200 hover:bg-rose-100 hover:text-rose-700'
                  }`}
                >
                  A
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Finish Session Bar */}
      <div className="bg-white border border-[#e0e0e0] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
        <div>
          <h4 className="text-sm font-bold text-[#1d1d1f]">Finished Marking Attendance?</h4>
          <p className="text-xs text-[#7a7a7a]">
            {presentCount} Present • {absentCount} Absent out of {total} total students
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="pearl" size="sm" onClick={() => setIsWhatsAppOpen(true)} className="flex-1 sm:flex-initial text-xs">
            <Share2 className="w-3.5 h-3.5 mr-1 text-[#25D366]" />
            WhatsApp
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={completeSession}
            className="flex-1 sm:flex-initial text-xs px-6 py-2.5 justify-center font-bold"
          >
            <Save className="w-4 h-4 mr-1.5 shrink-0" />
            Finish & Save Session
          </Button>
        </div>
      </div>

      {/* Modals */}
      <BulkAbsentModal isOpen={isBulkOpen} onClose={() => setIsBulkOpen(false)} />
      <WhatsAppSummaryModal
        session={activeSession}
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />
    </div>
  );
};
