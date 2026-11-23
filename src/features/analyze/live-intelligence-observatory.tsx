'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Cpu,
  Database,
  FileSearch,
  Filter,
  Globe,
  Newspaper,
  Pause,
  Play,
  Radio,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  buildInspectionTemplates,
  createInitialObservatoryState,
  getActiveStageNumber,
  getStageChannelScope,
  stepObservatoryTick,
  type ChannelTelemetry,
  type LiveInspectionEvent,
  type LiveObservatoryCounters,
  type ResearchChannelId,
  type TriageCandidateEvent,
} from '@/features/analyze/live-telemetry-engine';
import { cn, formatNumber, getVerificationMeta } from '@/lib/utils';
import type { AnalysisJob, ProspectCompany } from '@/types/vanguard';

interface LiveIntelligenceObservatoryProps {
  job: AnalysisJob;
  matchedCompanies: ProspectCompany[];
  onInspectCompany: (company: ProspectCompany) => void;
  onJumpToCompanies: () => void;
  onAdvanceStage?: () => void;
}

const CHANNEL_ICONS: Record<
  Exclude<ResearchChannelId, 'scoring'>,
  React.ComponentType<{ className?: string }>
> = {
  web: Globe,
  filings: FileSearch,
  hiring: Users,
  tech: Cpu,
  news: Newspaper,
};

const OUTCOME_STYLE: Record<LiveInspectionEvent['outcome'], string> = {
  parsed: 'border-border-strong bg-elevated text-text-primary',
  signal: 'border-teal-brand/35 bg-teal-soft text-teal-brand',
  verified: 'border-success/35 bg-success/10 text-success',
  matched: 'border-brand-border bg-brand-soft text-brand',
  excluded: 'border-danger/35 bg-danger/10 text-danger',
};

interface ObservatoryState {
  counters: LiveObservatoryCounters;
  channels: ChannelTelemetry[];
  feed: LiveInspectionEvent[];
  triage: TriageCandidateEvent[];
  activePulseChannel: ResearchChannelId;
  velocityHistory: number[];
  cursor: number;
}

