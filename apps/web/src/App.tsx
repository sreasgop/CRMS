import React, { useState, useEffect, useRef } from 'react';
import { Button, Badge } from '@crms/ui';
import {
  Users,
  CheckSquare,
  History,
  FileSpreadsheet,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Play,
  Share2,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Student } from '@crms/types';
import { searchStudents } from '@crms/utils';
import { useStudentStore } from './store/useStudentStore';
import { useAttendanceStore } from './store/useAttendanceStore';
import { StudentTable } from './components/StudentTable';
import { ImportModal } from './components/ImportModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AddStudentModal } from './components/AddStudentModal';
import { NewSessionModal } from './components/NewSessionModal';
import { AttendanceMarkingView } from './components/AttendanceMarkingView';
import { HistoryLogsView } from './components/HistoryLogsView';
import { RosterExportModal } from './components/RosterExportModal';

export function App() {
  const {
    students,
    searchQuery,
    setSearchQuery,
    selectedSection,
    setSelectedSection,
    selectedStudentIds,
    bulkDeleteStudents,
    resetToSeed,
  } = useStudentStore();

  const { activeSession, historySessions, completeSession } = useAttendanceStore();

  const [currentTab, setCurrentTab] = useState<'STUDENTS' | 'ATTENDANCE' | 'HISTORY'>('STUDENTS');
  const [historySearch, setHistorySearch] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false);
  const [isExportRosterOpen, setIsExportRosterOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Switch to Attendance tab automatically if a session is active
  useEffect(() => {
    if (activeSession) {
      setCurrentTab('ATTENDANCE');
    }
  }, [activeSession]);

  // Global Keyboard Shortcut: '/' or 'Cmd+K' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Precise section matching to prevent "Group II" matching "Group I"
  const filteredBySection = students.filter((s) => {
    if (selectedSection === 'ALL') return true;
    if (selectedSection === 'Group I') {
      return s.section.includes('Group I') && !s.section.includes('Group II');
    }
    if (selectedSection === 'Group II') {
      return s.section.includes('Group II') || s.section.includes('Group 2');
    }
    return s.section.toLowerCase() === selectedSection.toLowerCase();
  });

  const filteredStudents = searchStudents(filteredBySection, searchQuery);

  const group1Count = students.filter((s) => s.section.includes('Group I') && !s.section.includes('Group II')).length;
  const group2Count = students.filter((s) => s.section.includes('Group II') || s.section.includes('Group 2')).length;

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col md:flex-row text-[#1d1d1f] antialiased max-w-full overflow-x-hidden">
      {/* Desktop Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#e0e0e0] flex flex-col justify-between p-5 hidden md:flex shrink-0">
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-[#0066cc] text-white flex items-center justify-center font-bold text-base shadow-sm">
              CR
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-[#1d1d1f]">CRMS Studio</h2>
              <p className="text-[11px] text-[#7a7a7a]">University BCA 3F</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setCurrentTab('STUDENTS')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                currentTab === 'STUDENTS'
                  ? 'bg-[#0066cc]/10 text-[#0066cc]'
                  : 'hover:bg-[#f5f5f7] text-[#7a7a7a] hover:text-[#1d1d1f]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Database</span>
              <Badge variant="blue" className="ml-auto text-[10px]">
                {students.length}
              </Badge>
            </button>

            <button
              onClick={() => setCurrentTab('ATTENDANCE')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                currentTab === 'ATTENDANCE'
                  ? 'bg-[#0066cc]/10 text-[#0066cc]'
                  : 'hover:bg-[#f5f5f7] text-[#7a7a7a] hover:text-[#1d1d1f]'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Mark Attendance</span>
              {activeSession && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-auto" />}
            </button>

            <button
              onClick={() => setCurrentTab('HISTORY')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                currentTab === 'HISTORY'
                  ? 'bg-[#0066cc]/10 text-[#0066cc]'
                  : 'hover:bg-[#f5f5f7] text-[#7a7a7a] hover:text-[#1d1d1f]'
              }`}
            >
              <History className="w-4 h-4" />
              <span>History Logs</span>
              {historySessions.length > 0 && (
                <Badge variant="gray" className="ml-auto text-[10px]">
                  {historySessions.length}
                </Badge>
              )}
            </button>
          </nav>
        </div>

        {/* Quick Reset Footer */}
        <div className="pt-4 border-t border-[#f0f0f0] space-y-2">
          <button
            onClick={resetToSeed}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-[#7a7a7a] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all"
            title="Restore full 85 BCA 3F Roster"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Roster Server Data</span>
          </button>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto w-full max-w-full">
        {/* Contextual Top Header Bar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-[#e0e0e0] px-4 py-3 sm:px-8 sm:py-4 sticky top-0 z-20 flex items-center justify-between gap-3 w-full max-w-full">
          {currentTab === 'STUDENTS' && (
            <>
              {/* Student Database Custom Header */}
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-xl">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 sm:top-3.5 text-[#7a7a7a]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search Roll No, Name, Student ID (Press '/')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 sm:h-11 pl-9 pr-8 sm:pl-11 sm:pr-12 text-xs sm:text-sm bg-[#f5f5f7] text-[#1d1d1f] border border-transparent rounded-full focus:bg-white focus:border-[#0066cc] focus:outline-none transition-all placeholder:text-[#7a7a7a]"
                  />
                  <span className="hidden sm:inline-block absolute right-3.5 top-3 text-[10px] font-mono text-[#7a7a7a] bg-white border border-[#e0e0e0] px-1.5 py-0.5 rounded">
                    /
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="pearl" size="sm" onClick={() => setIsImportOpen(true)} className="hidden sm:flex text-xs">
                  <FileSpreadsheet className="w-4 h-4 mr-1 text-[#0066cc]" />
                  Import Excel
                </Button>

                <Button variant="primary" size="sm" onClick={() => setIsNewSessionOpen(true)} className="text-xs px-3">
                  <Play className="w-3.5 h-3.5 sm:mr-1.5 fill-current" />
                  <span className="hidden sm:inline">New Attendance</span>
                  <span className="inline sm:hidden">Session</span>
                </Button>
              </div>
            </>
          )}

          {currentTab === 'ATTENDANCE' && (
            <>
              {/* Mark Attendance Custom Header */}
              {activeSession ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-[#1d1d1f] truncate">
                      {activeSession.subject} ({activeSession.section})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="primary" size="sm" onClick={completeSession} className="text-xs px-3">
                      <Save className="w-3.5 h-3.5 mr-1" />
                      Finish & Save Session
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="text-sm font-bold text-[#1d1d1f]">Attendance Sheet Launcher</h3>
                    <p className="text-[11px] text-[#7a7a7a]">Sub-20 second class marking mode</p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => setIsNewSessionOpen(true)} className="text-xs">
                    <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                    Start Session
                  </Button>
                </div>
              )}
            </>
          )}

          {currentTab === 'HISTORY' && (
            <>
              {/* History Logs Custom Header */}
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-xl">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 sm:top-3.5 text-[#7a7a7a]" />
                  <input
                    type="text"
                    placeholder="Search past logs by Subject, Faculty, or Date..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full h-9 sm:h-11 pl-9 pr-4 text-xs sm:text-sm bg-[#f5f5f7] text-[#1d1d1f] border border-transparent rounded-full focus:bg-white focus:border-[#0066cc] focus:outline-none transition-all placeholder:text-[#7a7a7a]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="blue" className="text-xs">
                  {historySessions.length} Logs Archived
                </Badge>
              </div>
            </>
          )}
        </header>

        {/* Dashboard Body Container */}
        <div className="p-4 sm:p-8 pb-24 md:pb-8 max-w-6xl w-full mx-auto space-y-4 sm:space-y-6 overflow-x-hidden">
          {currentTab === 'STUDENTS' && (
            <>
              {/* Action & Filter Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">Student Database</h1>
                  <p className="text-xs text-[#7a7a7a] mt-0.5">
                    Showing <span className="font-semibold text-[#1d1d1f]">{filteredStudents.length}</span> of{' '}
                    <span className="font-semibold text-[#1d1d1f]">{students.length}</span> students
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-[#e0e0e0] text-[11px] sm:text-xs font-medium">
                    <button
                      onClick={() => setSelectedSection('ALL')}
                      className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all ${
                        selectedSection === 'ALL' ? 'bg-[#0066cc] text-white shadow-sm' : 'text-[#7a7a7a]'
                      }`}
                    >
                      All ({students.length})
                    </button>
                    <button
                      onClick={() => setSelectedSection('Group I')}
                      className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all ${
                        selectedSection === 'Group I' ? 'bg-[#0066cc] text-white shadow-sm' : 'text-[#7a7a7a]'
                      }`}
                    >
                      Group I ({group1Count})
                    </button>
                    <button
                      onClick={() => setSelectedSection('Group II')}
                      className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full transition-all ${
                        selectedSection === 'Group II' ? 'bg-[#0066cc] text-white shadow-sm' : 'text-[#7a7a7a]'
                      }`}
                    >
                      Group II ({group2Count})
                    </button>
                  </div>

                  {/* Restore Server Data Button */}
                  <Button
                    variant="pearl"
                    size="sm"
                    onClick={resetToSeed}
                    className="text-xs px-2.5"
                    title="Restore full 85 student roster from server"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Restore Roster
                  </Button>

                  {/* Output & Export Roster Button */}
                  <Button variant="pearl" size="sm" onClick={() => setIsExportRosterOpen(true)} className="text-xs px-2.5">
                    <Share2 className="w-3.5 h-3.5 mr-1 text-[#0066cc]" />
                    Output List
                  </Button>
                </div>
              </div>

              {/* Bulk Selection Bar */}
              {selectedStudentIds.length > 0 && (
                <div className="bg-[#272729] text-white px-4 py-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-in fade-in duration-200">
                  <span className="text-xs font-medium text-center sm:text-left">
                    <span className="font-bold text-[#2997ff]">{selectedStudentIds.length}</span> students selected
                  </span>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                      variant="pearl"
                      size="sm"
                      className="bg-white/10 text-white hover:bg-white/20 border-transparent text-xs"
                      onClick={() => setIsExportRosterOpen(true)}
                    >
                      <Share2 className="w-3.5 h-3.5 mr-1 text-[#2997ff]" />
                      Output ({selectedStudentIds.length})
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
                      onClick={bulkDeleteStudents}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}

              {/* Student Table / Mobile List */}
              <StudentTable
                students={filteredStudents}
                onSelectStudent={(student) => {
                  setSelectedStudent(student);
                  setIsProfileOpen(true);
                }}
                onEditStudent={(student) => {
                  setSelectedStudent(student);
                  setIsProfileOpen(true);
                }}
              />
            </>
          )}

          {currentTab === 'ATTENDANCE' && (
            <>
              {activeSession ? (
                <AttendanceMarkingView />
              ) : (
                <div className="bg-white rounded-2xl border border-[#e0e0e0] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center">
                    <Play className="w-6 h-6 ml-0.5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1d1d1f]">No Active Attendance Session</h3>
                    <p className="text-xs text-[#7a7a7a] mt-1 max-w-sm">
                      Start a new session for your class. All students will default to Present, allowing sub-20s marking.
                    </p>
                  </div>
                  <Button variant="primary" onClick={() => setIsNewSessionOpen(true)}>
                    <Play className="w-4 h-4 mr-1.5 fill-current" />
                    Start Attendance Session
                  </Button>
                </div>
              )}
            </>
          )}

          {currentTab === 'HISTORY' && <HistoryLogsView searchQuery={historySearch} />}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e0e0e0] flex items-center justify-around py-2.5 px-3 md:hidden shadow-lg">
        <button
          onClick={() => setCurrentTab('STUDENTS')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
            currentTab === 'STUDENTS' ? 'text-[#0066cc]' : 'text-[#7a7a7a]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Roster</span>
        </button>

        <button
          onClick={() => setCurrentTab('ATTENDANCE')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all relative ${
            currentTab === 'ATTENDANCE' ? 'text-[#0066cc]' : 'text-[#7a7a7a]'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span>Attendance</span>
          {activeSession && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse absolute top-0 right-1" />
          )}
        </button>

        <button
          onClick={() => setCurrentTab('HISTORY')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
            currentTab === 'HISTORY' ? 'text-[#0066cc]' : 'text-[#7a7a7a]'
          }`}
        >
          <History className="w-5 h-5" />
          <span>Logs</span>
        </button>
      </div>

      {/* Modals */}
      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
      <AddStudentModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <NewSessionModal isOpen={isNewSessionOpen} onClose={() => setIsNewSessionOpen(false)} />
      <RosterExportModal
        students={students}
        selectedStudentIds={selectedStudentIds}
        currentSection={selectedSection}
        isOpen={isExportRosterOpen}
        onClose={() => setIsExportRosterOpen(false)}
      />
      <StudentProfileModal
        student={selectedStudent}
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
}

export default App;
