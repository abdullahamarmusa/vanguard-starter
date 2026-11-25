ALTER TABLE "lead_qualification_evidence" ADD COLUMN "workspace_id" uuid;--> statement-breakpoint
UPDATE "lead_qualification_evidence" AS link
SET "workspace_id" = qualification."workspace_id"
FROM "lead_qualifications" AS qualification
WHERE qualification."organization_id" = link."organization_id"
  AND qualification."id" = link."qualification_id";--> statement-breakpoint
ALTER TABLE "lead_qualification_evidence" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "lead_qualification_evidence" DROP CONSTRAINT "lead_qualification_evidence_pk";--> statement-breakpoint
ALTER TABLE "lead_qualification_evidence" ADD CONSTRAINT "lead_qualification_evidence_pk"
  PRIMARY KEY ("organization_id", "workspace_id", "qualification_id", "evidence_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lead_qualifications_org_workspace_id_key"
  ON "lead_qualifications" USING btree ("organization_id", "workspace_id", "id");--> statement-breakpoint
CREATE UNIQUE INDEX "evidence_org_workspace_id_key"
  ON "evidence" USING btree ("organization_id", "workspace_id", "id");--> statement-breakpoint
ALTER TABLE "lead_qualification_evidence" DROP CONSTRAINT "lead_qualification_evidence_qualification_tenant_fk";--> statement-breakpoint
ALTER TABLE "lead_qualification_evidence" ADD CONSTRAINT "lead_qualification_evidence_qualification_tenant_fk"
  FOREIGN KEY ("organization_id", "workspace_id", "qualification_id")
  REFERENCES "lead_qualifications" ("organization_id", "workspace_id", "id")
  ON DELETE CASCADE ON UPDATE NO ACTION;--> statement-breakpoint
ALTER TABLE "lead_qualification_evidence" DROP CONSTRAINT "lead_qualification_evidence_evidence_tenant_fk";--> statement-breakpoint
ALTER TABLE "lead_qualification_evidence" ADD CONSTRAINT "lead_qualification_evidence_evidence_tenant_fk"
  FOREIGN KEY ("organization_id", "workspace_id", "evidence_id")
  REFERENCES "evidence" ("organization_id", "workspace_id", "id")
  ON DELETE CASCADE ON UPDATE NO ACTION;--> statement-breakpoint
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "organizations_member_read" ON "organizations"
  AS PERMISSIVE FOR SELECT TO public
  USING (exists (
    select 1 from "organization_memberships"
    where "organization_memberships"."organization_id" = "organizations"."id"
      and "organization_memberships"."user_id" = current_setting('vanguard.user_id', true)
  ));--> statement-breakpoint
ALTER TABLE "organization_memberships" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "organization_memberships_self_read" ON "organization_memberships"
  AS PERMISSIVE FOR SELECT TO public
  USING ("organization_memberships"."user_id" = current_setting('vanguard.user_id', true));
