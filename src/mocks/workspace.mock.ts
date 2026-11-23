import type {
  IcpDefinition,
  OfferDefinition,
  WorkspaceProject,
  WorkspaceResource,
} from '@/types/vanguard';

export const ILLUSTRATIVE_WORKSPACE_PROJECTS: WorkspaceProject[] = [
  {
    id: 'prj_remote_collab',
    name: 'SaaS for remote team collaboration',
    description:
      'Analyzing the market for remote team collaboration tools targeting growing tech companies.',
    status: 'In Progress',
    updatedLabel: '2h ago',
    iconBg: '#3B82F6',
    currentStepIndex: 3,
    analysisId: 'anl_remote_saas_02',
  },
  {
    id: 'prj_ecom_ai',
    name: 'E-commerce AI assistant tools',
    description:
      'Evaluating B2B commerce brands needing conversational catalog search and retention analytics.',
    status: 'Analyzing',
    updatedLabel: '3h ago',
    iconBg: '#6366F1',
    currentStepIndex: 1,
    analysisId: 'anl_example_01',
  },
  {
    id: 'prj_fintech_smb',
    name: 'Fintech for small businesses',
    description:
      'Completed ICP discovery across European and North American SMB treasury platforms.',
    status: 'Completed',
    updatedLabel: '1d ago',
    iconBg: '#EC4899',
    currentStepIndex: 4,
    analysisId: 'anl_remote_saas_02',
  },
  {
    id: 'prj_health_auto',
    name: 'Healthcare workflow automation',
    description:
      'Draft research brief exploring HIPAA-aligned clinical operations SaaS vendors.',
    status: 'Draft',
    updatedLabel: '2d ago',
    iconBg: '#0EA5E9',
    currentStepIndex: 0,
  },
];

export const ILLUSTRATIVE_OFFERS: OfferDefinition[] = [
  {
    id: 'off_1',
    name: 'B2B SaaS Product Engineering & AI Modernization',
    urlOrSource: 'https://www.example.com',
    summary:
      'Dedicated senior full-stack squads shipping Next.js, TypeScript, and PostgreSQL enterprise apps.',
    positioning:
      'Senior product engineering studio (2–20 specialists) for funded B2B SaaS teams.',
    targetDealSize: '$45K – $180K',
    linkedAnalysesCount: 4,
    updatedAt: 'Today',
  },
  {
    id: 'off_2',
    name: 'Compliance-First FinTech BI Architecture',
    urlOrSource: 'https://fintech.example.com/offer',
    summary:
      'Multi-tenant RLS dashboards, audit logging, and real-time reporting for payment platforms.',
    positioning: 'Security-first revenue analytics engineering.',
    targetDealSize: '$60K – $220K',
    linkedAnalysesCount: 2,
    updatedAt: '3 days ago',
  },
  {
    id: 'off_3',
    name: 'Distributed Engineering Async SaaS',
    urlOrSource: 'Idea Brief · Remote Collaboration',
    summary:
      'Lightweight async standups and delivery visibility for globally distributed engineering orgs.',
    positioning: 'Zero-meeting sprint clarity for remote product teams.',
    targetDealSize: '$12K – $36K ARR',
    linkedAnalysesCount: 1,
    updatedAt: 'Yesterday',
  },
];

export const ILLUSTRATIVE_ICPS: IcpDefinition[] = [
  {
    id: 'icp_1',
    name: 'Enterprise & Growth Cloud SaaS',
    industries: ['Technology', 'Enterprise SaaS', 'Developer Tools'],
    companySize: '200 – 10,000+ employees',
    regions: ['North America', 'Western Europe'],
    decisionMakers: [
      'VP of Engineering',
      'Director of Partner Engineering',
      'CTO',
    ],
    buyingSignals: [
      'Hiring UI/Platform Engineers',
      'Cloud Partner Ecosystem Expansion',
      'AI Roadmap Launch',
    ],
    matchThreshold: 80,
  },
  {
    id: 'icp_2',
    name: 'Mid-Market FinTech & Payments',
    industries: ['Finance', 'Payments', 'B2B Treasury'],
    companySize: '100 – 5,000 employees',
    regions: ['North America', 'Europe'],
    decisionMakers: ['Head of Product', 'VP Platform Partnerships', 'CISO'],
    buyingSignals: [
      'Usage-Based Billing Launch',
      'EMEA Market Entry',
      'SOC-2 / Compliance Initiative',
    ],
    matchThreshold: 78,
  },
  {
    id: 'icp_3',
    name: 'Remote-First Software Studios',
    industries: ['Technology', 'E-commerce Tech', 'Digital Agencies'],
    companySize: '25 – 500 employees',
    regions: ['North America', 'Europe', 'APAC'],
    decisionMakers: [
      'Founder / CEO',
      'Engineering Manager',
      'Head of Operations',
    ],
    buyingSignals: [
      'Hiring Across 3+ Timezones',
      'Atlassian / Linear Stack',
      'Rapid Headcount Growth',
    ],
    matchThreshold: 75,
  },
];

export const ILLUSTRATIVE_WORKSPACE_RESOURCES: WorkspaceResource[] = [
  {
    id: 'res_1',
    title: 'VANGUARD Guide',
    subtitle: 'Product Documentation',
    category: 'Guide',
    accent: 'purple',
    contentPreview:
      'End-to-end guide covering Offer-to-Lead Intelligence, explainable match scoring rubrics, evidence verification tiers, and human-approved outreach workflows.',
  },
  {
    id: 'res_2',
    title: 'ICP Template',
    subtitle: 'Download Template',
    category: 'Template',
    accent: 'blue',
    contentPreview:
      'Structured B2B Ideal Customer Profile worksheet covering firmographics, technical stack signals, buying triggers, and disqualification rules.',
  },
  {
    id: 'res_3',
    title: 'Research Playbook',
    subtitle: 'Best Practices',
    category: 'Playbook',
    accent: 'teal',
    contentPreview:
      'How agencies turn verified company evidence (SEC filings, partner announcements, hiring trends) into high-reply executive outreach.',
  },
  {
    id: 'res_4',
    title: 'Campaign Checklist',
    subtitle: 'Execution Guide',
    category: 'Checklist',
    accent: 'green',
    contentPreview:
      'Pre-flight quality checklist: ICP match threshold ≥ 80%, verified contact records, evidence citation check, and human approval sign-off.',
  },
];

export const ILLUSTRATIVE_WORKSPACE_ANALYTICS = [
  { week: 'Week 1', projects: 42, qualifiedLeads: 64, revenue: 35 },
  { week: 'Week 2', projects: 68, qualifiedLeads: 92, revenue: 54 },
  { week: 'Week 3', projects: 96, qualifiedLeads: 118, revenue: 88 },
  { week: 'Week 4', projects: 116, qualifiedLeads: 142, revenue: 108 },
];
