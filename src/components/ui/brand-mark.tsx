import React from 'react';
import { cn } from '@/lib/utils';

export function BrandMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="9" fill="#F59E0B" fillOpacity="0.14" />
      <rect
        x="0.75"
        y="0.75"
        width="34.5"
        height="34.5"
        rx="8.25"
        stroke="#F59E0B"
        strokeOpacity="0.38"
        strokeWidth="1.5"
      />
      <path
        d="M9.5 10.5H14.6L18 20.6L21.4 10.5H26.5L20.3 26.5H15.7L9.5 10.5Z"
        fill="url(#vanguard_v_grad)"
      />
      <defs>
        <linearGradient
          id="vanguard_v_grad"
          x1="10"
          y1="10"
          x2="26"
          y2="27"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}
