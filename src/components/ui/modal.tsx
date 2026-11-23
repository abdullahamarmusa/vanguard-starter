'use client';

import React, { useId } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFocusTrap } from '@/lib/hooks/use-focus-trap';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
}: ModalProps) {
  const titleId = useId();
  const dialogRef = useFocusTrap<HTMLDivElement>(open, onClose);

  if (!open) return null;

  const widths: Record<NonNullable<ModalProps['size']>, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          'rounded-modal border-border-subtle bg-surface shadow-elevated relative z-10 w-full border focus:outline-none',
          'flex max-h-[90vh] flex-col overflow-hidden',
          widths[size],
        )}
      >
        <div className="border-border-subtle flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            <h2
              id={titleId}
              className="text-text-primary text-base font-semibold"
            >
              {title}
            </h2>
            {description && (
              <p className="text-text-secondary mt-0.5 text-xs">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-btn text-text-secondary hover:bg-hover hover:text-text-primary p-1.5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
