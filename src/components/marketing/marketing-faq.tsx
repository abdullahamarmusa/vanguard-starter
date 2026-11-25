import { Plus } from 'lucide-react';

const questions = [
  {
    question: 'Is live lead analysis available?',
    answer:
      'Not yet. The current product is a preview with illustrative records. Entering a website or offer description opens the existing preview workflow, but it does not start a live analysis job or connect a data provider.',
  },
  {
    question: 'What can I evaluate in the product preview?',
    answer:
      'You can inspect the dashboard, offer workspace, prospect review, sample qualification report, campaign preview, reports, settings, and activity views. Changes are local preview state and do not create a production workspace.',
  },
  {
    question: 'Where does the evidence come from?',
    answer:
      'The sample records include source labels, source URLs, verification types, confidence, and verification gaps. They demonstrate the review model; they are not live customer results. Production data licensing and provider access are not connected.',
  },
  {
    question: 'Does VANGUARD send outreach automatically?',
    answer:
      'No. Campaign delivery is not implemented. The preview can show outreach preparation, but sending, suppression, and unsubscribe controls must be implemented before any production campaign use.',
  },
  {
    question: 'How does the qualification score work?',
    answer:
      'The prototype weights factors such as ICP alignment, technical and ecosystem signals, buying or hiring signals, and commercial fit. The evidence view shows each factor and its weight so a reviewer can understand the result rather than rely on the total alone.',
  },
  {
    question: 'What do the production plans cost?',
    answer:
      'Production pricing, plan limits, and billing intervals are not published or approved. The preview has no checkout, collects no payment, and does not change account entitlements.',
  },
  {
    question: 'How is my data handled?',
    answer:
      'The preview uses illustrative data and local browser state. Production privacy, retention, deletion, access, and data-processing terms are not yet published, and no security certification is claimed.',
  },
];

export function MarketingFAQ() {
  return (
    <section id="faq" className="marketing-section bg-app">
      <div className="marketing-container grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <div>
          <h2 className="font-display text-[clamp(36px,4.4vw,58px)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Questions before you evaluate.
          </h2>
          <p className="text-text-secondary mt-6 max-w-[400px] text-lg leading-relaxed">
            A clear view of what works now, what is illustrative, and what still
            needs to be built.
          </p>
        </div>

        <div className="border-border-subtle border-t">
          {questions.map((item) => (
            <details
              key={item.question}
              name="vanguard-faq"
              className="marketing-faq group border-border-subtle border-b"
            >
              <summary className="flex min-h-[76px] cursor-pointer list-none items-center justify-between gap-5 py-5 text-left text-base font-semibold sm:text-lg">
                {item.question}
                <Plus
                  className="text-text-muted h-5 w-5 shrink-0 transition-transform group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="text-text-secondary max-w-[65ch] pb-6 text-base leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
