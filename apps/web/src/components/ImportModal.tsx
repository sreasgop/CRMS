import React, { useState, useRef } from 'react';
import { Modal, Button, Badge } from '@crms/ui';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { parseStudentExcelBuffer } from '@crms/utils';
import { CreateStudentInput } from '@crms/types';
import { useStudentStore } from '../store/useStudentStore';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const { importStudents, students } = useStudentStore();
  const [parsedList, setParsedList] = useState<CreateStudentInput[]>([]);
  const [className, setClassName] = useState<string | undefined>('');
  const [fileName, setFileName] = useState<string>('');
  const [duplicateCount, setDuplicateCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [overwriteDuplicates, setOverwriteDuplicates] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg('');

    try {
      const buffer = await file.arrayBuffer();
      const res = parseStudentExcelBuffer(new Uint8Array(buffer));

      if (res.errors.length > 0) {
        setErrorMsg(res.errors.join('; '));
        return;
      }

      setParsedList(res.students);
      setClassName(res.className);

      // Check duplicates against current roster
      const existingRolls = new Set(students.map((s) => s.rollNumber.toLowerCase()));
      const dupes = res.students.filter((s) => existingRolls.has(s.rollNumber.toLowerCase())).length;
      setDuplicateCount(dupes);
    } catch (err: any) {
      setErrorMsg(`Failed to read Excel file: ${err.message}`);
    }
  };

  const handleConfirmImport = () => {
    if (parsedList.length === 0) return;
    importStudents(parsedList, overwriteDuplicates);
    onClose();
    // Reset state
    setParsedList([]);
    setFileName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Student Roster Excel (.xlsx)"
      subtitle="Drag and drop or select your university class roster Excel file."
    >
      <div className="space-y-6">
        {/* Upload Drop Zone */}
        {parsedList.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#e0e0e0] hover:border-[#0066cc] bg-[#fafafc] hover:bg-[#0066cc]/5 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1d1d1f]">Click to upload or drag & drop</p>
              <p className="text-xs text-[#7a7a7a] mt-1">Supports .xlsx, .xls Excel format (e.g. BCA_3F_StudentList.xlsx)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="bg-[#fafafc] rounded-2xl border border-[#e0e0e0] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center font-bold text-xs">
                XLSX
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1d1d1f]">{fileName}</p>
                <p className="text-xs text-[#7a7a7a]">
                  Parsed <span className="font-semibold text-[#0066cc]">{parsedList.length}</span> students cleanly.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setParsedList([]);
                setFileName('');
              }}
            >
              Choose Different File
            </Button>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Pre-Import Preview & Duplicate Warning */}
        {parsedList.length > 0 && (
          <div className="space-y-4">
            {duplicateCount > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>{duplicateCount} Duplicate Roll Numbers Detected</span>
                </div>
                <p className="text-[#7a7a7a]">
                  Some roll numbers in this Excel file match students already in your database.
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="dupOption"
                      checked={overwriteDuplicates}
                      onChange={() => setOverwriteDuplicates(true)}
                      className="text-[#0066cc]"
                    />
                    Update / Overwrite duplicates
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="dupOption"
                      checked={!overwriteDuplicates}
                      onChange={() => setOverwriteDuplicates(false)}
                      className="text-[#0066cc]"
                    />
                    Skip duplicates
                  </label>
                </div>
              </div>
            )}

            {/* Preview Sample Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-[#7a7a7a] uppercase tracking-wider">
                  Ingestion Preview (First 5 Students)
                </h4>
                {className && <Badge variant="blue">{className}</Badge>}
              </div>

              <div className="border border-[#e0e0e0] rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#fafafc] border-b border-[#e0e0e0] text-[#7a7a7a]">
                    <tr>
                      <th className="p-2.5 font-semibold">Roll No</th>
                      <th className="p-2.5 font-semibold">Name</th>
                      <th className="p-2.5 font-semibold">Student ID</th>
                      <th className="p-2.5 font-semibold">Group</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f0]">
                    {parsedList.slice(0, 5).map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-semibold text-[#0066cc]">#{item.rollNumber}</td>
                        <td className="p-2.5 font-medium">{item.name}</td>
                        <td className="p-2.5 text-[#7a7a7a]">{item.universityId || '—'}</td>
                        <td className="p-2.5">{item.section}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e0e0e0]">
              <Button variant="pearl" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmImport}>
                Import {parsedList.length} Students
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
