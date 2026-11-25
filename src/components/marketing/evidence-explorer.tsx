'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import type { EvidenceRecord, FitFactor } from '@/types/vanguard';

interface EvidenceExplorerProps {
  evidence: EvidenceRecord[];
  fitFactor: FitFactor;
}

const verificationLabels: Record<EvidenceRecord['verification'], string> = {
  verified: 'Verified fact',
  provider_sourced: 'Provider-sourced',
  inferred: 'Inferred signal',
  ai_recommendation: 'AI recommendation',
  unverified: 'Unverified',
};

export function EvidenceExplorer({
  evidence,
  fitFactor,
}: EvidenceExplorerProps) {
  const [selectedId, setSelectedId] = useState(evidence[0]?.id ?? '');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected =
    evidence.find((record) => record.id === selectedId) ?? evidence[0];

  const selectByKeyboard = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % evidence.length;
    else if (event.key === 'ArrowLeft')
      nextIndex = (index - 1 + evidence.length) % evidence.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = evidence.length - 1;
    else return;

    event.preventDefault();
    setSelectedId(evidence[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  if (!selected) return null;

  return (
    <div
      data-ui
      className="bg-surface rounded-card border-border-subtle border"
    >
      <div className="p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-text-secondary text-xs font-semibold tracking-[0.12em] uppercase">
              Weighted fit factor
            </p>
            <h3 className="mt-2 text-lg font-semibold">{fitFactor.label}</h3>
          </div>
          <p className="font-display text-3xl font-semibold tabular-nums">
            {fitFactor.score}
            <span className="text-text-muted text-base">/100</span>
          </p>
        </div>
        <div
          className="bg-elevated mt-5 h-2 overflow-hidden rounded-full"
          role="progressbar"
          aria-label={`${fitFactor.label} score`}
          aria-valuenow={fitFactor.score}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-[#d97706]"
            style={{ width: `${fitFactor.score}%` }}
          />
        </div>
        <p className="text-text-secondary mt-4 text-sm leading-relaxed">
          {fitFactor.explanation} Weighted at {fitFactor.weight}% of the total
          qualification model.
        </p>
      </div>

      <div className="border-border-subtle border-t">
        <div
          role="tablist"
          aria-label="Supporting evidence"
          className="border-border-subtle flex border-b"
        >
          {evidence.map((record, index) => (
            <button
              key={record.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`evidence-tab-${record.id}`}
              type="button"
              role="tab"
              aria-selected={record.id === selected.id}
              aria-controls={`evidence-panel-${record.id}`}
              tabIndex={record.id === selected.id ? 0 : -1}
              onClick={() => setSelectedId(record.id)}
              onKeyDown={(event) => selectByKeyboard(event, index)}
              className="text-text-secondary hover:bg-hover aria-selected:text-text-primary aria-selected:border-brand relative min-h-12 min-w-0 flex-1 border-b-2 border-transparent px-3 text-sm font-semibold"
            >
              Evidence {index + 1}
            </button>
          ))}
        </div>

        {evidence.map((record) => (
          <div
            key={record.id}
            id={`evidence-panel-${record.id}`}
            role="tabpanel"
            aria-labelledby={`evidence-tab-${record.id}`}
            tabIndex={0}
            hidden={record.id !== selected.id}
            className="min-h-[280px] p-5 sm:p-7"
          >
            <p className="text-text-secondary inline-flex items-center gap-2 text-xs font-semibold">
              {record.verification === 'verified' ? (
                <CheckCircle2
                  className="text-success h-4 w-4"
                  aria-hidden="true"
                />
              ) : (
                <Sparkles className="text-brand h-4 w-4" aria-hidden="true" />
              )}
              {verificationLabels[record.verification]}
            </p>
            <h3 className="mt-4 text-xl leading-snug font-semibold tracking-tight">
              {record.title}
            </h3>
            <p className="text-text-secondary mt-3 text-sm leading-relaxed">
              {record.summary}
            </p>
            <dl className="border-border-subtle mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2">
              <div>
                <dt className="text-text-muted text-xs">Source</dt>
                <dd className="mt-1 text-sm font-medium">
                  {record.sourceLabel}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Prototype timestamp</dt>
                <dd className="mt-1 text-sm font-medium">
                  {record.observedAt}
                </dd>
              </div>
            </dl>
            <a
              href={record.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-text-primary mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold hover:underline"
            >
              Visit source
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
