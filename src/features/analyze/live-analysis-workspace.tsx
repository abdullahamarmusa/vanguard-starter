'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Copy,
  ExternalLink,
  FlaskConical,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Square,
  Target,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';
import { LiveIntelligenceObservatory } from '@/features/analyze/live-intelligence-observatory';
import { ProspectResultsTable } from '@/features/analyze/prospect-results-table';
import { CompanyIntelligenceDrawer } from '@/features/analyze/company-intelligence-drawer';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn, formatNumber, getVerificationMeta } from '@/lib/utils';
import type { ProspectCompany } from '@/types/vanguard';

type WorkspaceTab = 'overview' | 'companies' | 'evidence' | 'activity';

export function LiveAnalysisWorkspace({ analysisId }: { analysisId: string }) {
  const {
    analyses,
    prospects,
    campaigns,
    advanceAnalysisStage,
    cancelAnalysisJob,
    restartAnalysisJob,
    updateAnalysisConfig,
    enrollProspectsInCampaign,
    pushToast,
  } = usePrototypeStore();

  const job = useMemo(
    () => analyses.find((a) => a.id === analysisId) ?? null,
    [analyses, analysisId],
  );

  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [autoPlay, setAutoPlay] = useState(false);
  const [sourcePanelOpen, setSourcePanelOpen] = useState(false);
  const [editConfigOpen, setEditConfigOpen] = useState(false);

  const [drawerCompany, setDrawerCompany] = useState<ProspectCompany | null>(
    null,
  );
  const [assignCompanyId, setAssignCompanyId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id ?? '',
  );

  // Edit config modal state
  const [cfgObjective, setCfgObjective] = useState('');
  const [cfgOfferDesc, setCfgOfferDesc] = useState('');
  const [cfgIndustry, setCfgIndustry] = useState('');
  const [cfgGeo, setCfgGeo] = useState('');
  const [cfgSize, setCfgSize] = useState('');
  const [cfgTitles, setCfgTitles] = useState('');
  const [cfgMax, setCfgMax] = useState(100);
  const [cfgNotes, setCfgNotes] = useState('');

  useEffect(() => {
    if (!job) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Refresh the editable draft when the selected job changes.
    setCfgObjective(job.objective);
    setCfgOfferDesc(job.offerDescription ?? '');
    setCfgIndustry(job.icpPreferences?.targetIndustry ?? '');
    setCfgGeo(job.icpPreferences?.targetRegion ?? '');
    setCfgSize(job.icpPreferences?.companySize ?? '');
    setCfgTitles(job.icpPreferences?.targetJobTitles ?? '');
    setCfgMax(job.icpPreferences?.maxCompanies ?? 100);
    setCfgNotes(job.icpPreferences?.additionalInstructions ?? '');
  }, [job, editConfigOpen]);

  useEffect(() => {
    if (!autoPlay || !job || job.status !== 'running') return;
    const timer = setInterval(() => {
      advanceAnalysisStage(job.id);
    }, 2400);
    return () => clearInterval(timer);
  }, [autoPlay, job, advanceAnalysisStage]);

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
          icon={<Target className="h-5 w-5" />}
          title="Analysis job not found"
          description={`No analysis record matches ID "${analysisId}". It may have expired in prototype session storage or never existed.`}
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link href="/analyze">
                <Button size="sm">Start New Analysis</Button>
              </Link>
              {analyses[0] && (
                <Link href={`/analyze/${analyses[0].id}`}>
                  <Button variant="secondary" size="sm">
                    Open {analyses[0].sourceDomain} (#{analyses[0].code})
                  </Button>
                </Link>
              )}
            </div>
          }
        />
      </div>
    );
  }

  const completedCount = job.stages.filter(
    (s) => s.status === 'completed',
  ).length;
  const activeStage = job.stages.find((s) => s.status === 'running');

  const handleCopyUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(job.inputValue).catch(() => {});
      pushToast({ title: 'Copied submitted source input', variant: 'info' });
    }
  };

  return (
    <div className="space-y-5">
      {/* FIX 01 — Short Structured Page Title + Clean Source Domain Metadata (Zero URL Overflow) */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/analyze"
              className="text-text-secondary hover:text-text-primary inline-flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Analyze
            </Link>
            <span className="text-text-disabled">/</span>
            <span className="text-text-secondary font-mono">#{job.code}</span>
            <Badge
              variant={
                job.status === 'completed'
                  ? 'teal'
                  : job.status === 'running'
                    ? 'brand'
                    : 'warning'
              }
            >
              {job.status === 'running'
                ? `Stage ${completedCount + 1} of ${job.stages.length} Running`
                : job.status === 'completed'
                  ? 'Completed'
                  : 'Cancelled'}
            </Badge>
          </div>

          <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-[30px] sm:leading-[1.15]">
            {job.shortTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm">
            <span className="text-brand font-semibold">{job.sourceDomain}</span>
            <span className="text-text-disabled">·</span>
            <span className="text-text-secondary">
              Offer intelligence · Analysis #{job.code}
            </span>
          </div>
        </div>

        {/* Action & Simulation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditConfigOpen(true)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Edit Configuration
          </Button>
          {job.status === 'running' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAutoPlay((v) => !v)}
              >
                {autoPlay ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                {autoPlay ? 'Pause' : 'Auto-Step'}
              </Button>
              <Button size="sm" onClick={() => advanceAnalysisStage(job.id)}>
                Advance Stage
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setAutoPlay(false);
                  cancelAnalysisJob(job.id);
                }}
              >
                <Square className="h-3 w-3" />
                Cancel
              </Button>
            </>
          )}
          {(job.status === 'completed' || job.status === 'cancelled') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => restartAnalysisJob(job.id)}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Replay Stages
            </Button>
          )}
          <Link href={`/analyze/${job.id}/results`}>
            <Button
              variant={job.status === 'completed' ? 'primary' : 'secondary'}
              size="sm"
            >
              Full Report
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* FIX 02 — Collapsible Source Information & Input Configuration Panel */}
      <div className="rounded-card border-border-subtle bg-surface border">
        <button
          type="button"
          onClick={() => setSourcePanelOpen((v) => !v)}
          aria-expanded={sourcePanelOpen}
          className="hover:bg-hover/40 flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-left text-xs"
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-text-primary font-semibold">
              Source Information &amp; Configuration
            </span>
            <span className="border-border-subtle bg-app text-text-secondary rounded-full border px-2.5 py-0.5 text-[11px]">
              {job.icpPreferences?.targetIndustry ?? 'B2B SaaS'}
            </span>
            <span className="border-border-subtle bg-app text-text-secondary rounded-full border px-2.5 py-0.5 text-[11px]">
              {job.icpPreferences?.targetRegion ?? 'North America'}
            </span>
            <span className="border-border-subtle bg-app text-text-secondary hidden rounded-full border px-2.5 py-0.5 text-[11px] sm:inline-block">
              Target: {job.icpPreferences?.maxCompanies ?? 100} companies
            </span>
          </div>
          <span className="text-brand inline-flex items-center gap-1 font-medium">
            {sourcePanelOpen ? 'Hide source' : 'Inspect full URL & config'}
            {sourcePanelOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
        </button>

        {sourcePanelOpen && (
          <div className="border-border-subtle grid gap-4 border-t px-4 py-4 text-xs sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-text-disabled mb-1 text-[11px] font-semibold tracking-wider uppercase">
                Full Submitted Input ({job.inputType.toUpperCase()})
              </p>
              <div className="rounded-btn border-border-subtle bg-app flex items-center justify-between gap-2 border px-3 py-2">
                <code className="text-text-primary font-mono text-xs break-all">
                  {job.inputValue}
                </code>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  aria-label="Copy submitted URL or input"
                  className="rounded-control text-text-secondary hover:bg-hover hover:text-text-primary shrink-0 p-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div>
              <p className="text-text-disabled text-[11px] font-semibold uppercase">
                Objective
              </p>
              <p className="text-text-primary mt-1">{job.objective}</p>
            </div>
            <div>
              <p className="text-text-disabled text-[11px] font-semibold uppercase">
                Target Titles
              </p>
              <p className="text-text-primary mt-1">
                {job.icpPreferences?.targetJobTitles ?? 'VP Engineering, CTO'}
              </p>
            </div>
            <div>
              <p className="text-text-disabled text-[11px] font-semibold uppercase">
                Company Size
              </p>
              <p className="text-text-primary mt-1">
                {job.icpPreferences?.companySize ?? '200–10,000+ employees'}
              </p>
            </div>
            {job.offerDescription && (
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-text-disabled text-[11px] font-semibold uppercase">
                  Offer Description
                </p>
                <p className="text-text-secondary mt-1 leading-relaxed">
                  {job.offerDescription}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Explicit Illustrative Prototype Notice */}
      <div className="rounded-card border-brand-border/40 bg-brand-soft/25 text-text-primary flex items-start gap-2.5 border px-4 py-2.5 text-xs">
        <FlaskConical className="text-brand mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>Illustrative Prototype Simulation:</strong> Stage transitions
          and screening counts are simulated locally for UX review. In
          production, progress streams from persisted PostgreSQL analysis events
          without arbitrary percentages.
        </p>
      </div>

      {/* FIX 04 — Top-Level Results Navigation Tabs (Direct Access Without Scrolling Past Processing) */}
      <div className="border-border-subtle border-b">
        <div
          className="flex gap-6 overflow-x-auto"
          role="tablist"
          aria-label="Analysis workspace sections"
        >
          {(
            [
              { id: 'overview', label: 'Overview & Live Stages' },
              {
                id: 'companies',
                label: `Companies (${matchedCompanies.filter((c) => !c.excluded).length})`,
              },
              { id: 'evidence', label: 'Qualification Evidence' },
              {
                id: 'activity',
                label: `Activity Timeline (${job.events.length})`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'border-b-2 pb-3 text-sm font-semibold whitespace-nowrap transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-brand text-text-primary'
                  : 'text-text-secondary hover:text-text-primary border-transparent',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & LIVE PROCESSING STAGES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Premium Interactive Live AI Research Observatory */}
          <LiveIntelligenceObservatory
            job={job}
            matchedCompanies={matchedCompanies}
            onInspectCompany={(company) => setDrawerCompany(company)}
            onJumpToCompanies={() => setActiveTab('companies')}
            onAdvanceStage={
              job.status === 'running'
                ? () => advanceAnalysisStage(job.id)
                : undefined
            }
          />

          <div className="grid gap-5 xl:grid-cols-12">
            {/* FIX 03 — Distinct Processing Stages + Granular Sub-step Checklist */}
            <Card className="xl:col-span-8">
              <CardHeader className="border-border-subtle border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="border-teal-brand/30 bg-teal-soft text-teal-brand flex h-9 w-9 items-center justify-center rounded-xl border">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle>
                      {job.status === 'completed'
                        ? 'All 4 Intelligence Stages Completed'
                        : job.status === 'cancelled'
                          ? 'Analysis Paused / Cancelled'
                          : `Stage ${activeStage?.stepNumber ?? 1} of ${job.stages.length} · ${
                              activeStage?.title ?? 'Processing'
                            }`}
                    </CardTitle>
                    <p className="text-text-secondary text-xs">
                      Real stage-driven milestones (no arbitrary percentage
                      bar). Refresh-safe in prototype storage.
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-5">
                {/* Distinct Stage Cards — Vertical stepper on mobile, 2x2 / 4-col structured grid on desktop */}
                <div className="grid gap-3.5 md:grid-cols-2">
                  {job.stages.map((stage) => {
                    const isDone = stage.status === 'completed';
                    const isRunning = stage.status === 'running';
                    const isFailed = stage.status === 'failed';
                    const isSkipped = stage.status === 'skipped';

                    return (
                      <div
                        key={stage.id}
                        className={cn(
                          'rounded-card border p-4 transition-all duration-200',
                          isRunning
                            ? 'border-brand bg-brand-soft/20 shadow-brand-subtle'
                            : isDone
                              ? 'border-teal-brand/35 bg-teal-soft/15'
                              : isFailed
                                ? 'border-danger/40 bg-danger/10'
                                : 'border-border-subtle bg-app/45 opacity-80',
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
                                isDone
                                  ? 'border-teal-brand bg-teal-brand text-[#0D0E11]'
                                  : isRunning
                                    ? 'border-brand bg-brand/20 text-brand'
                                    : isFailed
                                      ? 'border-danger bg-danger/20 text-danger'
                                      : 'border-border-strong bg-surface text-text-disabled',
                              )}
                            >
                              {isDone ? (
                                <Check className="h-4 w-4" />
                              ) : isRunning ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : isFailed ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <span className="font-mono text-[11px] font-semibold">
                                  0{stage.stepNumber}
                                </span>
                              )}
                            </span>
                            <div>
                              <p className="text-text-primary text-xs font-bold">
                                0{stage.stepNumber}. {stage.title}
                              </p>
                              <p className="text-text-secondary text-[11px]">
                                {stage.completedAt
                                  ? `Completed ${stage.completedAt}`
                                  : stage.startedAt
                                    ? `Started ${stage.startedAt}`
                                    : isSkipped
                                      ? 'Skipped'
                                      : 'Queued'}
                              </p>
                            </div>
                          </div>

                          <Badge
                            variant={
                              isDone
                                ? 'teal'
                                : isRunning
                                  ? 'brand'
                                  : isFailed
                                    ? 'danger'
                                    : 'default'
                            }
                          >
                            {isDone
                              ? 'Completed'
                              : isRunning
                                ? 'Running'
                                : isFailed
                                  ? 'Failed'
                                  : isSkipped
                                    ? 'Skipped'
                                    : 'Queued'}
                          </Badge>
                        </div>

                        <p className="text-text-secondary mt-2.5 text-xs leading-relaxed">
                          {stage.finding ?? stage.description}
                        </p>

                        {/* Granular Sub-step Checklist */}
                        {stage.substeps && stage.substeps.length > 0 && (
                          <ul className="border-border-subtle/70 mt-3 space-y-1.5 border-t pt-2.5 text-[11px]">
                            {stage.substeps.map((sub) => (
                              <li
                                key={sub.id}
                                className="flex items-center gap-2"
                              >
                                {sub.status === 'completed' ? (
                                  <CheckCircle2 className="text-teal-brand h-3.5 w-3.5 shrink-0" />
                                ) : sub.status === 'running' ? (
                                  <span className="bg-brand ml-0.5 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full" />
                                ) : (
                                  <Circle className="text-text-disabled ml-0.5 h-3 w-3 shrink-0" />
                                )}
                                <span
                                  className={
                                    sub.status === 'completed'
                                      ? 'text-text-primary'
                                      : sub.status === 'running'
                                        ? 'text-brand font-semibold'
                                        : 'text-text-disabled'
                                  }
                                >
                                  {sub.label}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Right Sidebar: Strictly Separated Live Processing Metrics vs Final Results */}
            <div className="space-y-4 xl:col-span-4">
              <Card>
                <CardHeader className="pb-2">
                  <div>
                    <CardTitle>
                      {job.status === 'completed'
                        ? 'Final Analysis Summary'
                        : 'Live Screening Indicators'}
                    </CardTitle>
                    <p className="text-text-secondary mt-0.5 text-xs">
                      {job.status === 'completed'
                        ? 'Qualification results finalized.'
                        : 'Preliminary counts — updates as stages complete.'}
                    </p>
                  </div>
                  <Badge
                    variant={job.status === 'completed' ? 'teal' : 'brand'}
                  >
                    {job.status === 'completed' ? 'Final' : 'In Progress'}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="rounded-btn border-border-subtle bg-app/55 flex items-center justify-between border px-3.5 py-3">
                    <span className="text-text-secondary flex items-center gap-2 text-xs">
                      <Building2 className="text-text-primary h-4 w-4" />
                      Organizations Screened
                    </span>
                    <span className="text-text-primary text-base font-bold tabular-nums">
                      {formatNumber(job.companiesAnalyzed)}
                    </span>
                  </div>
                  <div className="rounded-btn border-border-subtle bg-app/55 flex items-center justify-between border px-3.5 py-3">
                    <span className="text-text-secondary flex items-center gap-2 text-xs">
                      <Target className="text-teal-brand h-4 w-4" />
                      {job.status === 'completed'
                        ? 'Qualified Matches'
                        : 'Preliminary Matches'}
                    </span>
                    <span className="text-teal-brand text-base font-bold tabular-nums">
                      {formatNumber(job.matchesFound)}
                    </span>
                  </div>
                  <div className="rounded-btn border-border-subtle bg-app/55 flex items-center justify-between border px-3.5 py-3">
                    <span className="text-text-secondary flex items-center gap-2 text-xs">
                      <ShieldCheck className="text-brand h-4 w-4" />
                      Avg. Rubric Fit
                    </span>
                    <span className="text-text-primary text-base font-bold tabular-nums">
                      {job.status === 'completed'
                        ? `${job.avgMatchScore}%`
                        : `~${job.avgMatchScore}% (est.)`}
                    </span>
                  </div>

                  {/* Clear Next Action CTA */}
                  <div className="border-border-subtle border-t pt-3">
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => setActiveTab('companies')}
                    >
                      {job.status === 'completed'
                        ? 'Inspect Qualified Companies'
                        : 'Preview Candidate Companies'}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* High-visibility Activity Feed */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Live Event Stream</CardTitle>
                  <button
                    type="button"
                    onClick={() => setActiveTab('activity')}
                    className="text-brand text-xs font-medium hover:underline"
                  >
                    Full log
                  </button>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2.5 text-xs">
                    {job.events
                      .slice(-4)
                      .reverse()
                      .map((ev) => (
                        <li
                          key={ev.id}
                          className="rounded-btn border-border-subtle bg-app/45 border px-3 py-2"
                        >
                          <div className="text-text-disabled flex items-center justify-between font-mono text-[10px]">
                            <span>
                              EVENT #{String(ev.sequence).padStart(2, '0')}
                            </span>
                            <span>{ev.timestamp}</span>
                          </div>
                          <p className="text-text-primary mt-1 leading-snug">
                            {ev.message}
                          </p>
                        </li>
                      ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUALIFICATION RESULTS TABLE */}
      {activeTab === 'companies' && (
        <ProspectResultsTable
          companies={matchedCompanies}
          isPreliminary={job.status !== 'completed'}
          onSelectCompany={(company) => setDrawerCompany(company)}
        />
      )}

      {/* TAB 3: QUALIFICATION EVIDENCE SUMMARY */}
      {activeTab === 'evidence' && (
        <div className="grid gap-4 md:grid-cols-2">
          {matchedCompanies.map((company) => (
            <Card key={company.id} className="p-5">
              <div className="border-border-subtle flex items-center justify-between gap-2 border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: company.logoColor }}
                  >
                    {company.logoText}
                  </span>
                  <div>
                    <p className="text-text-primary text-sm font-semibold">
                      {company.name}
                    </p>
                    <p className="text-text-secondary text-[11px]">
                      {company.matchScore}% Fit Score
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => setDrawerCompany(company)}
                >
                  Open Drawer
                </Button>
              </div>
              <div className="mt-3 space-y-2.5">
                {company.evidence.map((ev) => {
                  const meta = getVerificationMeta(ev.verification);
                  return (
                    <div
                      key={ev.id}
                      className="rounded-btn border-border-subtle bg-app/50 border p-3 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <p className="text-text-primary font-semibold">
                          {ev.title}
                        </p>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-text-secondary mt-1">{ev.summary}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 4: FULL ACTIVITY TIMELINE */}
      {activeTab === 'activity' && (
        <Card className="p-5">
          <h2 className="text-text-primary mb-4 text-sm font-semibold">
            Complete Execution Event Log ({job.events.length})
          </h2>
          <ol className="divide-border-subtle divide-y text-xs">
            {job.events.map((ev) => (
              <li
                key={ev.id}
                className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <span className="rounded-control border-border-subtle bg-app text-text-secondary border px-2 py-0.5 font-mono text-[11px]">
                    #{String(ev.sequence).padStart(2, '0')}
                  </span>
                  <span className="text-text-primary">{ev.message}</span>
                </div>
                <span className="text-text-disabled shrink-0 font-mono text-[11px]">
                  {ev.timestamp}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      )}

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
        title="Add Company to Campaign"
        description="Generates an evidence-cited draft queued for explicit human approval."
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="live-camp-sel"
              className="text-text-secondary mb-1.5 block text-xs font-medium"
            >
              Select Campaign
            </label>
            <select
              id="live-camp-sel"
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

      {/* FIX 02 — Edit Configuration Modal */}
      <Modal
        open={editConfigOpen}
        onClose={() => setEditConfigOpen(false)}
        title="Edit Analysis Configuration"
        description={`Adjust ICP criteria for ${job.sourceDomain} (#${job.code}).`}
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateAnalysisConfig(job.id, {
              objective: cfgObjective,
              offerDescription: cfgOfferDesc,
              icpPreferences: {
                targetIndustry: cfgIndustry,
                targetRegion: cfgGeo,
                companySize: cfgSize,
                targetJobTitles: cfgTitles,
                maxCompanies: cfgMax,
                additionalInstructions: cfgNotes,
              },
            });
            setEditConfigOpen(false);
          }}
          className="space-y-3.5"
        >
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Objective
            </label>
            <Input
              value={cfgObjective}
              onChange={(e) => setCfgObjective(e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-text-secondary mb-1 block text-xs font-medium">
                Industry
              </label>
              <Input
                value={cfgIndustry}
                onChange={(e) => setCfgIndustry(e.target.value)}
              />
            </div>
            <div>
              <label className="text-text-secondary mb-1 block text-xs font-medium">
                Geography
              </label>
              <Input
                value={cfgGeo}
                onChange={(e) => setCfgGeo(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-text-secondary mb-1 block text-xs font-medium">
                Company Size
              </label>
              <Input
                value={cfgSize}
                onChange={(e) => setCfgSize(e.target.value)}
              />
            </div>
            <div>
              <label className="text-text-secondary mb-1 block text-xs font-medium">
                Discovery Limit
              </label>
              <Input
                type="number"
                min={10}
                max={500}
                value={cfgMax}
                onChange={(e) => setCfgMax(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Target Job Titles
            </label>
            <Input
              value={cfgTitles}
              onChange={(e) => setCfgTitles(e.target.value)}
            />
          </div>
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Offer Description
            </label>
            <Textarea
              rows={2}
              value={cfgOfferDesc}
              onChange={(e) => setCfgOfferDesc(e.target.value)}
            />
          </div>
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Additional Instructions
            </label>
            <Textarea
              rows={2}
              value={cfgNotes}
              onChange={(e) => setCfgNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditConfigOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Configuration
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
