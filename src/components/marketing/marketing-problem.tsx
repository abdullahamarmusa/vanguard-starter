import { Crosshair, FileSearch, MessageSquareText } from 'lucide-react';

const problems = [
  {
    title: 'Unclear targeting',
    description:
      'A broad company list says little about which accounts actually fit your offer, buying context, and commercial constraints.',
    icon: Crosshair,
  },
  {
    title: 'Manual research',
    description:
      'Tabs, spreadsheets, and stale notes make every account expensive to evaluate and difficult to defend.',
    icon: FileSearch,
  },
  {
    title: 'Unsupported outreach',
    description:
      'Generic messages ignore the evidence behind the opportunity, leaving your team to reconstruct the reasoning.',
    icon: MessageSquareText,
  },
];

export function MarketingProblem() {
  return (
    <section id="problem" className="marketing-section bg-surface">
      <div className="marketing-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:self-start">
          <h2 className="font-display max-w-[480px] text-[clamp(36px,4.4vw,58px)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Start with a clear fit.
          </h2>
          <p className="text-text-secondary mt-6 max-w-[440px] text-lg leading-relaxed">
            The problem is not a lack of companies. It is the missing chain
            between your offer, the evidence, and the next decision.
          </p>
        </div>

        <div className="space-y-3">
          {problems.map((problem) => {
            const Icon = problem.icon;
            return (
              <article
                key={problem.title}
                className="bg-app rounded-card p-6 sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="text-brand h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                  <h3 className="text-xl font-semibold tracking-tight">
                    {problem.title}
                  </h3>
                </div>
                <p className="text-text-secondary mt-3 max-w-[620px] text-base leading-relaxed">
                  {problem.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
