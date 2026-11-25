import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt, sql } from 'drizzle-orm';
import { getDb } from '@/server/db';
import { authTokens } from '@/server/db/schema';

export type AuthTokenPurpose = 'verify_email' | 'reset_password';

export async function issueLimitedAuthToken(userId: string, purpose: AuthTokenPurpose, lifetimeMs: number) {
  return getDb().transaction(async (tx) => {
    const lockKey = `${purpose}:${userId}`;
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`);
    const [issued] = await tx.select({ count: sql<number>`count(*)::int` }).from(authTokens).where(and(
      eq(authTokens.userId, userId),
      eq(authTokens.purpose, purpose),
      gt(authTokens.createdAt, new Date(Date.now() - 15 * 60 * 1000)),
    ));
    if (issued.count >= 5) return null;
    const rawToken = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    await tx.insert(authTokens).values({ userId, tokenHash, purpose, expiresAt: new Date(Date.now() + lifetimeMs) });
    return { rawToken, tokenHash };
  });
}
