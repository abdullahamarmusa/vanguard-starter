import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number; // 0..100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  accent?: 'teal' | 'brand' | 'success';
  className?: string;
}

export function ProgressRing({
  value,
  size = 112,
  strokeWidth = 9,
  label,
  sublabel,
  accent = 'teal',
  className,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clamped / 100) * circumference;
  const gradientId = `vanguard-ring-${accent}-${size}`;

  const stops = {
    teal: { start: '#00B6B6', end: '#22C55E' },
    brand: { start: '#F59E0B', end: '#F97316' },
    success: { start: '#22C55E', end: '#00B6B6' },
  }[accent];

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className,
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? `${clamped}%`} ${sublabel ?? ''}`.trim()}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stops.start} />
            <stop offset="100%" stopColor={stops.end} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="ease-vanguard transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-text-primary text-xl font-bold tracking-tight">
          {label ?? `${clamped}%`}
        </span>
        {sublabel && (
          <span className="text-text-secondary text-[11px]">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
