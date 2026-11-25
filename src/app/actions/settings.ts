'use server';

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/auth';
import { getDb } from '@/server/db';
import { organizations, users } from '@/server/db/schema';
import { getCurrentMembership } from '@/server/auth/membership';
import { inAuthorizedTenantTransaction } from '@/server/db/tenant';

export async function updateProfile(_previous: { error?: string; success?: boolean } | undefined, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  const name = z.string().trim().min(2).max(120).safeParse(formData.get('name'));
  if (!name.success) return { error: 'Enter a name between 2 and 120 characters.' };
  await getDb().update(users).set({ name: name.data }).where(eq(users.id, session.user.id));
  revalidatePath('/settings/profile');
  return { success: true };
}

export async function updateOrganization(_previous: { error?: string; success?: boolean } | undefined, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  const membership = await getCurrentMembership(session.user.id);
  if (!membership || !['owner', 'admin'].includes(membership.role)) return { error: 'Only an organization administrator can update these details.' };
  const parsed = z.object({ name: z.string().trim().min(2).max(120), website: z.union([z.literal(''), z.url().max(255)]), industry: z.string().max(100), companySize: z.string().max(60), region: z.string().max(100) }).safeParse({ name: formData.get('name'), website: formData.get('website') || '', industry: formData.get('industry') || '', companySize: formData.get('companySize') || '', region: formData.get('region') || '' });
  if (!parsed.success) return { error: 'Check the organization details and website format.' };
  await inAuthorizedTenantTransaction(session.user.id, membership.organizationId, 'manage', async (tx) => {
    await tx.update(organizations).set({ name: parsed.data.name, website: parsed.data.website || null, industry: parsed.data.industry || null, companySize: parsed.data.companySize || null, region: parsed.data.region || null }).where(eq(organizations.id, membership.organizationId));
  });
  revalidatePath('/settings/organization');
  return { success: true };
}
