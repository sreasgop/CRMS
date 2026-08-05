import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  variant?: 'blue' | 'gray' | 'green' | 'amber' | 'red';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'blue', children, className }) => {
  const variantStyles = {
    blue: 'bg-[#0066cc]/10 text-[#0066cc] border-[#0066cc]/20',
    gray: 'bg-[#f5f5f7] text-[#1d1d1f] border-[#e0e0e0]',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          variantStyles[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
};
