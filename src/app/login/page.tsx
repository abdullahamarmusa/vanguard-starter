import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';

export default function LoginPlaceholderPage() {
  return (
    <main className="bg-app text-text-primary flex min-h-screen items-center justify-center px-5 py-16">
      <section className="rounded-panel border-border-subtle bg-surface shadow-card w-full max-w-md border p-8">
        <span className="border-brand-border bg-brand-soft text-brand flex h-12 w-12 items-center justify-center rounded-xl border">
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-teal-brand mt-5 font-mono text-xs tracking-[0.18em] uppercase">
          VANGUARD account
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Sign-in is not set up yet
        </h1>
        <p className="text-text-secondary mt-2 text-sm leading-relaxed">
          Authentication is the next implementation phase. No sign-in was
          attempted and no account session was created.
        </p>
        <Link
          href="/"
          className="rounded-btn border-border-subtle bg-elevated hover:border-border-strong focus-visible:outline-teal-brand mt-6 inline-flex min-h-11 items-center gap-2 border px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Return to VANGUARD
        </Link>
      </section>
    </main>
  );
}
