interface ChartRow {
  [key: string]: string | number;
}

interface ChartSeries {
  key: string;
  label: string;
  color: string;
  fillOpacity?: number;
}

export function SeriesChart({
  data,
  xKey,
  series,
  variant = 'line',
  height = 220,
}: {
  data: ChartRow[];
  xKey: string;
  series: ChartSeries[];
  variant?: 'line' | 'area';
  height?: number;
}) {
  const width = 720;
  const padding = { top: 14, right: 14, bottom: 30, left: 42 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const max = Math.max(
    1,
    ...data.flatMap((row) => series.map(({ key }) => Number(row[key]) || 0)),
  );
  const px = (index: number) =>
    padding.left +
    (data.length < 2 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
  const py = (value: number) =>
    padding.top + plotHeight - (value / max) * plotHeight;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      role="img"
      aria-label="Illustrative performance chart"
    >
      {[0, 1, 2, 3].map((step) => {
        const y = padding.top + (plotHeight * step) / 3;
        const value = Math.round((max * (3 - step)) / 3);
        return (
          <g key={step}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={y}
              y2={y}
              stroke="var(--border-subtle)"
              strokeDasharray="3 4"
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              fill="var(--text-secondary)"
              fontSize="10"
            >
              {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
            </text>
          </g>
        );
      })}
      {series.map(({ key, color, fillOpacity = 0.15 }) => {
        const points = data.map(
          (row, index) => `${px(index)},${py(Number(row[key]) || 0)}`,
        );
        const path = `M ${points.join(' L ')}`;
        const areaPath = `${path} L ${px(data.length - 1)},${padding.top + plotHeight} L ${px(0)},${padding.top + plotHeight} Z`;
        return (
          <g key={key}>
            {variant === 'area' && (
              <path d={areaPath} fill={color} fillOpacity={fillOpacity} />
            )}
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth="2.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {data.map((row, index) => (
              <circle
                key={`${key}-${String(row[xKey])}`}
                cx={px(index)}
                cy={py(Number(row[key]) || 0)}
                r="2.5"
                fill={color}
              >
                <title>{`${row[xKey]} · ${key}: ${Number(row[key]).toLocaleString()}`}</title>
              </circle>
            ))}
          </g>
        );
      })}
      {data.map((row, index) => (
        <text
          key={String(row[xKey])}
          x={px(index)}
          y={height - 7}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="10"
        >
          {row[xKey]}
        </text>
      ))}
    </svg>
  );
}
