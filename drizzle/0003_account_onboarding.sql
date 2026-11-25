ALTER TABLE "users" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "job_title" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_goals" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "industry" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "company_size" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "region" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "organization_type" text;--> statement-breakpoint
CREATE TABLE "auth_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token_hash" text NOT NULL,
  "purpose" text NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "used_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "auth_tokens_purpose_check" CHECK ("purpose" in ('verify_email', 'reset_password'))
);--> statement-breakpoint
CREATE UNIQUE INDEX "auth_tokens_token_hash_key" ON "auth_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "auth_tokens_user_purpose_idx" ON "auth_tokens" USING btree ("user_id", "purpose");--> statement-breakpoint
CREATE POLICY "organizations_authenticated_insert" ON "organizations" AS PERMISSIVE FOR INSERT TO public WITH CHECK (current_setting('vanguard.user_id', true) <> '');--> statement-breakpoint
CREATE POLICY "organization_memberships_owner_insert" ON "organization_memberships" AS PERMISSIVE FOR INSERT TO public WITH CHECK ("organization_memberships"."user_id" = current_setting('vanguard.user_id', true) AND "organization_memberships"."role" = 'owner');--> statement-breakpoint
CREATE FUNCTION public.vanguard_is_org_member(target_organization_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, public AS $$ SELECT EXISTS (SELECT 1 FROM public.organization_memberships m WHERE m.organization_id = target_organization_id AND m.user_id = current_setting('vanguard.user_id', true)) $$;--> statement-breakpoint
CREATE POLICY "organization_memberships_org_read" ON "organization_memberships" AS PERMISSIVE FOR SELECT TO public USING ("organization_memberships"."organization_id"::text = current_setting('vanguard.organization_id', true) and public.vanguard_is_org_member("organization_memberships"."organization_id"));--> statement-breakpoint
ALTER POLICY "organizations_member_read" ON "organizations" USING ("organizations"."id"::text = current_setting('vanguard.organization_id', true) and exists (select 1 from organization_memberships where organization_memberships.organization_id = "organizations"."id" and organization_memberships.user_id = current_setting('vanguard.user_id', true)));--> statement-breakpoint
CREATE POLICY "organizations_admin_update" ON "organizations" AS PERMISSIVE FOR UPDATE TO public USING ("organizations"."id"::text = current_setting('vanguard.organization_id', true) and exists (select 1 from organization_memberships m where m.organization_id = "organizations"."id" and m.user_id = current_setting('vanguard.user_id', true) and m.role in ('owner', 'admin'))) WITH CHECK ("organizations"."id"::text = current_setting('vanguard.organization_id', true) and exists (select 1 from organization_memberships m where m.organization_id = "organizations"."id" and m.user_id = current_setting('vanguard.user_id', true) and m.role in ('owner', 'admin')));--> statement-breakpoint
CREATE POLICY "workspaces_member_insert" ON "workspaces" AS PERMISSIVE FOR INSERT TO public WITH CHECK ("workspaces"."organization_id"::text = current_setting('vanguard.organization_id', true) and exists (select 1 from organization_memberships m where m.organization_id = "workspaces"."organization_id" and m.user_id = current_setting('vanguard.user_id', true) and m.role in ('owner', 'admin')));