export function LiveIntelligenceObservatory({
  job,
  matchedCompanies,
  onInspectCompany,
  onJumpToCompanies,
  onAdvanceStage,
}: LiveIntelligenceObservatoryProps) {
  const activeStageNum = getActiveStageNumber(job);
  const stageScope = getStageChannelScope(activeStageNum);

  const templates = useMemo(
    () => buildInspectionTemplates(job, matchedCompanies),
    [job, matchedCompanies],
  );

  const buildFreshState = useMemo(() => {
    return (referenceTime = Date.now()): ObservatoryState => ({
      ...createInitialObservatoryState(job, matchedCompanies, referenceTime),
      activePulseChannel: stageScope.primaryChannels[0] ?? 'web',
      velocityHistory: [8, 12, 15, 11, 18, 22, 19, 25, 21, 28, 24, 30],
      cursor: 8,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.id, job.status, activeStageNum]);

  const [obs, setObs] = useState<ObservatoryState>(() =>
    buildFreshState(Date.UTC(2020, 0, 1, 14, 22, 30)),
  );
  const [streaming, setStreaming] = useState(job.status === 'running');
  const [speed, setSpeed] = useState<1 | 2 | 4>(2);
  const [channelFilter, setChannelFilter] = useState<ResearchChannelId | 'all'>(
    'all',
  );
  const [pinnedEvent, setPinnedEvent] = useState<LiveInspectionEvent | null>(
    () => obs.feed[0] ?? null,
  );

  // Sync cleanly when switching analysis jobs or when job status changes
  useEffect(() => {
    const fresh = buildFreshState();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset the local illustrative stream when its selected job changes.
    setObs(fresh);
    setPinnedEvent(fresh.feed[0] ?? null);
    setStreaming(job.status === 'running');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.id, job.status]);

  // Smoothly update active channel availability whenever pipeline stage advances (without wiping stream history!)
  useEffect(() => {
    if (job.status !== 'running') return;
    const scope = getStageChannelScope(activeStageNum);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Keep the simulated channel state aligned to the selected pipeline stage.
    setObs((prev) => ({
      ...prev,
      activePulseChannel: scope.primaryChannels[0] ?? 'web',
      channels: prev.channels.map((ch) => ({
        ...ch,
        status: scope.primaryChannels.includes(ch.id)
          ? 'active'
          : ch.docsParsed > 0
            ? 'completed'
            : 'queued',
      })),
    }));
  }, [activeStageNum, job.status]);

  // Rapid Live Inspection Loop (pure single state transition per tick, synced to active stage!)
  useEffect(() => {
    if (!streaming) return;

    const intervalMs = speed === 4 ? 320 : speed === 2 ? 620 : 1150;

    const timer = setInterval(() => {
      setObs((prev) => {
        const step = stepObservatoryTick({
          counters: prev.counters,
          channels: prev.channels,
          templates,
          cursor: prev.cursor,
          speedMultiplier: speed,
          activeStageNumber:
            job.status === 'running' ? activeStageNum : undefined,
        });

        let nextTriage = prev.triage;
        if (step.newEvent.outcome === 'excluded' && step.newEvent.companyName) {
          const ev = step.newEvent;
          const domain = ev.sourceUri.replace(/^https?:\/\//, '');
          if (!prev.triage.some((t) => t.domain === domain)) {
            nextTriage = [
              {
                id: `tri_${ev.id}`,
                companyName: ev.companyName ?? domain,
                domain,
                verdict: 'excluded' as const,
                reason: ev.extractedPayload.reason ?? ev.headline,
                channel: ev.channel,
              },
              ...prev.triage,
            ].slice(0, 6);
          }
        }

        return {
          counters: step.counters,
          channels: step.channels,
          feed: [step.newEvent, ...prev.feed].slice(0, 40),
          triage: nextTriage,
          activePulseChannel: step.activeChannelId,
          velocityHistory: [
            ...prev.velocityHistory.slice(1),
            step.counters.docsPerSecond,
          ],
          cursor: step.nextCursor,
        };
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [streaming, speed, templates, activeStageNum, job.status]);

  const {
    counters,
    channels,
    feed,
    triage,
    activePulseChannel,
    velocityHistory,
  } = obs;

  const filteredFeed = useMemo(() => {
    if (channelFilter === 'all') return feed;
    return feed.filter((item) => item.channel === channelFilter);
  }, [feed, channelFilter]);

  const isRunning = job.status === 'running';
  const maxVel = Math.max(...velocityHistory, 20);

  return (
    <Card className="border-border-strong bg-surface overflow-hidden">
      {/* Observatory Header Bar */}
      <div className="border-border-subtle bg-app/70 flex flex-col justify-between gap-3 border-b px-5 py-4 lg:flex-row lg:items-center">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border',
              streaming
                ? 'border-teal-brand/40 bg-teal-soft text-teal-brand'
                : 'border-border-strong bg-elevated text-text-secondary',
            )}
          >
            <Radio className={cn('h-4 w-4', streaming && 'animate-pulse')} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-text-primary text-sm font-bold tracking-tight sm:text-base">
                Live AI Research Observatory
              </h2>
              <Badge
                variant={streaming ? 'teal' : isRunning ? 'warning' : 'default'}
              >
                {streaming
                  ? `Live Rapid Scan · ${counters.docsPerSecond} docs/s`
                  : isRunning
                    ? 'Stream Paused'
                    : 'Audit Snapshot Complete'}
              </Badge>
              <span className="border-border-subtle bg-surface text-text-secondary rounded-full border px-2 py-0.5 text-[10px] font-medium">
                Simulated Prototype Stream
              </span>
            </div>
            <p className="text-text-secondary mt-0.5 text-xs">
              Real-time source inspection for{' '}
              <span className="text-brand font-semibold">
                {job.sourceDomain}
              </span>{' '}
              — click any source channel or trace row below to verify exactly
              what the AI read and extracted.
            </p>
          </div>
        </div>

        {/* Interactive Stream Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={streaming ? 'secondary' : 'primary'}
            size="xs"
            onClick={() => setStreaming((v) => !v)}
          >
            {streaming ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                Pause Feed
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                {isRunning ? 'Resume Feed' : 'Replay Live Scan'}
              </>
            )}
          </Button>

          <div
            className="rounded-control border-border-subtle bg-surface inline-flex border p-0.5 text-[11px]"
            role="group"
            aria-label="Live inspection speed"
          >
            {(
              [
                { value: 1, label: '1x' },
                { value: 2, label: 'Rapid 2x' },
                { value: 4, label: 'Turbo 4x' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSpeed(opt.value)}
                className={cn(
                  'rounded px-2 py-0.5 font-mono font-semibold transition-colors',
                  speed === opt.value
                    ? 'bg-brand-soft text-brand'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {channelFilter !== 'all' && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setChannelFilter('all')}
            >
              <RotateCcw className="h-3 w-3" />
              Clear Filter
            </Button>
          )}

          {isRunning && onAdvanceStage && (
            <Button size="xs" onClick={onAdvanceStage}>
              Next Stage
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Stage-Synchronized Phase Ribbon */}
      <div className="border-border-subtle bg-surface flex flex-wrap items-center justify-between gap-2 border-b px-5 py-2.5 text-[11px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text-secondary font-semibold">
            Pipeline Sync:
          </span>
          {job.stages.map((st) => {
            const done = st.status === 'completed';
            const active = st.status === 'running';
            return (
              <span
                key={st.id}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium',
                  done
                    ? 'border-teal-brand/35 bg-teal-soft text-teal-brand'
                    : active
                      ? 'border-brand-border bg-brand-soft text-brand'
                      : 'border-border-subtle bg-app text-text-disabled',
                )}
              >
                <span className="font-mono text-[10px]">0{st.stepNumber}</span>
                <span>{st.shortTitle}</span>
              </span>
            );
          })}
        </div>
        <span className="text-text-secondary font-mono text-[10px]">
          {isRunning
            ? `Active Scope: ${stageScope.label}`
            : 'All 4 stages verified'}
        </span>
      </div>

      {/* Rapid Source-Verification Telemetry Counters */}
      <div className="border-border-subtle bg-border-subtle grid grid-cols-2 gap-px border-b sm:grid-cols-3 lg:grid-cols-5">
        {/* 1. Pages & Docs Parsed + Live Velocity Bars */}
        <div className="bg-surface px-4 py-3.5">
          <div className="text-text-secondary flex items-center justify-between text-[11px]">
            <span>Pages &amp; Docs Read</span>
            <Globe className="text-teal-brand h-3.5 w-3.5" />
          </div>
          <div className="mt-1.5 flex items-end justify-between gap-2">
            <span className="text-text-primary text-xl font-bold tabular-nums">
              {formatNumber(counters.pagesParsed)}
            </span>
            <div className="flex h-6 items-end gap-0.5" aria-hidden="true">
              {velocityHistory.slice(-8).map((v, i) => (
                <span
                  key={i}
                  className={cn(
                    'w-1 rounded-t transition-all duration-200',
                    streaming ? 'bg-teal-brand' : 'bg-border-strong',
                  )}
                  style={{
                    height: `${Math.max(18, Math.round((v / maxVel) * 100))}%`,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-teal-brand mt-1 font-mono text-[10px]">
            {streaming
              ? `+${counters.docsPerSecond} artifacts / sec`
              : 'All source pages indexed'}
          </p>
        </div>

        {/* 2. External Research Channels */}
        <div className="bg-surface px-4 py-3.5">
          <div className="text-text-secondary flex items-center justify-between text-[11px]">
            <span>Live Data Sources</span>
            <Database className="text-text-secondary h-3.5 w-3.5" />
          </div>
          <p className="text-text-primary mt-1.5 text-xl font-bold tabular-nums">
            {counters.sourcesQueried}{' '}
            <span className="text-text-secondary text-xs font-medium">
              channels
            </span>
          </p>
          <p className="text-text-secondary mt-1 text-[10px]">
            Web · SEC · Hiring · DNS · News
          </p>
        </div>

        {/* 3. Concrete Buying Signals Extracted */}
        <div className="bg-surface px-4 py-3.5">
          <div className="text-text-secondary flex items-center justify-between text-[11px]">
            <span>Signals Extracted</span>
            <Zap className="text-brand h-3.5 w-3.5" />
          </div>
          <p className="text-text-primary mt-1.5 text-xl font-bold tabular-nums">
            {formatNumber(counters.signalsExtracted)}
          </p>
          <p className="text-text-secondary mt-1 text-[10px]">
            Tech, hiring, funding &amp; ICP cues
          </p>
        </div>

        {/* 4. Screened -> Shortlisted Funnel Ratio */}
        <div className="bg-surface px-4 py-3.5">
          <div className="text-text-secondary flex items-center justify-between text-[11px]">
            <span>Entities Screened</span>
            <Building2 className="text-text-secondary h-3.5 w-3.5" />
          </div>
          <p className="text-text-primary mt-1.5 text-xl font-bold tabular-nums">
            {formatNumber(counters.candidatesScreened)}
          </p>
          <p className="text-text-secondary mt-1 text-[10px]">
            <span className="text-teal-brand font-semibold">
              {counters.candidatesQualified} qualified
            </span>{' '}
            · {formatNumber(counters.candidatesExcluded)} filtered out
          </p>
        </div>

        {/* 5. Grounded Evidence Citations */}
        <div className="bg-surface col-span-2 px-4 py-3.5 sm:col-span-1">
          <div className="text-text-secondary flex items-center justify-between text-[11px]">
            <span>Source Grounding</span>
            <ShieldCheck className="text-teal-brand h-3.5 w-3.5" />
          </div>
          <p className="text-teal-brand mt-1.5 text-xl font-bold tabular-nums">
            {counters.groundingRate}%
          </p>
          <p className="text-text-secondary mt-1 text-[10px]">
            Claims backed by traceable URLs
          </p>
        </div>
      </div>

      {/* Interactive Split Observatory Body: Signal Pipeline Map (Left) + Rapid AI Inspection Terminal (Right) */}
      <div className="grid gap-0 xl:grid-cols-12">
        {/* LEFT COLUMN: Interactive Source-to-Signal Architecture & Channel Selector */}
        <div className="border-border-subtle bg-app/35 border-b p-5 xl:col-span-5 xl:border-r xl:border-b-0">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-text-secondary text-xs font-semibold tracking-wider uppercase">
                Active Research Channels
              </h3>
              <p className="text-text-disabled mt-0.5 text-[11px]">
                Click any source channel to isolate its live crawl trace
              </p>
            </div>
            <span className="text-teal-brand font-mono text-[10px]">
              {streaming ? 'SYNCING' : 'LOCKED'}
            </span>
          </div>

          {/* Interactive 2-Column Source -> Synthesis Core Visual */}
          <div className="grid items-center gap-3 sm:grid-cols-12">
            {/* 5 Clickable Source Channels */}
            <div className="space-y-2 sm:col-span-8">
              {channels.map((ch) => {
                const Icon = CHANNEL_ICONS[ch.id];
                const isSelected = channelFilter === ch.id;
                const isPulsing = streaming && activePulseChannel === ch.id;

                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() =>
                      setChannelFilter((prev) =>
                        prev === ch.id ? 'all' : ch.id,
                      )
                    }
                    className={cn(
                      'group rounded-card flex w-full items-center justify-between gap-2.5 border px-3 py-2.5 text-left transition-all duration-150',
                      isSelected
                        ? 'border-brand bg-brand-soft/30 shadow-brand-subtle'
                        : isPulsing
                          ? 'border-teal-brand/60 bg-teal-soft/20'
                          : 'border-border-subtle bg-surface hover:border-border-strong hover:bg-hover/60',
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border',
                          isSelected
                            ? 'border-brand-border bg-brand-soft text-brand'
                            : isPulsing
                              ? 'border-teal-brand/40 bg-teal-soft text-teal-brand'
                              : 'border-border-subtle bg-app text-text-secondary',
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-text-primary truncate text-xs font-semibold">
                            {ch.shortLabel}
                          </span>
                          {isPulsing && (
                            <span className="bg-teal-brand h-1.5 w-1.5 animate-ping rounded-full" />
                          )}
                        </div>
                        <p className="text-text-secondary font-mono text-[10px] tabular-nums">
                          {ch.docsParsed} docs · {ch.signalsFound} cues
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={cn(
                          'inline-block rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums',
                          ch.status === 'queued'
                            ? 'bg-app text-text-disabled'
                            : isPulsing
                              ? 'bg-teal-soft text-teal-brand'
                              : ch.status === 'completed'
                                ? 'bg-success/10 text-success'
                                : 'bg-app text-text-secondary',
                        )}
                      >
                        {ch.status === 'queued'
                          ? 'Queued'
                          : ch.status === 'completed' && !streaming
                            ? 'Done'
                            : `${ch.latencyMs}ms`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Synthesis Core & Live Signal Conduit (Theme-Safe Tokens) */}
            <div className="rounded-card border-border-subtle bg-surface flex flex-col items-center justify-center border p-4 text-center sm:col-span-4">
              {/* Animated SVG Conduit */}
              <svg
                viewBox="0 0 120 74"
                className="mb-2 h-16 w-full max-w-[120px]"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="vgFlowTeal"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#00B6B6" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#00B6B6" stopOpacity="0.95" />
                    <stop
                      offset="100%"
                      stopColor="#F59E0B"
                      stopOpacity="0.95"
                    />
                  </linearGradient>
                </defs>
                {/* Converging paths */}
                {[12, 26, 37, 48, 62].map((y, idx) => (
                  <path
                    key={y}
                    d={`M 6 ${y} C 38 ${y}, 46 37, 74 37`}
                    fill="none"
                    stroke={
                      streaming &&
                      idx ===
                        channels.findIndex((c) => c.id === activePulseChannel)
                        ? 'url(#vgFlowTeal)'
                        : 'var(--border-strong)'
                    }
                    strokeWidth={
                      streaming &&
                      idx ===
                        channels.findIndex((c) => c.id === activePulseChannel)
                        ? '2.2'
                        : '1.2'
                    }
                    strokeDasharray={streaming ? '4 4' : undefined}
                  />
                ))}
                {/* Central AI Synthesis Node */}
                <circle
                  cx="88"
                  cy="37"
                  r="19"
                  fill="var(--bg-surface)"
                  stroke={streaming ? '#00B6B6' : '#F59E0B'}
                  strokeWidth="2"
                />
                <circle
                  cx="88"
                  cy="37"
                  r="12"
                  fill={
                    streaming
                      ? 'rgba(0, 182, 182, 0.16)'
                      : 'rgba(245, 158, 11, 0.14)'
                  }
                />
              </svg>

              <span className="text-text-primary inline-flex items-center gap-1 text-[11px] font-bold">
                <Sparkles className="text-brand h-3 w-3" />
                VANGUARD Core
              </span>
              <p className="text-text-secondary mt-1 text-[10px] leading-relaxed">
                Deduplicates entities, cross-checks claims &amp; computes
                explainable fit rubrics.
              </p>

              <button
                type="button"
                onClick={onJumpToCompanies}
                className="rounded-btn border-brand-border bg-brand-soft text-brand hover:bg-brand/20 mt-3 inline-flex items-center gap-1 border px-2.5 py-1.5 text-[11px] font-semibold transition-colors"
              >
                {counters.candidatesQualified} Qualified
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Real-Time Candidate Triage Strip (Shows BOTH Qualified Matches & Transparent Exclusions!) */}
          <div className="border-border-subtle mt-5 border-t pt-4">
            <div className="mb-2.5 flex items-center justify-between">
              <h3 className="text-text-secondary text-xs font-semibold tracking-wider uppercase">
                Live Candidate Triage (Shortlisted vs. Filtered)
              </h3>
              <span className="text-text-disabled text-[10px]">
                Click match to inspect
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {triage.slice(0, 4).map((item) => {
                const matchedObj = item.companyId
                  ? matchedCompanies.find((c) => c.id === item.companyId)
                  : undefined;

                if (item.verdict === 'qualified' && matchedObj) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onInspectCompany(matchedObj)}
                      className="rounded-btn border-teal-brand/30 bg-surface hover:border-teal-brand hover:bg-hover/60 flex flex-col justify-between border p-2.5 text-left transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-text-primary truncate text-xs font-semibold">
                          {item.companyName}
                        </span>
                        <span className="bg-teal-soft text-teal-brand shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold">
                          {item.score}%
                        </span>
                      </div>
                      <p className="text-text-secondary mt-1 line-clamp-1 text-[10px]">
                        {item.reason}
                      </p>
                    </button>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="rounded-btn border-border-subtle bg-app/55 flex flex-col justify-between border p-2.5 opacity-85"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-text-secondary truncate text-xs font-medium line-through">
                        {item.companyName}
                      </span>
                      <span className="bg-danger/10 text-danger inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 font-mono text-[10px]">
                        <XCircle className="h-2.5 w-2.5" />
                        Filtered
                      </span>
                    </div>
                    <p className="text-text-disabled mt-1 line-clamp-1 text-[10px]">
                      {item.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Rapid Live Source Inspection Feed + Click-to-Inspect Extracted Payload (Theme-Safe) */}
        <div className="bg-app/60 flex flex-col p-5 xl:col-span-7">
          {/* Feed Filter Bar */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="text-teal-brand h-4 w-4" />
              <h3 className="text-text-primary text-xs font-semibold tracking-wider uppercase">
                Rapid Source &amp; Reasoning Stream
              </h3>
              {streaming && (
                <span className="bg-teal-soft text-teal-brand inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold">
                  <Activity className="h-3 w-3 animate-pulse" />
                  LIVE
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <Filter className="text-text-disabled mr-1 h-3 w-3" />
              {(
                [
                  'all',
                  'web',
                  'filings',
                  'hiring',
                  'tech',
                  'news',
                  'scoring',
                ] as const
              ).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setChannelFilter(f)}
                  className={cn(
                    'rounded-control px-2 py-0.5 text-[10px] font-semibold uppercase transition-colors',
                    channelFilter === f
                      ? 'bg-brand text-[#0D0E11]'
                      : 'bg-surface text-text-secondary hover:text-text-primary',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Rapid Scrolling Live Stream Rows */}
          <div
            className="rounded-card border-border-subtle bg-app/90 h-[290px] space-y-1.5 overflow-y-auto border p-2.5 font-mono"
            role="log"
            aria-live="off"
            aria-label="Live AI source inspection stream"
          >
            {filteredFeed.map((ev) => {
              const isPinned = pinnedEvent?.id === ev.id;
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => setPinnedEvent(ev)}
                  className={cn(
                    'rounded-btn flex w-full flex-col gap-1 border px-3 py-2 text-left transition-colors sm:flex-row sm:items-center sm:justify-between',
                    isPinned
                      ? 'border-brand bg-brand-soft/15'
                      : 'bg-surface/65 hover:border-border-subtle hover:bg-hover/50 border-transparent',
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="text-text-disabled tabular-nums">
                        {ev.timestamp}
                      </span>
                      <span
                        className={cn(
                          'py-0.2 rounded border px-1.5 font-semibold',
                          OUTCOME_STYLE[ev.outcome],
                        )}
                      >
                        {ev.statusTag}
                      </span>
                      <span className="text-teal-brand truncate">
                        {ev.sourceUri}
                      </span>
                    </div>
                    <p className="text-text-primary mt-1 truncate font-sans text-xs">
                      {ev.headline}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-[10px]">
                    {ev.scoreImpact && (
                      <span className="bg-app text-brand rounded px-1.5 py-0.5 font-semibold">
                        {ev.scoreImpact}
                      </span>
                    )}
                    <span className="text-text-disabled tabular-nums">
                      {ev.latencyMs}ms
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredFeed.length === 0 && (
              <div className="text-text-secondary flex h-full items-center justify-center font-sans text-xs">
                No events for this channel yet — resume stream or switch to All.
              </div>
            )}
          </div>

          {/* Click-to-Inspect Extracted Artifact Inspector */}
          {pinnedEvent && (
            <div className="rounded-card border-border-strong bg-surface mt-3 border p-3.5">
              <div className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <CheckCircle2 className="text-teal-brand h-4 w-4 shrink-0" />
                  <p className="text-text-primary truncate text-xs font-semibold">
                    Inspected Artifact:{' '}
                    <span className="text-teal-brand font-mono">
                      {pinnedEvent.sourceUri}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                      getVerificationMeta(pinnedEvent.verification).className,
                    )}
                  >
                    {getVerificationMeta(pinnedEvent.verification).label}
                  </span>
                  {pinnedEvent.companyId && (
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => {
                        const comp = matchedCompanies.find(
                          (c) => c.id === pinnedEvent.companyId,
                        );
                        if (comp) onInspectCompany(comp);
                      }}
                    >
                      Open Company Drawer
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-2.5 grid gap-2 text-xs sm:grid-cols-2">
                {Object.entries(pinnedEvent.extractedPayload).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="rounded-btn border-border-subtle bg-app/60 border px-2.5 py-1.5"
                    >
                      <span className="text-text-disabled block font-mono text-[10px] uppercase">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-text-primary mt-0.5 block text-xs">
                        {value}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
