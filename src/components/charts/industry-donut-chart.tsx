'use client';

import React, { useMemo, useState } from 'react';
import type { IndustryDistributionItem } from '@/types/vanguard';

interface IndustryDonutChartProps {
  data: IndustryDistributionItem[];
  onSelectIndustry?: (industry: string) => void;
}

export function IndustryDonutChart({
  data,
  onSelectIndustry,
}: IndustryDonutChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = data[activeIndex];
  const gradient = useMemo(() => {
    const result = data.reduce<{ cursor: number; stops: string[] }>(
      (state, item) => ({
        cursor: state.cursor + item.percentage,
        stops: [
          ...state.stops,
          `${item.color} ${state.cursor}% ${state.cursor + item.percentage}%`,
        ],
      }),
      { cursor: 0, stops: [] },
    );
    return `conic-gradient(${result.stops.join(',')})`;
  }, [data]);

  return (
    <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div
        className="relative grid h-[150px] w-[150px] shrink-0 place-items-center rounded-full"
        style={{ background: gradient }}
        aria-label="Illustrative industry distribution chart"
      >
        <div className="bg-surface grid h-[102px] w-[102px] place-items-center rounded-full text-center">
          {current ? (
            <>
              <span className="text-text-primary text-xl font-bold">
                {current.percentage}%
              </span>
              <span className="text-text-secondary max-w-[84px] truncate text-[11px]">
                {current.industry}
              </span>
            </>
          ) : (
            <span className="text-text-secondary text-xs">No data</span>
          )}
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col gap-1">
        {data.map((item, idx) => (
          <button
            key={item.industry}
            type="button"
            onMouseEnter={() => setActiveIndex(idx)}
            onFocus={() => setActiveIndex(idx)}
            onClick={() => onSelectIndustry?.(item.industry)}
            className="rounded-btn hover:bg-hover focus-visible:ring-brand flex min-h-8 items-center justify-between px-2 py-1 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="text-text-primary flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.industry}</span>
            </span>
            <span className="text-text-secondary font-medium tabular-nums">
              {item.percentage}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
