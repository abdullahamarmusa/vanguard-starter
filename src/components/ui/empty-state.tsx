import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-card border-border-strong bg-surface/60 flex flex-col items-center justify-center border border-dashed px-6 py-12 text-center',
        className,
      )}
    >
      <div className="border-brand-border bg-brand-soft text-brand mb-4 flex h-12 w-12 items-center justify-center rounded-xl border">
        {icon}
      </div>
      <h3 className="text-text-primary text-base font-semibold">{title}</h3>
      <p className="text-text-secondary mt-1.5 max-w-md text-sm">
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
