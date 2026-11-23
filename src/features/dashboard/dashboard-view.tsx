'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Rocket,
  Sparkles,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { IndustryDonutChart } from '@/components/charts/industry-donut-chart';
import { QuickAnalyzeHero } from '@/features/dashboard/quick-analyze-hero';
import { KpiCard } from '@/features/dashboard/kpi-card';
import { PerformanceOverviewCard } from '@/features/dashboard/performance-overview-card';
import { UpcomingTasksCard } from '@/features/dashboard/upcoming-tasks-card';
import { RecentActivityCard } from '@/features/dashboard/recent-activity-card';
import { mockVanguardAdapter } from '@/lib/data-access/mock-adapter';
import { usePrototypeStore } from '@/store/prototype-context';

export function DashboardView() {
  const router = useRouter();
  const {
    isEmptyWorkspace,
    toggleEmptyWorkspace,
    setPlansModalOpen,
    campaigns,
  } = usePrototypeStore();

  const kpis = mockVanguardAdapter.getDashboardKpis();
  const topIndustries = mockVanguardAdapter.getTopIndustries();
  const activeCampaignCount = campaigns.filter(
    (c) => c.status === 'Active',
  ).length;

  const kpiIcons = [
    <Users key="u" className="h-5 w-5" />,
    <CheckCircle2 key="c" className="h-5 w-5" />,
    <Rocket key="r" className="h-5 w-5" />,
    <DollarSign key="d" className="h-5 w-5" />,
  ];

  return (
    <div className="space-y-6">
      {/* 1. Personalized Welcome + Quick Analyze Entry + Quick Actions */}
      <QuickAnalyzeHero />

      {isEmptyWorkspace ? (
        /* Honest First-Time User Onboarding Empty State (Section 4.11) */
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total Prospects"
              value="0"
              changeLabel="No analyses yet"
              trend="neutral"
              accent="blue"
              icon={<Users className="h-5 w-5" />}
            />
            <KpiCard
              title="Qualified Leads"
              value="0"
              changeLabel="Awaiting first rubric"
              trend="neutral"
              accent="teal"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
            <KpiCard
              title="Active Campaigns"
              value="0"
              changeLabel="None scheduled"
              trend="neutral"
              accent="orange"
              icon={<Rocket className="h-5 w-5" />}
            />
            <KpiCard
              title="Attributed Revenue"
              value="—"
              changeLabel="No attributed revenue yet"
              trend="neutral"
              accent="purple"
              icon={<DollarSign className="h-5 w-5" />}
            />
          </div>

          <EmptyState
            icon={<Sparkles className="h-6 w-6" />}
            title="Your intelligence workspace is ready."
            description="Start with your first offer analysis to discover relevant companies, inspect verified qualification evidence, and build human-approved outreach campaigns."
            action={
              <Button onClick={() => router.push('/analyze')}>
                Analyze Your First Offer
                <ArrowRight className="h-4 w-4" />
              </Button>
            }
            secondaryAction={
              <Button variant="secondary" onClick={toggleEmptyWorkspace}>
                Load Illustrative Preview Data
              </Button>
            }
          />
        </div>
      ) : (
        <>
          {/* 2. Primary Business KPI Cards */}
          <section
            aria-label="Key business metrics"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {kpis.map((kpi, index) => (
              <KpiCard
                key={kpi.id}
                title={kpi.title}
                value={
                  kpi.id === 'campaigns-running'
                    ? String(activeCampaignCount)
                    : kpi.value
                }
                changeLabel={`+${kpi.changePercent}%`}
                trend={kpi.trend}
                accent={kpi.accent}
                icon={kpiIcons[index]}
                sparkline={kpi.sparkline}
                href={kpi.href}
                tooltip={kpi.formulaTooltip}
              />
            ))}
          </section>

          {/* 3. Main Analytical Grid: Performance Overview + Top Industries / Tasks + Recent Activity */}
          <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="min-w-0 space-y-5 xl:col-span-6">
              <PerformanceOverviewCard />
            </div>

            <div className="min-w-0 space-y-5 xl:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Top Industries</CardTitle>
                  <Link
                    href="/prospects"
                    className="text-info inline-flex items-center gap-1 text-xs font-medium hover:underline"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardHeader>
                <CardContent>
                  <IndustryDonutChart
                    data={topIndustries}
                    onSelectIndustry={(industry) =>
                      router.push(
                        `/prospects?industry=${encodeURIComponent(industry)}`,
                      )
                    }
                  />
                </CardContent>
              </Card>

              <UpcomingTasksCard />
            </div>

            <div className="min-w-0 xl:col-span-3">
              <RecentActivityCard />
            </div>
          </section>

          {/* 4. Subtle Footer Pro Banner */}
          <section className="rounded-card border-brand-border/40 from-brand/10 via-surface to-teal-brand/10 flex flex-col items-start justify-between gap-4 border bg-gradient-to-r px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5">
              <div className="border-brand-border bg-brand-soft text-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-text-primary text-sm font-semibold">
                  Unlock more insights with VANGUARD Pro
                </p>
                <p className="text-text-secondary text-xs">
                  Higher analysis quotas, custom AI agents, and full CSV/PDF
                  qualification exports.
                </p>
              </div>
            </div>
            <Button size="sm" onClick={() => setPlansModalOpen(true)}>
              Upgrade Now
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </section>
        </>
      )}
    </div>
  );
}
