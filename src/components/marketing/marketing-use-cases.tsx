import Link from 'next/link';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CodeXml,
  Headset,
} from 'lucide-react';

const useCases = [
  {
    title: 'Software agencies',
    description:
      'Shape an offer around a specific technical outcome, compare account fit, and carry the context into outreach drafts.',
    icon: CodeXml,
    route: '/workspace',
    action: 'Open agency workspace',
  },
  {
    title: 'SaaS companies',
    description:
      'Focus on complementary products, buyer context, and ecosystem signals that support a useful qualification conversation.',
    icon: ChartNoAxesCombined,
    route: '/prospects',
    action: 'Inspect prospect preview',
  },
  {
    title: 'B2B consulting',
    description:
      'Connect advisory expertise to an explicit ideal-customer profile, with evidence and review notes beside each account.',
    icon: BriefcaseBusiness,
    route: '/reports',
    action: 'Open report preview',
  },
  {
    title: 'Technology services',
    description:
      'Prepare an evidence-backed outreach draft while keeping delivery capacity, sourcing, and sending decisions with your team.',
    icon: Headset,
    route: '/campaigns',
    action: 'Open outreach preview',
  },
];

export function MarketingUseCases() {
  return (
    <section id="use-cases" className="marketing-section bg-app">
      <div className="marketing-container">
        <div className="max-w-[65ch]">
          <h2 className="font-display text-[clamp(36px,4.4vw,58px)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Built for teams that sell expertise.
          </h2>
          <p className="text-text-secondary mt-6 text-lg leading-relaxed">
            The workflow adapts to the offer and customer context, not a fixed
            industry template.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-2">
          {useCases.map((useCase) => {
            const Icon = useCase.icon;
            return (
              <article
                key={useCase.title}
                className="bg-surface rounded-card p-6 sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="text-brand h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {useCase.title}
                  </h3>
                </div>
                <p className="text-text-secondary mt-3 max-w-[510px] text-base leading-relaxed">
                  {useCase.description}
                </p>
                <Link
                  href={useCase.route}
                  className="text-text-primary mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold hover:underline"
                >
                  {useCase.action}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
