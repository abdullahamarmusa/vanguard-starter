'use server';

import { randomUUID } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/auth';
import { getDb } from '@/server/db';
import { organizationMemberships, organizations, users, workspaces } from '@/server/db/schema';

const formSchema = z.object({
  name: z.string().trim().min(2).max(120),
  organizationName: z.string().trim().min(2).max(120),
  website: z.union([z.literal(''), z.url().max(255)]),
  industry: z.string().max(100), companySize: z.string().max(60), region: z.string().max(100),
  organizationType: z.string().max(60), role: z.string().max(80), goals: z.array(z.string().max(100)).max(5),
});

export async function finishOnboarding(_previous: { error?: string } | undefined, formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) redirect('/sign-in');
  const parsed = formSchema.safeParse({
    name: formData.get('name'), organizationName: formData.get('organizationName'), website: formData.get('website') || '',
    industry: formData.get('industry') || '', companySize: formData.get('companySize') || '', region: formData.get('region') || '',
    organizationType: formData.get('organizationType') || '', role: formData.get('role') || '', goals: formData.getAll('goals'),
  });
  if (!parsed.success) return { error: 'Review the organization name and website, then try again.' };
  const data = parsed.data;
  const db = getDb();
  const prior = await db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('vanguard.user_id', ${userId}, true)`);
    return tx.query.organizationMemberships.findFirst({ where: (m, { eq }) => eq(m.userId, userId), columns: { id: true } });
  });
  if (prior) redirect('/dashboard');
  const organizationId = randomUUID();
  const workspaceId = randomUUID();
  const slug = `${data.organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'workspace'}-${organizationId.slice(0, 8)}`;
  await db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('vanguard.user_id', ${userId}, true)`);
    await tx.insert(users).values({ id: userId, name: data.name }).onConflictDoUpdate({ target: users.id, set: { name: data.name, jobTitle: data.role || null, onboardingGoals: data.goals } });
    await tx.insert(organizations).values({ id: organizationId, name: data.organizationName, slug, website: data.website || null, industry: data.industry || null, companySize: data.companySize || null, region: data.region || null, organizationType: data.organizationType || null });
    await tx.insert(organizationMemberships).values({ organizationId, userId, role: 'owner' });
    await tx.execute(sql`select set_config('vanguard.organization_id', ${organizationId}, true)`);
    await tx.insert(workspaces).values({ id: workspaceId, organizationId, name: `${data.organizationName} workspace`, slug: 'main' });
  });
  redirect('/onboarding/complete');
}
