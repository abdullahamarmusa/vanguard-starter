'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';
import { ProspectResultsTable } from '@/features/analyze/prospect-results-table';
import { CompanyIntelligenceDrawer } from '@/features/analyze/company-intelligence-drawer';
import { usePrototypeStore } from '@/store/prototype-context';
import { downloadTextFile, getVerificationMeta } from '@/lib/utils';
import type { ProspectCompany } from '@/types/vanguard';

export function AnalysisResultsView({ analysisId }: { analysisId: string }) {
  const {
    analyses,
    prospects,
    campaigns,
    enrollProspectsInCampaign,
    pushToast,
  } = usePrototypeStore();

  const job = useMemo(
    () => analyses.find((a) => a.id === analysisId) ?? null,
    [analyses, analysisId],
  );

  const [drawerCompany, setDrawerCompany] = useState<ProspectCompany | null>(
    null,
  );
  const [assignCompanyId, setAssignCompanyId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id ?? '',
  );

  const matchedCompanies = useMemo(() => {
    if (!job) return [];
    return job.matchedCompanyIds
      .map((id) => prospects.find((p) => p.id === id))
      .filter((p): p is ProspectCompany => Boolean(p));
  }, [job, prospects]);

  if (!job) {
    return (
      <div className="py-8">
        <EmptyState
          icon={<Sparkles className="h-5 w-5" />}
          title="Qualification report not found"
          description={`No report exists for analysis ID "${analysisId}".`}
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link href="/analyze">
                <Button size="sm">Back to Analyze</Button>
              </Link>
              {analyses[0] && (
                <Link href={`/analyze/${analyses[0].id}/results`}>
                  <Button variant="secondary" size="sm">
                    View {analyses[0].sourceDomain} Report
                  </Button>
                </Link>
              )}
            </div>
          }
        />
      </div>
    );
  }

  const handleExport = () => {
    const markdown = [
      `# VANGUARD Qualification Report — ${job.shortTitle} (${job.sourceDomain})`,
      `Analysis Code: #${job.code}`,
      `Objective: ${job.objective}`,
      ``,
      `## Offer Understanding`,
      `${job.offerSummary.headline}`,
      `${job.offerSummary.valueProposition}`,
      ``,
      `## Qualified Companies (${matchedCompanies.length})`,
      ...matchedCompanies.map(
        (c) =>
          `- ${c.name} (${c.matchScore}% Fit) — ${c.industry}, ${c.location}\n  Evidence: ${c.evidence
            .map(
              (e) =>
                `[${getVerificationMeta(e.verification).label}] ${e.title}`,
            )
            .join('; ')}`,
      ),
    ].join('\n');

    downloadTextFile(
      `vanguard-report-${job.code}.md`,
      markdown,
      'text/markdown;charset=utf-8',
    );
    pushToast({
      title: 'Qualification report exported',
      description: `Downloaded vanguard-report-${job.code}.md`,
      variant: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Structured Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
            <Link
              href={`/analyze/${job.id}`}
              className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Live Workspace
            </Link>
            <span className="text-text-disabled">/</span>
            <span className="text-text-secondary font-mono">#{job.code}</span>
            <Badge variant="teal">Qualification Results</Badge>
          </div>
          <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-[30px]">
            {job.shortTitle} Results
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            <span className="text-brand font-semibold">{job.sourceDomain}</span>{' '}
            · {job.offerSummary.headline}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Export Report (.md)
          </Button>
          <Link href="/prospects">
            <Button size="sm">Open Prospects Directory</Button>
          </Link>
        </div>
      </div>

      {/* Offer Understanding + ICP Summary */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Offer Understanding</CardTitle>
            <Badge variant="default">Extracted Positioning</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-text-secondary leading-relaxed">
              {job.offerSummary.valueProposition}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {job.offerSummary.targetBuyers.map((buyer) => (
                <Badge key={buyer} variant="default">
                  {buyer}
                </Badge>
              ))}
            </div>
            <ul className="text-text-primary space-y-1.5 pt-1">
              {job.offerSummary.coreCapabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2">
                  <CheckCircle2 className="text-teal-brand mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ideal Customer Profile (ICP)</CardTitle>
            <Badge variant="brand">Qualification Rubric</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="rounded-btn border-border-subtle bg-app/55 grid grid-cols-2 gap-3 border p-3">
              <div>
                <p className="text-text-disabled text-[11px] font-semibold uppercase">
                  Company Size
                </p>
                <p className="text-text-primary mt-0.5 font-semibold">
                  {job.icpSummary.companySize}
                </p>
              </div>
              <div>
                <p className="text-text-disabled text-[11px] font-semibold uppercase">
                  Geography
                </p>
                <p className="text-text-primary mt-0.5 font-semibold">
                  {job.icpSummary.geography}
                </p>
              </div>
            </div>
            <ul className="text-text-primary space-y-1.5">
              {job.icpSummary.buyingSignals.map((sig) => (
                <li key={sig} className="flex items-start gap-2">
                  <Sparkles className="text-brand mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Verification Legend */}
      <div className="rounded-card border-border-subtle bg-surface flex flex-wrap items-center gap-2 border px-4 py-3 text-xs">
        <span className="text-text-primary inline-flex items-center gap-1.5 font-semibold">
          <ShieldCheck className="text-teal-brand h-4 w-4" />
          Evidence Verification Tiers:
        </span>
        {(
          [
            'verified',
            'provider_sourced',
            'inferred',
            'ai_recommendation',
            'unverified',
          ] as const
        ).map((status) => {
          const meta = getVerificationMeta(status);
          return (
            <span
              key={status}
              title={meta.description}
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${meta.className}`}
            >
              {meta.label}
            </span>
          );
        })}
      </div>

      {/* Phase 3 — Two-Level Prospect Results Overview + Interactive Semantic Table */}
      <ProspectResultsTable
        companies={matchedCompanies}
        onSelectCompany={(company) => setDrawerCompany(company)}
      />

      {/* Phase 4 — Right-Side Company Intelligence Drawer */}
      <CompanyIntelligenceDrawer
        company={drawerCompany}
        onClose={() => setDrawerCompany(null)}
        onAddToCampaign={(companyId) => {
          setAssignCompanyId(companyId);
          if (!selectedCampaignId && campaigns[0])
            setSelectedCampaignId(campaigns[0].id);
        }}
      />

      {/* Campaign Handoff Modal */}
      <Modal
        open={Boolean(assignCompanyId)}
        onClose={() => setAssignCompanyId(null)}
        title="Add Prospect to Campaign"
        description="Outreach drafts require explicit human approval before any external send."
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="select-campaign-report"
              className="text-text-secondary mb-1.5 block text-xs font-medium"
            >
              Choose Campaign
            </label>
            <select
              id="select-campaign-report"
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="rounded-btn border-border-subtle bg-app text-text-primary h-10 w-full border px-3 text-sm"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.status})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAssignCompanyId(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (assignCompanyId && selectedCampaignId) {
                  enrollProspectsInCampaign(selectedCampaignId, [
                    assignCompanyId,
                  ]);
                }
                setAssignCompanyId(null);
              }}
            >
              Queue for Approval
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
