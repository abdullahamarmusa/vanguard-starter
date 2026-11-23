'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Link2,
  Play,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea } from '@/components/ui/input';
import { analyzeSubmissionSchema } from '@/lib/validation';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn } from '@/lib/utils';

const EXAMPLES = [
  'https://www.example.com',
  'SaaS for remote teams',
  'AI marketing tool',
  'Fintech solution',
  'E-commerce platform',
];

export function AnalyzeEntryView({ initialInput }: { initialInput?: string }) {
  const { analyses } = usePrototypeStore();

  const [inputValue, setInputValue] = useState(
    initialInput ?? 'https://www.example.com',
  );
  const [offerDescription, setOfferDescription] = useState('');
  const [objective, setObjective] = useState(
    'Discover & qualify ideal B2B buyers',
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [targetIndustry, setTargetIndustry] = useState(
    'Technology & Enterprise SaaS',
  );
  const [targetRegion, setTargetRegion] = useState(
    'North America & Western Europe',
  );
  const [companySize, setCompanySize] = useState('200–10,000+ employees');
  const [targetJobTitles, setTargetJobTitles] = useState(
    'VP of Engineering, CTO, Director of Partner Engineering',
  );
  const [maxCompanies, setMaxCompanies] = useState(100);
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const parsed = analyzeSubmissionSchema.safeParse({
      inputValue,
      offerDescription: offerDescription || undefined,
      objective,
      targetIndustry,
      targetRegion,
      companySize,
      targetJobTitles,
      maxCompanies,
      additionalInstructions: additionalInstructions || undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input.');
      return;
    }

    setSubmitting(false);
    setError(
      'The analysis service is not connected yet. Your request was validated, but no analysis job was started.',
    );
  };

  return (
    <div className="space-y-6">
      {/* Phase 1 — Input & Configuration */}
      <section className="vanguard-hero-surface rounded-panel border-border-subtle shadow-card border p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="brand">
                <Sparkles className="h-3 w-3" />
                VANGUARD Offer Intelligence
              </Badge>
              <span className="text-text-secondary text-xs">
                Phase 1 of 4 · Input &amp; Configuration
              </span>
            </div>

            <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-[32px] sm:leading-[1.18]">
              Turn Your Offer Into{' '}
              <span className="text-brand">Explainable Opportunities</span>
            </h1>
            <p className="text-text-secondary mt-2 max-w-2xl text-sm leading-relaxed">
              Submit a website URL, business idea, or offer description.
              Configure your target geography, industry, and ideal buyer roles
              before starting live intelligence processing.
            </p>

            {/* Primary Submission Form */}
            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="analyze-url-input"
                  className="text-text-primary mb-1.5 block text-xs font-semibold"
                >
                  Website URL, Offer Headline, or Business Idea{' '}
                  <span className="text-brand">*</span>
                </label>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <div className="relative flex-1">
                    <Link2 className="text-text-disabled pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
                    <input
                      id="analyze-url-input"
                      type="text"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="https://www.example.com or describe your B2B offer..."
                      aria-invalid={Boolean(error)}
                      className={cn(
                        'rounded-btn bg-app/80 text-text-primary placeholder:text-text-disabled h-12 w-full border pr-9 pl-10 text-sm',
                        'focus:ring-brand/40 focus:border-brand focus:ring-2 focus:outline-none',
                        error ? 'border-danger' : 'border-border-subtle',
                      )}
                    />
                    {inputValue && (
                      <button
                        type="button"
                        onClick={() => setInputValue('')}
                        aria-label="Clear input"
                        className="rounded-control text-text-secondary hover:bg-hover hover:text-text-primary absolute top-1/2 right-2.5 -translate-y-1/2 p-1"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    loading={submitting}
                    className="h-12 shrink-0 px-6"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Start Analysis</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                {error && (
                  <p
                    role="alert"
                    className="text-danger mt-1.5 text-xs font-medium"
                  >
                    {error}
                  </p>
                )}
              </div>

              {/* Example chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-text-secondary mr-1 text-xs">
                  Examples:
                </span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setInputValue(ex);
                      setError(null);
                    }}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      inputValue === ex
                        ? 'border-brand-border bg-brand-soft text-brand'
                        : 'border-border-subtle bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary',
                    )}
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Essential Fields + Progressive Disclosure Trigger */}
              <div className="grid gap-4 pt-1 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="offer-desc"
                    className="text-text-secondary mb-1.5 block text-xs font-medium"
                  >
                    Offer Description{' '}
                    <span className="text-text-disabled">(Optional)</span>
                  </label>
                  <Textarea
                    id="offer-desc"
                    rows={2}
                    value={offerDescription}
                    onChange={(e) => setOfferDescription(e.target.value)}
                    placeholder="Value proposition, deal size, or delivery specialization..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="analysis-obj"
                    className="text-text-secondary mb-1.5 block text-xs font-medium"
                  >
                    Analysis Objective
                  </label>
                  <select
                    id="analysis-obj"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="rounded-btn border-border-subtle bg-app/80 text-text-primary focus:ring-brand/40 h-11 w-full border px-3 text-sm focus:ring-2 focus:outline-none"
                  >
                    <option value="Discover & qualify ideal B2B buyers">
                      Discover &amp; qualify ideal B2B buyers
                    </option>
                    <option value="Validate ICP & buying signals">
                      Validate ICP &amp; buying signals
                    </option>
                    <option value="Build enterprise outreach shortlist">
                      Build enterprise outreach shortlist
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowAdvanced((v) => !v)}
                    aria-expanded={showAdvanced}
                    className="text-brand mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    {showAdvanced
                      ? 'Hide Advanced Configuration'
                      : 'Configure Target Market, ICP & Discovery Limit'}
                  </button>
                </div>
              </div>

              {/* Progressive Disclosure: Advanced Configuration */}
              {showAdvanced && (
                <div className="rounded-card border-border-subtle bg-app/70 space-y-4 border p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="icp-geo"
                        className="text-text-secondary mb-1 block text-xs font-medium"
                      >
                        Target Geography
                      </label>
                      <Input
                        id="icp-geo"
                        value={targetRegion}
                        onChange={(e) => setTargetRegion(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="icp-ind"
                        className="text-text-secondary mb-1 block text-xs font-medium"
                      >
                        Industry
                      </label>
                      <Input
                        id="icp-ind"
                        value={targetIndustry}
                        onChange={(e) => setTargetIndustry(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="icp-size"
                        className="text-text-secondary mb-1 block text-xs font-medium"
                      >
                        Company Size
                      </label>
                      <Input
                        id="icp-size"
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="icp-titles"
                        className="text-text-secondary mb-1 block text-xs font-medium"
                      >
                        Target Job Titles
                      </label>
                      <Input
                        id="icp-titles"
                        value={targetJobTitles}
                        onChange={(e) => setTargetJobTitles(e.target.value)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="icp-max"
                        className="text-text-secondary mb-1 block text-xs font-medium"
                      >
                        Companies to Discover
                      </label>
                      <Input
                        id="icp-max"
                        type="number"
                        min={10}
                        max={500}
                        value={maxCompanies}
                        onChange={(e) =>
                          setMaxCompanies(Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="icp-notes"
                      className="text-text-secondary mb-1 block text-xs font-medium"
                    >
                      Additional Instructions
                    </label>
                    <Textarea
                      id="icp-notes"
                      rows={2}
                      value={additionalInstructions}
                      onChange={(e) =>
                        setAdditionalInstructions(e.target.value)
                      }
                      placeholder="e.g., Exclude agencies; prioritize companies hiring React/TypeScript engineers..."
                    />
                  </div>
                </div>
              )}

              {/* Pre-flight Configuration Review Bar */}
              <div className="rounded-btn border-border-subtle bg-surface/80 text-text-secondary flex flex-wrap items-center gap-x-4 gap-y-1.5 border px-3.5 py-2 text-[11px]">
                <span className="text-text-primary font-semibold">
                  Configuration Summary:
                </span>
                <span>Industry: {targetIndustry}</span>
                <span>·</span>
                <span>Geo: {targetRegion}</span>
                <span>·</span>
                <span>Size: {companySize}</span>
                <span>·</span>
                <span>Limit: {maxCompanies} companies</span>
              </div>
            </form>
          </div>

          {/* Right 4-Phase Workflow Roadmap */}
          <div className="rounded-card border-border-subtle bg-app/70 border p-5 lg:col-span-4">
            <p className="text-text-secondary text-xs font-semibold tracking-wider uppercase">
              4-Phase Analysis Workflow
            </p>
            <ol className="text-text-primary mt-4 space-y-3.5 text-xs">
              {[
                {
                  num: '01',
                  title: 'Input & Configuration',
                  desc: 'Review offer source, geography, industry, and buyer titles.',
                },
                {
                  num: '02',
                  title: 'Live Intelligence Processing',
                  desc: 'Inspect stage sub-steps and real-time events.',
                },
                {
                  num: '03',
                  title: 'Qualification Results',
                  desc: 'Filter fit scores, evidence counts, and confidence.',
                },
                {
                  num: '04',
                  title: 'Take Action',
                  desc: 'Inspect company drawer, save prospects, or draft outreach.',
                },
              ].map((phase, idx) => (
                <li key={phase.num} className="flex items-start gap-3">
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-bold',
                      idx === 0
                        ? 'border-brand-border bg-brand-soft text-brand'
                        : 'border-border-subtle bg-surface text-text-secondary',
                    )}
                  >
                    {phase.num}
                  </span>
                  <div>
                    <p className="text-text-primary font-semibold">
                      {phase.title}
                    </p>
                    <p className="text-text-secondary mt-0.5">{phase.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Previous & Active Analyses (Clean Short Titles + Domain Metadata) */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent &amp; Active Analyses</CardTitle>
            <p className="text-text-secondary mt-0.5 text-xs">
              Reopen an active processing workspace or jump straight to
              completed qualification results.
            </p>
          </div>
          <Badge variant="default">{analyses.length} Analyses</Badge>
        </CardHeader>
        <CardContent>
          <div className="divide-border-subtle divide-y">
            {analyses.map((job) => {
              const completedStages = job.stages.filter(
                (s) => s.status === 'completed',
              ).length;
              return (
                <div
                  key={job.id}
                  className="flex flex-col justify-between gap-4 py-4 first:pt-1 last:pb-1 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/analyze/${job.id}`}
                        className="text-text-primary hover:text-brand text-sm font-semibold"
                      >
                        {job.shortTitle} ·{' '}
                        <span className="text-brand">{job.sourceDomain}</span>
                      </Link>
                      <Badge variant="default">#{job.code}</Badge>
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
                          ? 'Processing (Simulated)'
                          : job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-text-secondary mt-1 text-xs">
                      {job.objective} · Stage {completedStages}/
                      {job.stages.length} ·{' '}
                      {job.status === 'completed'
                        ? `${job.matchesFound} qualified matches (${job.avgMatchScore}% avg.)`
                        : `${job.companiesAnalyzed.toLocaleString()} screened so far (preliminary)`}
                    </p>
                    <p className="text-text-disabled mt-1 inline-flex items-center gap-1.5 text-[11px]">
                      <Clock className="h-3 w-3" />
                      {job.createdAt}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Link href={`/analyze/${job.id}`}>
                      <Button variant="secondary" size="sm">
                        <Play className="h-3.5 w-3.5" />
                        {job.status === 'running'
                          ? 'Live Workspace'
                          : 'Inspect Stages'}
                      </Button>
                    </Link>
                    <Link href={`/analyze/${job.id}/results`}>
                      <Button variant="primary" size="sm">
                        Results
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
