import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Badge } from '@crms/ui';
import { Student } from '@crms/types';
import { User, Phone, Mail, Hash, BookOpen } from 'lucide-react';
import { useStudentStore } from '../store/useStudentStore';

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const { updateStudent } = useStudentStore();

  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [section, setSection] = useState('Group I');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setRollNumber(student.rollNumber);
      setUniversityId(student.universityId || '');
      setSection(student.section);
      setPhone(student.phone || '');
      setEmail(student.email || '');
      setIsEditing(false);
    }
  }, [student]);

  if (!student) return null;

  const handleSave = () => {
    updateStudent(student.id, {
      name,
      rollNumber,
      universityId: universityId || undefined,
      section,
      phone,
      email,
    });
    setIsEditing(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Student Record' : 'Student Profile'}
      subtitle={`Roll #${student.rollNumber} • ${student.section}`}
    >
      <div className="space-y-6">
        {/* Profile Card Summary */}
        <div className="bg-[#fafafc] border border-[#e0e0e0] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0066cc] text-white flex items-center justify-center font-bold text-xl font-display shadow-md">
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">{student.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="blue">Roll #{student.rollNumber}</Badge>
              <Badge variant="gray">{student.section}</Badge>
              <Badge variant="gray">Semester 3</Badge>
            </div>
          </div>
        </div>

        {/* Detailed Fields */}
        {!isEditing ? (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-white border border-[#e0e0e0] rounded-xl">
                <span className="text-xs text-[#7a7a7a] font-medium block mb-1">University Student ID</span>
                <span className="font-mono font-semibold text-[#1d1d1f]">{student.universityId || 'Not set'}</span>
              </div>
              <div className="p-3.5 bg-white border border-[#e0e0e0] rounded-xl">
                <span className="text-xs text-[#7a7a7a] font-medium block mb-1">Section / Group</span>
                <span className="font-semibold text-[#1d1d1f]">{student.section}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-white border border-[#e0e0e0] rounded-xl flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#7a7a7a]" />
                <div>
                  <span className="text-xs text-[#7a7a7a] block">Phone Number</span>
                  <span className="font-medium text-[#1d1d1f]">{student.phone || 'Not provided'}</span>
                </div>
              </div>
              <div className="p-3.5 bg-white border border-[#e0e0e0] rounded-xl flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#7a7a7a]" />
                <div>
                  <span className="text-xs text-[#7a7a7a] block">Email Address</span>
                  <span className="font-medium text-[#1d1d1f]">{student.email || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">Roll Number</label>
                <Input value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#7a7a7a] block mb-1">University Student ID</label>
                <Input value={universityId} onChange={(e) => setUniversityId(e.target.value)} />
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
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e0e0e0]">
          {!isEditing ? (
            <>
              <Button variant="pearl" onClick={onClose}>
                Close
              </Button>
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
            </>
          ) : (
            <>
              <Button variant="pearl" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
