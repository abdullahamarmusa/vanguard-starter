'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { mockVanguardAdapter } from '@/lib/data-access/mock-adapter';
import { detectAnalyzeInputType, extractDomainOrLabel } from '@/lib/utils';
import type {
  AnalyzeSubmissionInput,
  CreateCampaignInput,
} from '@/lib/validation';
import type {
  ActivityEvent,
  AgentCategory,
  AgentDefinition,
  AgentExecution,
  AnalysisJob,
  CampaignItem,
  CampaignStatus,
  NotificationItem,
  OfferDefinition,
  Organization,
  OutreachDraft,
  ProspectCompany,
  TaskItem,
  UserProfile,
  WorkspaceProject,
} from '@/types/vanguard';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'warning' | 'info';
}

interface PrototypeContextValue {
  user: UserProfile;
  organizations: Organization[];
  activeOrg: Organization;
  setActiveOrgById: (orgId: string) => void;
  isEmptyWorkspace: boolean;
  toggleEmptyWorkspace: () => void;

  theme: 'dark' | 'light';
  toggleTheme: () => void;

  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  plansModalOpen: boolean;
  setPlansModalOpen: (v: boolean) => void;

  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;

  tasks: TaskItem[];
  toggleTaskCompleted: (id: string) => void;
  addTask: (title: string, priority: TaskItem['priority']) => void;

  recentActivity: ActivityEvent[];

  analyses: AnalysisJob[];
  createAnalysisJob: (input: AnalyzeSubmissionInput) => AnalysisJob;
  updateAnalysisConfig: (
    analysisId: string,
    updates: {
      offerDescription?: string;
      objective?: string;
      icpPreferences?: AnalysisJob['icpPreferences'];
    },
  ) => void;
  advanceAnalysisStage: (analysisId: string) => void;
  cancelAnalysisJob: (analysisId: string) => void;
  restartAnalysisJob: (analysisId: string) => void;

  prospects: ProspectCompany[];
  toggleSaveProspect: (prospectId: string) => void;
  bulkSaveProspects: (prospectIds: string[]) => void;
  markProspectReviewed: (prospectId: string) => void;
  excludeProspect: (prospectId: string) => void;

  campaigns: CampaignItem[];
  createCampaign: (input: CreateCampaignInput) => CampaignItem;
  updateCampaignStatus: (campaignId: string, status: CampaignStatus) => void;
  duplicateCampaign: (campaignId: string) => CampaignItem | null;
  enrollProspectsInCampaign: (
    campaignId: string,
    prospectIds: string[],
  ) => void;
  updateDraftApproval: (
    campaignId: string,
    draftId: string,
    status: OutreachDraft['approvalStatus'],
  ) => void;
  updateCampaignSettings: (
    campaignId: string,
    updates: Partial<
      Pick<
        CampaignItem,
        'name' | 'audienceSummary' | 'description' | 'requireHumanApproval'
      >
    >,
  ) => void;

  projects: WorkspaceProject[];
  addWorkspaceProject: (name: string, description: string) => WorkspaceProject;

  offers: OfferDefinition[];
  addOffer: (
    offer: Omit<OfferDefinition, 'id' | 'linkedAnalysesCount' | 'updatedAt'>,
  ) => void;

  agents: AgentDefinition[];
  agentExecutions: AgentExecution[];
  creditsRemaining: number;
  runAgentSimulation: (
    agentId: string,
    prompt: string,
  ) => AgentExecution | null;
  createCustomAgent: (payload: {
    name: string;
    category: AgentCategory;
    description: string;
    requiresApproval: boolean;
  }) => AgentDefinition;

  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const PrototypeContext = createContext<PrototypeContextValue | null>(null);

const STORAGE_KEY_ANALYSES = 'vanguard_proto_analyses_v1';
const STORAGE_KEY_THEME = 'vanguard_proto_theme_v1';

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const user = useMemo(() => mockVanguardAdapter.getCurrentUser(), []);
  const organizations = useMemo(
    () => mockVanguardAdapter.getOrganizations(),
    [],
  );

