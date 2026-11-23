import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roadmap',
};

const phases = [
  {
    title: 'Foundation',
    description:
      'Make the tenant boundary, persistence, and product decisions safe to build on.',
    items: [
      'Finalize organization membership and authorization rules',
      'Connect a local PostgreSQL instance and validate tenant isolation',
      'Select an identity provider based on target-customer requirements',
    ],
  },
  {
    title: 'Offer-to-Lead MVP',
    description:
      'Support one reviewable journey for small software agencies, without sending campaigns.',
    items: [
      'Capture an offer and its ideal customer profile',
      'Connect an authorized, licensed source for company evidence',
      'Qualify prospects with validated outputs and traceable evidence',
      'Prepare drafts and suppression checks for human review',
    ],
  },
  {
    title: 'Expand after validation',
    description:
      'Add operational breadth only when customer evidence and provider terms justify it.',
    items: [
      'Measure usage and qualification quality',
      'Evaluate CRM, inbox, and campaign integrations',
      'Consider background jobs and a separate analytics store only when workload requires them',
    ],
  },
];

export default function RoadmapPage() {
  return (
    <main className="page-content">
      <header className="page-heading">
        <div>
          <h1>Roadmap</h1>
          <p>
            Build the offer-to-lead loop first; expand only after it is
            validated.
          </p>
        </div>
      </header>

      <div className="roadmap-grid">
        <div className="roadmap-sections">
          {phases.map((phase) => (
            <section className="panel roadmap-phase" key={phase.title}>
              <h2>{phase.title}</h2>
              <p>{phase.description}</p>
              <ul>
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside aria-label="Product guardrails" className="panel guardrails">
          <h2>Product guardrails</h2>
          <ul>
            <li>Use authorized APIs and licensed data sources.</li>
            <li>AI can recommend; server rules and people decide.</li>
            <li>Never send an unapproved campaign.</li>
            <li>Honor tenant suppression and unsubscribe records.</li>
            <li>Do not assume pricing, legal terms, or provider access.</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
