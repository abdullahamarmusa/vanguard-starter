import Link from 'next/link';
import { ArrowUpRight, Check, Clock3 } from 'lucide-react';

export function MarketingPricing() {
  return (
    <section id="pricing" className="marketing-section bg-surface">
      <div className="marketing-container">
        <div className="max-w-[65ch]">
          <h2 className="font-display text-[clamp(36px,4.4vw,58px)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Preview the product before pricing is final.
          </h2>
          <p className="text-text-secondary mt-6 text-lg leading-relaxed">
            The current experience is a product preview. Production plans and
            billing are not published because pricing and quotas are still being
            validated.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <article className="bg-app rounded-panel flex flex-col p-7 sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold">Product preview</h3>
              <span className="bg-brand-soft text-accent-text rounded-full px-3 py-1 text-sm font-semibold">
                Available now
              </span>
            </div>
            <p className="text-text-secondary mt-5 leading-relaxed">
              Explore the interface and local-state workflows using illustrative
              company, evidence, and outreach records.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                'No account or payment required',
                'Illustrative qualification and reports',
                'Browser-only exports and local preview state',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-base">
                  <Check
                    className="text-success mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="marketing-button mt-8 self-start"
            >
              Open product preview
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>

          <article className="bg-app rounded-panel flex flex-col p-7 sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold">Production plans</h3>
              <span className="text-text-secondary inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-semibold">
                <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                Not published
              </span>
            </div>
            <p className="text-text-secondary mt-5 leading-relaxed">
              Plan names, prices, usage limits, billing intervals, and payment
              entitlements require validated product and commercial decisions.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                'No checkout or payment collection',
                'Monthly and annual prices not yet approved',
                'Live data access and campaign delivery not included',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-base">
                  <span
                    className="text-text-muted mt-0.5 h-4 w-4 shrink-0 text-center"
                    aria-hidden="true"
                  >
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/roadmap"
              className="marketing-button-secondary mt-8 self-start"
            >
              View product roadmap
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