  const [activeOrgId, setActiveOrgId] = useState<string>(organizations[0].id);
  const [manualEmptyMode, setManualEmptyMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [plansModalOpen, setPlansModalOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    mockVanguardAdapter.getNotifications(),
  );
  const [tasks, setTasks] = useState<TaskItem[]>(() =>
    mockVanguardAdapter.getUpcomingTasks(),
  );
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>(() =>
    mockVanguardAdapter.getRecentActivity(),
  );
  const [analyses, setAnalyses] = useState<AnalysisJob[]>(() =>
    mockVanguardAdapter.getAnalyses(),
  );
  const [prospects, setProspects] = useState<ProspectCompany[]>(() =>
    mockVanguardAdapter.getProspects(),
  );
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(() =>
    mockVanguardAdapter.getCampaigns(),
  );
  const [projects, setProjects] = useState<WorkspaceProject[]>(() =>
    mockVanguardAdapter.getWorkspaceProjects(),
  );
  const [offers, setOffers] = useState<OfferDefinition[]>(() =>
    mockVanguardAdapter.getOffers(),
  );
  const [agents, setAgents] = useState<AgentDefinition[]>(() =>
    mockVanguardAdapter.getAgents(),
  );
  const [agentExecutions, setAgentExecutions] = useState<AgentExecution[]>(() =>
    mockVanguardAdapter.getAgentExecutions(),
  );
  const [creditsRemaining, setCreditsRemaining] = useState<number>(2840);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const activeOrg = useMemo(
    () => organizations.find((o) => o.id === activeOrgId) ?? organizations[0],
    [organizations, activeOrgId],
  );

  const isEmptyWorkspace = Boolean(activeOrg.isEmptyDemo || manualEmptyMode);

  /* Restore persisted theme & prototype analyses on mount */
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(STORAGE_KEY_THEME);
      const savedAnalyses = window.sessionStorage.getItem(STORAGE_KEY_ANALYSES);
      requestAnimationFrame(() => {
        if (savedTheme === 'light' || savedTheme === 'dark')
          setTheme(savedTheme);
        if (savedAnalyses) {
          const parsed = JSON.parse(savedAnalyses) as AnalysisJob[];
          if (Array.isArray(parsed) && parsed.length > 0) setAnalyses(parsed);
        }
      });
    } catch {
      // ignore storage errors in restricted environments
    }
  }, []);

  /* Sync theme class on <html> */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  /* Persist prototype analyses in sessionStorage so refresh restores analysis progress */
  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY_ANALYSES,
        JSON.stringify(analyses),
      );
    } catch {
      // ignore
    }
  }, [analyses]);

  /* Global Cmd+K / Ctrl+K shortcut for Command Palette */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const pushToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setActiveOrgById = useCallback(
    (orgId: string) => {
      setActiveOrgId(orgId);
      const found = organizations.find((o) => o.id === orgId);
      if (found) {
        setManualEmptyMode(Boolean(found.isEmptyDemo));
        pushToast({
          title: `Switched workspace to ${found.name}`,
          description: found.isEmptyDemo
            ? 'Previewing first-time onboarding empty states.'
            : 'Showing illustrative preview data for this organization.',
          variant: 'info',
        });
      }
    },
    [organizations, pushToast],
  );

  const toggleEmptyWorkspace = useCallback(() => {
    setManualEmptyMode((prev) => {
      const next = !prev;
      pushToast({
        title: next
          ? 'Empty State Preview Enabled'
          : 'Illustrative Preview Data Restored',
        description: next
          ? 'Inspecting first-time user onboarding states across screens.'
          : 'Showing illustrative Acme Corp prototype data.',
        variant: 'info',
      });
      return next;
    });
  }, [pushToast]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const toggleTaskCompleted = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const addTask = useCallback(
    (title: string, priority: TaskItem['priority']) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      const newTask: TaskItem = {
        id: `task_${Date.now()}`,
        title: trimmed,
        resourceLabel: 'Workspace Task',
        href: '/workspace',
        dueLabel: 'Due Soon',
        priority,
        completed: false,
      };
      setTasks((prev) => [newTask, ...prev]);
      pushToast({
        title: 'Task added',
        description: trimmed,
        variant: 'success',
      });
    },
    [pushToast],
  );

  const createAnalysisJob = useCallback(
    (input: AnalyzeSubmissionInput): AnalysisJob => {
      const id = `anl_${Date.now().toString(36)}`;
      const inputType = detectAnalyzeInputType(input.inputValue);
      const sourceDomain = extractDomainOrLabel(input.inputValue, 44);
      const shortTitle =
        inputType === 'url'
          ? 'Website Analysis'
          : inputType === 'offer'
            ? 'Offer Analysis'
            : 'Idea Analysis';
      const code = `AN-${String(analyses.length + 1).padStart(4, '0')}`;
      const nowTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const newJob: AnalysisJob = {
        id,
        code,
        shortTitle,
        sourceDomain,
        organizationId: activeOrg.id,
        inputValue: input.inputValue,
        inputType,
        offerDescription: input.offerDescription,
        objective: input.objective || 'Discover & qualify ideal B2B buyers',
        icpPreferences: {
          targetIndustry: input.targetIndustry || 'Technology & B2B SaaS',
          targetRegion: input.targetRegion || 'North America & Europe',
          companySize: input.companySize || '100–10,000+ employees',
          targetJobTitles:
            input.targetJobTitles || 'VP of Engineering, CTO, Head of Product',
          maxCompanies: input.maxCompanies ?? 100,
          additionalInstructions: input.additionalInstructions,
        },
        status: 'running',
        createdAt: 'Just now',
        estimatedRemaining: 'Stage 1 of 4 active (illustrative)',
        companiesAnalyzed: 214,
        matchesFound: 18,
        avgMatchScore: 88.6,
        estimatedPipelineRange: '$1.2M – $2.4M',
        offerSummary: {
          headline: `Offer Intelligence: ${sourceDomain}`,
          valueProposition:
            input.offerDescription ||
            `Illustrative value proposition extracted from "${sourceDomain}" targeting B2B decision-makers seeking measurable operational efficiency.`,
          targetBuyers: (
            input.targetJobTitles ||
            'VP of Engineering, Head of Product, Director of RevOps'
          )
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          coreCapabilities: [
            'Automated discovery & ICP alignment',
            'Explainable qualification scoring',
            'Evidence-backed executive outreach',
          ],
        },
        icpSummary: {
          industries: [
            input.targetIndustry || 'Technology',
            'Enterprise SaaS',
            'Finance',
          ],
          companySize: input.companySize || '100 – 10,000+ employees',
          geography: input.targetRegion || 'North America & Western Europe',
          buyingSignals: [
            'Active modernization or hiring initiatives',
            'Public ecosystem / API expansion',
            'Clear budget ownership for specialized partners',
          ],
        },
        keyInsights: [
          `Initial screening indicates healthy B2B demand aligned with "${sourceDomain}"`,
          'Top matched accounts exhibit verifiable technical and partner-hiring signals',
          'Recommend reviewing qualification evidence before enrolling in outreach campaigns',
        ],
        pipelineTrend: [
          { step: 'Stage 1', value: 0.4 },
          { step: 'Stage 2', value: 0.9 },
          { step: 'Stage 3', value: 1.5 },
          { step: 'Stage 4', value: 2.0 },
          { step: 'Stage 5', value: 2.4 },
        ],
        stages: [
          {
            id: 'st_1',
            stepNumber: 1,
            title: 'Understand Offer',
            shortTitle: 'Understand Offer',
            description: `Normalizing submitted ${inputType.toUpperCase()} and extracting offer positioning.`,
            status: 'running',
            startedAt: nowTime,
            substeps: [
              {
                id: 'n1_a',
                label: 'Source input received',
                status: 'completed',
              },
              {
                id: 'n1_b',
                label: 'Offer context normalized',
                status: 'completed',
              },
              {
                id: 'n1_c',
                label: 'Identifying target customer profile',
                status: 'running',
              },
              { id: 'n1_d', label: 'ICP rubric completed', status: 'pending' },
            ],
          },
          {
            id: 'st_2',
            stepNumber: 2,
            title: 'Research Companies',
            shortTitle: 'Research Companies',
            description:
              'Discover potential target companies matching firmographic & hiring signals.',
            status: 'pending',
            substeps: [
              {
                id: 'n2_a',
                label: 'Query authorized company enrichment index',
                status: 'pending',
              },
              {
                id: 'n2_b',
                label: 'Correlate public hiring & roadmap signals',
                status: 'pending',
              },
              {
                id: 'n2_c',
                label: 'Deduplicate candidate accounts',
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
                id: 'n3_a',
                label: 'Compute weighted fit-factor scores',
                status: 'pending',
              },
              {
                id: 'n3_b',
                label: 'Verify filings & attach source URLs',
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
              'Prepare qualification results, confidence notes, and recommended next actions.',
            status: 'pending',
            substeps: [
              {
                id: 'n4_a',
                label: 'Compile qualification distribution',
                status: 'pending',
              },
              {
                id: 'n4_b',
                label: 'Publish explainable qualification report',
                status: 'pending',
              },
            ],
          },
        ],
        events: [
          {
            id: `ev_${Date.now()}_1`,
            sequence: 1,
            stageId: 'st_1',
            message: `Analysis #${code} created for ${sourceDomain} (illustrative simulation).`,
            timestamp: nowTime,
            kind: 'info',
          },
        ],
        matchedCompanyIds: [
          'prsp_microsoft',
          'prsp_google',
          'prsp_adobe',
          'prsp_stripe',
          'prsp_atlassian',
          'prsp_veeva',
        ],
        isIllustrativeSimulation: true,
      };

      setAnalyses((prev) => [newJob, ...prev]);
      setRecentActivity((prev) => [
        {
          id: `act_${Date.now()}`,
          title: `Started ${shortTitle} (${sourceDomain})`,
          detail: `Analysis #${code} · Illustrative workflow initialized.`,
          timestamp: 'Just now',
          category: 'analysis',
          href: `/analyze/${id}`,
        },
        ...prev,
      ]);
      pushToast({
        title: `Analysis #${code} started`,
        description: `Opening dedicated analysis workspace for ${sourceDomain}.`,
        variant: 'success',
      });

      return newJob;
    },
    [activeOrg.id, analyses.length, pushToast],
  );

  const updateAnalysisConfig = useCallback(
    (
      analysisId: string,
      updates: {
        offerDescription?: string;
        objective?: string;
        icpPreferences?: AnalysisJob['icpPreferences'];
      },
    ) => {
      const nowTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setAnalyses((prev) =>
        prev.map((job) => {
          if (job.id !== analysisId) return job;
          return {
            ...job,
            offerDescription: updates.offerDescription ?? job.offerDescription,
            objective: updates.objective ?? job.objective,
            icpPreferences: {
              ...job.icpPreferences,
              ...updates.icpPreferences,
            },
            events: [
              ...job.events,
              {
                id: `ev_cfg_${Date.now()}`,
                sequence: job.events.length + 1,
                stageId: 'config',
                message: 'Analysis configuration updated by operator.',
                timestamp: nowTime,
                kind: 'info',
              },
            ],
          };
        }),
      );
      pushToast({
        title: 'Analysis configuration saved',
        description: 'Updated ICP filters and target parameters.',
        variant: 'success',
      });
    },
    [pushToast],
  );

  const advanceAnalysisStage = useCallback((analysisId: string) => {
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setAnalyses((prev) =>
      prev.map((job) => {
        if (job.id !== analysisId || job.status !== 'running') return job;

        const runningIdx = job.stages.findIndex((s) => s.status === 'running');
        if (runningIdx === -1) return job;

        const nextStages = job.stages.map((stage, idx) => {
          if (idx === runningIdx) {
            return {
              ...stage,
              status: 'completed' as const,
              completedAt: nowTime,
              substeps: stage.substeps?.map((sub) => ({
                ...sub,
                status: 'completed' as const,
              })),
              finding:
                stage.finding ??
                (idx === 0
                  ? `Extracted value proposition and target buyer personas for "${job.sourceDomain}".`
                  : idx === 1
                    ? 'Screened 1,180 candidate organizations; 74 matched ICP firmographics.'
                    : idx === 2
                      ? 'Corroborated verified filings and hiring signals across top matched accounts.'
                      : 'Compiled final explainable qualification report with verification tags.'),
            };
          }
          if (idx === runningIdx + 1) {
            return {
              ...stage,
              status: 'running' as const,
              startedAt: nowTime,
              substeps: stage.substeps?.map((sub, sIdx) => ({
                ...sub,
                status:
                  sIdx === 0
                    ? ('completed' as const)
                    : sIdx === 1
                      ? ('running' as const)
                      : ('pending' as const),
              })),
            };
          }
          return stage;
        });

        const isFinished = runningIdx === job.stages.length - 1;
        const nextCompaniesAnalyzed = Math.min(
          1480,
          job.companiesAnalyzed + 312,
        );
        const nextMatchesFound = Math.min(94, job.matchesFound + 22);
        const nextAvgScore = Number(
          Math.min(93.8, job.avgMatchScore + 1.1).toFixed(1),
        );

        const stageMessages = [
          'Offer positioning & target buyer roles structured.',
          `Market screening progressed to ${nextCompaniesAnalyzed.toLocaleString()} organizations.`,
          `Fit scoring complete for ${nextMatchesFound} candidate matches with source evidence.`,
          'Qualification report ready for full inspection.',
        ];

        const nextEvent = {
          id: `ev_${Date.now()}_${runningIdx}`,
          sequence: job.events.length + 1,
          stageId: job.stages[runningIdx].id,
          message: stageMessages[runningIdx] ?? 'Stage completed.',
          timestamp: nowTime,
          kind: isFinished ? ('success' as const) : ('discovery' as const),
        };

        return {
          ...job,
          status: isFinished ? 'completed' : 'running',
          estimatedRemaining: isFinished
            ? 'Completed'
            : `Stage ${Math.min(job.stages.length, runningIdx + 2)} of ${job.stages.length} active (illustrative)`,
          companiesAnalyzed: nextCompaniesAnalyzed,
          matchesFound: nextMatchesFound,
          avgMatchScore: nextAvgScore,
          stages: nextStages,
          events: [...job.events, nextEvent],
        };
      }),
    );
  }, []);

  const cancelAnalysisJob = useCallback(
    (analysisId: string) => {
      const nowTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setAnalyses((prev) =>
        prev.map((job) => {
          if (job.id !== analysisId) return job;
          return {
            ...job,
            status: 'cancelled',
            estimatedRemaining: 'Cancelled by user',
            stages: job.stages.map((s) =>
              s.status === 'running' ? { ...s, status: 'skipped' } : s,
            ),
            events: [
              ...job.events,
              {
                id: `ev_cancel_${Date.now()}`,
                sequence: job.events.length + 1,
                stageId: 'cancelled',
                message:
                  'Analysis cancelled by operator. Partial findings preserved.',
                timestamp: nowTime,
                kind: 'warning',
              },
            ],
          };
        }),
      );
      pushToast({
        title: 'Analysis cancelled',
        description:
          'Partial findings remain available for inspection or restart.',
        variant: 'warning',
      });
    },
    [pushToast],
  );

  const restartAnalysisJob = useCallback(
    (analysisId: string) => {
      const nowTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setAnalyses((prev) =>
        prev.map((job) => {
          if (job.id !== analysisId) return job;
          return {
            ...job,
            status: 'running',
            estimatedRemaining: '~ 2 min remaining (simulated)',
            companiesAnalyzed: 184,
            matchesFound: 14,
            stages: job.stages.map((s, idx) => ({
              ...s,
              status: idx === 0 ? 'running' : 'pending',
              startedAt: idx === 0 ? nowTime : undefined,
              completedAt: undefined,
              substeps: s.substeps?.map((sub, sIdx) => ({
                ...sub,
                status:
                  idx === 0
                    ? sIdx === 0
                      ? 'completed'
                      : sIdx === 1
                        ? 'running'
                        : 'pending'
                    : 'pending',
              })),
            })),
            events: [
              {
                id: `ev_restart_${Date.now()}`,
                sequence: 1,
                stageId: 'st_1',
                message: 'Prototype simulation restarted from Stage 1.',
                timestamp: nowTime,
                kind: 'info',
              },
            ],
          };
        }),
      );
      pushToast({
        title: 'Analysis restarted',
        description: 'Stepping through illustrative stages from the beginning.',
        variant: 'info',
      });
    },
    [pushToast],
  );

  const toggleSaveProspect = useCallback(
    (prospectId: string) => {
      setProspects((prev) =>
        prev.map((p) => {
          if (p.id !== prospectId) return p;
          const nextSaved = !p.saved;
          pushToast({
            title: nextSaved
              ? `Saved ${p.name}`
              : `Removed ${p.name} from saved`,
            description: nextSaved
              ? 'Available in your Workspace saved prospects list.'
              : undefined,
            variant: nextSaved ? 'success' : 'info',
          });
          return { ...p, saved: nextSaved };
        }),
      );
    },
    [pushToast],
  );

  const bulkSaveProspects = useCallback(
    (prospectIds: string[]) => {
      if (prospectIds.length === 0) return;
      const setIds = new Set(prospectIds);
      setProspects((prev) =>
        prev.map((p) => (setIds.has(p.id) ? { ...p, saved: true } : p)),
      );
      pushToast({
        title: `Saved ${prospectIds.length} prospect${prospectIds.length > 1 ? 's' : ''}`,
        variant: 'success',
      });
    },
    [pushToast],
  );

  const markProspectReviewed = useCallback(
    (prospectId: string) => {
      setProspects((prev) =>
        prev.map((p) => {
          if (p.id !== prospectId) return p;
          const next = !p.reviewed;
          pushToast({
            title: next
              ? `Marked ${p.name} as reviewed`
              : `Moved ${p.name} back to review`,
            variant: 'info',
          });
          return {
            ...p,
            reviewed: next,
            status: next ? 'Qualified' : 'In Review',
          };
        }),
      );
    },
    [pushToast],
  );

  const excludeProspect = useCallback(
    (prospectId: string) => {
      setProspects((prev) =>
        prev.map((p) => {
          if (p.id !== prospectId) return p;
          pushToast({
            title: `Excluded ${p.name} from future results`,
            description:
              'You can restore excluded accounts from Prospect filters.',
            variant: 'warning',
          });
          return { ...p, excluded: true, status: 'Archived' };
        }),
      );
    },
    [pushToast],
  );

  const createCampaign = useCallback(
    (input: CreateCampaignInput): CampaignItem => {
      const newCampaign: CampaignItem = {
        id: `cmp_${Date.now().toString(36)}`,
        name: input.name,
        subtitle: input.audienceSummary,
        description: input.description,
        audienceSummary: input.audienceSummary,
        offerName: input.offerName,
        status: 'Draft',
        accentColor: '#F59E0B',
        sent: 0,
        opened: 0,
        clicked: 0,
        replies: 0,
        replyRate: 0,
        qualifiedLeads: 0,
        requireHumanApproval: input.requireHumanApproval,
        performanceSeries: [
          { date: 'Day 1', sent: 0, opened: 0, clicked: 0, qualified: 0 },
          { date: 'Day 7', sent: 0, opened: 0, clicked: 0, qualified: 0 },
        ],
        workflow: [
          { id: 'wf_1', label: 'Target Audience', status: 'completed' },
          { id: 'wf_2', label: 'Find Companies', status: 'active' },
          { id: 'wf_3', label: 'Approve & Send', status: 'pending' },
          { id: 'wf_4', label: 'Track Responses', status: 'pending' },
          { id: 'wf_5', label: 'Get Leads', status: 'pending' },
        ],
        recentActivity: [
          {
            id: `ca_new_${Date.now()}`,
            text: 'Campaign draft created with human-approval safeguard enabled',
            timestamp: 'Just now',
            tone: 'orange',
          },
        ],
        drafts: [],
        enrolledProspectIds: [],
      };
      setCampaigns((prev) => [newCampaign, ...prev]);
      setRecentActivity((prev) => [
        {
          id: `act_cmp_${Date.now()}`,
          title: `New campaign created "${input.name}"`,
          detail: 'Status: Draft · Human approval required prior to send.',
          timestamp: 'Just now',
          category: 'campaign',
          href: '/campaigns',
        },
        ...prev,
      ]);
      pushToast({
        title: `Campaign "${input.name}" created`,
        description:
          'Saved as Draft. Add prospects and approve outreach drafts before launching.',
        variant: 'success',
      });
      return newCampaign;
    },
    [pushToast],
  );

  const updateCampaignStatus = useCallback(
    (campaignId: string, status: CampaignStatus) => {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, status } : c)),
      );
      pushToast({
        title: `Campaign marked as ${status}`,
        variant: 'info',
      });
    },
    [pushToast],
  );

  const duplicateCampaign = useCallback(
    (campaignId: string): CampaignItem | null => {
      const target = campaigns.find((c) => c.id === campaignId);
      if (!target) return null;
      const copy: CampaignItem = {
        ...target,
        id: `cmp_copy_${Date.now().toString(36)}`,
        name: `${target.name} (Copy)`,
        status: 'Draft',
        sent: 0,
        opened: 0,
        clicked: 0,
        replies: 0,
        replyRate: 0,
        qualifiedLeads: 0,
      };
      setCampaigns((prev) => [copy, ...prev]);
      pushToast({
        title: `Duplicated "${target.name}"`,
        description: 'Created as Draft with clean metrics.',
        variant: 'success',
      });
      return copy;
    },
    [campaigns, pushToast],
  );

  const enrollProspectsInCampaign = useCallback(
    (campaignId: string, prospectIds: string[]) => {
      const targetCampaign = campaigns.find((c) => c.id === campaignId);
      if (!targetCampaign) return;

      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id !== campaignId) return c;
          const mergedIds = Array.from(
            new Set([...c.enrolledProspectIds, ...prospectIds]),
          );
          const newDrafts: OutreachDraft[] = prospectIds
            .filter((pid) => !c.drafts.some((d) => d.prospectId === pid))
            .map((pid) => {
              const company = prospects.find((p) => p.id === pid);
              const primaryContact = company?.contacts[0];
              return {
                id: `drf_${Date.now()}_${pid}`,
                prospectId: pid,
                companyName: company?.name ?? 'Company',
                recipientName: primaryContact?.name ?? 'Decision Maker',
                recipientTitle: primaryContact?.title ?? 'Executive Buyer',
                subject: `Tailored intelligence brief for ${company?.name ?? 'your team'}`,
                body: `Hi ${primaryContact?.name.split(' ')[0] ?? 'there'},\n\nFollowing recent ${
                  company?.subIndustry ?? 'market'
                } initiatives at ${
                  company?.name ?? 'your organization'
                }, we prepared a concise breakdown of how our offer aligns with your current roadmap.\n\nWould next week work for a short review?`,
                personalizationNotes: `Generated from verified ${
                  company?.name ?? 'account'
                } profile (${company?.matchScore ?? 85}% ICP match).`,
                approvalStatus: 'Pending Approval',
                updatedAt: 'Just now',
              };
            });

          return {
            ...c,
            enrolledProspectIds: mergedIds,
            drafts: [...newDrafts, ...c.drafts],
            recentActivity: [
              {
                id: `ca_enr_${Date.now()}`,
                text: `Added ${prospectIds.length} prospect(s) — outreach drafts queued for human approval`,
                timestamp: 'Just now',
                tone: 'orange',
              },
              ...c.recentActivity,
            ],
          };
        }),
      );

      pushToast({
        title: `Added to "${targetCampaign.name}"`,
        description: `${prospectIds.length} prospect(s) queued with drafts pending human approval.`,
        variant: 'success',
      });
    },
    [campaigns, prospects, pushToast],
  );

  const updateDraftApproval = useCallback(
    (
      campaignId: string,
      draftId: string,
      status: OutreachDraft['approvalStatus'],
    ) => {
      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id !== campaignId) return c;
          return {
            ...c,
            drafts: c.drafts.map((d) =>
              d.id === draftId
                ? { ...d, approvalStatus: status, updatedAt: 'Just now' }
                : d,
            ),
          };
        }),
      );
      pushToast({
        title:
          status === 'Approved'
            ? 'Outreach draft approved'
            : 'Revision requested',
        description:
          status === 'Approved'
            ? 'Human approval logged. In production, dispatch runs via your authorized provider.'
            : 'Draft returned for copy refinement.',
        variant: status === 'Approved' ? 'success' : 'warning',
      });
    },
    [pushToast],
  );

  const updateCampaignSettings = useCallback(
    (
      campaignId: string,
      updates: Partial<
        Pick<
          CampaignItem,
          'name' | 'audienceSummary' | 'description' | 'requireHumanApproval'
        >
      >,
    ) => {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, ...updates } : c)),
      );
      pushToast({ title: 'Campaign settings saved', variant: 'success' });
    },
    [pushToast],
  );

  const addWorkspaceProject = useCallback(
    (name: string, description: string): WorkspaceProject => {
      const project: WorkspaceProject = {
        id: `prj_${Date.now().toString(36)}`,
        name: name.trim(),
        description: description.trim(),
        status: 'In Progress',
        updatedLabel: 'Just now',
        iconBg: '#F59E0B',
        currentStepIndex: 1,
      };
      setProjects((prev) => [project, ...prev]);
      pushToast({
        title: `Project "${project.name}" created`,
        variant: 'success',
      });
      return project;
    },
    [pushToast],
  );

  const addOffer = useCallback(
    (
      offer: Omit<OfferDefinition, 'id' | 'linkedAnalysesCount' | 'updatedAt'>,
    ) => {
      const newOffer: OfferDefinition = {
        ...offer,
        id: `off_${Date.now().toString(36)}`,
        linkedAnalysesCount: 0,
        updatedAt: 'Just now',
      };
      setOffers((prev) => [newOffer, ...prev]);
      pushToast({ title: `Offer "${offer.name}" saved`, variant: 'success' });
    },
    [pushToast],
  );

  const runAgentSimulation = useCallback(
    (agentId: string, prompt: string): AgentExecution | null => {
      const agent = agents.find((a) => a.id === agentId);
      if (!agent) return null;

      const exec: AgentExecution = {
        id: `exec_${Date.now().toString(36)}`,
        agentId: agent.id,
        agentName: agent.name,
        status: agent.requiresApproval ? 'Awaiting Approval' : 'Completed',
        summary: agent.requiresApproval
          ? `Prepared draft outputs for "${prompt.slice(0, 60)}" (approval gate active)`
          : `Completed illustrative run for "${prompt.slice(0, 64)}"`,
        timestamp: 'Just now',
        accent: agent.accent,
        inputPrompt: prompt,
        evidenceSources: [
          'Workspace Offer & ICP Definitions (Verified)',
          'Illustrative Enrichment Dataset (Prototype)',
        ],
        findings: [
          `Evaluated objective: ${prompt}`,
          agent.requiresApproval
            ? 'External actions paused pending explicit human review.'
            : 'Structured intelligence summary saved to execution history.',
        ],
        creditsUsed: 25,
      };

      setAgentExecutions((prev) => [exec, ...prev]);
      setCreditsRemaining((prev) => Math.max(0, prev - 25));
      pushToast({
        title: `${agent.name} executed (Prototype)`,
        description: agent.requiresApproval
          ? 'Output queued for human approval.'
          : 'Inspect findings in Agent Activity below.',
        variant: 'success',
      });
      return exec;
    },
    [agents, pushToast],
  );

  const createCustomAgent = useCallback(
    (payload: {
      name: string;
      category: AgentCategory;
      description: string;
      requiresApproval: boolean;
    }): AgentDefinition => {
      const newAgent: AgentDefinition = {
        id: `ag_custom_${Date.now().toString(36)}`,
        name: payload.name,
        category: payload.category,
        description: payload.description,
        tags: [payload.category, 'Custom', 'Workspace'],
        estimatedDuration: '1–3 min',
        active: true,
        accent: 'orange',
        requiresApproval: payload.requiresApproval,
        defaultPromptHint: `Run ${payload.name} against active organization offers and ICPs.`,
        capabilities: [
          'Uses shared VANGUARD agent execution framework',
          'Organization-scoped permissions & audit logging',
          payload.requiresApproval
            ? 'Mandatory human approval before external actions'
            : 'Read-only intelligence synthesis',
        ],
      };
      setAgents((prev) => [newAgent, ...prev]);
      pushToast({
        title: `Custom agent "${payload.name}" added`,
        description: 'Configured on the shared agent framework.',
        variant: 'success',
      });
      return newAgent;
    },
    [pushToast],
  );

  const unreadNotificationCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const value: PrototypeContextValue = {
    user,
    organizations,
    activeOrg,
    setActiveOrgById,
    isEmptyWorkspace,
    toggleEmptyWorkspace,
    theme,
    toggleTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileNavOpen,
    setMobileNavOpen,
    commandOpen,
    setCommandOpen,
    notificationsOpen,
    setNotificationsOpen,
    plansModalOpen,
    setPlansModalOpen,
    notifications,
    unreadNotificationCount,
    markAllNotificationsRead,
    markNotificationRead,
    tasks,
    toggleTaskCompleted,
    addTask,
    recentActivity,
    analyses,
    createAnalysisJob,
    updateAnalysisConfig,
    advanceAnalysisStage,
    cancelAnalysisJob,
    restartAnalysisJob,
    prospects,
    toggleSaveProspect,
    bulkSaveProspects,
    markProspectReviewed,
    excludeProspect,
    campaigns,
    createCampaign,
    updateCampaignStatus,
    duplicateCampaign,
    enrollProspectsInCampaign,
    updateDraftApproval,
    updateCampaignSettings,
    projects,
    addWorkspaceProject,
    offers,
    addOffer,
    agents,
    agentExecutions,
    creditsRemaining,
    runAgentSimulation,
    createCustomAgent,
    toasts,
    pushToast,
    dismissToast,
  };

  return (
    <PrototypeContext.Provider value={value}>
      {children}
    </PrototypeContext.Provider>
  );
}

export function usePrototypeStore() {
  const ctx = useContext(PrototypeContext);
  if (!ctx) {
    throw new Error('usePrototypeStore must be used inside PrototypeProvider');
  }
  return ctx;
}
