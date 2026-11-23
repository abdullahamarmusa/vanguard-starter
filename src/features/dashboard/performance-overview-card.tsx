'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceAreaChart } from '@/components/charts/performance-chart';
import { mockVanguardAdapter } from '@/lib/data-access/mock-adapter';
import type { DateRangePreset } from '@/types/vanguard';
import { cn } from '@/lib/utils';

type MetricTab = 'overview' | 'prospects' | 'campaigns' | 'revenue';

export function PerformanceOverviewCard() {
  const [range, setRange] = useState<DateRangePreset>('30D');
  const [tab, setTab] = useState<MetricTab>('overview');
  const [toggles, setToggles] = useState({
    prospects: true,
    qualifiedLeads: true,
    revenue: true,
  });

  const series = useMemo(
    () => mockVanguardAdapter.getPerformanceSeries(range),
    [range],
  );

  const effectiveSeries = useMemo(() => {
    if (tab === 'prospects')
      return { prospects: true, qualifiedLeads: true, revenue: false };
    if (tab === 'campaigns')
      return { prospects: false, qualifiedLeads: true, revenue: false };
    if (tab === 'revenue')
      return { prospects: false, qualifiedLeads: false, revenue: true };
    return toggles;
  }, [tab, toggles]);

  return (
    <Card>
      <CardHeader className="flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div>
          <CardTitle>Your Performance Overview</CardTitle>
          <p className="text-text-secondary mt-0.5 text-xs">
            Dual-axis scaling separates count volume (left) from attributed
            revenue USD (right) · Illustrative
          </p>
        </div>
        <select
          aria-label="Select date range"
          value={range}
          onChange={(e) => setRange(e.target.value as DateRangePreset)}
          className="rounded-btn border-border-subtle bg-elevated text-text-primary focus:ring-brand/40 h-8 border px-2.5 text-xs font-medium focus:ring-2 focus:outline-none"
        >
          <option value="7D">Last 7 Days</option>
          <option value="30D">Last 30 Days</option>
          <option value="90D">Last 90 Days</option>
        </select>
      </CardHeader>

      <CardContent>
        <div className="border-border-subtle mb-4 flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          {/* Metric tabs */}
          <div
            className="flex items-center gap-1"
            role="tablist"
            aria-label="Performance view tabs"
          >
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'prospects', label: 'Prospects' },
                { id: 'campaigns', label: 'Qualified' },
                { id: 'revenue', label: 'Revenue' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={tab === item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  'rounded-btn px-3 py-1.5 text-xs font-medium transition-colors',
                  tab === item.id
                    ? 'bg-brand-soft text-brand border-brand-border border'
                    : 'text-text-secondary hover:bg-hover hover:text-text-primary',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Interactive series visibility toggles in Overview tab */}
          {tab === 'overview' && (
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {(
                [
                  { key: 'prospects', label: 'Prospects', color: '#3B82F6' },
                  {
                    key: 'qualifiedLeads',
                    label: 'Qualified Leads',
                    color: '#00B6B6',
                  },
                  { key: 'revenue', label: 'Revenue (USD)', color: '#F59E0B' },
                ] as const
              ).map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() =>
                    setToggles((prev) => {
                      const next = { ...prev, [s.key]: !prev[s.key] };
                      if (
                        !next.prospects &&
                        !next.qualifiedLeads &&
                        !next.revenue
                      )
                        return prev;
                      return next;
                    })
                  }
                  className={cn(
                    'inline-flex items-center gap-1.5 transition-opacity',
                    toggles[s.key]
                      ? 'text-text-primary opacity-100'
                      : 'text-text-secondary opacity-40',
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <PerformanceAreaChart
          data={series}
          visibleSeries={effectiveSeries}
          height={255}
        />
      </CardContent>
    </Card>
  );
}
