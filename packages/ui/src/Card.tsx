import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'parchment' | 'dark' | 'utility';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'light',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'p-6 transition-all duration-200';

  const variantStyles = {
    light: 'bg-white text-[#1d1d1f] border border-[#e0e0e0] rounded-2xl',
    parchment: 'bg-[#f5f5f7] text-[#1d1d1f] border border-[#e0e0e0]/60 rounded-2xl',
    dark: 'bg-[#272729] text-white rounded-2xl',
    utility: 'bg-white text-[#1d1d1f] border border-[#e0e0e0] rounded-xl hover:border-[#0066cc]/40',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variantStyles[variant], className))} {...props}>
      {children}
    </div>
  );
};
