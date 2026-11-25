import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '@/server/db';
import { users } from '@/server/db/schema';
import { verifyPassword } from '@/server/auth/password';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 14 },
  pages: { signIn: '/sign-in', error: '/sign-in' },
  providers: [
    CredentialsProvider({
      name: 'Email and password',
      credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Password', type: 'password' } },
      async authorize(credentials) {
        const parsed = z.object({ email: z.email(), password: z.string().min(1).max(256) }).safeParse(credentials);
        if (!parsed.success) return null;
        const db = getDb();
        const user = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email.trim().toLowerCase()) });
        if (!user?.emailVerified || !user.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) return null;
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
};
