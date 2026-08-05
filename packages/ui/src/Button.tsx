import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'pearl' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-normal transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0071e3] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variantStyles = {
    primary: 'bg-[#0066cc] text-white hover:bg-[#0071e3] rounded-full shadow-sm',
    secondary: 'bg-transparent text-[#0066cc] border border-[#0066cc] rounded-full hover:bg-[#0066cc]/5',
    dark: 'bg-[#1d1d1f] text-white rounded-lg hover:bg-black',
    pearl: 'bg-[#fafafc] text-[#333333] border border-[#f0f0f0] rounded-xl hover:bg-[#f5f5f7]',
    ghost: 'bg-transparent text-[#0066cc] hover:underline',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-sm px-4 py-2 h-10',
    lg: 'text-base px-6 py-3 h-12',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variantStyles[variant], sizeStyles[size], className))}
      {...props}
    >
      {children}
    </button>
  );
};
