'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return <button onClick={() => signOut({ callbackUrl: '/' })} className="border-border-strong hover:bg-hover min-h-11 rounded-lg border px-4 text-sm font-medium">Sign out of this browser</button>;
}
