import React, { useState } from 'react';
import { Modal, Button, Input } from '@crms/ui';
import { useStudentStore } from '../store/useStudentStore';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { addStudent } = useStudentStore();
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [section, setSection] = useState('Group I');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rollNumber) return;

    addStudent({
      name,
      rollNumber,
      universityId: universityId || undefined,
      section,
      semester: 3,
      phone: '',
      email: '',
    });

    // Reset
    setName('');
    setRollNumber('');
    setUniversityId('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Single Student Record"
      subtitle="Manually register a new student into the database."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">
            Student Full Name *
          </label>
          <Input
            placeholder="e.g. SWAYAM RAJ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">
              Roll Number *
            </label>
            <Input
              placeholder="e.g. 1"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">
              University Student ID
            </label>
            <Input
              placeholder="e.g. 231001102042"
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">Group / Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full h-11 px-4 text-sm bg-white border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0066cc]"
          >
            <option value="Group I">Group I</option>
            <option value="Group II">Group II</option>
            <option value="Section A">Section A</option>
            <option value="Section B">Section B</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e0e0e0]">
          <Button variant="pearl" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Student
          </Button>
        </div>
      </form>
    </Modal>
  );
};
