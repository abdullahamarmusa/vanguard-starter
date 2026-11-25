import { randomUUID } from 'node:crypto';
import { sql } from 'drizzle-orm';
import {
  AnyPgColumn,
  char,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

const organizationRole = pgEnum('organization_role', [
  'owner',
  'admin',
  'member',
  'analyst',
]);

const offerStatus = pgEnum('offer_status', ['draft', 'ready', 'archived']);

const qualificationStatus = pgEnum('qualification_status', [
  'pending',
  'running',
  'completed',
  'failed',
]);

const evidenceSourceKind = pgEnum('evidence_source_kind', [
  'licensed_api',
  'customer_provided',
  'public_record',
]);

const suppressionSource = pgEnum('suppression_source', [
  'unsubscribe',
  'manual',
  'provider_feedback',
]);

function tenantPolicy(name: string, organizationId: AnyPgColumn) {
  return pgPolicy(name, {
    for: 'all',
    to: 'public',
    using: sql`${organizationId}::text = current_setting('vanguard.organization_id', true) and public.vanguard_is_org_member(${organizationId})`,
    withCheck: sql`${organizationId}::text = current_setting('vanguard.organization_id', true) and public.vanguard_is_org_member(${organizationId})`,
  });
}

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  image: text('image'),
  passwordHash: text('password_hash'),
  jobTitle: text('job_title'),
  onboardingGoals: jsonb('onboarding_goals').$type<string[]>().default([]).notNull(),
});

export const accounts = pgTable(
  'accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (table) => [
    primaryKey({
      columns: [table.provider, table.providerAccountId],
      name: 'accounts_provider_account_pk',
    }),
    index('accounts_user_id_idx').on(table.userId),
  ],
);

export const sessions = pgTable(
  'sessions',
  {
    sessionToken: text('session_token').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (table) => [index('sessions_user_id_idx').on(table.userId)],
);

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.identifier, table.token],
      name: 'verification_tokens_pk',
    }),
    uniqueIndex('verification_tokens_token_key').on(table.token),
  ],
);

export const authTokens = pgTable(
  'auth_tokens',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    purpose: text('purpose').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('auth_tokens_token_hash_key').on(table.tokenHash),
    index('auth_tokens_user_purpose_idx').on(table.userId, table.purpose),
    check('auth_tokens_purpose_check', sql`purpose in ('verify_email', 'reset_password')`),
  ],
);

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    website: text('website'),
    industry: text('industry'),
    companySize: text('company_size'),
    region: text('region'),
    organizationType: text('organization_type'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('organizations_slug_key').on(table.slug),
    pgPolicy('organizations_member_read', {
      for: 'select',
      to: 'public',
      using: sql`exists (
        select 1 from organization_memberships
        where organization_memberships.organization_id = ${table.id}
          and organization_memberships.user_id = current_setting('vanguard.user_id', true)
      )`,
    }),
    pgPolicy('organizations_authenticated_insert', {
      for: 'insert',
      to: 'public',
      withCheck: sql`current_setting('vanguard.user_id', true) <> ''`,
    }),
    pgPolicy('organizations_admin_update', {
      for: 'update',
      to: 'public',
      using: sql`${table.id}::text = current_setting('vanguard.organization_id', true) and exists (select 1 from organization_memberships m where m.organization_id = ${table.id} and m.user_id = current_setting('vanguard.user_id', true) and m.role in ('owner', 'admin'))`,
      withCheck: sql`${table.id}::text = current_setting('vanguard.organization_id', true) and exists (select 1 from organization_memberships m where m.organization_id = ${table.id} and m.user_id = current_setting('vanguard.user_id', true) and m.role in ('owner', 'admin'))`,
    }),
  ],
).enableRLS();

export const organizationMemberships = pgTable(
  'organization_memberships',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: organizationRole('role').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('organization_memberships_org_user_key').on(
      table.organizationId,
      table.userId,
    ),
    index('organization_memberships_user_id_idx').on(table.userId),
    pgPolicy('organization_memberships_self_read', {
      for: 'select',
      to: 'public',
      using: sql`${table.userId} = current_setting('vanguard.user_id', true)`,
    }),
    pgPolicy('organization_memberships_org_read', {
      for: 'select',
      to: 'public',
      using: sql`${table.organizationId}::text = current_setting('vanguard.organization_id', true) and public.vanguard_is_org_member(${table.organizationId})`,
    }),
    pgPolicy('organization_memberships_owner_insert', {
      for: 'insert',
      to: 'public',
      withCheck: sql`${table.userId} = current_setting('vanguard.user_id', true) and ${table.role} = 'owner'`,
    }),
  ],
).enableRLS();

