import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from './index';

type TenantTransaction = Parameters<
  Parameters<ReturnType<typeof getDb>['transaction']>[0]
>[0];

export async function inTenantTransaction<T>(
  organizationId: string,
  operation: (transaction: TenantTransaction) => Promise<T>,
): Promise<T> {
  const tenantId = z.string().uuid().parse(organizationId);

  return getDb().transaction(async (transaction) => {
    await transaction.execute(
      sql`select set_config('vanguard.organization_id', ${tenantId}, true)`,
    );
    return operation(transaction);
  });
}
