'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'teal';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-brand text-[#08090C] hover:bg-brand-hover active:scale-[0.99] shadow-sm font-semibold',
      secondary:
        'bg-elevated text-text-primary border border-border-subtle hover:bg-hover hover:border-border-strong font-medium',
      outline:
        'bg-transparent text-text-primary border border-border-subtle hover:bg-hover hover:border-border-strong font-medium',
      ghost:
        'bg-transparent text-text-secondary hover:text-text-primary hover:bg-hover font-medium',
      danger:
        'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25 font-medium',
      teal: 'bg-teal-brand text-[#0D0E11] hover:opacity-90 font-semibold',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      xs: 'h-8 px-2.5 text-xs rounded-control gap-1.5',
      sm: 'h-9 px-3 text-xs rounded-btn gap-1.5',
      md: 'h-11 px-4 text-sm rounded-btn gap-2',
      lg: 'h-[48px] px-5 text-sm rounded-btn gap-2',
      icon: 'h-11 w-11 rounded-btn justify-center',
    };

    return (
      <button
        ref={ref}
        type={props.type ?? 'button'}
        disabled={disabled || loading}
        className={cn(
          'ease-vanguard inline-flex items-center justify-center whitespace-nowrap transition-all duration-150',
          'select-none disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <span
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
