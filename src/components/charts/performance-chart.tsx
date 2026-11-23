'use client';

import React from 'react';
import type { PerformancePoint } from '@/types/vanguard';

interface PerformanceAreaChartProps {
  data: PerformancePoint[];
  visibleSeries: {
    prospects: boolean;
    qualifiedLeads: boolean;
    revenue: boolean;
  };
  height?: number;
}

export function PerformanceAreaChart({
  data,
  visibleSeries,
  height = 250,
}: PerformanceAreaChartProps) {
  const max = Math.max(
    1,
    ...data.flatMap((item) => [
      visibleSeries.prospects ? item.prospects : 0,
      visibleSeries.qualifiedLeads ? item.qualifiedLeads : 0,
      visibleSeries.revenue ? item.revenue / 20 : 0,
    ]),
  );
  const xAt = (index: number) =>
    data.length < 2 ? 250 : 34 + index * (442 / (data.length - 1));
  const yAt = (value: number) => 184 - (value / max) * 156;
  const points = (pick: (item: PerformancePoint) => number) =>
    data.map((item, index) => `${xAt(index)},${yAt(pick(item))}`).join(' ');
  const areaPoints = (pick: (item: PerformancePoint) => number) =>
    `${xAt(0)},184 ${points(pick)} ${xAt(data.length - 1)},184`;

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox="0 0 500 220"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        role="group"
        aria-label="Illustrative performance overview chart"
      >
        <defs>
          <linearGradient id="prospects-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity=".22" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="qualified-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#00B6B6" stopOpacity=".18" />
            <stop offset="100%" stopColor="#00B6B6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity=".16" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[28, 68, 108, 148, 188].map((y) => (
          <line
            key={y}
            x1="30"
            x2="488"
            y1={y}
            y2={y}
            stroke="var(--border-subtle)"
            strokeDasharray="4 5"
          />
        ))}
        {visibleSeries.prospects && (
          <g>
            <polygon
              points={areaPoints((point) => point.prospects)}
              fill="url(#prospects-fill)"
            />
            <polyline
              points={points((point) => point.prospects)}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
            {data.map((point, index) => (
              <circle
                key={`${point.date}-${index}`}
                cx={xAt(index)}
                cy={yAt(point.prospects)}
                r="4"
                fill="#3B82F6"
                stroke="var(--bg-surface)"
                strokeWidth="2"
                tabIndex={0}
                aria-label={`${point.date}: ${point.prospects} prospects`}
              >
                <title>{`${point.date}: ${point.prospects} prospects`}</title>
              </circle>
            ))}
          </g>
        )}
        {visibleSeries.qualifiedLeads && (
          <g>
            <polygon
              points={areaPoints((point) => point.qualifiedLeads)}
              fill="url(#qualified-fill)"
            />
            <polyline
              points={points((point) => point.qualifiedLeads)}
              fill="none"
              stroke="#00B6B6"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
            {data.map((point, index) => (
              <circle
                key={`${point.date}-${index}`}
                cx={xAt(index)}
                cy={yAt(point.qualifiedLeads)}
                r="4"
                fill="#00B6B6"
                stroke="var(--bg-surface)"
                strokeWidth="2"
                tabIndex={0}
                aria-label={`${point.date}: ${point.qualifiedLeads} qualified leads`}
              >
                <title>{`${point.date}: ${point.qualifiedLeads} qualified leads`}</title>
              </circle>
            ))}
          </g>
        )}
        {visibleSeries.revenue && (
          <g>
            <polygon
              points={areaPoints((point) => point.revenue / 20)}
              fill="url(#revenue-fill)"
            />
            <polyline
              points={points((point) => point.revenue / 20)}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
            {data.map((point, index) => (
              <circle
                key={`${point.date}-${index}`}
                cx={xAt(index)}
                cy={yAt(point.revenue / 20)}
                r="4"
                fill="#F59E0B"
                stroke="var(--bg-surface)"
                strokeWidth="2"
                tabIndex={0}
                aria-label={`${point.date}: $${point.revenue.toLocaleString()} attributed revenue`}
              >
                <title>
                  {`${point.date}: $${point.revenue.toLocaleString()} attributed revenue`}
                </title>
              </circle>
            ))}
          </g>
        )}
        {data.map((point, index) => (
          <text
            key={`${point.date}-${index}`}
            x={xAt(index)}
            y="211"
            textAnchor="middle"
            fill="var(--text-disabled)"
            fontSize="10"
          >
            {point.date}
          </text>
        ))}
        <title>
          Illustrative preview trends. Select series controls above to compare
          measures.
        </title>
      </svg>
    </div>
  );
}
