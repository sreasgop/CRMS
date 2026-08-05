import React, { useState } from 'react';
import { Modal, Button } from '@crms/ui';
import { Copy, Check, Settings2, Type } from 'lucide-react';
import { AttendanceSession } from '@crms/types';
import { useStudentStore } from '../store/useStudentStore';

interface WhatsAppSummaryModalProps {
  session: AttendanceSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppSummaryModal: React.FC<WhatsAppSummaryModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const { students } = useStudentStore();
  const [copied, setCopied] = useState(false);

  // Field Selection Checkboxes
  const [includeSubject, setIncludeSubject] = useState(true);
  const [includeDateTime, setIncludeDateTime] = useState(true);
  const [includeStats, setIncludeStats] = useState(true);

  // Meaningful Student Identifier Fields
  const [showName, setShowName] = useState(true); // DEFAULT: TRUE
  const [showUnivId, setShowUnivId] = useState(true); // DEFAULT: TRUE
  const [univIdMode, setUnivIdMode] = useState<'FULL' | 'LAST4'>('FULL');
  const [showGroup, setShowGroup] = useState(false); // DEFAULT: FALSE (Unchecked)

  // Name Letter Casing (Capitalized / UPPERCASE / lowercase)
  const [nameCasing, setNameCasing] = useState<'CAPITAL' | 'UPPER' | 'LOWER'>('CAPITAL');

  // Layout & Scope (Defaults: Presentees Only & New Line per student)
  const [listType, setListType] = useState<'ABSENT' | 'PRESENT' | 'BOTH'>('PRESENT');
  const [newLinePerStudent, setNewLinePerStudent] = useState(true);

  if (!session) return null;

  // Map student university ID & section if missing in entry
  const studentMap = new Map(students.map((s) => [s.id, s]));

  const total = session.entries.length;
  const presentEntries = session.entries.filter((e) => e.status === 'PRESENT');
  const absentEntries = session.entries.filter((e) => e.status === 'ABSENT');

  const presentCount = presentEntries.length;
  const absentCount = absentEntries.length;
  const presentPercentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : '0';

  // Helper for applying name letter casing
  const applyNameCasing = (rawName: string) => {
    if (nameCasing === 'UPPER') return rawName.toUpperCase();
    if (nameCasing === 'LOWER') return rawName.toLowerCase();
    // Capitalized / Title Case
    return rawName.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
  };

  // Helper to format a single student entry using meaningful identifiers
  const formatStudentItem = (entry: (typeof session.entries)[0]) => {
    const matchedStudent = studentMap.get(entry.studentId);
    let univId = matchedStudent?.universityId || entry.remarks || '';
    if (univId && univIdMode === 'LAST4') {
      univId = univId.slice(-4);
    }

    const parts: string[] = [];

    if (showName) {
      parts.push(applyNameCasing(entry.studentName));
    }
    if (showUnivId && univId) {
      parts.push(showName ? `(${univId})` : univId);
    }
    if (showGroup && matchedStudent?.section) {
      parts.push(`[${matchedStudent.section}]`);
    }

    if (parts.length === 0) {
      return applyNameCasing(entry.studentName);
    }

    return parts.join(' ');
  };

  const renderStudentList = (entries: typeof session.entries) => {
    if (entries.length === 0) return 'None 🎉';
    const formattedItems = entries.map(formatStudentItem);

    if (newLinePerStudent) {
      return '\n' + formattedItems.map((item) => `• ${item}`).join('\n');
    }
    return formattedItems.join(', ');
  };

  // Build customizable report string
  let lines: string[] = [];

  lines.push('📚 *ATTENDANCE REPORT*');

  if (includeSubject) {
    lines.push(`Subject: ${session.subject} (${session.sessionType})`);
    lines.push(`Faculty: ${session.teacher}`);
  }

  if (includeDateTime) {
    lines.push(`Date: ${session.date} | Group: ${session.section}`);
  }

