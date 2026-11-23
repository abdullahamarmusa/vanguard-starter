'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Activity,
  ArrowRight,
  Bot,
  Briefcase,
  Check,
  CheckCircle2,
  Download,
  FileText,
  FlaskConical,
  LayoutGrid,
  Plus,
  Rocket,
  Search,
  Send,
  Star,
  Tag,
  Target,
  Users,
} from 'lucide-react';
import { SeriesChart } from '@/components/charts/series-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/ui/empty-state';
import { KpiCard } from '@/features/dashboard/kpi-card';
import { mockVanguardAdapter } from '@/lib/data-access/mock-adapter';
import { ILLUSTRATIVE_WORKSPACE_ANALYTICS } from '@/mocks/workspace.mock';
import { createOfferSchema } from '@/lib/validation';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn, downloadTextFile } from '@/lib/utils';
import type { WorkspaceResource } from '@/types/vanguard';

type WorkspaceTab =
  | 'overview'
  | 'offers'
  | 'icp'
  | 'research'
  | 'prospects'
  | 'resources'
  | 'activity';

const WORKSPACE_STEPS = [
  'Analyze Offer',
  'Research Companies',
  'Evaluate Fit',
  'Review Results',
  'Complete',
];

export function WorkspaceView() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as WorkspaceTab) || 'overview';

  const {
    projects,
    offers,
    prospects,
    campaigns,
    recentActivity,
    addWorkspaceProject,
    addOffer,
    isEmptyWorkspace,
    toggleEmptyWorkspace,
    pushToast,
  } = usePrototypeStore();

  const icps = mockVanguardAdapter.getIcps();
  const resources = mockVanguardAdapter.getWorkspaceResources();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialTab);
  const [range, setRange] = useState('Last 30 Days');
  const [analyticsTab, setAnalyticsTab] = useState<
    'overview' | 'performance' | 'activity'
  >('overview');

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');

  const [newOfferOpen, setNewOfferOpen] = useState(false);
  const [offerName, setOfferName] = useState('');
  const [offerUrl, setOfferUrl] = useState('');
  const [offerSummary, setOfferSummary] = useState('');
  const [offerDealSize, setOfferDealSize] = useState('$40K – $120K');
  const [offerErr, setOfferErr] = useState<string | null>(null);

  const [previewResource, setPreviewResource] =
    useState<WorkspaceResource | null>(null);

  const spotlight = projects[0];
  const savedProspects = prospects.filter((p) => p.saved);
  const activeCampaignsCount = campaigns.filter(
    (c) => c.status === 'Active',
  ).length;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;
    addWorkspaceProject(
      projName,
      projDesc || 'New B2B market research initiative.',
    );
    setProjName('');
    setProjDesc('');
    setNewProjectOpen(false);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = createOfferSchema.safeParse({
      name: offerName,
      urlOrSource: offerUrl,
      summary: offerSummary,
      targetDealSize: offerDealSize,
    });
    if (!parsed.success) {
      setOfferErr(parsed.error.issues[0]?.message ?? 'Check required fields.');
      return;
    }
    setOfferErr(null);
    addOffer({
      ...parsed.data,
      positioning: 'Workspace-defined commercial offer',
    });
    setOfferName('');
    setOfferUrl('');
    setOfferSummary('');
    setNewOfferOpen(false);
  };

  if (isEmptyWorkspace) {
    return (
      <div className="space-y-6">
        <h1 className="text-text-primary text-2xl font-bold">Your Workspace</h1>
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title="Your intelligence workspace is empty"
          description="Save your commercial offers, define your Ideal Customer Profiles (ICPs), and organize market research projects here."
          action={
            <Button onClick={() => setNewProjectOpen(true)}>
              Create First Project
            </Button>
          }
          secondaryAction={
            <Button variant="secondary" onClick={toggleEmptyWorkspace}>
              Load Illustrative Workspace
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
          <Badge variant="ai" className="mb-2">
            Workspace
          </Badge>
          <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-[28px]">
            Your Workspace
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Manage your offers, ICP definitions, research projects, and
            intelligence playbooks in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Workspace timeframe"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-btn border-border-subtle bg-surface text-text-primary h-9 border px-3 text-xs font-medium"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
          <Button size="sm" onClick={() => setNewProjectOpen(true)}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Horizontal Sub-Navigation Pills */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Workspace sections"
      >
        {(
          [
            { id: 'overview', label: 'Overview', icon: LayoutGrid },
            { id: 'offers', label: `Offers (${offers.length})`, icon: Tag },
            { id: 'icp', label: `ICP (${icps.length})`, icon: Target },
            {
              id: 'research',
              label: `Research (${projects.length})`,
              icon: FlaskConical,
            },
            {
              id: 'prospects',
              label: `Saved Prospects (${savedProspects.length})`,
              icon: Users,
            },
            { id: 'resources', label: 'Resources', icon: FileText },
            { id: 'activity', label: 'Activity', icon: Activity },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'rounded-btn inline-flex shrink-0 items-center gap-2 border px-3.5 py-2 text-xs font-semibold transition-all',
                active
                  ? 'border-brand-border bg-brand-soft text-brand'
                  : 'border-border-subtle bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total Projects"
              value={String(projects.length + 4)}
              changeLabel="+14%"
              accent="purple"
              icon={<Briefcase className="h-5 w-5" />}
              sparkline={[3, 4, 4, 5, 6, 7, 8]}
            />
            <KpiCard
              title="Active Prospects"
              value="247"
              changeLabel="+22%"
              accent="teal"
              icon={<Users className="h-5 w-5" />}
              sparkline={[90, 110, 128, 152, 180, 212, 247]}
            />
            <KpiCard
              title="Campaigns Running"
              value={String(activeCampaignsCount)}
              changeLabel="+50%"
              accent="orange"
              icon={<Rocket className="h-5 w-5" />}
              sparkline={[1, 1, 2, 2, 2, 3, 3]}
            />
            <KpiCard
              title="Qualified Leads"
              value="86"
              changeLabel="+32%"
              accent="blue"
              icon={<CheckCircle2 className="h-5 w-5" />}
              sparkline={[24, 34, 42, 51, 63, 74, 86]}
            />
          </section>

          {/* Current Project + Quick Actions */}
          <div className="grid min-w-0 gap-5 xl:grid-cols-12">
            {spotlight && (
              <Card className="min-w-0 xl:col-span-6">
                <CardHeader>
                  <div className="flex items-center gap-2.5">
                    <CardTitle>Current Project</CardTitle>
                    <Badge variant="success">{spotlight.status}</Badge>
                  </div>
                  <Link
                    href={
                      spotlight.analysisId
                        ? `/analyze/${spotlight.analysisId}`
                        : '/analyze'
                    }
                    className="text-info inline-flex items-center gap-1 text-xs font-medium hover:underline"
                  >
                    View Details <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="rounded-card border-info/30 from-info/20 via-app to-teal-brand/20 flex h-24 w-full shrink-0 items-center justify-center border bg-gradient-to-br sm:w-32">
                      <FlaskConical className="text-teal-brand h-9 w-9" />
                    </div>
                    <div>
                      <h3 className="text-text-primary text-base font-semibold">
                        {spotlight.name}
                      </h3>
                      <p className="text-text-secondary mt-1 text-xs leading-relaxed">
                        {spotlight.description}
                      </p>
                    </div>
                  </div>

                  {/* 5-Stage Progress Stepper */}
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {WORKSPACE_STEPS.map((label, idx) => {
                      const done = idx < spotlight.currentStepIndex;
                      const current = idx === spotlight.currentStepIndex;
                      return (
                        <div
                          key={label}
                          className="flex flex-col items-center text-center"
                        >
                          <span
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-full border',
                              done
                                ? 'border-teal-brand bg-teal-brand text-[#0D0E11]'
                                : current
                                  ? 'border-brand bg-brand-soft text-brand'
                                  : 'border-border-strong bg-elevated text-text-disabled',
                            )}
                          >
                            {done ? (
                              <Check className="h-4 w-4" />
                            ) : current ? (
                              <Star className="h-3.5 w-3.5" />
                            ) : (
                              <span className="text-[11px]">{idx + 1}</span>
                            )}
                          </span>
                          <span className="text-text-secondary mt-1.5 text-[10px] leading-tight font-medium">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="min-w-0 xl:col-span-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    {
                      title: 'Analyze an Offer',
                      sub: 'Paste URL or idea',
                      href: '/analyze',
                      icon: <Search className="text-brand h-5 w-5" />,
                      featured: true,
                    },
                    {
                      title: 'Find Prospects',
                      sub: 'Explore matches',
                      href: '/prospects',
                      icon: <Users className="text-info h-5 w-5" />,
                    },
                    {
                      title: 'Create Campaign',
                      sub: 'Start outreach',
                      href: '/campaigns?create=1',
                      icon: <Send className="text-teal-brand h-5 w-5" />,
                    },
                    {
                      title: 'Open AI Agents',
                      sub: 'Get assistance',
                      href: '/agents',
                      icon: <Bot className="text-ai h-5 w-5" />,
                    },
                  ].map((tile) => (
                    <Link
                      key={tile.title}
                      href={tile.href}
                      className={cn(
                        'rounded-card hover:bg-hover flex flex-col items-center justify-center border p-4 text-center transition-all',
                        tile.featured
                          ? 'border-brand-border bg-brand-soft/30'
                          : 'border-border-subtle bg-app/50 hover:border-border-strong',
                      )}
                    >
                      <span className="border-border-subtle bg-surface mb-3 flex h-10 w-10 items-center justify-center rounded-xl border">
                        {tile.icon}
                      </span>
                      <span className="text-text-primary text-xs font-semibold">
                        {tile.title}
                      </span>
                      <span className="text-text-secondary mt-0.5 text-[11px]">
                        {tile.sub}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom 3-Column Grid */}
          <div className="grid min-w-0 gap-5 xl:grid-cols-12">
            {/* Recent Projects */}
            <Card className="min-w-0 xl:col-span-4">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <button
                  type="button"
                  onClick={() => setActiveTab('research')}
                  className="text-info inline-flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  View All <ArrowRight className="h-3 w-3" />
                </button>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {projects.map((p) => (
                  <Link
                    key={p.id}
                    href={
                      p.analysisId ? `/analyze/${p.analysisId}` : '/analyze'
                    }
                    className="rounded-btn border-border-subtle bg-app/50 hover:border-border-strong hover:bg-hover/60 flex items-center justify-between gap-3 border p-3 transition-colors"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                        style={{ backgroundColor: p.iconBg }}
                      >
                        {p.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="text-text-primary truncate text-xs font-semibold">
                          {p.name}
                        </p>
                        <p className="text-text-disabled text-[11px]">
                          Updated {p.updatedLabel}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        p.status === 'Completed'
                          ? 'success'
                          : p.status === 'Analyzing'
                            ? 'info'
                            : p.status === 'In Progress'
                              ? 'brand'
                              : 'default'
                      }
                    >
                      {p.status}
                    </Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Workspace Analytics */}
            <Card className="min-w-0 xl:col-span-5">
              <CardHeader>
                <CardTitle>Workspace Analytics</CardTitle>
                <div className="flex gap-1">
                  {(['overview', 'performance', 'activity'] as const).map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAnalyticsTab(t)}
                        className={cn(
                          'rounded-control px-2 py-1 text-[11px] font-medium capitalize',
                          analyticsTab === t
                            ? 'bg-brand-soft text-brand'
                            : 'text-text-secondary hover:text-text-primary',
                        )}
                      >
                        {t}
                      </button>
                    ),
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[215px] w-full">
                  <SeriesChart
                    data={ILLUSTRATIVE_WORKSPACE_ANALYTICS}
                    xKey="week"
                    variant="area"
                    series={[
                      {
                        key: 'qualifiedLeads',
                        label: 'Qualified Leads',
                        color: '#00B6B6',
                        fillOpacity: 0.18,
                      },
                      ...(analyticsTab !== 'activity'
                        ? [
                            {
                              key: 'projects',
                              label: 'Research Volume',
                              color: '#F59E0B',
                              fillOpacity: 0.14,
                            },
                          ]
                        : []),
                      ...(analyticsTab !== 'performance'
                        ? [
                            {
                              key: 'revenue',
                              label: 'Index Score',
                              color: '#8B5CF6',
                              fillOpacity: 0.14,
                            },
                          ]
                        : []),
                    ]}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Your Resources */}
            <Card className="min-w-0 xl:col-span-3">
              <CardHeader>
                <CardTitle>Your Resources</CardTitle>
                <button
                  type="button"
                  onClick={() => setActiveTab('resources')}
                  className="text-info inline-flex items-center gap-1 text-xs font-medium hover:underline"
                >
                  View All <ArrowRight className="h-3 w-3" />
                </button>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {resources.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => setPreviewResource(res)}
                    className="rounded-btn border-border-subtle bg-app/50 hover:border-border-strong hover:bg-hover flex w-full items-center gap-3 border p-2.5 text-left transition-colors"
                  >
                    <span className="border-border-subtle bg-elevated text-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-text-primary truncate text-xs font-semibold">
                        {res.title}
                      </p>
                      <p className="text-text-secondary truncate text-[11px]">
                        {res.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB: OFFERS */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-text-secondary text-xs">
              Commercial offers and service definitions that power your VANGUARD
              analyses.
            </p>
            <Button size="sm" onClick={() => setNewOfferOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Add Offer
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <Card key={offer.id} className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="brand">{offer.targetDealSize}</Badge>
                  <span className="text-text-disabled text-[11px]">
                    Updated {offer.updatedAt}
                  </span>
                </div>
                <h3 className="text-text-primary mt-3 text-base font-semibold">
                  {offer.name}
                </h3>
                <p className="text-info mt-1 font-mono text-[11px]">
                  {offer.urlOrSource}
                </p>
                <p className="text-text-secondary mt-2.5 text-xs leading-relaxed">
                  {offer.summary}
                </p>
                <div className="border-border-subtle mt-4 flex items-center justify-between border-t pt-3 text-xs">
                  <span className="text-text-secondary">
                    {offer.linkedAnalysesCount} linked analyses
                  </span>
                  <Link
                    href="/analyze"
                    className="text-brand font-medium hover:underline"
                  >
                    Analyze Offer →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB: ICP */}
      {activeTab === 'icp' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {icps.map((icp) => (
            <Card key={icp.id} className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-text-primary text-base font-semibold">
                  {icp.name}
                </h3>
                <Badge variant="teal">Min {icp.matchThreshold}%</Badge>
              </div>
              <p className="text-text-secondary mt-1 text-xs">
                {icp.companySize} · {icp.regions.join(', ')}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {icp.industries.map((ind) => (
                  <Badge key={ind} variant="default">
                    {ind}
                  </Badge>
                ))}
              </div>
              <div className="border-border-subtle mt-4 border-t pt-3">
                <p className="text-text-disabled text-[11px] font-semibold tracking-wider uppercase">
                  Decision Makers
                </p>
                <p className="text-text-primary mt-1 text-xs">
                  {icp.decisionMakers.join(' · ')}
                </p>
                <p className="text-text-disabled mt-3 text-[11px] font-semibold tracking-wider uppercase">
                  Buying Signals
                </p>
                <ul className="text-text-secondary mt-1.5 space-y-1 text-xs">
                  {icp.buyingSignals.map((sig) => (
                    <li key={sig} className="flex items-center gap-1.5">
                      <CheckCircle2 className="text-teal-brand h-3.5 w-3.5" />
                      {sig}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB: RESEARCH */}
      {activeTab === 'research' && (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <Card key={p.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-text-primary text-base font-semibold">
                    {p.name}
                  </h3>
                  <p className="text-text-secondary mt-1 text-xs">
                    {p.description}
                  </p>
                </div>
                <Badge variant={p.status === 'Completed' ? 'success' : 'brand'}>
                  {p.status}
                </Badge>
              </div>
              <div className="border-border-subtle mt-4 flex items-center justify-between border-t pt-3 text-xs">
                <span className="text-text-disabled">
                  Updated {p.updatedLabel}
                </span>
                <Link
                  href={p.analysisId ? `/analyze/${p.analysisId}` : '/analyze'}
                  className="text-info font-medium hover:underline"
                >
                  Open Research →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB: SAVED PROSPECTS */}
      {activeTab === 'prospects' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedProspects.map((comp) => (
            <Card key={comp.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
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
                      {comp.industry}
                    </p>
                  </div>
                </div>
                <Badge variant="success">{comp.matchScore}%</Badge>
              </div>
              <p className="text-text-secondary mt-3 line-clamp-2 text-xs">
                {comp.description}
              </p>
              <Link
                href={`/prospects?selected=${comp.id}`}
                className="text-brand mt-3 inline-flex items-center gap-1 text-xs font-medium hover:underline"
              >
                Inspect in Prospects <ArrowRight className="h-3 w-3" />
              </Link>
            </Card>
          ))}
        </div>
      )}

      {/* TAB: RESOURCES */}
      {activeTab === 'resources' && (
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((res) => (
            <Card key={res.id} className="p-5">
              <div className="flex items-center justify-between">
                <Badge variant="brand">{res.category}</Badge>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => {
                    downloadTextFile(
                      `${res.title.toLowerCase().replace(/\s+/g, '-')}.txt`,
                      `${res.title}\n\n${res.contentPreview}`,
                    );
                    pushToast({
                      title: `Downloaded ${res.title}`,
                      variant: 'success',
                    });
                  }}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
              <h3 className="text-text-primary mt-3 text-base font-semibold">
                {res.title}
              </h3>
              <p className="text-text-secondary mt-1.5 text-xs leading-relaxed">
                {res.contentPreview}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* TAB: ACTIVITY */}
      {activeTab === 'activity' && (
        <Card className="p-5">
          <h2 className="text-text-primary mb-4 text-sm font-semibold">
            Workspace Activity Log
          </h2>
          <div className="divide-border-subtle divide-y">
            {recentActivity.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between gap-4 py-3 text-xs"
              >
                <div>
                  <p className="text-text-primary font-semibold">{ev.title}</p>
                  <p className="text-text-secondary">{ev.detail}</p>
                </div>
                <span className="text-text-disabled shrink-0">
                  {ev.timestamp}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* New Project Modal */}
      <Modal
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        title="Create Research Project"
        description="Organize an offer analysis and its target ICP discovery into a tracked workspace project."
        size="sm"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Project Name *
            </label>
            <Input
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              placeholder="e.g., B2B DevTools Q1 Expansion"
              required
            />
          </div>
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Description
            </label>
            <Textarea
              rows={3}
              value={projDesc}
              onChange={(e) => setProjDesc(e.target.value)}
              placeholder="Target segment, offer angle, or research goals..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setNewProjectOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Offer Modal */}
      <Modal
        open={newOfferOpen}
        onClose={() => setNewOfferOpen(false)}
        title="Add Commercial Offer"
        description="Reusable offer definitions can be submitted directly to VANGUARD Analyze."
        size="sm"
      >
        <form onSubmit={handleCreateOffer} className="space-y-3.5">
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Offer Name *
            </label>
            <Input
              value={offerName}
              onChange={(e) => setOfferName(e.target.value)}
              placeholder="e.g., AI Analytics Sprint"
            />
          </div>
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Website URL or Source *
            </label>
            <Input
              value={offerUrl}
              onChange={(e) => setOfferUrl(e.target.value)}
              placeholder="https://agency.example.com/offer"
            />
          </div>
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Target Deal Size *
            </label>
            <Input
              value={offerDealSize}
              onChange={(e) => setOfferDealSize(e.target.value)}
            />
          </div>
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Value Summary *
            </label>
            <Textarea
              rows={3}
              value={offerSummary}
              onChange={(e) => setOfferSummary(e.target.value)}
            />
          </div>
          {offerErr && <p className="text-danger text-xs">{offerErr}</p>}
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setNewOfferOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Offer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Resource Preview Modal */}
      <Modal
        open={Boolean(previewResource)}
        onClose={() => setPreviewResource(null)}
        title={previewResource?.title ?? 'Resource'}
        description={previewResource?.subtitle}
        size="sm"
      >
        {previewResource && (
          <div className="space-y-4">
            <p className="text-text-secondary text-xs leading-relaxed">
              {previewResource.contentPreview}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPreviewResource(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  downloadTextFile(
                    `${previewResource.title.toLowerCase().replace(/\s+/g, '-')}.txt`,
                    `${previewResource.title}\n\n${previewResource.contentPreview}`,
                  );
                  pushToast({
                    title: `Downloaded ${previewResource.title}`,
                    variant: 'success',
                  });
                  setPreviewResource(null);
                }}
              >
                <Download className="h-3.5 w-3.5" />
                Download Copy
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
