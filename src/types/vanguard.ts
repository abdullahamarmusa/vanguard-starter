export type DateRangePreset = '7D' | '30D' | '90D' | 'Custom';

export type VerificationStatus =
  | 'verified'
  | 'provider_sourced'
  | 'inferred'
  | 'ai_recommendation'
  | 'unverified';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  role: 'Owner' | 'Admin' | 'Member';
  isEmptyDemo?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: string;
  initials: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'analysis' | 'prospect' | 'campaign' | 'agent' | 'system';
  href?: string;
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  accent: 'blue' | 'teal' | 'orange' | 'purple';
  sparkline: number[];
  href: string;
  formulaTooltip: string;
}

export interface PerformancePoint {
  date: string;
  prospects: number;
  qualifiedLeads: number;
  campaigns: number;
  revenue: number;
}

export interface IndustryDistributionItem {
  industry: string;
  percentage: number;
  count: number;
  color: string;
}

export interface TaskItem {
  id: string;
  title: string;
  resourceLabel: string;
  href: string;
  dueLabel: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface ActivityEvent {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  category: 'analysis' | 'prospect' | 'campaign' | 'report' | 'agent';
  href: string;
}

/* ---------------- ANALYZE ---------------- */

export type AnalysisJobStatus =
  'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
export type AnalysisStageStatus =
  'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface AnalysisSubstep {
  id: string;
  label: string;
  status: 'completed' | 'running' | 'pending' | 'failed';
}

export interface AnalysisStage {
  id: string;
  stepNumber: number;
  title: string;
  shortTitle: string;
  description: string;
  status: AnalysisStageStatus;
  startedAt?: string;
  completedAt?: string;
  finding?: string;
  errorMessage?: string;
  substeps?: AnalysisSubstep[];
}

export interface AnalysisEventLog {
  id: string;
  sequence: number;
  stageId: string;
  message: string;
  timestamp: string;
  kind: 'info' | 'success' | 'warning' | 'discovery';
}

export interface EvidenceRecord {
  id: string;
  title: string;
  summary: string;
  sourceLabel: string;
  sourceUrl: string;
  verification: VerificationStatus;
  observedAt: string;
}

export interface FitFactor {
  label: string;
  score: number; // 0-100
  weight: number; // percentage
  explanation: string;
}

export interface ProspectContact {
  id: string;
  name: string;
  title: string;
  email: string;
  linkedinUrl: string;
  verification: 'verified' | 'provider_sourced' | 'unverified';
}

export interface ProspectCompany {
  id: string;
  name: string;
  logoText: string;
  logoColor: string;
  verified: boolean;
  industry: string;
  subIndustry: string;
  region: 'North America' | 'Europe' | 'APAC' | 'LATAM';
  location: string;
  website: string;
  employeeRange: string;
  employeeSortValue?: number;
  annualRevenue: string;
  matchScore: number;
  confidenceScore?: number;
  status: 'Qualified' | 'In Review' | 'Contacted' | 'Archived';
  saved: boolean;
  reviewed?: boolean;
  excluded?: boolean;
  tagline: string;
  description: string;
  whyMatch: string[];
  missingInfo?: string[];
  recommendedAction?: string;
  fitFactors: FitFactor[];
  evidence: EvidenceRecord[];
  contacts: ProspectContact[];
  relatedAnalysisId?: string;
  discoveredAt: string;
}

export interface AnalysisConfiguration {
  targetIndustry?: string;
  targetRegion?: string;
  companySize?: string;
  targetJobTitles?: string;
  maxCompanies?: number;
  additionalInstructions?: string;
}

export interface AnalysisJob {
  id: string;
  code: string;
  shortTitle: string;
  sourceDomain: string;
  organizationId: string;
  inputValue: string;
  inputType: 'url' | 'offer' | 'idea';
  offerDescription?: string;
  objective: string;
  icpPreferences?: AnalysisConfiguration;
  status: AnalysisJobStatus;
  createdAt: string;
  estimatedRemaining: string;
  companiesAnalyzed: number;
  matchesFound: number;
  avgMatchScore: number;
  estimatedPipelineRange: string;
  offerSummary: {
    headline: string;
    valueProposition: string;
    targetBuyers: string[];
    coreCapabilities: string[];
  };
  icpSummary: {
    industries: string[];
    companySize: string;
    geography: string;
    buyingSignals: string[];
  };
  keyInsights: string[];
  pipelineTrend: { step: string; value: number }[];
  stages: AnalysisStage[];
  events: AnalysisEventLog[];
  matchedCompanyIds: string[];
  isIllustrativeSimulation: true;
}

