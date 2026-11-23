import type { AnalysisJob } from '@/types/vanguard';

export const ILLUSTRATIVE_ANALYSES: AnalysisJob[] = [
  {
    id: 'anl_example_01',
    code: 'AN-0001',
    shortTitle: 'Website Analysis',
    sourceDomain: 'example.com',
    organizationId: 'org_acme',
    inputValue:
      'https://www.example.com/solutions/enterprise-ai-modernization?utm_campaign=q4-b2b-offer',
    inputType: 'url',
    offerDescription:
      'Custom B2B SaaS engineering & AI workflow modernization for mid-market and enterprise technology companies.',
    objective: 'Discover & qualify ideal B2B buyers',
    icpPreferences: {
      targetIndustry: 'Technology & Enterprise SaaS',
      targetRegion: 'North America & Western Europe',
      companySize: '200–10,000+ employees',
      targetJobTitles:
        'VP of Engineering, CTO, Director of Partner Engineering',
      maxCompanies: 100,
      additionalInstructions:
        'Prioritize companies showing active cloud partner or AI roadmap hiring.',
    },
    status: 'running',
    createdAt: 'Today, 14:22',
    estimatedRemaining: 'Stage 2 of 4 active (illustrative)',
    companiesAnalyzed: 1247,
    matchesFound: 86,
    avgMatchScore: 92.4,
    estimatedPipelineRange: '$2.8M – $5.1M',
    offerSummary: {
      headline: 'B2B SaaS Product Engineering & AI Workflow Modernization',
      valueProposition:
        'Helps engineering and product organizations ship high-reliability AI analytics, multi-tenant dashboards, and legacy platform modernizations faster without inflating internal headcount.',
      targetBuyers: [
        'VP of Engineering',
        'Director of Partner Engineering',
        'Head of Product Operations',
        'CTO (Growth & Mid-Market)',
      ],
      coreCapabilities: [
        'Next.js / TypeScript enterprise web platforms',
        'PostgreSQL multi-tenant data architecture',
        'Evidence-backed AI workflow integration',
        'Design-system modernization & UX acceleration',
      ],
    },
    icpSummary: {
      industries: [
        'Technology',
        'Enterprise SaaS',
        'FinTech',
        'Healthcare Cloud',
      ],
      companySize: '200 – 10,000+ employees',
      geography: 'North America, Western Europe, APAC',
      buyingSignals: [
        'Active cloud / AI partner ecosystem expansion',
        'Hiring surges in developer experience or platform UI teams',
        'Recent product modernization announcements',
        'Public B2B marketplace / integration roadmap',
      ],
    },
    keyInsights: [
      'Strong market demand for specialized AI workflow modernization partners',
      '3,200+ candidate organizations indexed across primary target verticals',
      'High ICP alignment with cloud infrastructure and enterprise software segments',
      'Growing buyer preference for explainable, compliance-ready engineering studios',
    ],
    pipelineTrend: [
      { step: 'Stage 1', value: 1.1 },
      { step: 'Stage 2', value: 1.9 },
      { step: 'Stage 3', value: 2.6 },
      { step: 'Stage 4', value: 3.4 },
      { step: 'Stage 5', value: 4.3 },
      { step: 'Stage 6', value: 5.1 },
    ],
    stages: [
      {
        id: 'st_1',
        stepNumber: 1,
        title: 'Understand Offer',
        shortTitle: 'Understand Offer',
        description:
          'Extract offer positioning, services, and value proposition.',
        status: 'completed',
        startedAt: '14:22:04',
        completedAt: '14:22:21',
        finding:
          'Extracted 4 core engineering capabilities and B2B enterprise delivery positioning.',
        substeps: [
          { id: 'sub_1a', label: 'Source URL received', status: 'completed' },
          {
            id: 'sub_1b',
            label: 'Website content retrieved',
            status: 'completed',
          },
          {
            id: 'sub_1c',
            label: 'Offer positioning extracted',
            status: 'completed',
          },
          {
            id: 'sub_1d',
            label: 'ICP definition completed',
            status: 'completed',
          },
        ],
      },
      {
        id: 'st_2',
        stepNumber: 2,
        title: 'Research Companies',
        shortTitle: 'Research Companies',
        description:
          'Discover potential target companies matching firmographic & hiring signals.',
        status: 'running',
        startedAt: '14:22:22',
        finding:
          '1,247 organizations screened; 86 candidate matches surfaced so far.',
        substeps: [
          {
            id: 'sub_2a',
            label: 'Mapped primary & adjacent B2B verticals',
            status: 'completed',
          },
          {
            id: 'sub_2b',
            label: 'Queried authorized company enrichment index',
            status: 'completed',
          },
          {
            id: 'sub_2c',
            label: 'Correlating public hiring & partner signals',
            status: 'running',
          },
          {
            id: 'sub_2d',
            label: 'Deduplicating enterprise parent/subsidiary records',
            status: 'pending',
          },
        ],
      },
      {
        id: 'st_3',
        stepNumber: 3,
        title: 'Evaluate Fit',
        shortTitle: 'Evaluate Fit',
        description:
          'Score companies against the ICP rubric and attach supporting evidence.',
        status: 'pending',
        substeps: [
          {
            id: 'sub_3a',
            label: 'Compute weighted ICP rubric scores',
            status: 'pending',
          },
          {
            id: 'sub_3b',
            label: 'Attach verified filings & source URLs',
            status: 'pending',
          },
          {
            id: 'sub_3c',
            label: 'Flag missing or unverified attributes',
            status: 'pending',
          },
        ],
      },
      {
        id: 'st_4',
        stepNumber: 4,
        title: 'Generate Report',
        shortTitle: 'Generate Report',
        description:
          'Prepare qualification results, evidence summaries, and next actions.',
        status: 'pending',
        substeps: [
          {
            id: 'sub_4a',
            label: 'Compile qualification distribution',
            status: 'pending',
          },
          {
            id: 'sub_4b',
            label: 'Publish explainable qualification report',
            status: 'pending',
          },
        ],
      },
    ],
    events: [
      {
        id: 'ev_1',
        sequence: 1,
        stageId: 'st_1',
        message:
          'Source URL normalized to domain example.com · Analysis #AN-0001 initialized.',
        timestamp: '14:22:04',
        kind: 'info',
      },
      {
        id: 'ev_2',
        sequence: 2,
        stageId: 'st_1',
        message: 'Offer value proposition & 4 target buyer personas extracted.',
        timestamp: '14:22:21',
        kind: 'success',
      },
      {
        id: 'ev_3',
        sequence: 3,
        stageId: 'st_2',
        message:
          'Screened 1,247 organizations across Technology, Finance, and Healthcare Cloud.',
        timestamp: '14:22:48',
        kind: 'discovery',
      },
      {
        id: 'ev_4',
        sequence: 4,
        stageId: 'st_2',
        message:
          'Preliminary verified signals collected for Microsoft, Google, Adobe, Stripe, and Atlassian.',
        timestamp: '14:23:12',
        kind: 'discovery',
      },
    ],
    matchedCompanyIds: [
      'prsp_microsoft',
      'prsp_google',
      'prsp_adobe',
      'prsp_stripe',
      'prsp_atlassian',
      'prsp_salesforce',
      'prsp_shopify',
      'prsp_veeva',
    ],
    isIllustrativeSimulation: true,
  },
  {
    id: 'anl_remote_saas_02',
    code: 'AN-0002',
    shortTitle: 'Idea Analysis',
    sourceDomain: 'Remote Team Collaboration SaaS',
    organizationId: 'org_acme',
    inputValue: 'SaaS for remote team collaboration',
    inputType: 'idea',
    offerDescription:
      'Async engineering standups, sprint intelligence, and workload visibility for distributed software teams.',
    objective: 'Validate ICP & shortlist early adopter accounts',
    icpPreferences: {
      targetIndustry: 'Software & Technology',
      targetRegion: 'North America & APAC',
      companySize: '50–2,000 employees',
      targetJobTitles:
        'VP of Engineering, Head of Remote Operations, Engineering Manager',
      maxCompanies: 50,
    },
    status: 'completed',
    createdAt: 'Yesterday, 16:10',
    estimatedRemaining: 'Completed',
    companiesAnalyzed: 940,
    matchesFound: 64,
    avgMatchScore: 89.2,
    estimatedPipelineRange: '$1.4M – $2.6M',
    offerSummary: {
      headline: 'Distributed Engineering Collaboration & Async Rituals SaaS',
      valueProposition:
        'Reduces meeting overhead by 35% for remote product teams while surfacing delivery bottlenecks automatically.',
      targetBuyers: [
        'VP of Engineering',
        'Head of Remote Operations',
        'Engineering Manager',
      ],
      coreCapabilities: [
        'Async sprint check-ins integrated with Git & issue trackers',
        'Cross-timezone handoff digests',
        'Automated delivery risk signals',
      ],
    },
    icpSummary: {
      industries: ['Technology', 'FinTech', 'E-commerce Tech'],
      companySize: '50 – 5,000 employees',
      geography: 'Remote-first US, Europe, Australia',
      buyingSignals: [
        'Distributed hiring across 3+ timezones',
        'Heavy Atlassian / Linear / GitHub adoption',
        'Public engineering culture blogs emphasizing async workflows',
      ],
    },
    keyInsights: [
      'Remote-first software studios show the fastest adoption cycles (14–30 days)',
      'Strongest buying trigger is scaling past 40 distributed engineers',
      'High integration pull for Jira, GitHub, and Slack notifications',
    ],
    pipelineTrend: [
      { step: 'Stage 1', value: 0.6 },
      { step: 'Stage 2', value: 1.0 },
      { step: 'Stage 3', value: 1.5 },
      { step: 'Stage 4', value: 2.0 },
      { step: 'Stage 5', value: 2.6 },
    ],
    stages: [
      {
        id: 'st_1',
        stepNumber: 1,
        title: 'Understand Offer',
        shortTitle: 'Understand Offer',
        description:
          'Parsed offer idea and structured core async collaboration value props.',
        status: 'completed',
        startedAt: '16:10:02',
        completedAt: '16:10:18',
        finding:
          'Mapped 3 primary buyer pain points for distributed engineering leaders.',
        substeps: [
          { id: 'r_1a', label: 'Business idea parsed', status: 'completed' },
          {
            id: 'r_1b',
            label: 'Core value props structured',
            status: 'completed',
          },
          { id: 'r_1c', label: 'ICP rubric defined', status: 'completed' },
        ],
      },
      {
        id: 'st_2',
        stepNumber: 2,
        title: 'Research Companies',
        shortTitle: 'Research Companies',
        description:
          'Discovered remote-first B2B software companies matching ICP criteria.',
        status: 'completed',
        startedAt: '16:10:19',
        completedAt: '16:11:12',
        finding:
          '940 organizations screened; 64 high-fit distributed teams identified.',
        substeps: [
          {
            id: 'r_2a',
            label: 'Screened distributed hiring signals',
            status: 'completed',
          },
          {
            id: 'r_2b',
            label: 'Filtered by engineering headcount band',
            status: 'completed',
          },
        ],
      },
      {
        id: 'st_3',
        stepNumber: 3,
        title: 'Evaluate Fit',
        shortTitle: 'Evaluate Fit',
        description:
          'Scored ICP alignment, remote-hiring evidence, and collaboration stack fit.',
        status: 'completed',
        startedAt: '16:11:13',
        completedAt: '16:12:04',
        finding: 'Average qualification score 89.2% across top cohort.',
        substeps: [
          {
            id: 'r_3a',
            label: 'Applied weighted fit rubric',
            status: 'completed',
          },
          {
            id: 'r_3b',
            label: 'Verified source links attached',
            status: 'completed',
          },
        ],
      },
      {
        id: 'st_4',
        stepNumber: 4,
        title: 'Generate Report',
        shortTitle: 'Generate Report',
        description:
          'Finalized evidence-backed qualification report and recommended next steps.',
        status: 'completed',
        startedAt: '16:12:05',
        completedAt: '16:12:19',
        finding: 'Report published and ready for campaign handoff.',
        substeps: [
          {
            id: 'r_4a',
            label: 'Qualification results published',
            status: 'completed',
          },
        ],
      },
    ],
    events: [
      {
        id: 'ev_r1',
        sequence: 1,
        stageId: 'st_1',
        message: 'Parsed idea: SaaS for remote team collaboration (#AN-0002).',
        timestamp: '16:10:02',
        kind: 'info',
      },
      {
        id: 'ev_r2',
        sequence: 2,
        stageId: 'st_2',
        message: 'Identified 64 remote-first engineering organizations.',
        timestamp: '16:11:12',
        kind: 'discovery',
      },
      {
        id: 'ev_r3',
        sequence: 3,
        stageId: 'st_4',
        message: 'Qualification report finalized with explainable evidence.',
        timestamp: '16:12:19',
        kind: 'success',
      },
    ],
    matchedCompanyIds: [
      'prsp_atlassian',
      'prsp_shopify',
      'prsp_stripe',
      'prsp_microsoft',
      'prsp_adyen',
    ],
    isIllustrativeSimulation: true,
  },
];
