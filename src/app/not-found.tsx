import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="bg-app text-text-primary flex min-h-screen items-center justify-center px-5 py-16">
      <section className="rounded-panel border-border-subtle bg-surface shadow-card w-full max-w-lg border p-8 text-center">
        <span className="border-brand-border bg-brand-soft text-brand mx-auto flex h-12 w-12 items-center justify-center rounded-xl border">
          <Compass className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-text-secondary mt-5 font-mono text-xs tracking-[0.18em] uppercase">
          Error 404
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="text-text-secondary mt-2 text-sm leading-relaxed">
          This VANGUARD route does not exist. Return to the public site or open
          your workspace dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-btn border-border-subtle bg-elevated hover:border-border-strong focus-visible:outline-teal-brand inline-flex min-h-11 items-center gap-2 border px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to VANGUARD
          </Link>
          <Link
            href="/dashboard"
            className="rounded-btn bg-brand hover:bg-brand/90 focus-visible:outline-teal-brand inline-flex min-h-11 items-center px-4 text-sm font-semibold text-[#0D0E11] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Open dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
