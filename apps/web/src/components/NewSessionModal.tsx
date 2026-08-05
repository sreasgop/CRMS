import React, { useState } from 'react';
import { Modal, Button, Input } from '@crms/ui';
import { SessionType } from '@crms/types';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { useStudentStore } from '../store/useStudentStore';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CoursePreset {
  id: string;
  name: string;
  teacher: string;
  sessionType: SessionType;
  defaultGroup: string;
}

const COURSE_PRESETS: CoursePreset[] = [
  // Theory Subjects (All Groups)
  {
    id: 'adv-data-vis',
    name: 'Advanced Data Visualization',
    teacher: 'KM',
    sessionType: 'LECTURE',
    defaultGroup: 'ALL',
  },
  {
    id: 'intro-aiml',
    name: 'Introduction to AI-ML',
    teacher: 'RM',
    sessionType: 'LECTURE',
    defaultGroup: 'ALL',
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    teacher: 'SDG',
    sessionType: 'LECTURE',
    defaultGroup: 'ALL',
  },

  // Lab Sessions (Group I / Group II)
  {
    id: 'aiml-lab-g1',
    name: 'AI-ML Lab (Group I)',
    teacher: 'SM, AKY',
    sessionType: 'LAB',
    defaultGroup: 'Group I',
  },
  {
    id: 'aiml-lab-g2',
    name: 'AI-ML Lab (Group II)',
    teacher: 'SM, AKY',
    sessionType: 'LAB',
    defaultGroup: 'Group II',
  },
  {
    id: 'frontend-lab-g1',
    name: 'Frontend Development Lab (Group I)',
    teacher: 'SB, SG',
    sessionType: 'LAB',
    defaultGroup: 'Group I',
  },
  {
    id: 'frontend-lab-g2',
    name: 'Frontend Development Lab (Group II)',
    teacher: 'SB, RHM',
    sessionType: 'LAB',
    defaultGroup: 'Group II',
  },
];

export const NewSessionModal: React.FC<NewSessionModalProps> = ({ isOpen, onClose }) => {
  const { startSession } = useAttendanceStore();
  const { students } = useStudentStore();

  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [subject, setSubject] = useState('Advanced Data Visualization');
  const [teacher, setTeacher] = useState('KM');
  const [sessionType, setSessionType] = useState<SessionType>('LECTURE');
  const [section, setSection] = useState('ALL');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = COURSE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSubject(found.name);
      setTeacher(found.teacher);
      setSessionType(found.sessionType);
      setSection(found.defaultGroup);
    }
  };

  const handleSessionTypeChange = (newType: SessionType) => {
    setSessionType(newType);
    if (newType === 'LECTURE') {
      setSection('ALL');
    } else if (newType === 'LAB' && section === 'ALL') {
      setSection('Group I');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !teacher) return;

    startSession(
      {
        subject,
        teacher,
        sessionType,
        section,
        semester: 7,
        date,
        startTime,
      },
      students
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start New Attendance Session"
      subtitle="Select a course routine preset or customize parameters."
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-w-full overflow-x-hidden">
        {/* Quick Routine Preset Selection */}
        <div className="bg-[#fafafc] border border-[#e0e0e0] rounded-2xl p-3.5 space-y-1.5">
          <label className="text-xs font-semibold text-[#0066cc] block">⚡ Select Official Course Routine Preset</label>
          <select
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="w-full h-10 px-3 text-xs bg-white border border-[#e0e0e0] rounded-xl focus:outline-none focus:border-[#0066cc] text-[#1d1d1f]"
          >
            <option value="">-- Choose from Routine Presets --</option>
            <optgroup label="Theory Courses (Entire Class / All Groups)">
              {COURSE_PRESETS.filter((p) => p.sessionType === 'LECTURE').map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ({p.teacher})
                </option>
              ))}
            </optgroup>
            <optgroup label="Lab Sessions (Group I / Group II)">
              {COURSE_PRESETS.filter((p) => p.sessionType === 'LAB').map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ({p.teacher})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Subject / Course Name */}
        <div>
          <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">Subject / Course Name *</label>
          <Input
            placeholder="e.g. Advanced Data Visualization"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        {/* Faculty Name & Session Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">Faculty Name / Initials *</label>
            <Input
              placeholder="e.g. KM"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">Session Type *</label>
            <select
              value={sessionType}
              onChange={(e) => handleSessionTypeChange(e.target.value as SessionType)}
              className="w-full h-11 px-4 text-xs sm:text-sm bg-white border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0066cc]"
            >
              <option value="LECTURE">Theory Session</option>
              <option value="LAB">Lab Session</option>
            </select>
          </div>
        </div>

        {/* Target Group & Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">Target Group *</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full h-11 px-3 text-xs sm:text-sm bg-white border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0066cc]"
            >
              <option value="ALL">Entire Class (All Groups)</option>
              <option value="Group I">Group I (Only Group 1)</option>
              <option value="Group II">Group II (Only Group 2)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">Start Time</label>
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-4 border-t border-[#e0e0e0]">
          <Button variant="pearl" type="button" onClick={onClose} className="w-full sm:w-auto text-xs">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="w-full sm:w-auto text-xs">
            Launch Attendance Sheet
          </Button>
        </div>
      </form>
    </Modal>
  );
};
