'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Info } from 'lucide-react';
import { Sparkline } from '@/components/charts/sparkline';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  changeLabel: string;
  trend?: 'up' | 'down' | 'neutral';
  accent: 'blue' | 'teal' | 'orange' | 'purple';
  icon: React.ReactNode;
  sparkline?: number[];
  href?: string;
  tooltip?: string;
}

/**
 * Restrained VANGUARD color discipline (Design Review Section 1.1 & Fix 05):
 * Keep icon surfaces calm & cohesive rather than 4 competing rainbow hues,
 * reserving Golden Orange for primary brand actions and Tropical Teal for live/positive states.
 */
const ACCENT_META = {
  blue: {
    iconBg: 'bg-elevated text-text-primary border-border-subtle',
    sparkColor: '#00B6B6',
  },
  teal: {
    iconBg: 'bg-teal-soft text-teal-brand border-teal-brand/30',
    sparkColor: '#00B6B6',
  },
  orange: {
    iconBg: 'bg-brand-soft text-brand border-brand-border',
    sparkColor: '#F59E0B',
  },
  purple: {
    iconBg: 'bg-elevated text-text-primary border-border-subtle',
    sparkColor: '#F59E0B',
  },
};

export function KpiCard({
  title,
  value,
  changeLabel,
  trend = 'up',
  accent,
  icon,
  sparkline,
  href,
  tooltip,
}: KpiCardProps) {
  const styles = ACCENT_META[accent];

  const inner = (
    <div
      className={cn(
        'group rounded-card border-border-subtle bg-surface shadow-card ease-vanguard relative flex h-full flex-col justify-between gap-3 border p-5 transition-all duration-150',
        href && 'hover:border-border-strong hover:bg-elevated/55',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-text-secondary text-[13px] leading-snug font-medium">
              {title}
            </p>
            {tooltip && (
              <span
                title={tooltip}
                aria-label={tooltip}
                className="text-text-disabled hover:text-text-primary shrink-0"
              >
                <Info className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
          <p className="text-text-primary mt-2 text-[28px] leading-[1.1] font-bold tracking-tight tabular-nums">
            {value}
          </p>
        </div>

        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
            styles.iconBg,
          )}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 pt-1">
        <p
          className={cn(
            'inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums',
            trend === 'up'
              ? 'text-teal-brand'
              : trend === 'down'
                ? 'text-danger'
                : 'text-text-secondary',
          )}
        >
          {trend === 'up' && <ArrowUpRight className="h-3.5 w-3.5" />}
          {trend === 'down' && <ArrowDownRight className="h-3.5 w-3.5" />}
          <span>{changeLabel}</span>
        </p>

        {sparkline && sparkline.length > 1 && (
          <div className="shrink-0">
            <Sparkline
              data={sparkline}
              color={styles.sparkColor}
              width={76}
              height={28}
            />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus-visible:rounded-card block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
