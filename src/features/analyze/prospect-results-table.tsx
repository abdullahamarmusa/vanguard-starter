'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Columns2,
  Download,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { CompanyCompareModal } from '@/features/analyze/company-compare-modal';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn, downloadTextFile, getMatchScoreTone, toCsv } from '@/lib/utils';
import type { ProspectCompany } from '@/types/vanguard';

type FitFilter = 'all' | 'high' | 'medium' | 'low' | 'review' | 'saved';
type SortField = 'score' | 'size' | 'evidence';

interface ProspectResultsTableProps {
  companies: ProspectCompany[];
  isPreliminary?: boolean;
  onSelectCompany: (company: ProspectCompany) => void;
}

function sizeWeight(range: string): number {
  if (range.includes('10K+')) return 4;
  if (range.includes('5K')) return 3;
  if (range.includes('1K')) return 2;
  return 1;
}

export function ProspectResultsTable({
  companies,
  isPreliminary = false,
  onSelectCompany,
}: ProspectResultsTableProps) {
  const { toggleSaveProspect, pushToast } = usePrototypeStore();
  const [filter, setFilter] = useState<FitFilter>('all');
  const [sortBy, setSortBy] = useState<SortField>('score');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const toggleCompareId = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) {
        pushToast({
          title: 'Compare supports up to 3 companies side by side',
          variant: 'info',
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const activeCompanies = useMemo(
    () => companies.filter((c) => !c.excluded),
    [companies],
  );

  const filtered = useMemo(() => {
    return activeCompanies
      .filter((c) => {
        if (filter === 'high') return c.matchScore >= 90;
        if (filter === 'medium') return c.matchScore >= 80 && c.matchScore < 90;
        if (filter === 'low') return c.matchScore < 80;
        if (filter === 'review') return c.status === 'In Review' || !c.reviewed;
        if (filter === 'saved') return c.saved;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.matchScore - a.matchScore;
        if (sortBy === 'size')
          return sizeWeight(b.employeeRange) - sizeWeight(a.employeeRange);
        return b.evidence.length - a.evidence.length;
      });
  }, [activeCompanies, filter, sortBy]);

  const highFitCount = activeCompanies.filter((c) => c.matchScore >= 90).length;
  const mediumFitCount = activeCompanies.filter(
    (c) => c.matchScore >= 80 && c.matchScore < 90,
  ).length;
  const lowFitCount = activeCompanies.filter((c) => c.matchScore < 80).length;
  const verifiedEvidenceCount = activeCompanies.filter((c) =>
    c.evidence.some((e) => e.verification === 'verified'),
  ).length;
  const evidenceCoverage =
    activeCompanies.length > 0
      ? Math.round((verifiedEvidenceCount / activeCompanies.length) * 100)
      : 0;
  const avgFit =
    activeCompanies.length > 0
      ? (
          activeCompanies.reduce((sum, c) => sum + c.matchScore, 0) /
          activeCompanies.length
        ).toFixed(1)
      : '0.0';

  const handleExportTable = () => {
    const csv = toCsv(
      [
        'Company',
        'Industry',
        'Company Size',
        'Fit Score',
        'Evidence Sources',
        'Status',
        'Saved',
      ],
      filtered.map((c) => [
        c.name,
        c.industry,
        c.employeeRange,
        `${c.matchScore}%`,
        c.evidence.length,
        c.status,
        c.saved ? 'Yes' : 'No',
      ]),
    );
    downloadTextFile(
      'vanguard-qualification-results.csv',
      csv,
      'text/csv;charset=utf-8',
    );
    pushToast({
      title: `Exported ${filtered.length} qualified companies (CSV)`,
      variant: 'success',
    });
  };

  return (
    <div className="space-y-5">
      {/* Level A: Results Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-card border-border-subtle bg-surface border p-4">
          <p className="text-text-secondary text-xs">
            {isPreliminary
              ? 'Companies Surfaced (Live)'
              : 'Companies Discovered'}
          </p>
          <p className="text-text-primary mt-1.5 text-2xl font-bold tabular-nums">
            {activeCompanies.length}
          </p>
          <p className="text-text-disabled mt-1 text-[11px]">
            Illustrative cohort
          </p>
        </div>
        <div className="rounded-card border-border-subtle bg-surface border p-4">
          <p className="text-text-secondary text-xs">High-Fit Opportunities</p>
          <p className="text-teal-brand mt-1.5 text-2xl font-bold tabular-nums">
            {highFitCount}
          </p>
          <p className="text-text-disabled mt-1 text-[11px]">Score ≥ 90%</p>
        </div>
        <div className="rounded-card border-border-subtle bg-surface border p-4">
          <p className="text-text-secondary text-xs">Average Fit Score</p>
          <p className="text-text-primary mt-1.5 text-2xl font-bold tabular-nums">
            {avgFit}%
          </p>
          <p className="text-text-disabled mt-1 text-[11px]">
            Weighted ICP rubric
          </p>
        </div>
        <div className="rounded-card border-border-subtle bg-surface border p-4">
          <p className="text-text-secondary text-xs">
            Verified Evidence Coverage
          </p>
          <p className="text-brand mt-1.5 text-2xl font-bold tabular-nums">
            {evidenceCoverage}%
          </p>
          <p className="text-text-disabled mt-1 text-[11px]">
            ≥1 primary source attached
          </p>
        </div>
        <div className="rounded-card border-border-subtle bg-surface border p-4">
          <p className="text-text-secondary text-xs">
            Qualification Distribution
          </p>
          <div className="bg-elevated mt-2.5 flex h-2.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-teal-brand"
              style={{
                width: `${activeCompanies.length ? (highFitCount / activeCompanies.length) * 100 : 0}%`,
              }}
              title={`High fit: ${highFitCount}`}
            />
            <div
              className="bg-brand"
              style={{
                width: `${activeCompanies.length ? (mediumFitCount / activeCompanies.length) * 100 : 0}%`,
              }}
              title={`Medium fit: ${mediumFitCount}`}
            />
            <div
              className="bg-border-strong"
              style={{
                width: `${activeCompanies.length ? (lowFitCount / activeCompanies.length) * 100 : 0}%`,
              }}
              title={`Low fit: ${lowFitCount}`}
            />
          </div>
          <p className="text-text-secondary mt-2 text-[11px] tabular-nums">
            {highFitCount} high · {mediumFitCount} med · {lowFitCount} low
          </p>
        </div>
      </div>

      {/* Level B: Prospect Results Table */}
      <Card>
        <CardHeader className="border-border-subtle flex-col items-start gap-3 border-b pb-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Prospect Qualification Results</CardTitle>
              {isPreliminary && (
                <Badge variant="brand">Preliminary — Analysis Running</Badge>
              )}
            </div>
            <p className="text-text-secondary mt-0.5 text-xs">
              Select any company row to open the Intelligence Drawer with
              evidence, confidence, and next actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {compareIds.length >= 2 && (
              <Button size="xs" onClick={() => setCompareOpen(true)}>
                <Columns2 className="h-3.5 w-3.5" />
                Compare ({compareIds.length})
              </Button>
            )}
            {compareIds.length > 0 && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setCompareIds([])}
              >
                Clear ({compareIds.length})
              </Button>
            )}
            <div className="inline-flex items-center gap-1.5">
              <ArrowUpDown className="text-text-secondary h-3.5 w-3.5" />
              <select
                aria-label="Sort qualification results"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                className="rounded-btn border-border-subtle bg-app text-text-primary h-8 border px-2.5 text-xs"
              >
                <option value="score">Sort: Fit Score</option>
                <option value="size">Sort: Company Size</option>
                <option value="evidence">Sort: Evidence Quality</option>
              </select>
            </div>
            <Button variant="secondary" size="xs" onClick={handleExportTable}>
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {/* Filter Chips */}
          <div
            className="mb-4 flex flex-wrap gap-1.5"
            role="group"
            aria-label="Filter companies"
          >
            {(
              [
                {
                  id: 'all',
                  label: `All companies (${activeCompanies.length})`,
                },
                { id: 'high', label: `High fit (${highFitCount})` },
                { id: 'medium', label: `Medium fit (${mediumFitCount})` },
                { id: 'low', label: `Low fit (${lowFitCount})` },
                { id: 'review', label: 'Needs review' },
                { id: 'saved', label: 'Saved prospects' },
              ] as const
            ).map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
                  filter === chip.id
                    ? 'border-brand-border bg-brand-soft text-brand'
                    : 'border-border-subtle bg-app/50 text-text-secondary hover:border-border-strong hover:text-text-primary',
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<ShieldCheck className="h-5 w-5" />}
              title="No companies match this filter"
              description="Adjust your fit-score filter or switch back to All companies."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  Show All Companies
                </Button>
              }
            />
          ) : (
            <>
              {/* Desktop Semantic Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-border-subtle text-text-secondary border-b">
                      <th scope="col" className="w-8 py-2.5 pr-2 font-semibold">
                        <span className="sr-only">Compare</span>
                      </th>
                      <th scope="col" className="py-2.5 pr-4 font-semibold">
                        Company
                      </th>
                      <th scope="col" className="py-2.5 pr-4 font-semibold">
                        Industry
                      </th>
                      <th scope="col" className="py-2.5 pr-4 font-semibold">
                        Fit Score
                      </th>
                      <th scope="col" className="py-2.5 pr-4 font-semibold">
                        Evidence
                      </th>
                      <th scope="col" className="py-2.5 pr-4 font-semibold">
                        Status
                      </th>
                      <th
                        scope="col"
                        className="py-2.5 text-right font-semibold"
                      >
                        Inspect
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-border-subtle divide-y">
                    {filtered.map((company) => {
                      const tone = getMatchScoreTone(company.matchScore);
                      return (
                        <tr
                          key={company.id}
                          onClick={() => onSelectCompany(company)}
                          className="group hover:bg-hover/55 cursor-pointer transition-colors duration-150"
                        >
                          <td
                            className="py-3.5 pr-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              aria-label={`Select ${company.name} to compare`}
                              checked={compareIds.includes(company.id)}
                              onChange={() => toggleCompareId(company.id)}
                              className="border-border-strong bg-app accent-brand h-4 w-4 rounded"
                            />
                          </td>
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-3">
                              <span
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                                style={{ backgroundColor: company.logoColor }}
                              >
                                {company.logoText}
                              </span>
                              <div>
                                <p className="text-text-primary group-hover:text-brand font-semibold">
                                  {company.name}
                                </p>
                                <p className="text-text-secondary text-[11px]">
                                  {company.employeeRange} · {company.location}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="text-text-primary py-3.5 pr-4">
                            {company.industry}
                          </td>
                          <td className="py-3.5 pr-4">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tabular-nums ${tone.className}`}
                            >
                              {company.matchScore}% · {tone.label}
                            </span>
                          </td>
                          <td className="text-text-secondary py-3.5 pr-4 tabular-nums">
                            {company.evidence.length}{' '}
                            {company.evidence.length === 1
                              ? 'source'
                              : 'sources'}
                          </td>
                          <td className="py-3.5 pr-4">
                            <Badge
                              variant={
                                company.status === 'Qualified'
                                  ? 'teal'
                                  : 'default'
                              }
                            >
                              {company.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                aria-label={
                                  company.saved
                                    ? `Unsave ${company.name}`
                                    : `Save ${company.name}`
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveProspect(company.id);
                                }}
                                className="rounded-control text-text-secondary hover:bg-elevated hover:text-brand p-1.5"
                              >
                                {company.saved ? (
                                  <BookmarkCheck className="text-brand h-4 w-4" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                              </button>
                              <span className="rounded-btn border-border-subtle bg-app/70 text-text-primary group-hover:border-brand-border group-hover:text-brand inline-flex items-center gap-1 border px-2.5 py-1 text-[11px] font-medium">
                                Details
                                <ChevronRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Presentation (Section 4.2 Responsive Behavior) */}
              <div className="space-y-3 md:hidden">
                {filtered.map((company) => {
                  const tone = getMatchScoreTone(company.matchScore);
                  return (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() => onSelectCompany(company)}
                      className="rounded-card border-border-subtle bg-app/50 hover:border-border-strong flex w-full flex-col gap-2.5 border p-3.5 text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: company.logoColor }}
                          >
                            {company.logoText}
                          </span>
                          <div>
                            <p className="text-text-primary text-sm font-semibold">
                              {company.name}
                            </p>
                            <p className="text-text-secondary text-[11px]">
                              {company.industry} · {company.employeeRange}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${tone.className}`}
                        >
                          {company.matchScore}%
                        </span>
                      </div>
                      <div className="text-text-secondary flex items-center justify-between text-[11px]">
                        <span>{company.evidence.length} evidence sources</span>
                        <span className="text-brand inline-flex items-center gap-1 font-medium">
                          Open Intelligence <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <CompanyCompareModal
        open={compareOpen}
        companies={activeCompanies.filter((c) => compareIds.includes(c.id))}
        onClose={() => setCompareOpen(false)}
        onInspectCompany={(company) => onSelectCompany(company)}
        onToggleSave={(companyId) => toggleSaveProspect(companyId)}
      />
    </div>
  );
}
