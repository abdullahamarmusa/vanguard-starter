'use client';

import React, { useId } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFocusTrap } from '@/lib/hooks/use-focus-trap';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: 'right' | 'left';
  widthClass?: string;
  children: React.ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  side = 'right',
  widthClass = 'max-w-lg',
  children,
}: DrawerProps) {
  const titleId = useId();
  const drawerRef = useFocusTrap<HTMLDivElement>(open, onClose);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        tabIndex={-1}
        className={cn(
          'border-border-subtle bg-surface shadow-elevated relative z-10 flex h-full w-full flex-col focus:outline-none',
          widthClass,
          side === 'right' ? 'ml-auto border-l' : 'mr-auto border-r',
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
            aria-label="Close panel"
            className="rounded-btn text-text-secondary hover:bg-hover hover:text-text-primary p-1.5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
