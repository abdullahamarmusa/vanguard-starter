import { ArrowRight } from 'lucide-react';
import { HeroProductPreview } from './hero-product-preview';
import { ShaderCtaButton } from './shader-cta-button';
import { ShaderHeroBackground } from './shader-hero-background';
import { SplitTextReveal } from './split-text-reveal';

export function MarketingHero() {
  return (
    <section
      id="start"
      className="shader-hero relative isolate overflow-hidden"
    >
      <ShaderHeroBackground />

      <div className="marketing-shell relative z-10 flex min-h-[100svh] flex-col justify-center pt-28 pb-10 sm:pt-32 sm:pb-14 lg:pt-[132px] lg:pb-16">
        <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12 xl:gap-16">
          <div className="shader-hero__copy max-w-[720px]">
            <p className="shader-hero__eyebrow hero-reveal hero-reveal--eyebrow">
              OFFER-TO-LEAD INTELLIGENCE
            </p>

            <h1
              className="shader-hero__title"
              aria-label="Find the companies that matter."
            >
              <SplitTextReveal
                lines={['Find the companies', 'that matter.']}
                initialDelayMs={140}
                staggerMs={15}
              />
            </h1>

            <p className="shader-hero__support hero-reveal hero-reveal--support">
              Understand your offer. Identify the companies that fit. See the
              evidence behind every opportunity.
            </p>

            <div className="hero-reveal hero-reveal--actions mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <ShaderCtaButton href="/analyze" label="Get started" />
              <a href="#workflow" className="shader-hero__cta-secondary">
                Explore how it works
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <p className="shader-hero__trust hero-reveal hero-reveal--trust">
              <span className="whitespace-nowrap">
                Evidence-backed qualification.
              </span>{' '}
              <span className="whitespace-nowrap">Transparent decisions.</span>{' '}
              <span className="whitespace-nowrap">
                Human-approved outreach.
              </span>
            </p>
          </div>

          <HeroProductPreview />
        </div>
      </div>
    </section>
  );
}