export const workspaces = pgTable(
  'workspaces',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('workspaces_org_id_id_key').on(table.organizationId, table.id),
    uniqueIndex('workspaces_org_slug_key').on(table.organizationId, table.slug),
    pgPolicy('workspaces_member_insert', {
      for: 'insert', to: 'public',
      withCheck: sql`${table.organizationId}::text = current_setting('vanguard.organization_id', true) and exists (select 1 from organization_memberships m where m.organization_id = ${table.organizationId} and m.user_id = current_setting('vanguard.user_id', true) and m.role in ('owner', 'admin'))`,
    }),
    tenantPolicy('workspaces_tenant_isolation', table.organizationId),
  ],
).enableRLS();

export const offers = pgTable(
  'offers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    targetOutcome: text('target_outcome').notNull(),
    priceMinor: integer('price_minor'),
    currency: char('currency', { length: 3 }),
    status: offerStatus('status').default('draft').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: 'offers_workspace_tenant_fk',
      columns: [table.organizationId, table.workspaceId],
      foreignColumns: [workspaces.organizationId, workspaces.id],
    }).onDelete('cascade'),
    uniqueIndex('offers_org_workspace_id_key').on(
      table.organizationId,
      table.workspaceId,
      table.id,
    ),
    index('offers_org_workspace_idx').on(
      table.organizationId,
      table.workspaceId,
    ),
    check(
      'offers_price_currency_check',
      sql`(${table.priceMinor} is null) = (${table.currency} is null) and (${table.priceMinor} is null or ${table.priceMinor} >= 0)`,
    ),
    tenantPolicy('offers_tenant_isolation', table.organizationId),
  ],
).enableRLS();

export const icpProfiles = pgTable(
  'icp_profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id').notNull(),
    name: text('name').notNull(),
    criteria: jsonb('criteria')
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: 'icp_profiles_workspace_tenant_fk',
      columns: [table.organizationId, table.workspaceId],
      foreignColumns: [workspaces.organizationId, workspaces.id],
    }).onDelete('cascade'),
    uniqueIndex('icp_profiles_org_workspace_id_key').on(
      table.organizationId,
      table.workspaceId,
      table.id,
    ),
    tenantPolicy('icp_profiles_tenant_isolation', table.organizationId),
  ],
).enableRLS();

export const companies = pgTable(
  'companies',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id').notNull(),
    name: text('name').notNull(),
    domain: text('domain'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: 'companies_workspace_tenant_fk',
      columns: [table.organizationId, table.workspaceId],
      foreignColumns: [workspaces.organizationId, workspaces.id],
    }).onDelete('cascade'),
    uniqueIndex('companies_org_workspace_id_key').on(
      table.organizationId,
      table.workspaceId,
      table.id,
    ),
    index('companies_org_workspace_idx').on(
      table.organizationId,
      table.workspaceId,
    ),
    uniqueIndex('companies_org_workspace_domain_key').on(
      table.organizationId,
      table.workspaceId,
      table.domain,
    ),
    tenantPolicy('companies_tenant_isolation', table.organizationId),
  ],
).enableRLS();

export const evidence = pgTable(
  'evidence',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id').notNull(),
    companyId: uuid('company_id'),
    sourceKind: evidenceSourceKind('source_kind').notNull(),
    sourceName: text('source_name').notNull(),
    sourceUrl: text('source_url'),
    claim: text('claim').notNull(),
    capturedAt: timestamp('captured_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: 'evidence_company_tenant_fk',
      columns: [table.organizationId, table.workspaceId, table.companyId],
      foreignColumns: [
        companies.organizationId,
        companies.workspaceId,
        companies.id,
      ],
    }).onDelete('cascade'),
    uniqueIndex('evidence_org_id_key').on(table.organizationId, table.id),
    uniqueIndex('evidence_org_workspace_id_key').on(
      table.organizationId,
      table.workspaceId,
      table.id,
    ),
    index('evidence_org_workspace_company_idx').on(
      table.organizationId,
      table.workspaceId,
      table.companyId,
    ),
    tenantPolicy('evidence_tenant_isolation', table.organizationId),
  ],
).enableRLS();