  if (includeStats) {
    lines.push(`Total Enrolled: ${total}`);
    lines.push(`✅ Present: ${presentCount} (${presentPercentage}%)`);
    lines.push(`❌ Absent: ${absentCount}`);
  }

  if (includeSubject || includeDateTime || includeStats) {
    lines.push('');
  }

  if (listType === 'ABSENT' || listType === 'BOTH') {
    lines.push(`❌ Absentees (${absentCount}): ${renderStudentList(absentEntries)}`);
  }

  if (listType === 'PRESENT' || listType === 'BOTH') {
    if (listType === 'BOTH') lines.push('');
    lines.push(`✅ Presentees (${presentCount}): ${renderStudentList(presentEntries)}`);
  }

  lines.push('\n_Generated via CRMS Studio_');

  const summaryText = lines.join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize WhatsApp Summary"
      subtitle="Configure output fields, casing, and format for your class announcement group."
    >
      <div className="space-y-4 max-w-full overflow-x-hidden">
        {/* Customization Options Toolbar */}
        <div className="bg-[#fafafc] border border-[#e0e0e0] rounded-2xl p-3.5 sm:p-4 space-y-3 sm:space-y-4 text-xs">
          <div className="flex items-center gap-2 font-semibold text-[#1d1d1f] border-b border-[#e0e0e0] pb-2">
            <Settings2 className="w-4 h-4 text-[#0066cc] shrink-0" />
            <span>Summary Field Checkboxes</span>
          </div>

          {/* Section 1: Header Info Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeSubject}
                onChange={(e) => setIncludeSubject(e.target.checked)}
                className="rounded border-[#e0e0e0] text-[#0066cc] shrink-0"
              />
              Subject & Faculty
            </label>
            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeDateTime}
                onChange={(e) => setIncludeDateTime(e.target.checked)}
                className="rounded border-[#e0e0e0] text-[#0066cc] shrink-0"
              />
              Date, Time & Group
            </label>
            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeStats}
                onChange={(e) => setIncludeStats(e.target.checked)}
                className="rounded border-[#e0e0e0] text-[#0066cc] shrink-0"
              />
              Stats & Percentages
            </label>
          </div>

          {/* Section 2: Meaningful Student Identifiers & ID Digits Mode */}
          <div className="pt-2 border-t border-[#f0f0f0] space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-semibold text-[#7a7a7a] block">Select Student Identifiers:</span>

