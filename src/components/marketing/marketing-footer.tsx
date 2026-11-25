import Link from 'next/link';
import { BrandMark } from '@/components/ui/brand-mark';
import { legalLinks } from '@/content/legal';

export function MarketingFooter() {
  return (
    <footer className="bg-surface border-border-subtle border-t py-12 sm:py-16">
      <div className="marketing-container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-3 no-underline"
              aria-label="VANGUARD home"
            >
              <BrandMark className="h-9 w-9" />
              <span className="font-display text-[15px] font-bold tracking-[0.16em]">
                VANGUARD
              </span>
            </Link>
            <p className="text-text-secondary mt-4 max-w-[300px] text-sm leading-relaxed">
              Evidence-backed lead qualification for teams that sell software,
              consulting, and technology expertise.
            </p>
          </div>

          <nav aria-label="Product">
            <h2 className="text-sm font-semibold">Product</h2>
            <ul className="mt-4 space-y-1">
              {[
                ['How it works', '#workflow'],
                ['Evidence', '#evidence'],
                ['Product preview', '/dashboard'],
                ['Sample report', '/analyze/anl_example_01/results'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-text-secondary hover:text-text-primary inline-flex min-h-9 items-center text-sm hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-sm font-semibold">Company</h2>
            <ul className="mt-4 space-y-1">
              <li>
                <Link
                  href="/roadmap"
                  className="text-text-secondary hover:text-text-primary inline-flex min-h-9 items-center text-sm hover:underline"
                >
                  Product roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-text-secondary hover:text-text-primary inline-flex min-h-9 items-center text-sm hover:underline"
                >
                  Trust &amp; controls
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold">Legal</h2>
            <ul className="mt-4 space-y-1">{legalLinks.map(([label, href]) => <li key={href}><Link href={href} className="text-text-secondary hover:text-text-primary inline-flex min-h-9 items-center text-sm hover:underline">{label}</Link></li>)}</ul>
          </div>
        </div>

        <div className="text-text-muted border-border-subtle mt-12 flex flex-col gap-3 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 VANGUARD</p>
          <p>Product preview · Illustrative data</p>
        </div>
      </div>
    </footer>
  );
}
