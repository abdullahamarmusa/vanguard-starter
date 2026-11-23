'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={Boolean(error)}
        className={cn(
          'rounded-btn bg-app/70 text-text-primary placeholder:text-text-disabled h-10 w-full border px-3 text-sm',
          'focus:ring-brand/40 focus:border-brand transition-colors duration-150 focus:ring-2 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-danger focus:ring-danger/40 focus:border-danger'
            : 'border-border-subtle hover:border-border-strong',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={Boolean(error)}
        className={cn(
          'rounded-btn bg-app/70 text-text-primary placeholder:text-text-disabled w-full border px-3 py-2.5 text-sm',
          'focus:ring-brand/40 focus:border-brand transition-colors duration-150 focus:ring-2 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-danger focus:ring-danger/40 focus:border-danger'
            : 'border-border-subtle hover:border-border-strong',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