              {/* Toggle for Full ID vs Last 4 Digits */}
              {showUnivId && (
                <div className="flex items-center gap-1 bg-[#e0e0e0]/60 p-0.5 rounded-lg text-[11px] self-start sm:self-auto">
                  <button
                    onClick={() => setUnivIdMode('FULL')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      univIdMode === 'FULL' ? 'bg-[#0066cc] text-white shadow-xs' : 'text-[#7a7a7a]'
                    }`}
                  >
                    Full ID
                  </button>
                  <button
                    onClick={() => setUnivIdMode('LAST4')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      univIdMode === 'LAST4' ? 'bg-[#0066cc] text-white shadow-xs' : 'text-[#7a7a7a]'
                    }`}
                  >
                    Last 4 Digits Only
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 font-medium cursor-pointer text-[#0066cc]">
                <input
                  type="checkbox"
                  checked={showName}
                  onChange={(e) => setShowName(e.target.checked)}
                  className="rounded border-[#e0e0e0] text-[#0066cc] shrink-0"
                />
                Student Name
              </label>
              <label className="flex items-center gap-2 font-medium cursor-pointer text-[#0066cc]">
                <input
                  type="checkbox"
                  checked={showUnivId}
                  onChange={(e) => setShowUnivId(e.target.checked)}
                  className="rounded border-[#e0e0e0] text-[#0066cc] shrink-0"
                />
                University Student ID
              </label>
              <label className="flex items-center gap-2 font-medium cursor-pointer text-[#7a7a7a]">
                <input
                  type="checkbox"
                  checked={showGroup}
                  onChange={(e) => setShowGroup(e.target.checked)}
                  className="rounded border-[#e0e0e0] text-[#0066cc] shrink-0"
                />
                Include Group / Section
              </label>
            </div>
          </div>

          {/* Section 3: Name Letter Casing */}
          <div className="pt-2 border-t border-[#f0f0f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-[#0066cc] shrink-0" />
              <span className="font-semibold text-[#7a7a7a]">Name Letter Casing:</span>
              <div className="flex items-center gap-1 bg-[#e0e0e0]/60 p-0.5 rounded-lg text-[11px]">
                <button
                  onClick={() => setNameCasing('CAPITAL')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                    nameCasing === 'CAPITAL' ? 'bg-[#0066cc] text-white shadow-xs' : 'text-[#7a7a7a]'
                  }`}
                >
                  Capitalized
                </button>
                <button
                  onClick={() => setNameCasing('UPPER')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                    nameCasing === 'UPPER' ? 'bg-[#0066cc] text-white shadow-xs' : 'text-[#7a7a7a]'
                  }`}
                >
                  UPPERCASE
                </button>
                <button
                  onClick={() => setNameCasing('LOWER')}
                  className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                    nameCasing === 'LOWER' ? 'bg-[#0066cc] text-white shadow-xs' : 'text-[#7a7a7a]'
                  }`}
                >
                  lowercase
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 font-medium cursor-pointer text-[#0066cc] shrink-0">
              <input
                type="checkbox"
                checked={newLinePerStudent}
                onChange={(e) => setNewLinePerStudent(e.target.checked)}
                className="rounded border-[#e0e0e0] text-[#0066cc] shrink-0"
              />
              Each student on new line
            </label>
          </div>

          {/* Section 4: Scope */}
          <div className="pt-2 border-t border-[#f0f0f0] flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-[#7a7a7a]">Scope:</span>
            <label className="flex items-center gap-1.5 font-medium cursor-pointer">
              <input
                type="radio"
                name="listType"
                checked={listType === 'PRESENT'}
                onChange={() => setListType('PRESENT')}
                className="text-[#0066cc]"
              />
              Presentees Only
            </label>
            <label className="flex items-center gap-1.5 font-medium cursor-pointer">
              <input
                type="radio"
                name="listType"
                checked={listType === 'ABSENT'}
                onChange={() => setListType('ABSENT')}
                className="text-[#0066cc]"
              />
              Absentees Only
            </label>
            <label className="flex items-center gap-1.5 font-medium cursor-pointer">
              <input
                type="radio"
                name="listType"
                checked={listType === 'BOTH'}
                onChange={() => setListType('BOTH')}
                className="text-[#0066cc]"
              />
              Both (All)
            </label>
          </div>
        </div>

        {/* Formatted Text Live Preview */}
        <div>
          <span className="text-xs font-semibold text-[#7a7a7a] uppercase tracking-wider block mb-1.5">
            Live Text Preview
          </span>
          <div className="bg-[#128c7e]/5 border border-[#128c7e]/20 rounded-2xl p-4 text-xs font-mono text-[#1d1d1f] whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto break-words max-w-full">
            {summaryText}
          </div>
        </div>

        {/* Mobile Responsive Modal Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-[#e0e0e0] w-full">
          <p className="text-[11px] text-[#7a7a7a] text-center sm:text-left">
            Formatted for WhatsApp / Telegram announcement groups.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="pearl" onClick={onClose} className="flex-1 sm:flex-initial text-xs">
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleCopy}
              className="flex-1 sm:flex-initial text-xs bg-[#25D366] hover:bg-[#128c7e] text-white justify-center"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 shrink-0" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1 shrink-0" /> Copy WhatsApp Summary
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
