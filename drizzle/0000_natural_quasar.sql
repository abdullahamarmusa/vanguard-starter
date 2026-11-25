CREATE TYPE "organization_role" AS ENUM('owner', 'admin', 'member', 'analyst');
--> statement-breakpoint
CREATE TYPE "offer_status" AS ENUM('draft', 'ready', 'archived');
--> statement-breakpoint
CREATE TYPE "qualification_status" AS ENUM('pending', 'running', 'completed', 'failed');
--> statement-breakpoint
CREATE TYPE "evidence_source_kind" AS ENUM('licensed_api', 'customer_provided', 'public_record');
--> statement-breakpoint
CREATE TYPE "suppression_source" AS ENUM('unsubscribe', 'manual', 'provider_feedback');
--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_account_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"actor_user_id" text,
	"action" text NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"domain" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"company_id" uuid,
	"source_kind" "evidence_source_kind" NOT NULL,
	"source_name" text NOT NULL,
	"source_url" text,
	"claim" text NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "evidence" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "icp_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"criteria" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "icp_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "lead_qualification_evidence" (
	"organization_id" uuid NOT NULL,
	"qualification_id" uuid NOT NULL,
	"evidence_id" uuid NOT NULL,
	CONSTRAINT "lead_qualification_evidence_pk" PRIMARY KEY("organization_id","qualification_id","evidence_id")
);
--> statement-breakpoint
ALTER TABLE "lead_qualification_evidence" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "lead_qualifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"qualification_run_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"rationale" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lead_qualifications_score_range" CHECK ("lead_qualifications"."score" between 0 and 100)
);
--> statement-breakpoint
ALTER TABLE "lead_qualifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"target_outcome" text NOT NULL,
	"price_minor" integer,
	"currency" char(3),
	"status" "offer_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offers_price_currency_check" CHECK (("offers"."price_minor" is null) = ("offers"."currency" is null) and ("offers"."price_minor" is null or "offers"."price_minor" >= 0))
);
--> statement-breakpoint
ALTER TABLE "offers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "organization_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "organization_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qualification_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"offer_id" uuid NOT NULL,
	"initiated_by_user_id" text,
	"model_provider" text,
	"status" "qualification_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "qualification_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppression_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"address_hash" text NOT NULL,
	"source" "suppression_source" NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "suppression_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "usage_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"operation" text NOT NULL,
	"units" integer NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "usage_events_units_positive" CHECK ("usage_events"."units" > 0)
);
--> statement-breakpoint
ALTER TABLE "usage_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"email_verified" timestamp with time zone,
	"image" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspaces" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_events_org_created_idx" ON "audit_events" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "companies_org_workspace_id_key" ON "companies" USING btree ("organization_id","workspace_id","id");--> statement-breakpoint
