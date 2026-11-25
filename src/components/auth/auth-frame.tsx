import Link from 'next/link';
import { BrandMark } from '@/components/ui/brand-mark';

export function AuthFrame({ children, eyebrow = 'Workspace access' }: { children: React.ReactNode; eyebrow?: string }) {
  return (
    <main className="bg-app text-text-primary relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,182,182,.10),transparent_55%)]" />
      <div className="relative w-full max-w-[460px]">
        <Link href="/" className="mx-auto mb-8 flex w-fit items-center gap-3" aria-label="VANGUARD home">
          <BrandMark className="h-9 w-9" /><span className="font-display text-sm font-bold tracking-[.16em]">VANGUARD</span>
        </Link>
        <section className="rounded-panel border-border-subtle bg-surface shadow-card border p-6 sm:p-9">
          <p className="text-teal-brand font-mono text-[10px] tracking-[.2em] uppercase">{eyebrow}</p>
          {children}
        </section>
        <p className="text-text-muted mt-6 text-center text-xs leading-relaxed">
          By continuing, you agree to our <Link className="text-text-secondary underline underline-offset-4" href="/terms">Terms</Link> and acknowledge our <Link className="text-text-secondary underline underline-offset-4" href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}
