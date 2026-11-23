'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Ban,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Download,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { usePrototypeStore } from '@/store/prototype-context';
import {
  downloadTextFile,
  getMatchScoreTone,
  getVerificationMeta,
} from '@/lib/utils';
import type { ProspectCompany } from '@/types/vanguard';

interface CompanyIntelligenceDrawerProps {
  company: ProspectCompany | null;
  onClose: () => void;
  onAddToCampaign: (companyId: string) => void;
}

export function CompanyIntelligenceDrawer({
  company,
  onClose,
  onAddToCampaign,
}: CompanyIntelligenceDrawerProps) {
  const {
    campaigns,
    toggleSaveProspect,
    markProspectReviewed,
    excludeProspect,
    enrollProspectsInCampaign,
    pushToast,
  } = usePrototypeStore();
  const [draftGenerated, setDraftGenerated] = useState(false);

  if (!company) return null;

  const tone = getMatchScoreTone(company.matchScore);
  const confidence =
    company.confidenceScore ??
    Math.min(96, Math.max(72, company.matchScore - 3));
  const missingInfo = company.missingInfo ?? [
    'Exact Q4 external vendor budget allocation is not publicly disclosed.',
    'Primary procurement timeline should be confirmed during initial discovery call.',
  ];

  const handleGenerateDraft = () => {
    const defaultCampaign = campaigns[0];
    if (defaultCampaign) {
      enrollProspectsInCampaign(defaultCampaign.id, [company.id]);
      setDraftGenerated(true);
    } else {
      pushToast({
        title: 'Create a campaign first',
        description:
          'Outreach drafts are governed inside Campaigns with human approval.',
        variant: 'warning',
      });
    }
  };

  const handleExportSingle = () => {
    const doc = [
      `# ${company.name} — VANGUARD Intelligence Dossier (Illustrative)`,
      `Website: ${company.website}`,
      `Industry: ${company.industry} (${company.subIndustry})`,
      `Size: ${company.employeeRange} | Location: ${company.location}`,
      `Fit Score: ${company.matchScore}% (${tone.label}) | Confidence: ${confidence}%`,
      ``,
      `## Why This Company Matches`,
      ...company.whyMatch.map((w) => `- ${w}`),
      ``,
      `## Evidence & Sources`,
      ...company.evidence.map(
        (ev) =>
          `- [${getVerificationMeta(ev.verification).label}] ${ev.title}: ${ev.summary} (${ev.sourceUrl})`,
      ),
      ``,
      `## Uncertainties & Missing Information`,
      ...missingInfo.map((m) => `- ${m}`),
    ].join('\n');
    downloadTextFile(
      `${company.id}-dossier.md`,
      doc,
      'text/markdown;charset=utf-8',
    );
    pushToast({
      title: `Exported ${company.name} dossier`,
      variant: 'success',
    });
  };

  return (
    <Drawer
      open={Boolean(company)}
      onClose={() => {
        setDraftGenerated(false);
        onClose();
      }}
      title={company.name}
      description={`${company.industry} · ${company.location} · Company Intelligence`}
      widthClass="max-w-xl"
    >
      <div className="space-y-6 text-xs">
        {/* 1-3. Overview, Website, Industry, Size, Location + Fit Score */}
        <div className="rounded-card border-border-subtle bg-app/60 flex flex-col justify-between gap-4 border p-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white"
                style={{ backgroundColor: company.logoColor }}
              >
                {company.logoText}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-text-primary text-sm font-bold">
                    {company.name}
                  </p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tone.className}`}
                  >
                    {tone.label}
                  </span>
                </div>
                <p className="text-text-secondary text-[11px]">
                  {company.subIndustry}
                </p>
              </div>
            </div>
            <p className="text-text-secondary leading-relaxed">
              {company.description}
            </p>
            <div className="text-text-secondary flex flex-wrap gap-2 pt-1 text-[11px]">
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="border-border-subtle bg-surface hover:text-text-primary inline-flex items-center gap-1 rounded-full border px-2.5 py-1"
              >
                <Globe className="text-teal-brand h-3 w-3" />
                {company.website.replace(/^https?:\/\//, '')}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
              <span className="border-border-subtle bg-surface inline-flex items-center gap-1 rounded-full border px-2.5 py-1">
                <Users className="text-brand h-3 w-3" />
                {company.employeeRange}
              </span>
              <span className="border-border-subtle bg-surface inline-flex items-center gap-1 rounded-full border px-2.5 py-1">
                <MapPin className="text-text-secondary h-3 w-3" />
                {company.location}
              </span>
            </div>
          </div>

          <ProgressRing
            value={company.matchScore}
            size={92}
            strokeWidth={8}
            label={`${company.matchScore}%`}
            sublabel="Fit Score"
            accent="teal"
            className="shrink-0 self-start sm:self-center"
          />
        </div>

        {/* 4. Why this company matches the offer */}
        <section>
          <h3 className="text-text-secondary mb-2.5 text-xs font-semibold tracking-wider uppercase">
            Why This Company Matches Your Offer
          </h3>
          <ul className="rounded-card border-border-subtle bg-app/45 text-text-primary space-y-2 border p-3.5">
            {company.whyMatch.map((reason) => (
              <li key={reason} className="flex items-start gap-2">
                <CheckCircle2 className="text-teal-brand mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 6. Weighted Qualification Factors */}
        <section>
          <h3 className="text-text-secondary mb-2.5 text-xs font-semibold tracking-wider uppercase">
            Qualification Factors (Score Explanation)
          </h3>
          <div className="space-y-2.5">
            {company.fitFactors.map((factor) => (
              <div
                key={factor.label}
                className="rounded-btn border-border-subtle bg-app/45 border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-text-primary font-semibold">
                    {factor.label}{' '}
                    <span className="text-text-secondary font-normal">
                      (weight {factor.weight}%)
                    </span>
                  </span>
                  <span className="text-teal-brand font-bold tabular-nums">
                    {factor.score}%
                  </span>
                </div>
                <div className="bg-elevated mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-teal-brand h-full rounded-full"
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                <p className="text-text-secondary mt-1.5 text-[11px]">
                  {factor.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Supporting Evidence & Source Links */}
        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="text-text-secondary text-xs font-semibold tracking-wider uppercase">
              Evidence &amp; Source Links ({company.evidence.length})
            </h3>
            <span className="text-teal-brand inline-flex items-center gap-1 text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Source-tagged
            </span>
          </div>
          <div className="space-y-2.5">
            {company.evidence.map((ev) => {
              const meta = getVerificationMeta(ev.verification);
              return (
                <div
                  key={ev.id}
                  className="rounded-btn border-border-subtle bg-app/45 border p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-text-primary font-semibold">
                      {ev.title}
                    </p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1 leading-relaxed">
                    {ev.summary}
                  </p>
                  <div className="text-text-disabled mt-2 flex items-center justify-between text-[11px]">
                    <span>Observed {ev.observedAt}</span>
                    <a
                      href={ev.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand inline-flex items-center gap-1 hover:underline"
                    >
                      {ev.sourceLabel}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Confidence & Missing Information */}
        <section className="rounded-card border-warning/35 bg-warning/10 border p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-text-primary flex items-center gap-2 font-semibold">
              <AlertTriangle className="text-warning h-4 w-4" />
              Confidence &amp; Missing Information
            </div>
            <Badge variant="brand">Evidence Confidence: {confidence}%</Badge>
          </div>
          <ul className="text-text-secondary mt-2 space-y-1.5 text-[11px]">
            {missingInfo.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>

        {/* 8. Recommended Next Actions (Phase 5) */}
        <section className="border-border-subtle space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-text-secondary text-xs font-semibold tracking-wider uppercase">
              Take Action
            </h3>
            <span className="text-text-secondary inline-flex items-center gap-1 text-[11px]">
              <Sparkles className="text-brand h-3 w-3" />
              Human approval required for outreach
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" onClick={() => onAddToCampaign(company.id)}>
              <Megaphone className="h-3.5 w-3.5" />
              Add to Campaign
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toggleSaveProspect(company.id)}
            >
              {company.saved ? (
                <>
                  <BookmarkCheck className="text-brand h-3.5 w-3.5" />
                  Saved Prospect
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5" />
                  Save to Prospects
                </>
              )}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleGenerateDraft}>
              <Mail className="h-3.5 w-3.5" />
              {draftGenerated
                ? 'Draft Queued (Review)'
                : 'Generate Outreach Draft'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => markProspectReviewed(company.id)}
            >
              <CheckCircle2 className="text-teal-brand h-3.5 w-3.5" />
              {company.reviewed ? 'Reviewed' : 'Mark as Reviewed'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportSingle}>
              <Download className="h-3.5 w-3.5" />
              Export Dossier
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                excludeProspect(company.id);
                onClose();
              }}
            >
              <Ban className="h-3.5 w-3.5" />
              Exclude Company
            </Button>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
