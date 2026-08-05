import React, { useState } from 'react';
import { Button, Badge } from '@crms/ui';
import { History, Calendar, Trash2, Share2, Search, FileSpreadsheet } from 'lucide-react';
import { AttendanceSession } from '@crms/types';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { WhatsAppSummaryModal } from './WhatsAppSummaryModal';
import * as XLSX from 'xlsx';

interface HistoryLogsViewProps {
  searchQuery?: string;
}

export const HistoryLogsView: React.FC<HistoryLogsViewProps> = ({ searchQuery = '' }) => {
  const { historySessions, deleteSession } = useAttendanceStore();
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [localSearch, setLocalSearch] = useState('');

  const activeQuery = (searchQuery || localSearch).toLowerCase().trim();

  const filteredSessions = historySessions.filter(
    (s) =>
      s.subject.toLowerCase().includes(activeQuery) ||
      s.teacher.toLowerCase().includes(activeQuery) ||
      s.section.toLowerCase().includes(activeQuery) ||
      s.date.includes(activeQuery)
  );

  const handleExportAllLogsExcel = () => {
    if (historySessions.length === 0) return;

    const exportRows: any[] = [];
    historySessions.forEach((sess) => {
      sess.entries.forEach((e) => {
        exportRows.push({
          'Session ID': sess.id,
          Subject: sess.subject,
          Faculty: sess.teacher,
          Type: sess.sessionType,
          Section: sess.section,
          Date: sess.date,
          'Start Time': sess.startTime,
          'Roll Number': e.studentRollNumber,
          'Student Name': e.studentName,
          Status: e.status,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance History');
    XLSX.writeFile(workbook, `CRMS_Attendance_History_${Date.now()}.xlsx`);
  };

  if (historySessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e0e0e0] p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#7a7a7a]">
          <History className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-[#1d1d1f]">No historical sessions yet</h4>
        <p className="text-xs text-[#7a7a7a] max-w-sm">
          Once you complete attendance marking sessions, they will be archived here for instant review and export.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Export Toolbar inside History view */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#1d1d1f]">Attendance History Logs</h2>
          <p className="text-xs text-[#7a7a7a] mt-0.5">
            Archived logs of completed sessions ({historySessions.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="pearl" size="sm" onClick={handleExportAllLogsExcel} className="text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-[#0066cc]" />
            Export All History (.xlsx)
          </Button>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e0e0e0] p-8 text-center text-xs text-[#7a7a7a]">
          No attendance logs found matching "{activeQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map((session) => {
            const total = session.entries.length;
            const presentCount = session.entries.filter((e) => e.status === 'PRESENT').length;
            const absentCount = session.entries.filter((e) => e.status === 'ABSENT').length;
            const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

            return (
              <div
                key={session.id}
                className="bg-white border border-[#e0e0e0] rounded-2xl p-5 shadow-sm hover:border-[#0066cc] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="blue">{session.sessionType}</Badge>
                      <Badge variant="gray">{session.section}</Badge>
                    </div>
                    <span className="text-xs text-[#7a7a7a] font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {session.date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1d1d1f] tracking-tight">{session.subject}</h3>
                  <p className="text-xs text-[#7a7a7a] mt-0.5">Faculty: {session.teacher}</p>

                  {/* Session Attendance Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#1d1d1f]">
                        {presentCount} / {total} Present
                      </span>
                      <span className="text-[#0066cc]">{percentage}% Rate</span>
                    </div>
                    <div className="h-2 w-full bg-[#f5f5f7] rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: `${percentage}%` }} />
                      <div className="bg-rose-500 h-full flex-1" />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#f0f0f0]">
                  <div className="flex items-center gap-2">
                    <Button variant="pearl" size="sm" onClick={() => setSelectedSession(session)}>
                      <Share2 className="w-3.5 h-3.5 mr-1 text-[#25D366]" />
                      WhatsApp Summary
                    </Button>
                  </div>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-100 text-[#7a7a7a] hover:text-rose-600 transition-colors"
                    title="Delete Session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <WhatsAppSummaryModal
        session={selectedSession}
        isOpen={Boolean(selectedSession)}
        onClose={() => setSelectedSession(null)}
      />
    </div>
  );
};
