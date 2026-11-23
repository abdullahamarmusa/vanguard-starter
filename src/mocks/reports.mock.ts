import type { AiInsightItem, FunnelStage, SavedReport } from '@/types/vanguard';

export const ILLUSTRATIVE_FUNNEL_STAGES: FunnelStage[] = [
  {
    label: 'Total Prospects',
    count: 2847,
    rateLabel: 'Engagement Rate',
    rateValue: '57.7%',
    color: '#3B82F6',
    widthPercent: 100,
  },
  {
    label: 'Engaged',
    count: 1642,
    rateLabel: 'Qualification Rate',
    rateValue: '26.1%',
    color: '#00B6B6',
    widthPercent: 78,
  },
  {
    label: 'Qualified',
    count: 742,
    rateLabel: 'Conversion Rate',
    rateValue: '10.1%',
    color: '#F59E0B',
    widthPercent: 56,
  },
  {
    label: 'Converted',
    count: 289,
    color: '#8B5CF6',
    widthPercent: 38,
  },
];

export const ILLUSTRATIVE_SAVED_REPORTS: SavedReport[] = [
  {
    id: 'rep_1',
    title: 'Q4 SaaS Market Analysis',
    category: 'Market Intelligence Report',
    date: 'Nov 22, 2026',
    accent: 'blue',
    summary:
      'Illustrative benchmark of 1,247 enterprise and mid-market SaaS organizations evaluated against custom engineering modernization offers.',
    highlights: [
      'Technology vertical represents 28.4% of qualified pipeline volume',
      'Accounts with active partner ecosystem hiring convert 2.1x faster',
      'Average verified evidence count per qualified account: 3.4 signals',
    ],
  },
  {
    id: 'rep_2',
    title: 'Fintech ICP Report',
    category: 'Target Audience Insights',
    date: 'Nov 18, 2026',
    accent: 'teal',
    summary:
      'Illustrative ICP calibration comparing North American vs. European payment infrastructure buyers.',
    highlights: [
      'Compliance & multi-tenant auditability ranked #1 decision criterion',
      'Average match score across top 40 accounts: 86.4%',
      'Recommended outreach channel: executive technical brief + case study',
    ],
  },
  {
    id: 'rep_3',
    title: 'E-commerce Opportunity Analysis',
    category: 'Growth Potential Assessment',
    date: 'Nov 14, 2026',
    accent: 'orange',
    summary:
      'Illustrative assessment of B2B wholesale & headless storefront modernization demand across Shopify Plus merchants.',
    highlights: [
      '16.3% share of total discovered accounts',
      'Strongest demand in wholesale catalog & ERP dashboard workflows',
      'Estimated illustrative pipeline band: $640K – $1.1M',
    ],
  },
];

export const ILLUSTRATIVE_AI_INSIGHTS: AiInsightItem[] = [
  {
    id: 'ins_1',
    title: 'Technology vertical outperforming benchmark',
    body: 'Technology companies are showing 42% higher engagement with your offers this month, with an illustrative conversion rate of 12.5% compared to 8.8% in October.',
    confidenceNote:
      'AI Interpretation (Illustrative) · Based on simulated 30D cohort metrics',
    category: 'Engagement',
  },
  {
    id: 'ins_2',
    title: 'Evidence-cited drafts double executive replies',
    body: 'Outreach drafts referencing verified public filings or partner announcements achieved 26.4% reply rates vs. 13.1% for generic introductions.',
    confidenceNote:
      'AI Interpretation (Illustrative) · Campaign cohort comparison',
    category: 'Outreach',
  },
  {
    id: 'ins_3',
    title: 'Healthcare Cloud emerging as secondary ICP',
    body: 'Healthcare accounts make up 22.1% of discovered companies with above-average fit scores around compliance and audit-trail capabilities.',
    confidenceNote:
      'AI Interpretation (Illustrative) · Industry distribution model',
    category: 'Market',
  },
];

export const ILLUSTRATIVE_REPORTS_COMPOSED_DATA = [
  { date: 'Nov 1', prospects: 640, leads: 280, revenue: 3200 },
  { date: 'Nov 3', prospects: 780, leads: 390, revenue: 4100 },
  { date: 'Nov 5', prospects: 1120, leads: 480, revenue: 5200 },
  { date: 'Nov 7', prospects: 840, leads: 340, revenue: 3900 },
  { date: 'Nov 9', prospects: 920, leads: 430, revenue: 4600 },
  { date: 'Nov 11', prospects: 1080, leads: 510, revenue: 5400 },
  { date: 'Nov 14', prospects: 1210, leads: 590, revenue: 6200 },
  { date: 'Nov 17', prospects: 1040, leads: 490, revenue: 5600 },
  { date: 'Nov 20', prospects: 1180, leads: 620, revenue: 6900 },
  { date: 'Nov 23', prospects: 1320, leads: 660, revenue: 7400 },
  { date: 'Nov 26', prospects: 1247, leads: 690, revenue: 7950 },
  { date: 'Nov 30', prospects: 1580, leads: 742, revenue: 8420 },
];
