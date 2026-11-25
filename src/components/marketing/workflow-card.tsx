import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { WorkflowStage } from './workflow-data';
import { WorkflowStagePreview } from './workflow-previews';

interface WorkflowCardProps {
  stage: WorkflowStage;
  index: number;
}

type WorkflowCardStyle = CSSProperties & {
  '--stack-index': number;
  '--stack-top': string;
  '--stack-layer': number;
};

export function WorkflowCard({ stage, index }: WorkflowCardProps) {
  // Precomputed custom properties keep sticky offsets compatible without
  // relying on newer calc() multiplication syntax.
  const style: WorkflowCardStyle = {
    '--stack-index': index,
    '--stack-top': `${84 + index * 20}px`,
    '--stack-layer': 10 + index,
  };

  return (
    <li className="workflow-card" style={style}>
      <article
        className="workflow-card__surface flex flex-col"
        aria-labelledby={`workflow-stage-${stage.id}-title`}
      >
        <div className="grid flex-1 gap-7 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] lg:items-stretch lg:gap-10">
          <div className="flex min-w-0 flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-[#b45309] tabular-nums">
                  {stage.number}
                </span>
                <span
                  className="h-px w-5 shrink-0 bg-[#f59e0b]"
                  aria-hidden="true"
                />
                <span className="text-[11px] font-semibold tracking-[0.08em] text-[#586276] uppercase">
                  {stage.label}
                </span>
              </div>

              <h3
                id={`workflow-stage-${stage.id}-title`}
                className="font-display mt-4 text-[19px] leading-[1.28] font-semibold tracking-[-0.02em] text-[#111318] [text-wrap:balance] sm:text-[22px] lg:text-[23px]"
              >
                {stage.headline}
              </h3>

              <p className="mt-3 text-[13.5px] leading-[1.6] text-[#4a5365] sm:text-sm">
                {stage.description}
              </p>

              <dl className="mt-5 divide-y divide-[#e2e8f0] border-y border-[#e2e8f0] text-[11.5px] leading-[1.5]">
                <div className="grid grid-cols-[58px_1fr] gap-3 py-2">
                  <dt className="font-semibold text-[#111318]">Input</dt>
                  <dd className="text-[#4a5365]">{stage.input}</dd>
                </div>
                <div className="grid grid-cols-[58px_1fr] gap-3 py-2">
                  <dt className="font-semibold text-[#111318]">Process</dt>
                  <dd className="text-[#4a5365]">{stage.process}</dd>
                </div>
                <div className="grid grid-cols-[58px_1fr] gap-3 py-2">
                  <dt className="font-semibold text-[#0f766e]">Output</dt>
                  <dd className="font-medium text-[#111318]">{stage.output}</dd>
                </div>
              </dl>
            </div>

            <div className="pt-1">
              <Link
                href={stage.route}
                className="group inline-flex min-h-11 items-center gap-2.5 rounded-lg bg-[#111318] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b45309]"
              >
                <span>{stage.ctaLabel}</span>
                <ArrowRight
                  className="h-4 w-4 text-[#f59e0b] transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
            <WorkflowStagePreview stageId={stage.id} />
          </div>
        </div>
      </article>
    </li>
  );
}
