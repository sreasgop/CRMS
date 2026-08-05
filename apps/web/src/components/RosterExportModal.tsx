import React, { useState } from 'react';
import { Modal, Button } from '@crms/ui';
import { Copy, Check, Download, FileSpreadsheet, Search, Type } from 'lucide-react';
import { Student } from '@crms/types';
import * as XLSX from 'xlsx';

interface RosterExportModalProps {
  students: Student[];
  selectedStudentIds: string[];
  currentSection: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RosterExportModal: React.FC<RosterExportModalProps> = ({
  students,
  selectedStudentIds,
  currentSection,
  isOpen,
  onClose,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedTsv, setCopiedTsv] = useState(false);

  // Scope: ALL | SECTION | SELECTED | CUSTOM_INPUT
  const [scope, setScope] = useState<'ALL' | 'SECTION' | 'SELECTED' | 'CUSTOM_INPUT'>(
    selectedStudentIds.length > 0 ? 'SELECTED' : currentSection !== 'ALL' ? 'SECTION' : 'ALL'
  );

  // Raw pasted input string for CUSTOM_INPUT mode
  const [rawPastedInput, setRawPastedInput] = useState('');

  // Field Checkboxes (Meaningful Identifiers only: Name, University ID, Group)
  const [incName, setIncName] = useState(true);
  const [incUnivId, setIncUnivId] = useState(true);
  const [univIdDigits, setUnivIdDigits] = useState<'FULL' | 'LAST4'>('FULL');
  const [incSection, setIncSection] = useState(true);

  // Name Letter Casing (Capitalized / UPPERCASE / lowercase)
  const [nameCasing, setNameCasing] = useState<'CAPITAL' | 'UPPER' | 'LOWER'>('CAPITAL');

  // Formatting Options
  const [newLinePerStudent, setNewLinePerStudent] = useState(true);

  if (!isOpen) return null;

  // Helper for applying name letter casing
  const applyNameCasing = (rawName: string) => {
    if (nameCasing === 'UPPER') return rawName.toUpperCase();
    if (nameCasing === 'LOWER') return rawName.toLowerCase();
    // Capitalized / Title Case
    return rawName.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
  };

  // Filter students based on chosen scope
  let targetStudents: Student[] = students;

  if (scope === 'SELECTED' && selectedStudentIds.length > 0) {
    targetStudents = students.filter((s) => selectedStudentIds.includes(s.id));
  } else if (scope === 'SECTION' && currentSection !== 'ALL') {
    targetStudents = students.filter((s) => {
      if (currentSection === 'Group I') return s.section.includes('Group I') && !s.section.includes('Group II');
      if (currentSection === 'Group II') return s.section.includes('Group II') || s.section.includes('Group 2');
      return s.section.toLowerCase() === currentSection.toLowerCase();
    });
  } else if (scope === 'CUSTOM_INPUT') {
    if (!rawPastedInput.trim()) {
      targetStudents = [];
    } else {
      const matchedSet = new Set<Student>();

      // 1. Extract 4-digit or longer numbers explicitly using Regex (\d{4,})
      const extractedNumbers = rawPastedInput.match(/\b\d{4,}\b/g) || [];
      const cleanNumberSet = new Set(extractedNumbers.map((n) => n.trim()));

      // Step A: Match extracted numeric IDs (4-digit or full 12-digit)
      cleanNumberSet.forEach((numStr) => {
        students.forEach((s) => {
          const univId = s.universityId || '';
          if (numStr.length === 4) {
            if (univId.endsWith(numStr) || univId === numStr) {
              matchedSet.add(s);
            }
          } else if (univId.includes(numStr) || numStr.includes(univId)) {
            matchedSet.add(s);
          }
        });
      });

      // 2. Tokenize by newlines, commas, semicolons, or spaces, stripping bullets (#, -, •, 1., etc.)
      const rawTokens = rawPastedInput
        .split(/[\n,;\t]+/)
        .map((t) => t.replace(/^[•\-\*\d\.\#\:\s]+/, '').trim().toLowerCase())
        .filter(Boolean);

      // Step B: Match text tokens against student names or IDs
      rawTokens.forEach((tok) => {
        students.forEach((s) => {
          const name = s.name.toLowerCase();
          const univId = (s.universityId || '').toLowerCase();
          const last4 = univId.slice(-4);

          if (
            tok === univId ||
            tok === last4 ||
            (tok.length >= 3 && name.includes(tok)) ||
            (tok.length >= 3 && tok.includes(name))
          ) {
            matchedSet.add(s);
          }
        });
      });

      // Step C: Fallback check — search if any student's last 4 digits appear anywhere in raw text
      if (matchedSet.size === 0) {
        students.forEach((s) => {
          const univId = s.universityId || '';
          const last4 = univId.slice(-4);
          if (last4 && rawPastedInput.includes(last4)) {
            matchedSet.add(s);
          }
        });
      }

      targetStudents = Array.from(matchedSet);
    }
  }

  // Format student items into text lines cleanly WITHOUT "ID: " prefix or internal serial numbers
  const formatStudentLine = (s: Student) => {
    let displayId = s.universityId || '';
    if (displayId && univIdDigits === 'LAST4') {
      displayId = displayId.slice(-4);
    }

    const parts: string[] = [];
    if (incName) parts.push(applyNameCasing(s.name));
    if (incUnivId && displayId) parts.push(displayId); // Raw clean University ID
    if (incSection) parts.push(`[${s.section}]`);

    return parts.join(' - ');
  };

  // Build Top Header Column Summary string
  const columnHeaderParts: string[] = [];
  if (incName) columnHeaderParts.push('Name');
  if (incUnivId) columnHeaderParts.push(univIdDigits === 'LAST4' ? 'University ID (Last 4 Digits)' : 'Full University ID');
  if (incSection) columnHeaderParts.push('Group');

  const columnHeaderLine = columnHeaderParts.length > 0 ? `Columns: ${columnHeaderParts.join(' | ')}` : '';

  // Generate plain text output
  const listTitle =
    scope === 'CUSTOM_INPUT'
      ? `📋 MATCHED IDENTIFIER LIST (${targetStudents.length} Students)`
      : scope === 'SELECTED'
      ? `📋 SELECTED STUDENTS LIST (${targetStudents.length})`
      : scope === 'SECTION'
      ? `📋 ${currentSection.toUpperCase()} ROSTER LIST (${targetStudents.length})`
      : `📋 ENTIRE CLASS ROSTER (${targetStudents.length})`;

  const textLines: string[] = [listTitle];
  if (columnHeaderLine) textLines.push(columnHeaderLine);
  textLines.push('');

  if (newLinePerStudent) {
    targetStudents.forEach((s, idx) => textLines.push(`${idx + 1}. ${formatStudentLine(s)}`));
  } else {
    textLines.push(targetStudents.map((s) => formatStudentLine(s)).join(', '));
  }
  const plainTextOutput = textLines.join('\n');

  // Copy Plain Text handler
  const handleCopyText = () => {
    navigator.clipboard.writeText(plainTextOutput);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Copy TSV (Tab Separated) for Excel / Google Sheets
  const handleCopyTsv = () => {
    const headers: string[] = [];
    if (incName) headers.push('Name');
    if (incUnivId) headers.push(univIdDigits === 'LAST4' ? 'University Student ID (Last 4)' : 'University Student ID');
    if (incSection) headers.push('Group / Section');

    const rows = targetStudents.map((s) => {
      let displayId = s.universityId || '';
      if (displayId && univIdDigits === 'LAST4') {
        displayId = displayId.slice(-4);
      }
      const row: string[] = [];
      if (incName) row.push(applyNameCasing(s.name));
      if (incUnivId) row.push(displayId);
      if (incSection) row.push(s.section);
      return row.join('\t');
    });

    const tsvContent = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(tsvContent);
    setCopiedTsv(true);
    setTimeout(() => setCopiedTsv(false), 2000);
  };

  // Download Excel (.xlsx) handler
  const handleDownloadExcel = () => {
    const data = targetStudents.map((s) => {
      let displayId = s.universityId || '';
      if (displayId && univIdDigits === 'LAST4') {
        displayId = displayId.slice(-4);
      }

      const row: Record<string, any> = {};
      if (incName) row['Student Name'] = applyNameCasing(s.name);
      if (incUnivId) row[univIdDigits === 'LAST4' ? 'Student ID (Last 4)' : 'University Student ID'] = displayId;
      if (incSection) row['Group / Section'] = s.section;
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Roster');
    XLSX.writeFile(workbook, `CRMS_Student_Roster_${Date.now()}.xlsx`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Output & Batch Identifier Formatter"
      subtitle="Paste 4-digit IDs, full IDs, or names to instantly format and export custom lists."
    >
      <div className="space-y-4 max-w-full overflow-x-hidden">
        {/* Scope Controls */}
        <div className="bg-[#fafafc] border border-[#e0e0e0] rounded-2xl p-3.5 space-y-3 text-xs">
          <div className="space-y-1.5">
            <span className="font-semibold text-[#1d1d1f] block">1. Choose Output Source:</span>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                <input
                  type="radio"
                  name="rosterScope"
                  checked={scope === 'ALL'}
                  onChange={() => setScope('ALL')}
                  className="text-[#0066cc]"
                />
                Entire Class ({students.length})
              </label>

              {currentSection !== 'ALL' && (
                <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="rosterScope"
                    checked={scope === 'SECTION'}
                    onChange={() => setScope('SECTION')}
                    className="text-[#0066cc]"
                  />
                  {currentSection}
                </label>
              )}

              <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                <input
                  type="radio"
                  name="rosterScope"
                  checked={scope === 'SELECTED'}
                  onChange={() => setScope('SELECTED')}
                  disabled={selectedStudentIds.length === 0}
                  className="text-[#0066cc] disabled:opacity-50"
                />
                Selected ({selectedStudentIds.length})
              </label>

              <label className="flex items-center gap-1.5 font-medium cursor-pointer text-[#0066cc]">
                <input
                  type="radio"
                  name="rosterScope"
                  checked={scope === 'CUSTOM_INPUT'}
                  onChange={() => setScope('CUSTOM_INPUT')}
                  className="text-[#0066cc]"
                />
                Paste 4-Digit IDs / Names List 🎯
              </label>
            </div>
          </div>

          {/* Text Area for CUSTOM_INPUT mode */}
          {scope === 'CUSTOM_INPUT' && (
            <div className="pt-2 border-t border-[#e0e0e0] space-y-1.5 animate-in fade-in duration-150">
              <label className="font-semibold text-[#0066cc] flex items-center gap-1">
                <Search className="w-3.5 h-3.5" />
                Paste List of 4-Digit IDs, Full IDs, or Names:
              </label>
              <textarea
                rows={3}
                placeholder="Paste here e.g. 2042 2043 2045 OR • 2042 • 2043 OR Student Names..."
                value={rawPastedInput}
                onChange={(e) => setRawPastedInput(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#0066cc]/40 rounded-xl text-xs font-mono focus:outline-none focus:border-[#0066cc]"
              />
              <p className="text-[11px] text-[#7a7a7a]">
                Matched <span className="font-bold text-[#0066cc]">{targetStudents.length}</span> students out of database.
              </p>
            </div>
          )}

          {/* Fields Checkboxes & ID Length Mode */}
          <div className="pt-2 border-t border-[#e0e0e0] space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-semibold text-[#1d1d1f] block">2. Select Fields & ID Length:</span>

              {incUnivId && (
                <div className="flex items-center gap-1 bg-[#e0e0e0]/60 p-0.5 rounded-lg text-[11px] self-start sm:self-auto">
                  <button
                    onClick={() => setUnivIdDigits('FULL')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      univIdDigits === 'FULL' ? 'bg-[#0066cc] text-white shadow-xs' : 'text-[#7a7a7a]'
                    }`}
                  >
                    Full ID
                  </button>
                  <button
                    onClick={() => setUnivIdDigits('LAST4')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      univIdDigits === 'LAST4' ? 'bg-[#0066cc] text-white shadow-xs' : 'text-[#7a7a7a]'
                    }`}
                  >
                    Last 4 Digits Only
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={incName}
                  onChange={(e) => setIncName(e.target.checked)}
                  className="rounded border-[#e0e0e0] text-[#0066cc]"
                />
                Student Name
              </label>
              <label className="flex items-center gap-1.5 font-medium cursor-pointer text-[#0066cc]">
                <input
                  type="checkbox"
                  checked={incUnivId}
                  onChange={(e) => setIncUnivId(e.target.checked)}
                  className="rounded border-[#e0e0e0] text-[#0066cc]"
                />
                University Student ID
              </label>
              <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={incSection}
                  onChange={(e) => setIncSection(e.target.checked)}
                  className="rounded border-[#e0e0e0] text-[#0066cc]"
                />
                Group / Section
              </label>
            </div>
          </div>

          {/* Name Letter Casing & Layout Checkbox */}
          <div className="pt-2 border-t border-[#e0e0e0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

            <label className="flex items-center gap-2 font-medium text-[#0066cc] cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={newLinePerStudent}
                onChange={(e) => setNewLinePerStudent(e.target.checked)}
                className="rounded border-[#e0e0e0] text-[#0066cc]"
              />
              Format each student on new line
            </label>
          </div>
        </div>

        {/* Live Output Preview */}
        <div>
          <span className="text-xs font-semibold text-[#7a7a7a] uppercase tracking-wider block mb-1.5">
            Output Preview ({targetStudents.length} Students)
          </span>
          <div className="bg-[#fafafc] border border-[#e0e0e0] rounded-2xl p-4 text-xs font-mono text-[#1d1d1f] whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed break-words">
            {plainTextOutput}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-[#e0e0e0]">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="pearl" size="sm" onClick={handleCopyTsv} className="flex-1 sm:flex-initial text-xs">
              {copiedTsv ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-[#0066cc]" />}
              {copiedTsv ? 'Copied Table!' : 'Copy Excel Table'}
            </Button>
            <Button variant="pearl" size="sm" onClick={handleDownloadExcel} className="flex-1 sm:flex-initial text-xs">
              <Download className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Download .xlsx
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button variant="pearl" size="sm" onClick={onClose} className="flex-1 sm:flex-initial text-xs">
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={handleCopyText} className="flex-1 sm:flex-initial text-xs">
              {copiedText ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copiedText ? 'Copied!' : 'Copy Text Summary'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
