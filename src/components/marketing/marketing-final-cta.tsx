import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function MarketingFinalCTA() {
  return (
    <section className="final-cta-section">
      <div className="marketing-shell final-cta-layout">
        <div className="final-cta-copy">
          <h2 className="font-display">
            Your next lead,
            <br />
            with evidence.
          </h2>
          <p>
            Explore the product preview and inspect the workflow with
            illustrative data. No account or payment required.
          </p>
        </div>

        <nav className="final-cta-actions" aria-label="Next steps">
          <Link
            href="/dashboard"
            className="final-cta-link final-cta-link--primary"
          >
            <span>Open product preview</span>
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link href="#workflow" className="final-cta-link">
            <span>Explore how it works</span>
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link href="/roadmap" className="final-cta-link">
            <span>Review the product roadmap</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </section>
  );
}
