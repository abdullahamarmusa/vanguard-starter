import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from './index';

type TenantTransaction = Parameters<
  Parameters<ReturnType<typeof getDb>['transaction']>[0]
>[0];

export type TenantPermission = 'read' | 'write' | 'manage';

const rolePermissions = {
  owner: new Set<TenantPermission>(['read', 'write', 'manage']),
  admin: new Set<TenantPermission>(['read', 'write', 'manage']),
  member: new Set<TenantPermission>(['read', 'write']),
  analyst: new Set<TenantPermission>(['read']),
} satisfies Record<string, Set<TenantPermission>>;

export class TenantAuthorizationError extends Error {
  constructor() {
    super('The authenticated user is not authorized for this organization.');
    this.name = 'TenantAuthorizationError';
  }
}

/**
 * `userId` must come from a server-validated Auth.js session, never request data.
 * The authentication provider is not configured yet, so callers must not expose
 * tenant operations until that session check is implemented.
 */
export async function inAuthorizedTenantTransaction<T>(
  userId: string,
  organizationId: string,
  permission: TenantPermission,
  operation: (transaction: TenantTransaction) => Promise<T>,
): Promise<T> {
  const authenticatedUserId = z.string().min(1).max(255).parse(userId);
  const tenantId = z.string().uuid().parse(organizationId);

  return getDb().transaction(async (transaction) => {
    await transaction.execute(
      sql`select set_config('vanguard.user_id', ${authenticatedUserId}, true)`,
    );

    const membership =
      await transaction.query.organizationMemberships.findFirst({
        columns: { role: true },
        where: (memberships, { eq, and }) =>
          and(
            eq(memberships.organizationId, tenantId),
            eq(memberships.userId, authenticatedUserId),
          ),
      });

    if (!membership || !rolePermissions[membership.role].has(permission)) {
      throw new TenantAuthorizationError();
    }

    await transaction.execute(
      sql`select set_config('vanguard.organization_id', ${tenantId}, true)`,
    );
    return operation(transaction);
  });
}
