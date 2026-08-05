import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-x-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white text-[#1d1d1f] w-full max-w-[95vw] sm:max-w-2xl rounded-2xl shadow-2xl border border-[#e0e0e0] z-10 overflow-hidden flex flex-col max-h-[92vh] mx-auto">
        {/* Modal Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-[#e0e0e0] flex items-center justify-between bg-[#fafafc] shrink-0">
          <div className="pr-2">
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[#1d1d1f] leading-snug break-words">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-[#7a7a7a] mt-0.5 break-words">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0f0f0] hover:bg-[#e0e0e0] flex items-center justify-center text-[#1d1d1f] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 break-words">{children}</div>
      </div>
    </div>
  );
};