/* ---------------- CAMPAIGNS ---------------- */

export type CampaignStatus = 'Active' | 'Paused' | 'Draft' | 'Completed';

export interface OutreachDraft {
  id: string;
  prospectId: string;
  companyName: string;
  recipientName: string;
  recipientTitle: string;
  subject: string;
  body: string;
  personalizationNotes: string;
  approvalStatus: 'Pending Approval' | 'Approved' | 'Revision Requested';
  updatedAt: string;
}

export interface CampaignWorkflowStep {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

export interface CampaignItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  audienceSummary: string;
  offerName: string;
  status: CampaignStatus;
  accentColor: string;
  sent: number;
  opened: number;
  clicked: number;
  replies: number;
  replyRate: number;
  qualifiedLeads: number;
  requireHumanApproval: boolean;
  performanceSeries: {
    date: string;
    sent: number;
    opened: number;
    clicked: number;
    qualified: number;
  }[];
  workflow: CampaignWorkflowStep[];
  recentActivity: {
    id: string;
    text: string;
    timestamp: string;
    tone: 'teal' | 'blue' | 'orange';
  }[];
  drafts: OutreachDraft[];
  enrolledProspectIds: string[];
}

/* ---------------- WORKSPACE ---------------- */

export interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  status: 'Completed' | 'Analyzing' | 'In Progress' | 'Draft';
  updatedLabel: string;
  iconBg: string;
  currentStepIndex: number; // 0..4
  analysisId?: string;
}

export interface OfferDefinition {
  id: string;
  name: string;
  urlOrSource: string;
  summary: string;
  positioning: string;
  targetDealSize: string;
  linkedAnalysesCount: number;
  updatedAt: string;
}

export interface IcpDefinition {
  id: string;
  name: string;
  industries: string[];
  companySize: string;
  regions: string[];
  decisionMakers: string[];
  buyingSignals: string[];
  matchThreshold: number;
}

export interface WorkspaceResource {
  id: string;
  title: string;
  subtitle: string;
  category: 'Guide' | 'Template' | 'Playbook' | 'Checklist';
  accent: 'purple' | 'blue' | 'teal' | 'green';
  contentPreview: string;
}

/* ---------------- REPORTS ---------------- */

export interface FunnelStage {
  label: string;
  count: number;
  rateLabel?: string;
  rateValue?: string;
  color: string;
  widthPercent: number;
}

export interface SavedReport {
  id: string;
  title: string;
  category: string;
  date: string;
  accent: 'blue' | 'teal' | 'orange';
  summary: string;
  highlights: string[];
}

export interface AiInsightItem {
  id: string;
  title: string;
  body: string;
  confidenceNote: string;
  category: string;
}

/* ---------------- AI AGENTS ---------------- */

export type AgentCategory =
  | 'Research'
  | 'Qualification'
  | 'Outreach'
  | 'Analysis'
  | 'Content'
  | 'Analytics';

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  tags: string[];
  estimatedDuration: string;
  active: boolean;
  accent: 'blue' | 'purple' | 'teal' | 'orange' | 'green' | 'violet';
  requiresApproval: boolean;
  defaultPromptHint: string;
  capabilities: string[];
}

export interface AgentExecution {
  id: string;
  agentId: string;
  agentName: string;
  status: 'Completed' | 'Running' | 'Awaiting Approval';
  summary: string;
  timestamp: string;
  accent: AgentDefinition['accent'];
  inputPrompt: string;
  evidenceSources: string[];
  findings: string[];
  creditsUsed: number;
}

/* ---------------- AUDIT LOGS & MEMBERS ---------------- */

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
  status: 'Allowed' | 'Approved' | 'Denied';
  ip: string;
}

export interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Analyst' | 'Viewer';
  status: 'Active' | 'Invited';
  lastActive: string;
}
