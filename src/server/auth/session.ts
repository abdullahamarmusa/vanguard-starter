import 'server-only';
import { connection } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export async function getRequestSession() {
  await connection();
  return getServerSession(authOptions);
}