CREATE INDEX "companies_org_workspace_idx" ON "companies" USING btree ("organization_id","workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "companies_org_workspace_domain_key" ON "companies" USING btree ("organization_id","workspace_id","domain");--> statement-breakpoint
CREATE UNIQUE INDEX "evidence_org_id_key" ON "evidence" USING btree ("organization_id","id");--> statement-breakpoint
CREATE INDEX "evidence_org_workspace_company_idx" ON "evidence" USING btree ("organization_id","workspace_id","company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "icp_profiles_org_workspace_id_key" ON "icp_profiles" USING btree ("organization_id","workspace_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "lead_qualifications_org_id_key" ON "lead_qualifications" USING btree ("organization_id","id");--> statement-breakpoint
CREATE INDEX "lead_qualifications_org_workspace_score_idx" ON "lead_qualifications" USING btree ("organization_id","workspace_id","score");--> statement-breakpoint
CREATE UNIQUE INDEX "offers_org_workspace_id_key" ON "offers" USING btree ("organization_id","workspace_id","id");--> statement-breakpoint
CREATE INDEX "offers_org_workspace_idx" ON "offers" USING btree ("organization_id","workspace_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organization_memberships_org_user_key" ON "organization_memberships" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "organization_memberships_user_id_idx" ON "organization_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "qualification_runs_org_workspace_id_key" ON "qualification_runs" USING btree ("organization_id","workspace_id","id");--> statement-breakpoint
CREATE INDEX "qualification_runs_org_created_idx" ON "qualification_runs" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "suppression_entries_org_address_hash_key" ON "suppression_entries" USING btree ("organization_id","address_hash");--> statement-breakpoint
CREATE INDEX "usage_events_org_time_idx" ON "usage_events" USING btree ("organization_id","occurred_at");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "workspaces_org_id_id_key" ON "workspaces" USING btree ("organization_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspaces_org_slug_key" ON "workspaces" USING btree ("organization_id","slug");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_workspace_tenant_fk" FOREIGN KEY ("organization_id","workspace_id") REFERENCES "public"."workspaces"("organization_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_company_tenant_fk" FOREIGN KEY ("organization_id","workspace_id","company_id") REFERENCES "public"."companies"("organization_id","workspace_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "icp_profiles" ADD CONSTRAINT "icp_profiles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "icp_profiles" ADD CONSTRAINT "icp_profiles_workspace_tenant_fk" FOREIGN KEY ("organization_id","workspace_id") REFERENCES "public"."workspaces"("organization_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_qualification_evidence" ADD CONSTRAINT "lead_qualification_evidence_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_qualification_evidence" ADD CONSTRAINT "lead_qualification_evidence_qualification_tenant_fk" FOREIGN KEY ("organization_id","qualification_id") REFERENCES "public"."lead_qualifications"("organization_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_qualification_evidence" ADD CONSTRAINT "lead_qualification_evidence_evidence_tenant_fk" FOREIGN KEY ("organization_id","evidence_id") REFERENCES "public"."evidence"("organization_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_qualifications" ADD CONSTRAINT "lead_qualifications_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_qualifications" ADD CONSTRAINT "lead_qualifications_run_tenant_fk" FOREIGN KEY ("organization_id","workspace_id","qualification_run_id") REFERENCES "public"."qualification_runs"("organization_id","workspace_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_qualifications" ADD CONSTRAINT "lead_qualifications_company_tenant_fk" FOREIGN KEY ("organization_id","workspace_id","company_id") REFERENCES "public"."companies"("organization_id","workspace_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_workspace_tenant_fk" FOREIGN KEY ("organization_id","workspace_id") REFERENCES "public"."workspaces"("organization_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qualification_runs" ADD CONSTRAINT "qualification_runs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qualification_runs" ADD CONSTRAINT "qualification_runs_initiated_by_user_id_users_id_fk" FOREIGN KEY ("initiated_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qualification_runs" ADD CONSTRAINT "qualification_runs_offer_tenant_fk" FOREIGN KEY ("organization_id","workspace_id","offer_id") REFERENCES "public"."offers"("organization_id","workspace_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppression_entries" ADD CONSTRAINT "suppression_entries_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_events" ADD CONSTRAINT "usage_events_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_events" ADD CONSTRAINT "usage_events_workspace_tenant_fk" FOREIGN KEY ("organization_id","workspace_id") REFERENCES "public"."workspaces"("organization_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "audit_events_tenant_isolation" ON "audit_events" AS PERMISSIVE FOR ALL TO public USING ("audit_events"."organization_id"::text = current_setting('vanguard.organization_id', true)) WITH CHECK ("audit_events"."organization_id"::text = current_setting('vanguard.organization_id', true));--> statement-breakpoint
CREATE POLICY "companies_tenant_isolation" ON "companies" AS PERMISSIVE FOR ALL TO public USING ("companies"."organization_id"::text = current_setting('vanguard.organization_id', true)) WITH CHECK ("companies"."organization_id"::text = current_setting('vanguard.organization_id', true));--> statement-breakpoint
CREATE POLICY "evidence_tenant_isolation" ON "evidence" AS PERMISSIVE FOR ALL TO public USING ("evidence"."organization_id"::text = current_setting('vanguard.organization_id', true)) WITH CHECK ("evidence"."organization_id"::text = current_setting('vanguard.organization_id', true));--> statement-breakpoint
CREATE POLICY "icp_profiles_tenant_isolation" ON "icp_profiles" AS PERMISSIVE FOR ALL TO public USING ("icp_profiles"."organization_id"::text = current_setting('vanguard.organization_id', true)) WITH CHECK ("icp_profiles"."organization_id"::text = current_setting('vanguard.organization_id', true));--> statement-breakpoint
CREATE POLICY "lead_qualification_evidence_tenant_isolation" ON "lead_qualification_evidence" AS PERMISSIVE FOR ALL TO public USING ("lead_qualification_evidence"."organization_id"::text = current_setting('vanguard.organization_id', true)) WITH CHECK ("lead_qualification_evidence"."organization_id"::text = current_setting('vanguard.organization_id', true));--> statement-breakpoint
CREATE POLICY "lead_qualifications_tenant_isolation" ON "lead_qualifications" AS PERMISSIVE FOR ALL TO public USING ("lead_qualifications"."organization_id"::text = current_setting('vanguard.organization_id', true)) WITH CHECK ("lead_qualifications"."organization_id"::text = current_setting('vanguard.organization_id', true));--> statement-breakpoint
CREATE POLICY "offers_tenant_isolation" ON "offers" AS PERMISSIVE FOR ALL TO public USING ("offers"."organization_id"::text = current_setting('vanguard.organization_id', true)) WITH CHECK ("offers"."organization_id"::text = current_setting('vanguard.organization_id', true));--> statement-breakpoint
CREATE POLICY "qualification_runs_tenant_isolation" ON "qualification_runs" AS PERMISSIVE FOR ALL TO public USING ("qualification_runs"."organization_id"::text = current_setting('vanguard.organization_id', true)) WITH CHECK ("qualification_runs"."organization_id"::text = current_setting('vanguard.organization_id', true));--> statement-breakpoint
CREATE POLICY "suppression_entries_tenant_isolation" ON "suppression_entries" AS PERMISSIVE FOR ALL TO public USING ("suppression_entries"."organization_id"::text = current_setting('vanguard.organization_id', true)) WITH CHECK ("suppression_entries"."organization_id"::text = current_setting('vanguard.organization_id', true));--> statement-breakpoint
CREATE POLICY "usage_events_tenant_isolation" ON "usage_events" AS PERMISSIVE FOR ALL TO public USING ("usage_events"."organization_id"::text = current_setting('vanguard.organization_id', true)) WITH CHECK ("usage_events"."organization_id"::text = current_setting('vanguard.organization_id', true));--> statement-breakpoint
CREATE POLICY "workspaces_tenant_isolation" ON "workspaces" AS PERMISSIVE FOR ALL TO public USING ("workspaces"."organization_id"::text = current_setting('vanguard.organization_id', true)) WITH CHECK ("workspaces"."organization_id"::text = current_setting('vanguard.organization_id', true));