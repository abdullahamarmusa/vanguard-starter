import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'brand'
    | 'teal'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'ai';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-elevated text-text-secondary border-border-subtle',
    brand: 'bg-brand-soft text-brand border-brand-border',
    teal: 'bg-teal-soft text-teal-brand border-teal-brand/30',
    success: 'bg-success/15 text-success border-success/30',
    warning: 'bg-warning/15 text-warning border-warning/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
    info: 'bg-info/15 text-info border-info/30',
    ai: 'bg-ai/15 text-ai border-ai/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] leading-tight font-medium whitespace-nowrap',
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
