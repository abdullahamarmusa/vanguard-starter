import type { AgentDefinition, AgentExecution } from '@/types/vanguard';

export const ILLUSTRATIVE_AGENTS: AgentDefinition[] = [
  {
    id: 'ag_market_research',
    name: 'Market Research Agent',
    description:
      'Analyze any industry or market with evidence-backed trend synthesis and demand signals.',
    category: 'Research',
    tags: ['Research', 'Insights', 'Trends'],
    estimatedDuration: '2–5 min',
    active: true,
    accent: 'blue',
    requiresApproval: false,
    defaultPromptHint:
      'Analyze demand for custom B2B AI analytics dashboards among mid-market US SaaS studios.',
    capabilities: [
      'Synthesizes industry growth & hiring benchmarks',
      'Separates verified facts from inferred trends',
      'Produces structured ICP recommendations',
    ],
  },
  {
    id: 'ag_company_discovery',
    name: 'Company Discovery Agent',
    description:
      'Find and qualify ideal companies matched directly to your offer and ICP constraints.',
    category: 'Qualification',
    tags: ['Qualification', 'Company Data', 'Fit Score'],
    estimatedDuration: '1–3 min',
    active: true,
    accent: 'purple',
    requiresApproval: false,
    defaultPromptHint:
      'Discover Series B+ FinTech companies in North America expanding developer APIs.',
    capabilities: [
      'Applies explainable multi-factor qualification rubrics',
      'Enriches firmographics via authorized data adapters',
      'Flags unverified fields transparently',
    ],
  },
  {
    id: 'ag_outreach_assistant',
    name: 'Outreach Assistant',
    description:
      'Draft evidence-grounded personalized outreach messages with mandatory human approval.',
    category: 'Outreach',
    tags: ['Email', 'Personalization', 'Campaign'],
    estimatedDuration: '1–2 min',
    active: true,
    accent: 'teal',
    requiresApproval: true,
    defaultPromptHint:
      'Draft 3 executive outreach emails for qualified cloud engineering prospects citing verified signals.',
    capabilities: [
      'Cites verified account evidence in every draft',
      'Enforces human approval gate before any external send',
      'Aligns messaging tone to recipient seniority',
    ],
  },
  {
    id: 'ag_competitor_intel',
    name: 'Competitor Intelligence',
    description:
      'Analyze competing offers, positioning gaps, and differentiation opportunities.',
    category: 'Analysis',
    tags: ['Analysis', 'Benchmark', 'Strategy'],
    estimatedDuration: '3–6 min',
    active: false,
    accent: 'orange',
    requiresApproval: false,
    defaultPromptHint:
      'Benchmark top 5 B2B software modernization agencies targeting enterprise SaaS.',
    capabilities: [
      'Maps feature & positioning whitespace',
      'Tracks public pricing and partner tier shifts',
      'Outputs battlecard talking points',
    ],
  },
  {
    id: 'ag_content_generator',
    name: 'Content Generator',
    description:
      'Create high-clarity campaign briefs, case-study outlines, and ICP executive summaries.',
    category: 'Content',
    tags: ['Content', 'Copywriting', 'Marketing'],
    estimatedDuration: '1–2 min',
    active: true,
    accent: 'green',
    requiresApproval: true,
    defaultPromptHint:
      'Write a concise executive one-pager for our FinTech BI Architecture offer.',
    capabilities: [
      'Grounds copy in workspace Offer & ICP definitions',
      'Maintains enterprise B2B tone without hype',
      'Exports ready-to-review drafts',
    ],
  },
  {
    id: 'ag_performance_analyzer',
    name: 'Performance Analyzer',
    description:
      'Surface conversion bottlenecks across discovery, qualification, and campaign funnels.',
    category: 'Analytics',
    tags: ['Analytics', 'Reports', 'Optimization'],
    estimatedDuration: '2–4 min',
    active: true,
    accent: 'violet',
    requiresApproval: false,
    defaultPromptHint:
      'Identify which ICP segments produced the highest qualification-to-reply velocity over 30 days.',
    capabilities: [
      'Audits conversion drop-offs across funnel stages',
      'Highlights top-performing evidence signals',
      'Clearly labels AI interpretations vs. actual metrics',
    ],
  },
];

export const ILLUSTRATIVE_AGENT_EXECUTIONS: AgentExecution[] = [
  {
    id: 'exec_1',
    agentId: 'ag_market_research',
    agentName: 'Market Research Agent',
    status: 'Completed',
    summary:
      'Found 47 qualified companies matching enterprise SaaS modernization signals',
    timestamp: '2m ago',
    accent: 'blue',
    inputPrompt:
      'Analyze enterprise SaaS modernization demand across North America.',
    evidenceSources: [
      'SEC 10-K Filings (Verified)',
      'Authorized Hiring Telemetry (Provider-Sourced)',
    ],
    findings: [
      '47 accounts scored ≥ 85% fit against active ICP rubric',
      'Cloud partner delivery expansion cited in 31 verified announcements',
      'Recommended handoff: enroll top 15 into Q4 SaaS Outreach',
    ],
    creditsUsed: 42,
  },
  {
    id: 'exec_2',
    agentId: 'ag_outreach_assistant',
    agentName: 'Outreach Assistant',
    status: 'Awaiting Approval',
    summary:
      'Created 3 personalized campaign draft variants (human approval required)',
    timestamp: '5m ago',
    accent: 'teal',
    inputPrompt:
      'Draft personalized outreach messages for Microsoft, Google, and Adobe contacts.',
    evidenceSources: [
      'Verified Account Evidence Bundle',
      'Workspace Offer: B2B SaaS Engineering',
    ],
    findings: [
      '3 drafts queued in Campaigns → Q4 SaaS Outreach → Emails',
      'External sending blocked until explicit human approval',
    ],
    creditsUsed: 18,
  },
  {
    id: 'exec_3',
    agentId: 'ag_competitor_intel',
    agentName: 'Competitor Intelligence',
    status: 'Running',
    summary:
      'Analyzing positioning benchmarks across specialized B2B studios...',
    timestamp: '8m ago',
    accent: 'orange',
    inputPrompt:
      'Compare positioning of boutique Next.js & AI intelligence studios.',
    evidenceSources: [
      'Public Agency Websites (Verified)',
      'Partner Directory Listings',
    ],
    findings: [
      'Preliminary finding: explainable qualification evidence is an under-served differentiator',
    ],
    creditsUsed: 35,
  },
];

export const ILLUSTRATIVE_AI_USAGE = {
  usedPercent: 78,
  creditsRemaining: 2840,
  creditsTotal: 12900,
  approxAnalysesRemaining: 56,
};
