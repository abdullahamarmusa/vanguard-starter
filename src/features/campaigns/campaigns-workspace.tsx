'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Mail,
  Megaphone,
  MousePointerClick,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import { SeriesChart } from '@/components/charts/series-chart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';
import { KpiCard } from '@/features/dashboard/kpi-card';
import { createCampaignSchema } from '@/lib/validation';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn, downloadTextFile, formatNumber, toCsv } from '@/lib/utils';
import type { CampaignStatus } from '@/types/vanguard';

type CampaignTab =
  'overview' | 'performance' | 'prospects' | 'emails' | 'settings';

export function CampaignsWorkspace() {
  const searchParams = useSearchParams();
  const {
    campaigns,
    prospects,
    offers,
    createCampaign,
    updateCampaignStatus,
    duplicateCampaign,
    updateDraftApproval,
    updateCampaignSettings,
    isEmptyWorkspace,
    toggleEmptyWorkspace,
    pushToast,
  } = usePrototypeStore();

  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get('status') ?? 'All',
  );
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [selectedId, setSelectedId] = useState<string>(
    searchParams.get('selected') ?? campaigns[0]?.id ?? '',
  );
  const [activeTab, setActiveTab] = useState<CampaignTab>('overview');
  const [createOpen, setCreateOpen] = useState(
    searchParams.get('create') === '1',
  );

  useEffect(() => {
    const statusParam = searchParams.get('status');
    const selParam = searchParams.get('selected');
    const qParam = searchParams.get('q');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reflect query-string filters when navigating between campaign views.
    if (statusParam) setStatusFilter(statusParam);
    if (selParam) setSelectedId(selParam);
    if (qParam !== null) setSearch(qParam);
  }, [searchParams]);

  // Create campaign modal form state
  const [newName, setNewName] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newOffer, setNewOffer] = useState(offers[0]?.name ?? '');
  const [newDescription, setNewDescription] = useState('');
  const [newRequireApproval, setNewRequireApproval] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Settings tab editable state
  const [settingsName, setSettingsName] = useState('');
  const [settingsAudience, setSettingsAudience] = useState('');
  const [settingsDesc, setSettingsDesc] = useState('');
  const [settingsApproval, setSettingsApproval] = useState(true);

  const filteredCampaigns = useMemo(() => {
    const q = search.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !c.subtitle.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [campaigns, statusFilter, search]);

  const activeCampaign = useMemo(
    () =>
      filteredCampaigns.find((c) => c.id === selectedId) ??
      filteredCampaigns[0] ??
      null,
    [filteredCampaigns, selectedId],
  );

  useEffect(() => {
    if (!activeCampaign) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initialize the settings draft when the selected campaign changes.
    setSettingsName(activeCampaign.name);
    setSettingsAudience(activeCampaign.audienceSummary);
    setSettingsDesc(activeCampaign.description);
    setSettingsApproval(activeCampaign.requireHumanApproval);
  }, [activeCampaign]);

  const enrolledCompanies = useMemo(() => {
    if (!activeCampaign) return [];
    return activeCampaign.enrolledProspectIds
      .map((id) => prospects.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [activeCampaign, prospects]);

  const statusBadgeVariant = (status: CampaignStatus) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Paused':
        return 'info';
      case 'Draft':
        return 'default';
      case 'Completed':
        return 'teal';
    }
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = createCampaignSchema.safeParse({
      name: newName,
      audienceSummary: newAudience,
      offerName: newOffer,
      description: newDescription,
      requireHumanApproval: newRequireApproval,
    });
    if (!parsed.success) {
      setFormError(
        parsed.error.issues[0]?.message ?? 'Please complete all fields.',
      );
      return;
    }
    setFormError(null);
    const created = createCampaign(parsed.data);
    setSelectedId(created.id);
    setCreateOpen(false);
    setNewName('');
    setNewAudience('');
    setNewDescription('');
  };

  const handleExportCampaign = () => {
    if (!activeCampaign) return;
    const csv = toCsv(
      ['Date', 'Sent', 'Opened', 'Clicked', 'Qualified'],
      activeCampaign.performanceSeries.map((pt) => [
        pt.date,
        pt.sent,
        pt.opened,
        pt.clicked,
        pt.qualified,
      ]),
    );
    downloadTextFile(
      `${activeCampaign.id}-metrics.csv`,
      csv,
      'text/csv;charset=utf-8',
    );
    pushToast({
      title: `Exported "${activeCampaign.name}" performance CSV`,
      variant: 'success',
    });
  };

  if (isEmptyWorkspace) {
    return (
      <div className="space-y-6">
        <h1 className="text-text-primary text-2xl font-bold">Campaigns</h1>
        <EmptyState
          icon={<Megaphone className="h-6 w-6" />}
          title="No outreach campaigns yet"
          description="Create your first outreach workflow with mandatory human approval before any external message is dispatched."
          action={
            <Button onClick={() => setCreateOpen(true)}>Create Campaign</Button>
          }
          secondaryAction={
            <Button variant="secondary" onClick={toggleEmptyWorkspace}>
              Load Illustrative Campaigns
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-text-secondary text-xs">
            Campaigns <span className="text-text-disabled mx-1">&gt;</span>{' '}
            <span className="text-text-primary">Overview</span>
          </p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <span className="border-brand-border bg-brand-soft text-brand flex h-9 w-9 items-center justify-center rounded-xl border">
              <Send className="h-4 w-4" />
            </span>
            <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-[28px]">
              Campaigns
            </h1>
          </div>
          <p className="text-text-secondary mt-1 text-sm">
            Turn qualified prospects into human-approved conversations and
            measurable revenue.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Campaign
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* KPI Row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Campaigns"
          value={String(campaigns.length)}
          changeLabel="+20%"
          accent="blue"
          icon={<Send className="h-5 w-5" />}
          sparkline={[4, 6, 7, 8, 10, 11, 12]}
        />
        <KpiCard
          title="Emails Sent (Illustrative)"
          value="8,420"
          changeLabel="+32%"
          accent="teal"
          icon={<Mail className="h-5 w-5" />}
          sparkline={[24, 31, 40, 48, 55, 69, 84]}
          tooltip="Illustrative preview volume. Production displays only verified provider delivery events."
        />
        <KpiCard
          title="Response Rate"
          value="24.8%"
          changeLabel="+4.2%"
          accent="purple"
          icon={<MousePointerClick className="h-5 w-5" />}
          sparkline={[18, 19, 21, 20, 23, 24, 25]}
        />
        <KpiCard
          title="Qualified Leads"
          value="742"
          changeLabel="+28%"
          accent="orange"
          icon={<TrendingUp className="h-5 w-5" />}
          sparkline={[18, 26, 30, 39, 44, 58, 74]}
        />
      </section>

      {/* Split Workspace */}
      <div className="grid gap-5 xl:grid-cols-12">
        {/* Left List: Your Campaigns */}
        <Card className="min-w-0 p-4 xl:col-span-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-text-primary text-sm font-semibold">
              Your Campaigns
            </h2>
            <select
              aria-label="Filter campaign status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-btn border-border-subtle bg-app text-text-primary h-8 border px-2 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Draft">Draft</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="relative mb-3">
            <Search className="text-text-disabled pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="rounded-btn border-border-subtle bg-app text-text-primary placeholder:text-text-disabled focus:border-brand h-9 w-full border pr-3 pl-8 text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-2.5">
            {filteredCampaigns.map((cmp) => {
              const selected = activeCampaign?.id === cmp.id;
              return (
                <button
                  key={cmp.id}
                  type="button"
                  onClick={() => setSelectedId(cmp.id)}
                  className={cn(
                    'rounded-card flex w-full items-start gap-3 border p-3.5 text-left transition-all',
                    selected
                      ? 'border-brand bg-elevated shadow-brand-subtle'
                      : 'border-border-subtle bg-app/50 hover:border-border-strong hover:bg-hover/60',
                  )}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: cmp.accentColor }}
                  >
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-text-primary truncate text-sm font-semibold">
                        {cmp.name}
                      </p>
                      <Badge variant={statusBadgeVariant(cmp.status)}>
                        {cmp.status}
                      </Badge>
                    </div>
                    <p className="text-text-secondary mt-0.5 truncate text-xs">
                      {cmp.subtitle}
                    </p>
                    <div className="text-text-muted mt-2 flex flex-wrap items-center gap-3 text-[11px] tabular-nums">
                      <span>{formatNumber(cmp.sent)} sent</span>
                      <span>{formatNumber(cmp.replies)} replies</span>
                      <span>
                        {cmp.replyRate > 0 ? `${cmp.replyRate}%` : '—'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Right Detail Panel */}
        {activeCampaign && (
          <div className="min-w-0 space-y-5 xl:col-span-8">
            <Card className="overflow-hidden">
              <div className="vanguard-hero-surface border-border-subtle border-b p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={statusBadgeVariant(activeCampaign.status)}
                      >
                        {activeCampaign.status}
                      </Badge>
                      {activeCampaign.requireHumanApproval && (
                        <Badge variant="brand">Human Approval Enforced</Badge>
                      )}
                    </div>
                    <h2 className="text-text-primary mt-2 text-xl font-bold">
                      {activeCampaign.name}
                    </h2>
                    <p className="text-text-secondary mt-1 max-w-xl text-xs leading-relaxed">
                      {activeCampaign.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        updateCampaignStatus(
                          activeCampaign.id,
                          activeCampaign.status === 'Active'
                            ? 'Paused'
                            : 'Active',
                        )
                      }
                    >
                      {activeCampaign.status === 'Active' ? (
                        <>
                          <Pause className="h-3.5 w-3.5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const dup = duplicateCampaign(activeCampaign.id);
                        if (dup) setSelectedId(dup.id);
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Duplicate
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleExportCampaign}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Campaign Sub-tabs */}
                <div
                  className="border-border-subtle/70 mt-5 flex gap-5 overflow-x-auto border-t pt-3"
                  role="tablist"
                >
                  {(
                    [
                      { id: 'overview', label: 'Overview' },
                      { id: 'performance', label: 'Performance' },
                      {
                        id: 'prospects',
                        label: `Prospects (${enrolledCompanies.length})`,
                      },
                      {
                        id: 'emails',
                        label: `Emails & Approvals (${activeCampaign.drafts.length})`,
                      },
                      { id: 'settings', label: 'Settings' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={activeTab === t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id)}
                      className={cn(
                        'border-b-2 pb-2 text-xs font-semibold whitespace-nowrap transition-colors',
                        activeTab === t.id
                          ? 'border-brand text-brand'
                          : 'text-text-secondary hover:text-text-primary border-transparent',
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <CardContent className="pt-5">
                {/* TAB: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-5">
                    <div className="grid gap-5 lg:grid-cols-12">
                      {/* Multi-line Performance Chart */}
                      <div className="rounded-card border-border-subtle bg-app/45 border p-4 lg:col-span-8">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-text-primary text-sm font-semibold">
                            Campaign Performance
                          </h3>
                          <div className="text-text-secondary flex flex-wrap gap-3 text-[11px]">
                            <span className="inline-flex items-center gap-1">
                              <span className="bg-info h-2 w-2 rounded-full" />{' '}
                              Sent
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="bg-teal-brand h-2 w-2 rounded-full" />{' '}
                              Opened
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="bg-brand h-2 w-2 rounded-full" />{' '}
                              Clicked
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <span className="bg-ai h-2 w-2 rounded-full" />{' '}
                              Qualified
                            </span>
                          </div>
                        </div>

                        <div className="h-[220px] w-full">
                          <SeriesChart
                            data={activeCampaign.performanceSeries}
                            xKey="date"
                            series={[
                              { key: 'sent', label: 'Sent', color: '#3B82F6' },
                              {
                                key: 'opened',
                                label: 'Opened',
                                color: '#00B6B6',
                              },
                              {
                                key: 'clicked',
                                label: 'Clicked',
                                color: '#F59E0B',
                              },
                              {
                                key: 'qualified',
                                label: 'Qualified',
                                color: '#8B5CF6',
                              },
                            ]}
                          />
                        </div>
                      </div>

                      {/* Key Metrics Sidebar */}
                      <div className="space-y-2.5 lg:col-span-4">
                        <h3 className="text-text-primary text-sm font-semibold">
                          Key Metrics
                        </h3>
                        {[
                          {
                            label: 'Emails Sent',
                            value: formatNumber(activeCampaign.sent),
                            delta: '+18%',
                            icon: <Mail className="text-ai h-4 w-4" />,
                          },
                          {
                            label: 'Opened',
                            value: formatNumber(activeCampaign.opened),
                            delta: '+22%',
                            icon: <Eye className="text-info h-4 w-4" />,
                          },
                          {
                            label: 'Clicked',
                            value: formatNumber(activeCampaign.clicked),
                            delta: '+28%',
                            icon: (
                              <MousePointerClick className="text-teal-brand h-4 w-4" />
                            ),
                          },
                          {
                            label: 'Qualified Leads',
                            value: formatNumber(activeCampaign.qualifiedLeads),
                            delta: '+35%',
                            icon: (
                              <CheckCircle2 className="text-success h-4 w-4" />
                            ),
                          },
                        ].map((m) => (
                          <div
                            key={m.label}
                            className="rounded-btn border-border-subtle bg-app/50 flex items-center justify-between border px-3 py-2.5"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="bg-elevated flex h-8 w-8 items-center justify-center rounded-lg">
                                {m.icon}
                              </span>
                              <div>
                                <p className="text-text-primary text-sm font-bold tabular-nums">
                                  {m.value}
                                </p>
                                <p className="text-text-secondary text-[11px]">
                                  {m.label}
                                </p>
                              </div>
                            </div>
                            <span className="text-success text-xs font-semibold">
                              {m.delta}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Workflow Stepper + Recent Activity */}
                    <div className="grid gap-5 lg:grid-cols-12">
                      <div className="rounded-card border-border-subtle bg-app/45 border p-4 lg:col-span-7">
                        <h3 className="text-text-primary mb-4 text-sm font-semibold">
                          Campaign Workflow
                        </h3>
                        <div className="grid grid-cols-5 gap-2">
                          {activeCampaign.workflow.map((step) => (
                            <div
                              key={step.id}
                              className="flex flex-col items-center text-center"
                            >
                              <span
                                className={cn(
                                  'flex h-9 w-9 items-center justify-center rounded-full border',
                                  step.status === 'completed'
                                    ? 'border-teal-brand bg-teal-brand text-[#0D0E11]'
                                    : step.status === 'active'
                                      ? 'border-brand bg-brand-soft text-brand'
                                      : 'border-border-strong bg-elevated text-text-disabled',
                                )}
                              >
                                {step.status === 'completed' ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Star className="h-4 w-4" />
                                )}
                              </span>
                              <span className="text-text-secondary mt-2 text-[11px] leading-tight font-medium">
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-card border-border-subtle bg-app/45 border p-4 lg:col-span-5">
                        <h3 className="text-text-primary mb-3 text-sm font-semibold">
                          Recent Activity
                        </h3>
                        <ul className="space-y-2.5 text-xs">
                          {activeCampaign.recentActivity.map((act) => (
                            <li
                              key={act.id}
                              className="flex items-start justify-between gap-2"
                            >
                              <span className="text-text-primary">
                                {act.text}
                              </span>
                              <span className="text-text-disabled shrink-0 text-[11px]">
                                {act.timestamp}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: PERFORMANCE */}
                {activeTab === 'performance' && (
                  <div className="space-y-4">
                    <p className="text-text-secondary text-xs">
                      Deliverability and conversion telemetry (illustrative
                      prototype figures — production populates strictly from
                      authorized email provider webhooks).
                    </p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-card border-border-subtle bg-app/50 border p-4">
                        <p className="text-text-secondary text-xs">
                          Open-to-Reply Ratio
                        </p>
                        <p className="text-teal-brand mt-1 text-2xl font-bold">
                          {activeCampaign.opened > 0
                            ? `${((activeCampaign.replies / activeCampaign.opened) * 100).toFixed(1)}%`
                            : '—'}
                        </p>
                      </div>
                      <div className="rounded-card border-border-subtle bg-app/50 border p-4">
                        <p className="text-text-secondary text-xs">
                          Reply-to-Qualified Ratio
                        </p>
                        <p className="text-brand mt-1 text-2xl font-bold">
                          {activeCampaign.replies > 0
                            ? `${((activeCampaign.qualifiedLeads / activeCampaign.replies) * 100).toFixed(1)}%`
                            : '—'}
                        </p>
                      </div>
                      <div className="rounded-card border-border-subtle bg-app/50 border p-4">
                        <p className="text-text-secondary text-xs">
                          Associated Offer
                        </p>
                        <p className="text-text-primary mt-1 text-sm font-semibold">
                          {activeCampaign.offerName}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: PROSPECTS */}
                {activeTab === 'prospects' && (
                  <div className="space-y-3">
                    {enrolledCompanies.length === 0 ? (
                      <p className="text-text-secondary py-6 text-center text-xs">
                        No prospects enrolled yet. Add qualified companies from
                        the Prospects screen.
                      </p>
                    ) : (
                      enrolledCompanies.map((comp) => (
                        <div
                          key={comp.id}
                          className="rounded-card border-border-subtle bg-app/50 flex items-center justify-between gap-3 border p-3.5"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white"
                              style={{ backgroundColor: comp.logoColor }}
                            >
                              {comp.logoText}
                            </span>
                            <div>
                              <p className="text-text-primary text-sm font-semibold">
                                {comp.name}
                              </p>
                              <p className="text-text-secondary text-xs">
                                {comp.industry} · {comp.location}
                              </p>
                            </div>
                          </div>
                          <Badge variant="success">
                            {comp.matchScore}% Match
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB: EMAILS & HUMAN APPROVAL WORKFLOW */}
                {activeTab === 'emails' && (
                  <div className="space-y-4">
                    <div className="rounded-card border-brand-border/50 bg-brand-soft/30 text-text-primary flex items-start gap-2.5 border p-3.5 text-xs">
                      <ShieldAlert className="text-brand mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        <strong>Human Approval Gate Active:</strong>{' '}
                        AI-personalized drafts cannot be sent externally until
                        an authorized organization member explicitly approves
                        each message below.
                      </p>
                    </div>

                    {activeCampaign.drafts.length === 0 ? (
                      <p className="text-text-secondary py-8 text-center text-xs">
                        No outreach drafts queued for this campaign yet. Add
                        prospects to generate evidence-cited drafts for review.
                      </p>
                    ) : (
                      activeCampaign.drafts.map((draft) => (
                        <div
                          key={draft.id}
                          className="rounded-card border-border-subtle bg-app/55 border p-4"
                        >
                          <div className="border-border-subtle flex flex-wrap items-start justify-between gap-3 border-b pb-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-text-primary text-sm font-semibold">
                                  {draft.companyName} — {draft.recipientName}
                                </p>
                                <Badge
                                  variant={
                                    draft.approvalStatus === 'Approved'
                                      ? 'success'
                                      : draft.approvalStatus ===
                                          'Revision Requested'
                                        ? 'warning'
                                        : 'brand'
                                  }
                                >
                                  {draft.approvalStatus}
                                </Badge>
                              </div>
                              <p className="text-text-secondary text-xs">
                                {draft.recipientTitle} · Updated{' '}
                                {draft.updatedAt}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="secondary"
                                size="xs"
                                onClick={() =>
                                  updateDraftApproval(
                                    activeCampaign.id,
                                    draft.id,
                                    'Revision Requested',
                                  )
                                }
                              >
                                Request Revision
                              </Button>
                              <Button
                                size="xs"
                                disabled={draft.approvalStatus === 'Approved'}
                                onClick={() =>
                                  updateDraftApproval(
                                    activeCampaign.id,
                                    draft.id,
                                    'Approved',
                                  )
                                }
                              >
                                <Check className="h-3.5 w-3.5" />
                                {draft.approvalStatus === 'Approved'
                                  ? 'Approved'
                                  : 'Approve Draft'}
                              </Button>
                            </div>
                          </div>

                          <p className="text-text-primary mt-3 text-xs font-semibold">
                            Subject: {draft.subject}
                          </p>
                          <pre className="text-text-secondary mt-2 font-sans text-xs leading-relaxed whitespace-pre-wrap">
                            {draft.body}
                          </pre>
                          <p className="rounded-btn border-border-subtle bg-surface text-teal-brand mt-3 inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px]">
                            <Sparkles className="h-3 w-3" />
                            {draft.personalizationNotes}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB: SETTINGS */}
                {activeTab === 'settings' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateCampaignSettings(activeCampaign.id, {
                        name: settingsName,
                        audienceSummary: settingsAudience,
                        description: settingsDesc,
                        requireHumanApproval: settingsApproval,
                      });
                    }}
                    className="max-w-xl space-y-4"
                  >
                    <div>
                      <label className="text-text-secondary mb-1 block text-xs font-medium">
                        Campaign Name
                      </label>
                      <Input
                        value={settingsName}
                        onChange={(e) => setSettingsName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-text-secondary mb-1 block text-xs font-medium">
                        Target Audience
                      </label>
                      <Input
                        value={settingsAudience}
                        onChange={(e) => setSettingsAudience(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-text-secondary mb-1 block text-xs font-medium">
                        Campaign Description
                      </label>
                      <Textarea
                        rows={3}
                        value={settingsDesc}
                        onChange={(e) => setSettingsDesc(e.target.value)}
                      />
                    </div>
                    <label className="text-text-primary flex items-center gap-2.5 text-xs">
                      <input
                        type="checkbox"
                        checked={settingsApproval}
                        onChange={(e) => setSettingsApproval(e.target.checked)}
                        className="accent-brand h-4 w-4"
                      />
                      Require explicit human approval before any external
                      outreach send (Recommended)
                    </label>
                    <Button type="submit" size="sm">
                      Save Campaign Settings
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Outreach Campaign"
        description="Configure your audience and offer association. Campaigns launch in Draft until outreach messages are approved."
      >
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <div>
            <label
              htmlFor="cmp-name"
              className="text-text-secondary mb-1 block text-xs font-medium"
            >
              Campaign Name *
            </label>
            <Input
              id="cmp-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Q1 FinTech Modernization Outreach"
            />
          </div>
          <div>
            <label
              htmlFor="cmp-offer"
              className="text-text-secondary mb-1 block text-xs font-medium"
            >
              Associated Offer *
            </label>
            <Input
              id="cmp-offer"
              value={newOffer}
              onChange={(e) => setNewOffer(e.target.value)}
              placeholder="Select or type offer name"
            />
          </div>
          <div>
            <label
              htmlFor="cmp-aud"
              className="text-text-secondary mb-1 block text-xs font-medium"
            >
              Target Audience Segment *
            </label>
            <Input
              id="cmp-aud"
              value={newAudience}
              onChange={(e) => setNewAudience(e.target.value)}
              placeholder="e.g., Series B+ SaaS companies in North America"
            />
          </div>
          <div>
            <label
              htmlFor="cmp-desc"
              className="text-text-secondary mb-1 block text-xs font-medium"
            >
              Campaign Objective *
            </label>
            <Textarea
              id="cmp-desc"
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Describe the core value angle and call-to-action..."
            />
          </div>
          <label className="text-text-primary flex items-center gap-2.5 text-xs">
            <input
              type="checkbox"
              checked={newRequireApproval}
              onChange={(e) => setNewRequireApproval(e.target.checked)}
              className="accent-brand h-4 w-4"
            />
            Enforce human approval gate before external sending
          </label>
          {formError && (
            <p role="alert" className="text-danger text-xs font-medium">
              {formError}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Campaign Draft
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
