import type { Metadata } from 'next';
import { PwaControls } from '@/components/pwa-controls';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingHero } from '@/components/marketing/marketing-hero';
import { MarketingProblem } from '@/components/marketing/marketing-problem';
import { MarketingWorkflow } from '@/components/marketing/marketing-workflow';
import { MarketingEvidence } from '@/components/marketing/marketing-evidence';
import { MarketingUseCases } from '@/components/marketing/marketing-use-cases';
import { MarketingSecurity } from '@/components/marketing/marketing-security';
import { MarketingTestimonials } from '@/components/marketing/marketing-testimonials';
import { MarketingPricing } from '@/components/marketing/marketing-pricing';
import { MarketingFAQ } from '@/components/marketing/marketing-faq';
import { MarketingFinalCTA } from '@/components/marketing/marketing-final-cta';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import './marketing.css';

export const metadata: Metadata = {
  title: 'AI Business Intelligence & Revenue Operations',
  description:
    'Turn business offers into evidence-backed opportunities. Discover relevant companies, evaluate buyer fit, and prepare intelligent outreach with VANGUARD.',
};

export default function LandingPage() {
  return (
    <div className="marketing-page light">
      <a
        href="#main-content"
        className="bg-app text-text-primary focus:bg-elevated rounded-btn fixed top-3 left-3 z-[100] -translate-y-20 px-4 py-3 text-sm font-semibold no-underline transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <MarketingHeader />
      <main id="main-content" tabIndex={-1}>
        <MarketingHero />
        <MarketingProblem />
        <MarketingWorkflow />
        <MarketingEvidence />
        <MarketingUseCases />
        <MarketingSecurity />
        <MarketingTestimonials />
        <MarketingPricing />
        <MarketingFAQ />
        <MarketingFinalCTA />
      </main>
      <MarketingFooter />
      <PwaControls showControls={false} />
    </div>
  );
}
