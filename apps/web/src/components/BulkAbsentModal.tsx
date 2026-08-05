import React, { useState } from 'react';
import { Modal, Button } from '@crms/ui';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAttendanceStore } from '../store/useAttendanceStore';

interface BulkAbsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkAbsentModal: React.FC<BulkAbsentModalProps> = ({ isOpen, onClose }) => {
  const { markBulkAbsentByRollNumbers } = useAttendanceStore();
  const [rollInput, setRollInput] = useState('');
  const [feedback, setFeedback] = useState<{ marked: number; notFound: string[] } | null>(null);

  const handleApply = () => {
    if (!rollInput.trim()) return;
    const res = markBulkAbsentByRollNumbers(rollInput);
    setFeedback({ marked: res.markedAbsent, notFound: res.notFound });

    setTimeout(() => {
      onClose();
      setRollInput('');
      setFeedback(null);
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Paste Absent Roll Numbers"
      subtitle="Fast sub-20s workflow: Paste roll numbers separated by commas, spaces, or lines."
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">
            Absent Roll Numbers (e.g. 4, 12, 18, 27, 33)
          </label>
          <textarea
            rows={4}
            placeholder="Paste roll numbers here... e.g. 4, 12, 18 or list on separate lines"
            value={rollInput}
            onChange={(e) => setRollInput(e.target.value)}
            className="w-full p-4 text-sm bg-[#fafafc] border border-[#e0e0e0] rounded-2xl focus:bg-white focus:border-[#0066cc] focus:outline-none font-mono"
          />
        </div>

        {feedback && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Successfully marked <strong className="font-bold">{feedback.marked}</strong> roll numbers as Absent.
              {feedback.notFound.length > 0 && ` (Not found: ${feedback.notFound.join(', ')})`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[#e0e0e0]">
          <p className="text-[11px] text-[#7a7a7a]">
            All unpasted students in this session will remain <strong>Present</strong>.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="pearl" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApply}>
              Apply Absent Rolls
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
