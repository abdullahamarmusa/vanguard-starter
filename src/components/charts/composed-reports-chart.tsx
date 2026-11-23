'use client';

import { useState } from 'react';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface ComposedPoint {
  date: string;
  prospects: number;
  leads: number;
  revenue: number;
}

interface ComposedReportsChartProps {
  data: ComposedPoint[];
  visible: {
    prospects: boolean;
    leads: boolean;
    revenue: boolean;
  };
  height?: number;
}

const WIDTH = 720;
const HEIGHT = 265;
const PADDING = { top: 18, right: 54, bottom: 32, left: 42 };

export function ComposedReportsChart({
  data,
  visible,
  height = 270,
}: ComposedReportsChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const maxCount = Math.max(
    1,
    ...data.flatMap((point) => [point.prospects, point.leads]),
  );
  const maxRevenue = Math.max(1, ...data.map((point) => point.revenue));
  const x = (index: number) =>
    PADDING.left +
    (data.length < 2 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
  const yCount = (value: number) =>
    PADDING.top + plotHeight - (value / maxCount) * plotHeight;
  const yRevenue = (value: number) =>
    PADDING.top + plotHeight - (value / maxRevenue) * plotHeight;
  const line = (key: 'leads' | 'revenue') =>
    data
      .map(
        (point, index) =>
          `${index === 0 ? 'M' : 'L'} ${x(index)} ${key === 'leads' ? yCount(point.leads) : yRevenue(point.revenue)}`,
      )
      .join(' ');

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Illustrative reports performance overview chart"
        onMouseLeave={() => setActiveIndex(null)}
      >
        {[0, 1, 2, 3].map((step) => {
          const y = PADDING.top + (plotHeight / 3) * step;
          const count = Math.round((maxCount * (3 - step)) / 3);
          return (
            <g key={step}>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={y}
                y2={y}
                stroke="var(--border-subtle)"
                strokeDasharray="3 4"
              />
              <text
                x={PADDING.left - 8}
                y={y + 4}
                textAnchor="end"
                fill="var(--text-secondary)"
                fontSize="10"
              >
                {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
              </text>
              <text
                x={WIDTH - PADDING.right + 8}
                y={y + 4}
                fill="#F59E0B"
                fontSize="10"
              >
                ${Math.round((maxRevenue * (3 - step)) / 3000)}k
              </text>
            </g>
          );
        })}
        {visible.prospects &&
          data.map((point, index) => {
            const barWidth = Math.min(
              20,
              plotWidth / Math.max(data.length * 2, 1),
            );
            const barY = yCount(point.prospects);
            return (
              <rect
                key={`bar-${point.date}`}
                x={x(index) - barWidth / 2}
                y={barY}
                width={barWidth}
                height={PADDING.top + plotHeight - barY}
                rx="3"
                fill="#3B82F6"
                fillOpacity=".78"
                onMouseEnter={() => setActiveIndex(index)}
              >
                <title>{`${point.date}: ${formatNumber(point.prospects)} prospects`}</title>
              </rect>
            );
          })}
        {visible.leads && (
          <path
            d={line('leads')}
            fill="none"
            stroke="#00B6B6"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {visible.revenue && (
          <path
            d={line('revenue')}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {data.map((point, index) => (
          <g
            key={`point-${point.date}`}
            onMouseEnter={() => setActiveIndex(index)}
          >
            {visible.leads && (
              <circle
                cx={x(index)}
                cy={yCount(point.leads)}
                r={activeIndex === index ? 4 : 3}
                fill="#00B6B6"
              >
                <title>{`${point.date}: ${formatNumber(point.leads)} qualified leads`}</title>
              </circle>
            )}
            {visible.revenue && (
              <circle
                cx={x(index)}
                cy={yRevenue(point.revenue)}
                r={activeIndex === index ? 4 : 3}
                fill="#F59E0B"
              >
                <title>{`${point.date}: ${formatCurrency(point.revenue)} illustrative revenue`}</title>
              </circle>
            )}
            <text
              x={x(index)}
              y={HEIGHT - 8}
              textAnchor="middle"
              fill="var(--text-secondary)"
              fontSize="10"
            >
              {point.date}
            </text>
            <rect
              x={x(index) - 15}
              y={PADDING.top}
              width="30"
              height={plotHeight}
              fill="transparent"
            />
          </g>
        ))}
      </svg>
      {activeIndex !== null && data[activeIndex] && (
        <div
          className="border-border-strong bg-elevated shadow-card pointer-events-none absolute top-2 right-2 rounded-lg border px-3 py-2 text-[11px]"
          role="status"
        >
          <p className="text-text-primary mb-1 font-semibold">
            {data[activeIndex].date}
          </p>
          {visible.prospects && (
            <p className="text-blue-400">
              Prospects: {formatNumber(data[activeIndex].prospects)}
            </p>
          )}
          {visible.leads && (
            <p className="text-teal-brand">
              Qualified leads: {formatNumber(data[activeIndex].leads)}
            </p>
          )}
          {visible.revenue && (
            <p className="text-brand">
              Revenue (illustrative):{' '}
              {formatCurrency(data[activeIndex].revenue)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