export const qualificationRuns = pgTable(
  'qualification_runs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id').notNull(),
    offerId: uuid('offer_id').notNull(),
    initiatedByUserId: text('initiated_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    modelProvider: text('model_provider'),
    status: qualificationStatus('status').default('pending').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: 'qualification_runs_offer_tenant_fk',
      columns: [table.organizationId, table.workspaceId, table.offerId],
      foreignColumns: [offers.organizationId, offers.workspaceId, offers.id],
    }).onDelete('cascade'),
    uniqueIndex('qualification_runs_org_workspace_id_key').on(
      table.organizationId,
      table.workspaceId,
      table.id,
    ),
    index('qualification_runs_org_created_idx').on(
      table.organizationId,
      table.createdAt,
    ),
    tenantPolicy('qualification_runs_tenant_isolation', table.organizationId),
  ],
).enableRLS();

export const leadQualifications = pgTable(
  'lead_qualifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id').notNull(),
    qualificationRunId: uuid('qualification_run_id').notNull(),
    companyId: uuid('company_id').notNull(),
    score: integer('score').notNull(),
    rationale: text('rationale').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: 'lead_qualifications_run_tenant_fk',
      columns: [
        table.organizationId,
        table.workspaceId,
        table.qualificationRunId,
      ],
      foreignColumns: [
        qualificationRuns.organizationId,
        qualificationRuns.workspaceId,
        qualificationRuns.id,
      ],
    }).onDelete('cascade'),
    foreignKey({
      name: 'lead_qualifications_company_tenant_fk',
      columns: [table.organizationId, table.workspaceId, table.companyId],
      foreignColumns: [
        companies.organizationId,
        companies.workspaceId,
        companies.id,
      ],
    }).onDelete('cascade'),
    uniqueIndex('lead_qualifications_org_id_key').on(
      table.organizationId,
      table.id,
    ),
    uniqueIndex('lead_qualifications_org_workspace_id_key').on(
      table.organizationId,
      table.workspaceId,
      table.id,
    ),
    index('lead_qualifications_org_workspace_score_idx').on(
      table.organizationId,
      table.workspaceId,
      table.score,
    ),
    check(
      'lead_qualifications_score_range',
      sql`${table.score} between 0 and 100`,
    ),
    tenantPolicy('lead_qualifications_tenant_isolation', table.organizationId),
  ],
).enableRLS();

export const leadQualificationEvidence = pgTable(
  'lead_qualification_evidence',
  {
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id').notNull(),
    qualificationId: uuid('qualification_id').notNull(),
    evidenceId: uuid('evidence_id').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [
        table.organizationId,
        table.workspaceId,
        table.qualificationId,
        table.evidenceId,
      ],
      name: 'lead_qualification_evidence_pk',
    }),
    foreignKey({
      name: 'lead_qualification_evidence_qualification_tenant_fk',
      columns: [table.organizationId, table.workspaceId, table.qualificationId],
      foreignColumns: [
        leadQualifications.organizationId,
        leadQualifications.workspaceId,
        leadQualifications.id,
      ],
    }).onDelete('cascade'),
    foreignKey({
      name: 'lead_qualification_evidence_evidence_tenant_fk',
      columns: [table.organizationId, table.workspaceId, table.evidenceId],
      foreignColumns: [
        evidence.organizationId,
        evidence.workspaceId,
        evidence.id,
      ],
    }).onDelete('cascade'),
    tenantPolicy(
      'lead_qualification_evidence_tenant_isolation',
      table.organizationId,
    ),
  ],
).enableRLS();

export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    actorUserId: text('actor_user_id'),
    action: text('action').notNull(),
    subjectType: text('subject_type').notNull(),
    subjectId: text('subject_id'),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('audit_events_org_created_idx').on(
      table.organizationId,
      table.createdAt,
    ),
    tenantPolicy('audit_events_tenant_isolation', table.organizationId),
  ],
).enableRLS();

export const usageEvents = pgTable(
  'usage_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id').notNull(),
    operation: text('operation').notNull(),
    units: integer('units').notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: 'usage_events_workspace_tenant_fk',
      columns: [table.organizationId, table.workspaceId],
      foreignColumns: [workspaces.organizationId, workspaces.id],
    }).onDelete('cascade'),
    index('usage_events_org_time_idx').on(
      table.organizationId,
      table.occurredAt,
    ),
    check('usage_events_units_positive', sql`${table.units} > 0`),
    tenantPolicy('usage_events_tenant_isolation', table.organizationId),
  ],
).enableRLS();

export const suppressionEntries = pgTable(
  'suppression_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    addressHash: text('address_hash').notNull(),
    source: suppressionSource('source').notNull(),
    reason: text('reason'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('suppression_entries_org_address_hash_key').on(
      table.organizationId,
      table.addressHash,
    ),
    tenantPolicy('suppression_entries_tenant_isolation', table.organizationId),
  ],
).enableRLS();
