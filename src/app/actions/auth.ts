'use server';

import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { and, eq, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '@/server/db';
import { authTokens, users } from '@/server/db/schema';
import { hashPassword } from '@/server/auth/password';
import { appOrigin, sendTransactionalEmail } from '@/server/auth/email';
import { issueLimitedAuthToken } from '@/server/auth/token-issuer';

const registration = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(12).max(128).regex(/[a-z]/).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
});

export async function registerAccount(_previous: { error?: string } | undefined, formData: FormData) {
  const parsed = registration.safeParse({
    name: formData.get('name'), email: formData.get('email'), password: formData.get('password'),
  });
  if (!parsed.success) return { error: 'Enter your name, a valid work email, and a password meeting all requirements.' };
  const db = getDb();
  const existing = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email), columns: { id: true } });
  if (existing) return { error: 'We could not create this account. Try signing in or use another email.' };
  const passwordHash = await hashPassword(parsed.data.password);
  const userId = randomUUID();
  const rawToken = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');
  try {
    await db.transaction(async (tx) => {
      await tx.insert(users).values({ id: userId, name: parsed.data.name, email: parsed.data.email, passwordHash });
      await tx.insert(authTokens).values({ userId, tokenHash, purpose: 'verify_email', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    });
  } catch {
    return { error: 'We could not create this account. Please try again.' };
  }
  let delivered = false;
  try {
    const link = `${appOrigin()}/verify-email?token=${encodeURIComponent(rawToken)}`;
    delivered = await sendTransactionalEmail({
      to: parsed.data.email, subject: 'Verify your VANGUARD email',
      text: `Verify your email within 24 hours: ${link}`,
      html: `<p>Verify your email to activate your VANGUARD account.</p><p><a href="${link}">Verify email</a></p><p>This link expires in 24 hours.</p>`,
      idempotencyKey: `verify-email/${userId}/${tokenHash}`,
    });
  } catch { delivered = false; }
  return delivered ? { verificationRequired: true } : { error: 'Your account was created, but the verification email could not be sent. Ask for a new verification email after email delivery is configured.' };
}

export async function requestPasswordReset(_previous: { message?: string } | undefined, formData: FormData) {
  const email = z.email().safeParse(String(formData.get('email') ?? '').trim().toLowerCase());
  if (!email.success) return { message: 'Enter a valid email address.' };
  const user = await getDb().query.users.findFirst({ where: eq(users.email, email.data), columns: { id: true, email: true } });
  if (user?.email) {
    const token = await issueLimitedAuthToken(user.id, 'reset_password', 60 * 60 * 1000);
    try {
      if (!token) return { message: 'Request processed. If this address matches an account, reset instructions may be sent. This does not confirm account existence or email delivery.' };
      const link = `${appOrigin()}/reset-password?token=${encodeURIComponent(token.rawToken)}`;
      await sendTransactionalEmail({ to: user.email, subject: 'Reset your VANGUARD password', text: `Reset your password within one hour: ${link}`, html: `<p>Use the link below to reset your VANGUARD password. It expires in one hour.</p><p><a href="${link}">Reset password</a></p>`, idempotencyKey: `reset-password/${user.id}/${token.tokenHash}` });
    } catch { /* Keep the public response generic when delivery is unavailable. */ }
  }
  return { message: 'Request processed. If this address matches an account, reset instructions may be sent. This does not confirm account existence or email delivery.' };
}

export async function verifyEmailToken(_previous: { error?: string; verified?: boolean } | undefined, formData: FormData) {
  const token = z.string().min(20).max(100).safeParse(formData.get('token'));
  if (!token.success) return { error: 'This verification link is invalid or expired.' };
  const tokenHash = createHash('sha256').update(token.data).digest('hex');
  const db = getDb();
  const consumed = await db.transaction(async (tx) => {
    const row = await tx.query.authTokens.findFirst({ where: (tokens, { eq, and, gt, isNull }) => and(eq(tokens.tokenHash, tokenHash), eq(tokens.purpose, 'verify_email'), gt(tokens.expiresAt, new Date()), isNull(tokens.usedAt)) });
    if (!row) return false;
    const claimed = await tx.update(authTokens).set({ usedAt: new Date() }).where(and(eq(authTokens.id, row.id), isNull(authTokens.usedAt))).returning({ id: authTokens.id });
    if (!claimed.length) return false;
    await tx.update(users).set({ emailVerified: new Date() }).where(eq(users.id, row.userId));
    return true;
  });
  return consumed ? { verified: true } : { error: 'This verification link is invalid or expired.' };
}

export async function resendVerification(_previous: { message?: string } | undefined, formData: FormData) {
  const email = z.email().safeParse(String(formData.get('email') ?? '').trim().toLowerCase());
  if (!email.success) return { message: 'Enter a valid email address.' };
  const user = await getDb().query.users.findFirst({ where: eq(users.email, email.data), columns: { id: true, email: true, emailVerified: true } });
  if (user?.email && !user.emailVerified) {
    const token = await issueLimitedAuthToken(user.id, 'verify_email', 24 * 60 * 60 * 1000);
    try {
      if (!token) return { message: 'Request processed. If this address matches an unverified account, a verification email may be sent. This does not confirm account existence or email delivery.' };
      const link = `${appOrigin()}/verify-email?token=${encodeURIComponent(token.rawToken)}`;
      await sendTransactionalEmail({ to: user.email, subject: 'Verify your VANGUARD email', text: `Verify your email within 24 hours: ${link}`, html: `<p><a href="${link}">Verify your email</a></p><p>This link expires in 24 hours.</p>`, idempotencyKey: `verify-email/${user.id}/${token.tokenHash}` });
    } catch { /* Keep responses generic for unknown accounts and delivery failures. */ }
  }
  return { message: 'Request processed. If this address matches an unverified account, a verification email may be sent. This does not confirm account existence or email delivery.' };
}

export async function resetPassword(_previous: { error?: string; complete?: boolean } | undefined, formData: FormData) {
  const parsed = z.object({ token: z.string().min(20).max(100), password: registration.shape.password, confirmPassword: z.string() }).refine((value) => value.password === value.confirmPassword).safeParse({ token: formData.get('token'), password: formData.get('password'), confirmPassword: formData.get('confirmPassword') });
  if (!parsed.success) return { error: 'Use a valid reset link and a password meeting all requirements.' };
  const tokenHash = createHash('sha256').update(parsed.data.token).digest('hex');
  const db = getDb();
  const complete = await db.transaction(async (tx) => {
    const row = await tx.query.authTokens.findFirst({ where: (tokens, { eq, and, gt, isNull }) => and(eq(tokens.tokenHash, tokenHash), eq(tokens.purpose, 'reset_password'), gt(tokens.expiresAt, new Date()), isNull(tokens.usedAt)) });
    if (!row) return false;
    const claimed = await tx.update(authTokens).set({ usedAt: new Date() }).where(and(eq(authTokens.id, row.id), isNull(authTokens.usedAt))).returning({ id: authTokens.id });
    if (!claimed.length) return false;
    await tx.update(users).set({ passwordHash: await hashPassword(parsed.data.password) }).where(eq(users.id, row.userId));
    return true;
  });
  return complete ? { complete: true } : { error: 'This reset link is invalid or expired. Request a new link.' };
}
