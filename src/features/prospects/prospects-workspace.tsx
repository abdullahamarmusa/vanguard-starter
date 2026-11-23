'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  CheckSquare,
  Columns2,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Globe,
  Mail,
  MapPin,
  Megaphone,
  Search,
  Square,
  Target,
  Users,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Drawer } from '@/components/ui/drawer';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressRing } from '@/components/ui/progress-ring';
import { KpiCard } from '@/features/dashboard/kpi-card';
import { CompanyCompareModal } from '@/features/analyze/company-compare-modal';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn, downloadTextFile, getVerificationMeta, toCsv } from '@/lib/utils';
import type { DateRangePreset } from '@/types/vanguard';

type DetailTab = 'overview' | 'fit' | 'evidence' | 'contacts';

export function ProspectsWorkspace() {
  const searchParams = useSearchParams();
  const {
    prospects,
    campaigns,
    toggleSaveProspect,
    bulkSaveProspects,
    enrollProspectsInCampaign,
    isEmptyWorkspace,
    toggleEmptyWorkspace,
    pushToast,
  } = usePrototypeStore();

  const [range, setRange] = useState<DateRangePreset>('30D');
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [industry, setIndustry] = useState(
    searchParams.get('industry') ?? 'All',
  );
  const [region, setRegion] = useState('All');
  const [minMatch, setMinMatch] = useState(
    Number(searchParams.get('minMatch') ?? 70),
  );
  const [savedOnly, setSavedOnly] = useState(searchParams.get('saved') === '1');
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') ?? 'All',
  );
  const [sortBy, setSortBy] = useState<'match' | 'name'>('match');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [selectedId, setSelectedId] = useState<string>(
    searchParams.get('selected') ?? prospects[0]?.id ?? '',
  );
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [campaignModalIds, setCampaignModalIds] = useState<string[] | null>(
    null,
  );
  const [targetCampaignId, setTargetCampaignId] = useState<string>(
    campaigns[0]?.id ?? '',
  );
  const [reportDrawerOpen, setReportDrawerOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    const indParam = searchParams.get('industry');
    const selParam = searchParams.get('selected');
    const qParam = searchParams.get('q');
    const statusParam = searchParams.get('status');
    const savedParam = searchParams.get('saved');
    const minParam = searchParams.get('minMatch');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reflect dashboard-linked filters from the current URL.
    if (indParam) setIndustry(indParam);
    if (selParam) setSelectedId(selParam);
    if (qParam !== null) setSearch(qParam);
    if (statusParam) setStatusFilter(statusParam);
    if (savedParam !== null)
      setSavedOnly(savedParam === '1' || savedParam === 'true');
    if (minParam !== null && Number.isFinite(Number(minParam)))
      setMinMatch(Number(minParam));
  }, [searchParams]);

  const industries = useMemo(
    () => ['All', ...Array.from(new Set(prospects.map((p) => p.industry)))],
    [prospects],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return prospects
      .filter((p) => {
        if (
          industry !== 'All' &&
          p.industry.toLowerCase() !== industry.toLowerCase()
        )
          return false;
        if (region !== 'All' && p.region !== region) return false;
        if (
          statusFilter !== 'All' &&
          p.status.toLowerCase() !== statusFilter.toLowerCase()
        ) {
          return false;
        }
        if (p.matchScore < minMatch) return false;
        if (savedOnly && !p.saved) return false;
        if (
          q &&
          !p.name.toLowerCase().includes(q) &&
          !p.industry.toLowerCase().includes(q) &&
          !p.location.toLowerCase().includes(q) &&
          !p.subIndustry.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) =>
        sortBy === 'match'
          ? b.matchScore - a.matchScore
          : a.name.localeCompare(b.name),
      );
  }, [
    prospects,
    search,
    industry,
    region,
    statusFilter,
    minMatch,
    savedOnly,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const activeCompany = useMemo(
    () => filtered.find((p) => p.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId],
  );

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleExportCsv = () => {
    const csv = toCsv(
      [
        'Company',
        'Industry',
        'Region',
        'Location',
        'Employees',
        'Match Score',
        'Status',
        'Saved',
        'Website',
      ],
      filtered.map((p) => [
        p.name,
        p.industry,
        p.region,
        p.location,
        p.employeeRange,
        `${p.matchScore}%`,
        p.status,
        p.saved ? 'Yes' : 'No',
        p.website,
      ]),
    );
    downloadTextFile(
      'vanguard-prospects-illustrative.csv',
      csv,
      'text/csv;charset=utf-8',
    );
    pushToast({
      title: `Exported ${filtered.length} prospects to CSV`,
      variant: 'success',
    });
  };

  if (isEmptyWorkspace) {
    return (
      <div className="space-y-6">
        <div>
          <Badge variant="ai">Prospects</Badge>
          <h1 className="text-text-primary mt-2 text-2xl font-bold">
            Discover &amp; Manage Your Prospects
          </h1>
        </div>
        <EmptyState
          icon={<Building2 className="h-6 w-6" />}
          title="No discovered prospects yet"
          description="Run your first offer analysis to populate verified companies with explainable ICP fit scores."
          action={
            <Button onClick={toggleEmptyWorkspace}>
              Load Illustrative Prospects
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="ai" className="mb-2">
            Prospects
          </Badge>
          <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-[28px]">
            Discover &amp; Manage Your Prospects
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Find, qualify, and organize the highest-fit companies for your
            offers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-btn border-border-subtle bg-surface inline-flex border p-1">
            {(['7D', '30D', '90D', 'Custom'] as DateRangePreset[]).map(
              (preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRange(preset)}
                  className={cn(
                    'rounded-control px-2.5 py-1 text-xs font-medium transition-colors',
                    range === preset
                      ? 'bg-brand-soft text-brand border-brand-border border'
                      : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  {preset}
                </button>
              ),
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={handleExportCsv}>
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Prospects"
          value="2,847"
          changeLabel="+18%"
          accent="blue"
          icon={<Building2 className="h-5 w-5" />}
          sparkline={[22, 28, 25, 39, 44, 52, 68]}
          tooltip="Illustrative organization-scoped prospect count."
        />
        <KpiCard
          title="Qualified"
          value="686"
          changeLabel="+24%"
          accent="teal"
          icon={<CheckCircle2 className="h-5 w-5" />}
          sparkline={[15, 21, 24, 30, 38, 49, 61]}
        />
        <KpiCard
          title="Conversion Rate"
          value="24.1%"
          changeLabel="+2.3%"
          accent="orange"
          icon={<Target className="h-5 w-5" />}
          sparkline={[18, 19, 20, 21, 22, 23, 24]}
        />
        <KpiCard
          title="Pipeline Value"
          value="$342K"
          changeLabel="+36%"
          accent="purple"
          icon={<DollarSign className="h-5 w-5" />}
          sparkline={[12, 16, 19, 24, 29, 36, 45]}
          tooltip="Illustrative estimated pipeline from qualified accounts."
        />
      </section>

      {/* Filter & Bulk Action Toolbar */}
      <div className="rounded-card border-border-subtle bg-surface flex flex-wrap items-center gap-2.5 border p-3">
        <div className="text-text-secondary inline-flex items-center gap-1.5 px-2 text-xs font-semibold">
          <Filter className="text-brand h-3.5 w-3.5" />
          Filters
        </div>

        <select
          aria-label="Filter by industry"
          value={industry}
          onChange={(e) => {
            setIndustry(e.target.value);
            setPage(1);
          }}
          className="rounded-btn border-border-subtle bg-app text-text-primary focus:border-brand h-9 border px-2.5 text-xs focus:outline-none"
        >
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind === 'All' ? 'All Industries' : ind}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by region"
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            setPage(1);
          }}
          className="rounded-btn border-border-subtle bg-app text-text-primary focus:border-brand h-9 border px-2.5 text-xs focus:outline-none"
        >
          <option value="All">All Regions</option>
          <option value="North America">North America</option>
          <option value="Europe">Europe</option>
          <option value="APAC">APAC</option>
        </select>

        <select
          aria-label="Minimum match score"
          value={minMatch}
          onChange={(e) => {
            setMinMatch(Number(e.target.value));
            setPage(1);
          }}
          className="rounded-btn border-border-subtle bg-app text-text-primary focus:border-brand h-9 border px-2.5 text-xs focus:outline-none"
        >
          <option value={0}>Min Match: Any</option>
          <option value={70}>Min Match: 70%+</option>
          <option value={80}>Min Match: 80%+</option>
          <option value={90}>Min Match: 90%+</option>
        </select>

        <select
          aria-label="Sort prospects"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'match' | 'name')}
          className="rounded-btn border-border-subtle bg-app text-text-primary focus:border-brand h-9 border px-2.5 text-xs focus:outline-none"
        >
          <option value="match">Sort: Match Score</option>
          <option value="name">Sort: Company A–Z</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setSavedOnly((v) => !v);
            setPage(1);
          }}
          className={cn(
            'rounded-btn inline-flex h-9 items-center gap-1.5 border px-3 text-xs font-medium transition-colors',
            savedOnly
              ? 'border-brand-border bg-brand-soft text-brand'
              : 'border-border-subtle bg-app text-text-secondary hover:text-text-primary',
          )}
        >
          <Bookmark className="h-3.5 w-3.5" />
          Saved Only
        </button>

        <div className="relative min-w-[190px] flex-1">
          <Search className="text-text-disabled pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search prospects..."
            aria-label="Search prospects"
            className="rounded-btn border-border-subtle bg-app text-text-primary placeholder:text-text-disabled focus:border-brand h-9 w-full border pr-3 pl-8 text-xs focus:outline-none"
          />
        </div>

        {checkedIds.length > 0 && (
          <div className="border-border-subtle flex w-full items-center justify-between gap-2 border-t pt-2.5 sm:w-auto sm:border-t-0 sm:pt-0">
            <span className="text-brand text-xs font-medium">
              {checkedIds.length} selected
            </span>
            <div className="flex items-center gap-1.5">
              {checkedIds.length >= 2 && checkedIds.length <= 3 && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setCompareOpen(true)}
                >
                  <Columns2 className="h-3.5 w-3.5" />
                  Compare ({checkedIds.length})
                </Button>
              )}
              <Button
                variant="secondary"
                size="xs"
                onClick={() => {
                  bulkSaveProspects(checkedIds);
                  setCheckedIds([]);
                }}
              >
                Save All
              </Button>
              <Button
                size="xs"
                onClick={() => {
                  setCampaignModalIds(checkedIds);
                  if (!targetCampaignId && campaigns[0])
                    setTargetCampaignId(campaigns[0].id);
                }}
              >
                Add to Campaign
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Master-Detail Workspace */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="No prospects match your current filters"
          description="Try lowering the minimum match score or clearing your industry and search filters."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setSearch('');
                setIndustry('All');
                setRegion('All');
                setMinMatch(0);
                setSavedOnly(false);
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid min-w-0 gap-5 xl:grid-cols-12">
          {/* Left Master List */}
          <div className="min-w-0 space-y-2.5 xl:col-span-5">
            {paged.map((company) => {
              const isSelected = activeCompany?.id === company.id;
              const isChecked = checkedIds.includes(company.id);

              return (
                <div
                  key={company.id}
                  onClick={() => setSelectedId(company.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(company.id);
                    }
                  }}
                  className={cn(
                    'rounded-card flex cursor-pointer items-center justify-between gap-3 border p-3.5 transition-all duration-150',
                    isSelected
                      ? 'border-brand bg-elevated shadow-brand-subtle'
                      : 'border-border-subtle bg-surface hover:border-border-strong hover:bg-elevated/50',
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCheck(company.id);
                      }}
                      aria-label={`Select ${company.name}`}
                      className="text-text-disabled hover:text-brand"
                    >
                      {isChecked ? (
                        <CheckSquare className="text-brand h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>

                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                      style={{ backgroundColor: company.logoColor }}
                    >
                      {company.logoText}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-text-primary truncate text-sm font-semibold">
                          {company.name}
                        </p>
                        {company.verified && (
                          <BadgeCheck
                            className="text-info h-4 w-4 shrink-0"
                            aria-label="Verified company record"
                          />
                        )}
                      </div>
                      <p className="text-text-secondary truncate text-xs">
                        {company.industry} · {company.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="success">{company.matchScore}% Match</Badge>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveProspect(company.id);
                      }}
                      aria-label={
                        company.saved
                          ? `Unsave ${company.name}`
                          : `Save ${company.name}`
                      }
                      className="rounded-control text-text-secondary hover:bg-hover hover:text-brand p-1.5"
                    >
                      {company.saved ? (
                        <BookmarkCheck className="text-brand h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination Footer */}
            <div className="text-text-secondary flex items-center justify-between pt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="xs"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pNum) => (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setPage(pNum)}
                      className={cn(
                        'rounded-control h-7 w-7 text-xs font-medium',
                        pNum === safePage
                          ? 'bg-brand-soft text-brand border-brand-border border'
                          : 'hover:bg-hover text-text-secondary',
                      )}
                    >
                      {pNum}
                    </button>
                  ),
                )}
                <Button
                  variant="secondary"
                  size="xs"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
              <span>
                Showing {(safePage - 1) * pageSize + 1}–
                {Math.min(safePage * pageSize, filtered.length)} of{' '}
                {filtered.length}
              </span>
            </div>
          </div>

          {/* Right Company Detail Panel */}
          {activeCompany && (
            <Card className="min-w-0 overflow-hidden xl:col-span-7">
              {/* Architectural Header Banner */}
              <div className="vanguard-hero-surface border-border-subtle border-b p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="brand">
                    Top Match · {activeCompany.status}
                  </Badge>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleSaveProspect(activeCompany.id)}
                  >
                    {activeCompany.saved ? (
                      <>
                        <BookmarkCheck className="text-brand h-3.5 w-3.5" />
                        Saved Prospect
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-3.5 w-3.5" />
                        Save Prospect
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-4">
                    <div
                      className="shadow-card flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white"
                      style={{ backgroundColor: activeCompany.logoColor }}
                    >
                      {activeCompany.logoText}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-text-primary text-xl font-bold">
                          {activeCompany.name}
                        </h2>
                        {activeCompany.verified && (
                          <BadgeCheck className="text-info h-5 w-5" />
                        )}
                      </div>
                      <p className="text-text-secondary mt-1 max-w-md text-xs leading-relaxed">
                        {activeCompany.tagline}
                      </p>
                      <div className="text-text-secondary mt-3 flex flex-wrap gap-2 text-[11px]">
                        <span className="border-border-subtle bg-app/70 inline-flex items-center gap-1 rounded-full border px-2.5 py-1">
                          <MapPin className="text-info h-3 w-3" />
                          {activeCompany.location}
                        </span>
                        <a
                          href={activeCompany.website}
                          target="_blank"
                          rel="noreferrer"
                          className="border-border-subtle bg-app/70 hover:text-text-primary inline-flex items-center gap-1 rounded-full border px-2.5 py-1"
                        >
                          <Globe className="text-teal-brand h-3 w-3" />
                          {activeCompany.website.replace(/^https?:\/\//, '')}
                        </a>
                        <span className="border-border-subtle bg-app/70 inline-flex items-center gap-1 rounded-full border px-2.5 py-1">
                          <Users className="text-brand h-3 w-3" />
                          {activeCompany.employeeRange}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ProgressRing
                    value={activeCompany.matchScore}
                    size={104}
                    strokeWidth={9}
                    label={`${activeCompany.matchScore}%`}
                    sublabel="Match Score"
                    accent="teal"
                    className="shrink-0 self-start sm:self-center"
                  />
                </div>
              </div>

              {/* Detail Tabs */}
              <div className="border-border-subtle border-b px-5">
                <div className="flex gap-5 overflow-x-auto" role="tablist">
                  {(
                    [
                      { id: 'overview', label: 'Overview' },
                      { id: 'fit', label: 'Fit Analysis' },
                      {
                        id: 'evidence',
                        label: `Evidence (${activeCompany.evidence.length})`,
                      },
                      {
                        id: 'contacts',
                        label: `Contact Info (${activeCompany.contacts.length})`,
                      },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={detailTab === t.id}
                      type="button"
                      onClick={() => setDetailTab(t.id)}
                      className={cn(
                        'border-b-2 py-3 text-xs font-semibold whitespace-nowrap transition-colors',
                        detailTab === t.id
                          ? 'border-brand text-text-primary'
                          : 'text-text-secondary hover:text-text-primary border-transparent',
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Body */}
              <div className="p-5 sm:p-6">
                {detailTab === 'overview' && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-text-primary text-sm font-semibold">
                        Why This Match?
                      </h3>
                      <ul className="text-text-primary mt-3 space-y-2.5 text-xs">
                        {activeCompany.whyMatch.map((reason) => (
                          <li key={reason} className="flex items-start gap-2">
                            <CheckCircle2 className="text-teal-brand mt-0.5 h-4 w-4 shrink-0" />
                            <span className="leading-relaxed">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-text-primary text-sm font-semibold">
                        Key Insights
                      </h3>
                      <dl className="divide-border-subtle rounded-card border-border-subtle bg-app/50 mt-3 divide-y border px-3.5 text-xs">
                        <div className="flex items-center justify-between py-2.5">
                          <dt className="text-text-secondary">Company Size</dt>
                          <dd className="text-text-primary font-semibold">
                            {activeCompany.employeeRange}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between py-2.5">
                          <dt className="text-text-secondary">
                            Annual Revenue
                          </dt>
                          <dd className="text-text-primary font-semibold">
                            {activeCompany.annualRevenue}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between py-2.5">
                          <dt className="text-text-secondary">Sub-Industry</dt>
                          <dd className="text-text-primary font-semibold">
                            {activeCompany.subIndustry}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between py-2.5">
                          <dt className="text-text-secondary">Location</dt>
                          <dd className="text-text-primary font-semibold">
                            {activeCompany.location}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}

                {detailTab === 'fit' && (
                  <div className="space-y-4">
                    <p className="text-text-secondary text-xs">
                      Weighted qualification factors explaining how the{' '}
                      {activeCompany.matchScore}% match score was calculated.
                    </p>
                    {activeCompany.fitFactors.map((f) => (
                      <div
                        key={f.label}
                        className="rounded-card border-border-subtle bg-app/50 border p-3.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-primary font-semibold">
                            {f.label}{' '}
                            <span className="text-text-disabled">
                              · Weight {f.weight}%
                            </span>
                          </span>
                          <span className="text-teal-brand font-bold tabular-nums">
                            {f.score}%
                          </span>
                        </div>
                        <div className="bg-elevated mt-2 h-2 w-full overflow-hidden rounded-full">
                          <div
                            className="from-brand to-teal-brand h-full rounded-full bg-gradient-to-r"
                            style={{ width: `${f.score}%` }}
                          />
                        </div>
                        <p className="text-text-secondary mt-2 text-xs">
                          {f.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {detailTab === 'evidence' && (
                  <div className="space-y-3">
                    {activeCompany.evidence.map((ev) => {
                      const meta = getVerificationMeta(ev.verification);
                      return (
                        <div
                          key={ev.id}
                          className="rounded-card border-border-subtle bg-app/50 border p-3.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-text-primary text-xs font-semibold">
                              {ev.title}
                            </p>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${meta.className}`}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <p className="text-text-secondary mt-1.5 text-xs leading-relaxed">
                            {ev.summary}
                          </p>
                          <div className="text-text-disabled mt-2 flex items-center justify-between text-[11px]">
                            <span>Observed {ev.observedAt}</span>
                            <a
                              href={ev.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-info inline-flex items-center gap-1 hover:underline"
                            >
                              {ev.sourceLabel}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {detailTab === 'contacts' && (
                  <div className="space-y-3">
                    {activeCompany.contacts.map((ct) => {
                      const meta = getVerificationMeta(ct.verification);
                      return (
                        <div
                          key={ct.id}
                          className="rounded-card border-border-subtle bg-app/50 flex flex-col justify-between gap-3 border p-3.5 sm:flex-row sm:items-center"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-text-primary text-sm font-semibold">
                                {ct.name}
                              </p>
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${meta.className}`}
                              >
                                {meta.label}
                              </span>
                            </div>
                            <p className="text-text-secondary text-xs">
                              {ct.title}
                            </p>
                            <p className="text-text-muted mt-1 inline-flex items-center gap-1.5 font-mono text-[11px]">
                              <Mail className="text-info h-3 w-3" />
                              {ct.email}
                            </p>
                          </div>
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => {
                              setCampaignModalIds([activeCompany.id]);
                              if (!targetCampaignId && campaigns[0]) {
                                setTargetCampaignId(campaigns[0].id);
                              }
                            }}
                          >
                            Draft Outreach
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Bottom Action Buttons */}
                <div className="border-border-subtle mt-6 grid gap-3 border-t pt-5 sm:grid-cols-2">
                  <Button
                    size="lg"
                    onClick={() => {
                      setCampaignModalIds([activeCompany.id]);
                      if (!targetCampaignId && campaigns[0]) {
                        setTargetCampaignId(campaigns[0].id);
                      }
                    }}
                  >
                    <Megaphone className="h-4 w-4" />
                    Add to Campaign
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setReportDrawerOpen(true)}
                  >
                    <FileText className="h-4 w-4" />
                    View Full Report
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Campaign Handoff Modal */}
      <Modal
        open={Boolean(campaignModalIds)}
        onClose={() => setCampaignModalIds(null)}
        title="Add Prospect(s) to Campaign"
        description="Drafts are queued in Pending Approval status. Human approval is required before any external send."
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-xs">
            Enrolling{' '}
            <strong className="text-text-primary">
              {campaignModalIds?.length ?? 0}
            </strong>{' '}
            company account(s).
          </p>
          <div>
            <label
              htmlFor="camp-select"
              className="text-text-secondary mb-1.5 block text-xs font-medium"
            >
              Target Campaign
            </label>
            <select
              id="camp-select"
              value={targetCampaignId}
              onChange={(e) => setTargetCampaignId(e.target.value)}
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
              onClick={() => setCampaignModalIds(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (campaignModalIds && targetCampaignId) {
                  enrollProspectsInCampaign(targetCampaignId, campaignModalIds);
                  setCheckedIds([]);
                }
                setCampaignModalIds(null);
              }}
            >
              Confirm Handoff
            </Button>
          </div>
        </div>
      </Modal>

      {/* Full Company Report Drawer */}
      <Drawer
        open={reportDrawerOpen && Boolean(activeCompany)}
        onClose={() => setReportDrawerOpen(false)}
        title={
          activeCompany
            ? `${activeCompany.name} — Intelligence Brief`
            : 'Intelligence Brief'
        }
        description="Illustrative qualification dossier with verified vs. inferred signals."
        widthClass="max-w-xl"
      >
        {activeCompany && (
          <div className="space-y-5 text-xs">
            <p className="text-text-secondary leading-relaxed">
              {activeCompany.description}
            </p>
            <div>
              <h4 className="text-text-secondary mb-2 text-xs font-semibold tracking-wider uppercase">
                Qualification Score Summary ({activeCompany.matchScore}%)
              </h4>
              <div className="space-y-2">
                {activeCompany.fitFactors.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-btn border-border-subtle bg-app/50 flex items-center justify-between border px-3 py-2"
                  >
                    <span className="text-text-primary">{f.label}</span>
                    <span className="text-teal-brand font-bold">
                      {f.score}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-text-secondary mb-2 text-xs font-semibold tracking-wider uppercase">
                Evidence Audit Trail
              </h4>
              <div className="space-y-2.5">
                {activeCompany.evidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-btn border-border-subtle bg-app/50 border p-3"
                  >
                    <p className="text-text-primary font-semibold">
                      {ev.title}
                    </p>
                    <p className="text-text-secondary mt-1">{ev.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <CompanyCompareModal
        open={compareOpen}
        companies={prospects
          .filter((p) => checkedIds.includes(p.id))
          .slice(0, 3)}
        onClose={() => setCompareOpen(false)}
        onInspectCompany={(company) => setSelectedId(company.id)}
        onToggleSave={(companyId) => toggleSaveProspect(companyId)}
      />
    </div>
  );
}
