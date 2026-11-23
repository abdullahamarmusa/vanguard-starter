import { randomUUID } from 'node:crypto';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const migrationUrl = process.env.MIGRATION_DATABASE_URL;
const runtimeUrl = process.env.DATABASE_URL;
const describeIfConfigured =
  migrationUrl && runtimeUrl ? describe : describe.skip;

describeIfConfigured('PostgreSQL tenant isolation', () => {
  const organizationId = randomUUID();
  const otherOrganizationId = randomUUID();
  const userId = randomUUID();
  const workspaceId = randomUUID();
  const otherWorkspaceId = randomUUID();
  const otherTenantWorkspaceId = randomUUID();
  const companyId = randomUUID();
  const otherCompanyId = randomUUID();
  const otherTenantCompanyId = randomUUID();
  const offerId = randomUUID();
  const qualificationRunId = randomUUID();
  const qualificationId = randomUUID();
  const otherWorkspaceEvidenceId = randomUUID();

  const admin = postgres(migrationUrl!, { max: 1 });
  const app = postgres(runtimeUrl!, { max: 1 });

  beforeAll(async () => {
    await admin.begin(async (transaction) => {
      await transaction`
        insert into organizations (id, name, slug)
        values
          (${organizationId}, 'Integration tenant', ${`test-${organizationId}`}),
          (${otherOrganizationId}, 'Other tenant', ${`test-${otherOrganizationId}`})
      `;
      await transaction`
        insert into users (id, name) values (${userId}, 'Integration user')
      `;
      await transaction`
        insert into organization_memberships (organization_id, user_id, role)
        values (${organizationId}, ${userId}, 'member')
      `;
      await transaction`
        insert into workspaces (id, organization_id, name, slug)
        values
          (${workspaceId}, ${organizationId}, 'Workspace A', 'workspace-a'),
          (${otherWorkspaceId}, ${organizationId}, 'Workspace B', 'workspace-b'),
          (${otherTenantWorkspaceId}, ${otherOrganizationId}, 'Other tenant workspace', 'other')
      `;
      await transaction`
        insert into companies (id, organization_id, workspace_id, name)
        values
          (${companyId}, ${organizationId}, ${workspaceId}, 'Company A'),
          (${otherCompanyId}, ${organizationId}, ${otherWorkspaceId}, 'Company B'),
          (${otherTenantCompanyId}, ${otherOrganizationId}, ${otherTenantWorkspaceId}, 'Other tenant company')
      `;
      await transaction`
        insert into evidence (id, organization_id, workspace_id, company_id, source_kind, source_name, claim)
        values (${otherWorkspaceEvidenceId}, ${organizationId}, ${otherWorkspaceId}, ${otherCompanyId}, 'public_record', 'Integration fixture', 'Evidence from workspace B')
      `;
      await transaction`
        insert into offers (id, organization_id, workspace_id, name, description, target_outcome)
        values (${offerId}, ${organizationId}, ${workspaceId}, 'Integration offer', 'Fixture', 'Fixture outcome')
      `;
      await transaction`
        insert into qualification_runs (id, organization_id, workspace_id, offer_id)
        values (${qualificationRunId}, ${organizationId}, ${workspaceId}, ${offerId})
      `;
      await transaction`
        insert into lead_qualifications (id, organization_id, workspace_id, qualification_run_id, company_id, score, rationale)
        values (${qualificationId}, ${organizationId}, ${workspaceId}, ${qualificationRunId}, ${companyId}, 80, 'Fixture rationale')
      `;
    });
  });

  afterAll(async () => {
    await admin`delete from organizations where id in (${organizationId}, ${otherOrganizationId})`;
    await admin`delete from users where id = ${userId}`;
    await Promise.all([admin.end(), app.end()]);
  });

  it('runs with a non-superuser role that cannot bypass RLS', async () => {
    const [role] = await app`
      select rolsuper, rolbypassrls
      from pg_roles
      where rolname = current_user
    `;

    expect(role).toMatchObject({ rolsuper: false, rolbypassrls: false });
  });

  it('hides rows from another tenant under the runtime role', async () => {
    const visible = await app.begin(async (transaction) => {
      await transaction`select set_config('vanguard.organization_id', ${organizationId}, true)`;
      return transaction`
        select id from companies where organization_id = ${otherOrganizationId}
      `;
    });

    expect(visible).toHaveLength(0);
  });

  it('limits organization discovery to memberships of the current user', async () => {
    const visible = await app.begin(async (transaction) => {
      await transaction`select set_config('vanguard.user_id', ${userId}, true)`;
      return transaction`
        select id from organizations
        where id in (${organizationId}, ${otherOrganizationId})
      `;
    });

    expect(visible.map((organization) => organization.id)).toEqual([
      organizationId,
    ]);
  });

  it('rejects linking evidence from another workspace in the same organization', async () => {
    await expect(
      app.begin(async (transaction) => {
        await transaction`select set_config('vanguard.organization_id', ${organizationId}, true)`;
        return transaction`
          insert into lead_qualification_evidence
            (organization_id, workspace_id, qualification_id, evidence_id)
          values
            (${organizationId}, ${workspaceId}, ${qualificationId}, ${otherWorkspaceEvidenceId})
        `;
      }),
    ).rejects.toMatchObject({ code: '23503' });
  });
});
