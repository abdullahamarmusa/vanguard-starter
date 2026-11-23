import type {
  AuditLogEntry,
  NotificationItem,
  Organization,
  OrgMember,
  UserProfile,
} from '@/types/vanguard';

export const ILLUSTRATIVE_USER: UserProfile = {
  id: 'usr_abdullah_01',
  name: 'Abdullah Amar Musa',
  firstName: 'Abdullah',
  email: 'abdullah@acmecorp.example',
  role: 'Owner',
  initials: 'A',
};

export const ILLUSTRATIVE_ORGANIZATIONS: Organization[] = [
  {
    id: 'org_acme',
    name: 'Acme Corp',
    slug: 'acme-corp',
    plan: 'Pro',
    role: 'Owner',
  },
  {
    id: 'org_northstar',
    name: 'Northstar Studio',
    slug: 'northstar-studio',
    plan: 'Starter',
    role: 'Owner',
  },
  {
    id: 'org_fresh',
    name: 'Fresh Workspace (Empty State)',
    slug: 'fresh-workspace',
    plan: 'Starter',
    role: 'Owner',
    isEmptyDemo: true,
  },
];

export const ILLUSTRATIVE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Offer analysis ready for review',
    description:
      'Illustrative analysis for https://www.example.com reached 92.4% avg. match across 86 companies.',
    timestamp: '2m ago',
    read: false,
    type: 'analysis',
    href: '/analyze/anl_example_01/results',
  },
  {
    id: 'notif_2',
    title: 'Outreach drafts awaiting approval',
    description:
      '3 personalized drafts in Q4 SaaS Outreach require human review before any external send.',
    timestamp: '14m ago',
    read: false,
    type: 'campaign',
    href: '/campaigns',
  },
  {
    id: 'notif_3',
    title: 'Market Research Agent completed',
    description:
      'Identified 47 high-fit enterprise companies with verified cloud modernization signals.',
    timestamp: '38m ago',
    read: false,
    type: 'agent',
    href: '/agents',
  },
  {
    id: 'notif_4',
    title: 'Q4 SaaS Market Analysis exported',
    description: 'Saved report added to Reports library.',
    timestamp: '2h ago',
    read: true,
    type: 'prospect',
    href: '/reports',
  },
];

export const ILLUSTRATIVE_MEMBERS: OrgMember[] = [
  {
    id: 'mem_1',
    name: 'Abdullah Amar Musa',
    email: 'abdullah@acmecorp.example',
    role: 'Owner',
    status: 'Active',
    lastActive: 'Online now',
  },
  {
    id: 'mem_2',
    name: 'Nadia Rahman',
    email: 'nadia@acmecorp.example',
    role: 'Admin',
    status: 'Active',
    lastActive: '18m ago',
  },
  {
    id: 'mem_3',
    name: 'Daniel Chen',
    email: 'daniel@acmecorp.example',
    role: 'Analyst',
    status: 'Active',
    lastActive: '2h ago',
  },
  {
    id: 'mem_4',
    name: 'Sofia Alvarez',
    email: 'sofia@acmecorp.example',
    role: 'Viewer',
    status: 'Invited',
    lastActive: 'Pending invite',
  },
];

export const ILLUSTRATIVE_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_1',
    actor: 'Abdullah Amar Musa',
    action: 'analysis.job.created',
    resource: 'anl_example_01 (https://www.example.com)',
    timestamp: 'Today, 14:22',
    status: 'Allowed',
    ip: '103.112.44.18',
  },
  {
    id: 'aud_2',
    actor: 'Abdullah Amar Musa',
    action: 'campaign.draft.approved',
    resource: 'Q4 SaaS Outreach · Draft #104',
    timestamp: 'Today, 13:51',
    status: 'Approved',
    ip: '103.112.44.18',
  },
  {
    id: 'aud_3',
    actor: 'Nadia Rahman',
    action: 'prospect.list.exported',
    resource: 'Qualified Enterprise Prospects (CSV)',
    timestamp: 'Today, 11:19',
    status: 'Allowed',
    ip: '103.112.44.22',
  },
  {
    id: 'aud_4',
    actor: 'Daniel Chen',
    action: 'agent.execution.started',
    resource: 'Market Research Agent',
    timestamp: 'Yesterday, 18:05',
    status: 'Allowed',
    ip: '103.112.44.31',
  },
  {
    id: 'aud_5',
    actor: 'Sofia Alvarez',
    action: 'billing.plan.update',
    resource: 'Organization Billing Settings',
    timestamp: 'Yesterday, 16:40',
    status: 'Denied',
    ip: '198.51.100.14',
  },
];
