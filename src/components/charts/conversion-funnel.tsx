import React from 'react';
import { formatNumber } from '@/lib/utils';
import type { FunnelStage } from '@/types/vanguard';

export function ConversionFunnel({ stages }: { stages: FunnelStage[] }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-col items-center gap-2">
        {stages.map((stage) => (
          <div
            key={stage.label}
            className="flex flex-col items-center justify-center rounded-lg px-3 py-2.5 text-center transition-transform duration-150 hover:scale-[1.01]"
            style={{
              width: `${stage.widthPercent}%`,
              minWidth: '120px',
              background: `linear-gradient(135deg, ${stage.color}, ${stage.color}CC)`,
            }}
          >
            <span className="text-base leading-tight font-bold text-white tabular-nums">
              {formatNumber(stage.count)}
            </span>
            <span className="text-[11px] font-medium text-white/90">
              {stage.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-row justify-around gap-3 sm:w-40 sm:flex-col sm:justify-center sm:gap-5">
        {stages
          .filter((s) => s.rateLabel && s.rateValue)
          .map((stage) => (
            <div key={stage.rateLabel} className="flex items-start gap-2.5">
              <span
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: stage.color }}
              />
              <div>
                <p className="text-text-primary text-base leading-tight font-bold tabular-nums">
                  {stage.rateValue}
                </p>
                <p className="text-text-secondary text-[11px]">
                  {stage.rateLabel}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
