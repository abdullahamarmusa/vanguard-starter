import 'server-only';
import { getCurrentMembership } from './membership';

export async function postAuthPath(userId: string) {
  const membership = await getCurrentMembership(userId);
  return membership ? '/dashboard' : '/onboarding';
}
