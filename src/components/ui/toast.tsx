'use client';

import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, dismissToast } = usePrototypeStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed right-5 bottom-5 z-[60] flex w-full max-w-sm flex-col gap-2.5"
    >
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="text-success h-4 w-4 shrink-0" />,
          error: <AlertCircle className="text-danger h-4 w-4 shrink-0" />,
          warning: <TriangleAlert className="text-warning h-4 w-4 shrink-0" />,
          info: <Info className="text-info h-4 w-4 shrink-0" />,
        };
        const borderMap = {
          success: 'border-success/35',
          error: 'border-danger/35',
          warning: 'border-warning/35',
          info: 'border-info/35',
        };

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'rounded-card bg-elevated shadow-elevated pointer-events-auto flex items-start gap-3 border px-4 py-3',
              borderMap[toast.variant],
            )}
          >
            <div className="mt-0.5">{iconMap[toast.variant]}</div>
            <div className="min-w-0 flex-1">
              <p className="text-text-primary text-sm font-medium">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-text-secondary mt-0.5 text-xs">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="rounded-control text-text-secondary hover:bg-hover hover:text-text-primary p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
