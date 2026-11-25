import { randomUUID } from 'node:crypto';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const migrationUrl = process.env.MIGRATION_DATABASE_URL;
const runtimeUrl = process.env.DATABASE_URL;
const describeIfConfigured = migrationUrl && runtimeUrl ? describe : describe.skip;

describeIfConfigured('organization onboarding persistence', () => {
  const userId = `onboarding-${randomUUID()}`;
  const organizationId = randomUUID();
  const workspaceId = randomUUID();
  const admin = postgres(migrationUrl!, { max: 1 });
  const app = postgres(runtimeUrl!, { max: 1 });

  beforeAll(async () => {
    await admin`insert into users (id, name, email) values (${userId}, 'Onboarding test', ${`${userId}@example.test`})`;
  });

  afterAll(async () => {
    await admin`delete from organizations where id = ${organizationId}`;
    await admin`delete from users where id = ${userId}`;
    await Promise.all([admin.end(), app.end()]);
  });

  it('creates an organization, owner membership, and tenant-scoped workspace atomically', async () => {
    const persisted = await app.begin(async (transaction) => {
      await transaction`select set_config('vanguard.user_id', ${userId}, true)`;
      await transaction`insert into organizations (id, name, slug, website) values (${organizationId}, 'Onboarding test org', ${`onboarding-${organizationId}`}, 'https://example.test')`;
      await transaction`insert into organization_memberships (organization_id, user_id, role) values (${organizationId}, ${userId}, 'owner')`;
      await transaction`select set_config('vanguard.organization_id', ${organizationId}, true)`;
      await transaction`insert into workspaces (id, organization_id, name, slug) values (${workspaceId}, ${organizationId}, 'Onboarding test org workspace', 'main')`;
      const [organization] = await transaction`select name, website from organizations where id = ${organizationId}`;
      const [membership] = await transaction`select role from organization_memberships where organization_id = ${organizationId} and user_id = ${userId}`;
      const [workspace] = await transaction`select name from workspaces where id = ${workspaceId}`;
      return { organization, membership, workspace };
    });

    expect(persisted).toMatchObject({
      organization: { name: 'Onboarding test org', website: 'https://example.test' },
      membership: { role: 'owner' },
      workspace: { name: 'Onboarding test org workspace' },
    });
  });

  it('rejects workspace creation when the transaction tenant does not match membership', async () => {
    const otherOrganizationId = randomUUID();
    const otherWorkspaceId = randomUUID();
    await admin`insert into organizations (id, name, slug) values (${otherOrganizationId}, 'Unrelated org', ${`unrelated-${otherOrganizationId}`})`;
    await expect(app.begin(async (transaction) => {
      await transaction`select set_config('vanguard.user_id', ${userId}, true)`;
      await transaction`select set_config('vanguard.organization_id', ${otherOrganizationId}, true)`;
      return transaction`insert into workspaces (id, organization_id, name, slug) values (${otherWorkspaceId}, ${otherOrganizationId}, 'Forbidden workspace', 'forbidden')`;
    })).rejects.toMatchObject({ code: '42501' });
    await admin`delete from organizations where id = ${otherOrganizationId}`;
  });
});
