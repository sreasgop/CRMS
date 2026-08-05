import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        <input
          ref={ref}
          className={twMerge(
            clsx(
              'w-full h-11 px-4 text-sm bg-white text-[#1d1d1f] border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all placeholder:text-[#7a7a7a]',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )
          )}
          {...props}
        />
        {error && <span className="text-xs text-red-500 px-3 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
