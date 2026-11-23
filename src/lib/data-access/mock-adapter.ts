import type { VanguardDataAdapter } from '@/lib/data-access/contracts';
import {
  ILLUSTRATIVE_AGENT_EXECUTIONS,
  ILLUSTRATIVE_AGENTS,
} from '@/mocks/agents.mock';
import { ILLUSTRATIVE_ANALYSES } from '@/mocks/analyses.mock';
import { ILLUSTRATIVE_CAMPAIGNS } from '@/mocks/campaigns.mock';
import {
  ILLUSTRATIVE_DASHBOARD_KPIS,
  ILLUSTRATIVE_PERFORMANCE_BY_RANGE,
  ILLUSTRATIVE_RECENT_ACTIVITY,
  ILLUSTRATIVE_TOP_INDUSTRIES,
  ILLUSTRATIVE_UPCOMING_TASKS,
} from '@/mocks/dashboard.mock';
import {
  ILLUSTRATIVE_AUDIT_LOGS,
  ILLUSTRATIVE_MEMBERS,
  ILLUSTRATIVE_NOTIFICATIONS,
  ILLUSTRATIVE_ORGANIZATIONS,
  ILLUSTRATIVE_USER,
} from '@/mocks/organization.mock';
import { ILLUSTRATIVE_PROSPECTS } from '@/mocks/prospects.mock';
import {
  ILLUSTRATIVE_AI_INSIGHTS,
  ILLUSTRATIVE_FUNNEL_STAGES,
  ILLUSTRATIVE_SAVED_REPORTS,
} from '@/mocks/reports.mock';
import {
  ILLUSTRATIVE_ICPS,
  ILLUSTRATIVE_OFFERS,
  ILLUSTRATIVE_WORKSPACE_PROJECTS,
  ILLUSTRATIVE_WORKSPACE_RESOURCES,
} from '@/mocks/workspace.mock';

/**
 * Illustrative Prototype Data Adapter
 * Strictly isolated from UI components. Never represents live production data.
 */
export const mockVanguardAdapter: VanguardDataAdapter = {
  mode: 'illustrative-prototype',
  getCurrentUser: () => ILLUSTRATIVE_USER,
  getOrganizations: () => ILLUSTRATIVE_ORGANIZATIONS,
  getNotifications: () => ILLUSTRATIVE_NOTIFICATIONS,
  getDashboardKpis: () => ILLUSTRATIVE_DASHBOARD_KPIS,
  getPerformanceSeries: (range) => ILLUSTRATIVE_PERFORMANCE_BY_RANGE[range],
  getTopIndustries: () => ILLUSTRATIVE_TOP_INDUSTRIES,
  getUpcomingTasks: () => ILLUSTRATIVE_UPCOMING_TASKS,
  getRecentActivity: () => ILLUSTRATIVE_RECENT_ACTIVITY,
  getAnalyses: () => ILLUSTRATIVE_ANALYSES,
  getProspects: () => ILLUSTRATIVE_PROSPECTS,
  getCampaigns: () => ILLUSTRATIVE_CAMPAIGNS,
  getWorkspaceProjects: () => ILLUSTRATIVE_WORKSPACE_PROJECTS,
  getOffers: () => ILLUSTRATIVE_OFFERS,
  getIcps: () => ILLUSTRATIVE_ICPS,
  getWorkspaceResources: () => ILLUSTRATIVE_WORKSPACE_RESOURCES,
  getFunnelStages: () => ILLUSTRATIVE_FUNNEL_STAGES,
  getSavedReports: () => ILLUSTRATIVE_SAVED_REPORTS,
  getAiInsights: () => ILLUSTRATIVE_AI_INSIGHTS,
  getAgents: () => ILLUSTRATIVE_AGENTS,
  getAgentExecutions: () => ILLUSTRATIVE_AGENT_EXECUTIONS,
  getMembers: () => ILLUSTRATIVE_MEMBERS,
  getAuditLogs: () => ILLUSTRATIVE_AUDIT_LOGS,
};
