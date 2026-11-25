export type WorkflowStageId =
  | 'offer'
  | 'icp'
  | 'discovery'
  | 'evidence'
  | 'outreach'
  | 'review';

export type WorkflowRoute =
  | '/analyze'
  | '/workspace'
  | '/prospects'
  | '/analyze/anl_example_01/results'
  | '/campaigns'
  | '/audit-logs';

export interface WorkflowStage {
  id: WorkflowStageId;
  number: string;
  label: string;
  headline: string;
  description: string;
  input: string;
  process: string;
  output: string;
  ctaLabel: string;
  route: WorkflowRoute;
  previewTitle: string;
  previewContext: string;
  previewDescription: string;
}

export const WORKFLOW_INTRO = {
  eyebrow: 'FROM OFFER TO REVIEWED LEAD',
  heading: 'From offer to reviewed lead.',
  description:
    'One connected sequence keeps your commercial context, company evidence, and human decisions together—from understanding what you sell to reviewing the next action.',
  supportingLine:
    "Explore the six stages of VANGUARD's Offer-to-Lead Intelligence workflow.",
  disclosure:
    'Product-preview workflow. Records are illustrative. Live company-data provider integrations are not connected in this preview.',
} as const;

export const WORKFLOW_STAGES: readonly WorkflowStage[] = [
  {
    id: 'offer',
    number: '01',
    label: 'Understand the offer',
    headline:
      'Turn your business offering into a clear qualification foundation.',
    description:
      'Start with your website URL or describe your product or service. VANGUARD identifies what you sell, who it serves, the problems it solves, and the outcomes it delivers.',
    input: 'Website URL or offer description.',
    process:
      'Extract offer details, value proposition, audience, and business outcomes.',
    output: 'Structured offer profile ready for qualification.',
    ctaLabel: 'Open offer preview',
    route: '/analyze',
    previewTitle: 'Offer profile extraction',
    previewContext: 'Illustrative preview · Sample offer',
    previewDescription:
      'Illustrative offer profile preview with a sample URL, offer summary, target audience, value proposition, and key outcomes.',
  },
  {
    id: 'icp',
    number: '02',
    label: 'Define your ideal customer',
    headline:
      'Decide which companies are worth pursuing before discovery begins.',
    description:
      'Establish your ideal customer profile using industry, company characteristics, business context, location, and qualification preferences. Refine the criteria that determine whether an account is relevant to your offer.',
    input: 'Structured offer profile and targeting preferences.',
    process: 'Define ICP attributes, inclusion criteria, and exclusions.',
    output: 'A structured ICP and qualification framework.',
    ctaLabel: 'Open workspace',
    route: '/workspace',
    previewTitle: 'ICP qualification framework',
    previewContext: 'Illustrative preview · Workspace criteria',
    previewDescription:
      'Illustrative ideal-customer-profile preview with industry, company size, geography, qualification preferences, and inclusion and exclusion criteria.',
  },
  {
    id: 'discovery',
    number: '03',
    label: 'Discover relevant companies',
    headline:
      'Build a focused list of candidate accounts that match your target market.',
    description:
      'Organize discovered or imported companies against your ICP. Review company profiles and keep potential opportunities together in one workspace.',
    input: 'ICP criteria and available company records.',
    process:
      'Discover or import candidate accounts and organize them for review.',
    output: 'A structured list of potential companies.',
    ctaLabel: 'Inspect prospects',
    route: '/prospects',
    previewTitle: 'Candidate company directory',
    previewContext: 'Illustrative preview · Sample records',
    previewDescription:
      'Illustrative candidate company list with three sample accounts, locations, discovery sources, and review statuses. No live provider is connected.',
  },
  {
    id: 'evidence',
    number: '04',
    label: 'Evaluate fit with evidence',
    headline:
      'Understand why an account qualifies instead of relying on a score alone.',
    description:
      "Compare each company's characteristics against your ICP. Examine weighted fit factors, supporting evidence, source types, confidence, and missing information to understand the strength of every qualification.",
    input: 'Candidate company records and ICP criteria.',
    process: 'Evaluate fit factors and assess available supporting evidence.',
    output: 'An explainable qualification assessment with evidence and gaps.',
    ctaLabel: 'View sample report',
    route: '/analyze/anl_example_01/results',
    previewTitle: 'Explainable fit assessment',
    previewContext: 'Illustrative preview · Report anl_example_01',
    previewDescription:
      'Illustrative qualification report for Northstar Software Group with a 92 out of 100 sample fit score, four weighted factors, one evidence record, and a noted information gap.',
  },
  {
    id: 'outreach',
    number: '05',
    label: 'Prepare relevant outreach',
    headline: 'Turn company intelligence into personalized communication drafts.',
    description:
      'Use the offer context, company profile, qualification reasons, and available contact information to prepare relevant outreach drafts. Review the context before deciding what to send.',
    input: 'Qualified company records and available contact context.',
    process: 'Generate contextual outreach drafts for review.',
    output: 'Personalized campaign content awaiting human approval.',
    ctaLabel: 'Open campaign preview',
    route: '/campaigns',
    previewTitle: 'Contextual outreach draft',
    previewContext: 'Illustrative preview · Pending approval',
    previewDescription:
      'Illustrative outreach draft for Northstar Software Group with company context, an unconfirmed contact, evidence references, and a pending human approval state. Outbound sending is not connected.',
  },
  {
    id: 'review',
    number: '06',
    label: 'Review, decide, and hand off',
    headline:
      'Keep every important qualification and outreach decision accountable.',
    description:
      'Review the evidence, qualification assessment, and prepared outreach. A responsible person makes the final decision, approves the next action, and maintains a record of relevant activity.',
    input: 'Qualification assessment, evidence, and outreach draft.',
    process: 'Human review, approval, and decision recording.',
    output: 'An accountable decision and documented next action.',
    ctaLabel: 'View activity preview',
    route: '/audit-logs',
    previewTitle: 'Accountable decision & audit log',
    previewContext: 'Illustrative preview · Human review record',
    previewDescription:
      'Illustrative human review record with a qualification decision, named reviewer, approval-state example, and three activity-history entries.',
  },
];
