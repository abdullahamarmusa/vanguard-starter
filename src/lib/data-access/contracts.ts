import type {
  ActivityEvent,
  AgentDefinition,
  AgentExecution,
  AiInsightItem,
  AnalysisConfiguration,
  AnalysisJob,
  AnalysisStage,
  AuditLogEntry,
  CampaignItem,
  DateRangePreset,
  FunnelStage,
  IcpDefinition,
  IndustryDistributionItem,
  KpiMetric,
  NotificationItem,
  OfferDefinition,
  Organization,
  OrgMember,
  PerformancePoint,
  ProspectCompany,
  SavedReport,
  TaskItem,
  UserProfile,
  WorkspaceProject,
  WorkspaceResource,
} from '@/types/vanguard';
import type {
  ChannelTelemetry,
  LiveInspectionEvent,
  LiveObservatoryCounters,
} from '@/features/analyze/live-telemetry-engine';

/**
 * VANGUARD UI Data-Access Contract
 * ---------------------------------------------------------------------------
 * UI components consume data through these typed interfaces so that this
 * standalone prototype can be integrated cleanly into an existing VANGUARD
 * Next.js + Drizzle ORM + PostgreSQL (RLS) + Auth.js codebase.
 *
 * Replace `mockVanguardAdapter` with server-side RSC queries / Server Actions
 * scoped by your verified Auth.js session and PostgreSQL tenant context.
 */
export interface VanguardDataAdapter {
  readonly mode: 'illustrative-prototype' | 'production';
  getCurrentUser(): UserProfile;
  getOrganizations(): Organization[];
  getNotifications(): NotificationItem[];
  getDashboardKpis(): KpiMetric[];
  getPerformanceSeries(range: DateRangePreset): PerformancePoint[];
  getTopIndustries(): IndustryDistributionItem[];
  getUpcomingTasks(): TaskItem[];
  getRecentActivity(): ActivityEvent[];
  getAnalyses(): AnalysisJob[];
  getProspects(): ProspectCompany[];
  getCampaigns(): CampaignItem[];
  getWorkspaceProjects(): WorkspaceProject[];
  getOffers(): OfferDefinition[];
  getIcps(): IcpDefinition[];
  getWorkspaceResources(): WorkspaceResource[];
  getFunnelStages(): FunnelStage[];
  getSavedReports(): SavedReport[];
  getAiInsights(): AiInsightItem[];
  getAgents(): AgentDefinition[];
  getAgentExecutions(): AgentExecution[];
  getMembers(): OrgMember[];
  getAuditLogs(): AuditLogEntry[];
}

/**
 * Typed Mutation Contract for Server Actions / API Route Handlers
 * ---------------------------------------------------------------------------
 * Mirrors every interactive state transition currently backed by
 * `PrototypeProvider` so migrating to Drizzle + PostgreSQL requires swapping
 * only the handler implementation, not UI components.
 */
export interface CreateAnalysisInput {
  inputValue: string;
  offerDescription?: string;
  objective?: string;
  icpPreferences?: AnalysisConfiguration;
}

export interface VanguardMutationAdapter {
  createAnalysisJob(input: CreateAnalysisInput): Promise<AnalysisJob>;
  updateAnalysisConfig(
    analysisId: string,
    updates: {
      objective?: string;
      offerDescription?: string;
      icpPreferences?: AnalysisConfiguration;
    },
  ): Promise<AnalysisJob>;
  cancelAnalysisJob(analysisId: string): Promise<void>;
  toggleSaveProspect(prospectId: string): Promise<void>;
  markProspectReviewed(prospectId: string): Promise<void>;
  excludeProspect(prospectId: string): Promise<void>;
  enrollProspectsInCampaign(
    campaignId: string,
    prospectIds: string[],
  ): Promise<void>;
  approveOutreachDraft(
    campaignId: string,
    draftId: string,
    decision: 'approved' | 'rejected',
    editedBody?: string,
  ): Promise<void>;
}

/**
 * Typed Server-Sent Events (SSE) Contract for `/api/analyses/[analysisId]/stream`
 * ---------------------------------------------------------------------------
 * Powers `LiveIntelligenceObservatory` & `LiveAnalysisWorkspace` in production
 * without polling or fake percentage bars.
 */
export type AnalysisStreamMessage =
  | {
      type: 'stage.updated';
      analysisId: string;
      stage: AnalysisStage;
      timestamp: string;
    }
  | {
      type: 'source.inspected';
      analysisId: string;
      event: LiveInspectionEvent;
      counters: LiveObservatoryCounters;
      channels: ChannelTelemetry[];
    }
  | {
      type: 'prospect.discovered';
      analysisId: string;
      prospect: ProspectCompany;
    }
  | {
      type: 'analysis.completed';
      analysisId: string;
      finalCounters: LiveObservatoryCounters;
      completedAt: string;
    }
  | {
      type: 'analysis.failed';
      analysisId: string;
      errorMessage: string;
      failedStageId?: string;
    };
