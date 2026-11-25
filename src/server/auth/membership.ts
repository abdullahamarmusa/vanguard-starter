import 'server-only';
import { sql } from 'drizzle-orm';
import { getDb } from '@/server/db';

export async function getCurrentMembership(userId: string) {
  return getDb().transaction(async (tx) => {
    await tx.execute(sql`select set_config('vanguard.user_id', ${userId}, true)`);
    return tx.query.organizationMemberships.findFirst({
      where: (membership, { eq }) => eq(membership.userId, userId),
    });
  });
}
