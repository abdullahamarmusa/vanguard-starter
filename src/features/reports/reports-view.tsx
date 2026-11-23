'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  Lightbulb,
  Rocket,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Drawer } from '@/components/ui/drawer';
import { EmptyState } from '@/components/ui/empty-state';
import { KpiCard } from '@/features/dashboard/kpi-card';
import { ComposedReportsChart } from '@/components/charts/composed-reports-chart';
import { ConversionFunnel } from '@/components/charts/conversion-funnel';
import { IndustryDonutChart } from '@/components/charts/industry-donut-chart';
import { mockVanguardAdapter } from '@/lib/data-access/mock-adapter';
import { ILLUSTRATIVE_REPORTS_COMPOSED_DATA } from '@/mocks/reports.mock';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn, downloadTextFile, toCsv } from '@/lib/utils';
import type { DateRangePreset, SavedReport } from '@/types/vanguard';

export function ReportsView() {
  const router = useRouter();
  const { isEmptyWorkspace, toggleEmptyWorkspace, pushToast } =
    usePrototypeStore();

  const funnel = mockVanguardAdapter.getFunnelStages();
  const industries = mockVanguardAdapter.getTopIndustries();
  const savedReports = mockVanguardAdapter.getSavedReports();
  const aiInsights = mockVanguardAdapter.getAiInsights();

  const [range, setRange] = useState<DateRangePreset>('30D');
  const [visibleSeries, setVisibleSeries] = useState({
    prospects: true,
    leads: true,
    revenue: true,
  });
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(
    null,
  );
  const [insightsDrawerOpen, setInsightsDrawerOpen] = useState(false);

  const handleExportMasterCsv = () => {
    const csv = toCsv(
      [
        'Date',
        'Prospects (Illustrative)',
        'Qualified Leads',
        'Attributed Revenue (USD)',
      ],
      ILLUSTRATIVE_REPORTS_COMPOSED_DATA.map((d) => [
        d.date,
        d.prospects,
        d.leads,
        d.revenue,
      ]),
    );
    downloadTextFile(
      `vanguard-bi-report-${range}.csv`,
      csv,
      'text/csv;charset=utf-8',
    );
    pushToast({
      title: `Exported ${range} BI report (CSV)`,
      description:
        'Contains explicitly labeled illustrative prototype metrics.',
      variant: 'success',
    });
  };

  if (isEmptyWorkspace) {
    return (
      <div className="space-y-6">
        <h1 className="text-text-primary text-2xl font-bold">Reports</h1>
        <EmptyState
          icon={<BarChart3 className="h-6 w-6" />}
          title="No intelligence reports available yet"
          description="Complete an offer analysis or activate a campaign to generate conversion funnels and attribution reports."
          action={
            <Button onClick={toggleEmptyWorkspace}>
              Load Illustrative Reports
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
            Reports
          </Badge>
          <div className="flex items-center gap-2.5">
            <span className="border-brand-border bg-brand-soft text-brand flex h-9 w-9 items-center justify-center rounded-xl border">
              <BarChart3 className="h-4 w-4" />
            </span>
            <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-[28px]">
              Reports
            </h1>
          </div>
          <p className="text-text-secondary mt-1 text-sm">
            Track performance, audit conversion funnels, and separate actual
            metrics from AI interpretations.
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
          <Button variant="secondary" size="sm" onClick={handleExportMasterCsv}>
            <Download className="h-3.5 w-3.5" />
            Export Report
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
          icon={<Users className="h-5 w-5" />}
          sparkline={[24, 30, 34, 42, 50, 62, 74]}
        />
        <KpiCard
          title="Qualified Leads"
          value="742"
          changeLabel="+32%"
          accent="teal"
          icon={<CheckCircle2 className="h-5 w-5" />}
          sparkline={[18, 22, 29, 36, 44, 58, 70]}
        />
        <KpiCard
          title="Campaigns Revenue"
          value="$24,860"
          changeLabel="+48%"
          accent="orange"
          icon={<Rocket className="h-5 w-5" />}
          sparkline={[10, 14, 17, 21, 24, 29, 36]}
          tooltip="Illustrative attributed revenue for preview purposes."
        />
        <KpiCard
          title="Conversion Rate"
          value="24.8%"
          changeLabel="+2.7%"
          accent="purple"
          icon={<TrendingUp className="h-5 w-5" />}
          sparkline={[19, 20, 21, 22, 23, 24, 25]}
        />
      </section>

      {/* Main Analytics Row: Composed Chart + Conversion Funnel */}
      <section className="grid min-w-0 gap-5 xl:grid-cols-12">
        <Card className="min-w-0 xl:col-span-7">
          <CardHeader className="flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Performance Overview</CardTitle>
              <p className="text-text-secondary mt-0.5 text-xs">
                Prospect volume (bars) vs. Qualified Leads &amp; Revenue USD
                (dual-axis lines) · {range}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              {(
                [
                  { key: 'prospects', label: 'Prospects', color: '#3B82F6' },
                  { key: 'leads', label: 'Qualified Leads', color: '#00B6B6' },
                  { key: 'revenue', label: 'Revenue ($)', color: '#F59E0B' },
                ] as const
              ).map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() =>
                    setVisibleSeries((prev) => ({
                      ...prev,
                      [s.key]: !prev[s.key],
                    }))
                  }
                  className={cn(
                    'inline-flex items-center gap-1.5 transition-opacity',
                    visibleSeries[s.key]
                      ? 'text-text-primary opacity-100'
                      : 'text-text-secondary opacity-40',
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.label}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ComposedReportsChart
              data={ILLUSTRATIVE_REPORTS_COMPOSED_DATA}
              visible={visibleSeries}
              height={265}
            />
          </CardContent>
        </Card>

        <Card className="min-w-0 xl:col-span-5">
          <CardHeader>
            <div>
              <CardTitle>Conversion Funnel</CardTitle>
              <p className="text-text-secondary mt-0.5 text-xs">
                Stage-to-stage progression across discovered accounts
              </p>
            </div>
            <Badge variant="default">Illustrative</Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <ConversionFunnel stages={funnel} />
          </CardContent>
        </Card>
      </section>

      {/* Bottom 3-Column Row: Top Industries, Recent Reports, AI Insights */}
      <section className="grid min-w-0 gap-5 xl:grid-cols-12">
        <Card className="min-w-0 xl:col-span-4">
          <CardHeader>
            <CardTitle>Top Industries</CardTitle>
            <button
              type="button"
              onClick={() => router.push('/prospects')}
              className="text-info inline-flex items-center gap-1 text-xs font-medium hover:underline"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent>
            <IndustryDonutChart
              data={industries}
              onSelectIndustry={(ind) =>
                router.push(`/prospects?industry=${encodeURIComponent(ind)}`)
              }
            />
          </CardContent>
        </Card>

        <Card className="min-w-0 xl:col-span-4">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <Badge variant="default">{savedReports.length} Saved</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {savedReports.map((rep) => (
              <div
                key={rep.id}
                className="rounded-btn border-border-subtle bg-app/50 hover:border-border-strong flex items-center justify-between gap-3 border p-3 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setSelectedReport(rep)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="border-border-subtle bg-elevated text-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-text-primary hover:text-brand truncate text-xs font-semibold">
                      {rep.title}
                    </p>
                    <p className="text-text-secondary truncate text-[11px]">
                      {rep.category} · {rep.date}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  aria-label={`Download ${rep.title}`}
                  onClick={() => {
                    downloadTextFile(
                      `${rep.id}.md`,
                      `# ${rep.title}\n${rep.date}\n\n${rep.summary}\n\n${rep.highlights.map((h) => `- ${h}`).join('\n')}`,
                    );
                    pushToast({
                      title: `Downloaded ${rep.title}`,
                      variant: 'success',
                    });
                  }}
                  className="rounded-btn border-border-subtle bg-surface text-text-secondary hover:bg-hover hover:text-text-primary border p-2"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="min-w-0 xl:col-span-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="text-brand h-4 w-4" />
              <CardTitle>AI Insights</CardTitle>
            </div>
            <Badge variant="ai">AI Interpretation</Badge>
          </CardHeader>
          <CardContent className="flex flex-col justify-between space-y-4">
            <div className="rounded-card border-brand-border/40 bg-app/60 border p-4">
              <div className="text-brand flex items-center gap-2 text-xs font-semibold">
                <Lightbulb className="h-4 w-4" />
                Key Insight
              </div>
              <p className="text-text-primary mt-2 text-xs leading-relaxed">
                {aiInsights[0]?.body}
              </p>
              <p className="text-text-disabled mt-2.5 text-[11px]">
                {aiInsights[0]?.confidenceNote}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-brand-border text-brand hover:bg-brand-soft w-full"
              onClick={() => setInsightsDrawerOpen(true)}
            >
              Explore More Insights
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Saved Report Preview Modal */}
      <Modal
        open={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        title={selectedReport?.title ?? 'Saved Report'}
        description={
          selectedReport
            ? `${selectedReport.category} · ${selectedReport.date}`
            : undefined
        }
      >
        {selectedReport && (
          <div className="space-y-4 text-xs">
            <p className="text-text-secondary leading-relaxed">
              {selectedReport.summary}
            </p>
            <div>
              <h4 className="text-text-primary mb-2 font-semibold">
                Key Report Findings
              </h4>
              <ul className="text-text-primary space-y-2">
                {selectedReport.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <CheckCircle2 className="text-teal-brand mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  downloadTextFile(
                    `${selectedReport.id}.md`,
                    `# ${selectedReport.title}\n\n${selectedReport.summary}\n\n${selectedReport.highlights.map((h) => `- ${h}`).join('\n')}`,
                  );
                  pushToast({
                    title: `Exported ${selectedReport.title}`,
                    variant: 'success',
                  });
                }}
              >
                <Download className="h-3.5 w-3.5" />
                Export Markdown
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* AI Insights Drawer */}
      <Drawer
        open={insightsDrawerOpen}
        onClose={() => setInsightsDrawerOpen(false)}
        title="AI Performance Interpretations"
        description="Synthesized recommendations — explicitly separated from raw verified telemetry."
        widthClass="max-w-lg"
      >
        <div className="space-y-3.5">
          {aiInsights.map((ins) => (
            <div
              key={ins.id}
              className="rounded-card border-border-subtle bg-app/55 border p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-text-primary text-sm font-semibold">
                  {ins.title}
                </p>
                <Badge variant="ai">{ins.category}</Badge>
              </div>
              <p className="text-text-secondary mt-2 text-xs leading-relaxed">
                {ins.body}
              </p>
              <p className="text-text-disabled mt-2.5 text-[11px]">
                {ins.confidenceNote}
              </p>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
