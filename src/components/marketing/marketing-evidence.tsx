import Link from 'next/link';
import { ArrowUpRight, CircleAlert } from 'lucide-react';
import { ILLUSTRATIVE_PROSPECTS } from '@/mocks/prospects.mock';
import { EvidenceExplorer } from './evidence-explorer';

export function MarketingEvidence() {
  const prospect = ILLUSTRATIVE_PROSPECTS[0];
  const confidence =
    prospect.confidenceScore ??
    Math.min(96, Math.max(72, prospect.matchScore - 3));

  return (
    <section id="evidence" className="marketing-section bg-surface">
      <div className="marketing-container">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div>
            <p className="text-accent-text text-sm font-semibold">
              Evidence &amp; explainable intelligence
            </p>
            <h2 className="font-display mt-4 text-[clamp(36px,4.4vw,58px)] leading-[1.02] font-semibold tracking-[-0.04em]">
              A score is only the beginning.
            </h2>
            <p className="text-text-secondary mt-6 max-w-[470px] text-lg leading-relaxed">
              Review why an account fits, which sources support it, how
              confident the record is, and what still needs verification.
            </p>

            <div className="bg-app rounded-card mt-8 max-w-[470px] p-5 sm:p-6">
              <p className="text-text-secondary text-sm">
                Illustrative account
              </p>
              <p className="font-display mt-1 text-2xl font-semibold">
                {prospect.name}
              </p>
              <p className="text-text-secondary mt-1 text-sm">
                {prospect.subIndustry} · {prospect.location}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-secondary text-sm">
                    Weighted fit score
                  </p>
                  <p className="font-display mt-1 text-4xl font-semibold tabular-nums">
                    {prospect.matchScore}
                  </p>
                </div>
                <div className="border-border-subtle border-l pl-5">
                  <p className="text-text-secondary text-sm">Confidence</p>
                  <p className="font-display mt-1 text-4xl font-semibold tabular-nums">
                    {confidence}%
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {prospect.fitFactors.map((factor) => (
                  <li
                    key={factor.label}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-text-secondary">{factor.label}</span>
                    <span className="shrink-0 font-semibold tabular-nums">
                      {factor.weight}%
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/analyze/${prospect.relatedAnalysisId}/results`}
                className="marketing-button-secondary mt-6 w-full"
              >
                Open illustrative report
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="min-w-0">
            <div className="bg-brand-soft text-accent-text rounded-btn mb-4 inline-flex px-3 py-1.5 text-sm font-semibold">
              Illustrative prototype data — not a live customer result
            </div>
            <EvidenceExplorer
              evidence={prospect.evidence}
              fitFactor={prospect.fitFactors[0]}
            />
            <div className="bg-app rounded-card mt-4 flex items-start gap-3 p-5">
              <CircleAlert
                className="text-brand mt-0.5 h-5 w-5 shrink-0"
                aria-hidden="true"
              />
              <div>
                <h3 className="text-sm font-semibold">Verification gaps</h3>
                <p className="text-text-secondary mt-2 text-base leading-relaxed">
                  Exact external vendor budget and procurement timing are not
                  publicly confirmed. A reviewer should validate both during
                  discovery before outreach.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
