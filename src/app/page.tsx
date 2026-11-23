import Link from 'next/link';

const workflowStages = [
  {
    title: 'Define the offer',
    description:
      'Capture the service, outcome, audience, and commercial terms an agency can stand behind.',
  },
  {
    title: 'Describe the ideal customer',
    description:
      'Turn the offer into an explicit, reviewable customer profile rather than an opaque model prompt.',
  },
  {
    title: 'Gather authorized evidence',
    description:
      'Keep each prospect claim tied to a permitted source, its capture time, and its retention rules.',
  },
  {
    title: 'Review qualification',
    description:
      'Use validated, evidence-backed recommendations; people remain responsible for business decisions.',
  },
  {
    title: 'Prepare outreach',
    description:
      'Respect suppression and unsubscribe records. Campaign sending is outside this foundation.',
  },
];

const readiness = [
  ['Database', 'Schema drafted; connection not configured'],
  ['Authentication', 'Identity provider not selected'],
  ['Lead data', 'Licensed source not selected'],
  ['Campaign delivery', 'Disabled pending approval controls'],
];

export default function OverviewPage() {
  return (
    <main className="page-content">
      <header className="page-heading">
        <div>
          <h1>Overview</h1>
          <p>Turn a software agency’s offer into evidence-backed prospects.</p>
        </div>
        <Link className="button button-primary" href="/roadmap">
          View roadmap
        </Link>
      </header>

      <div className="scope-row">
        <p>First workflow: Offer-to-Lead Intelligence</p>
        <span className="scope-status">Foundation</span>
      </div>

      <div className="overview-grid">
        <section
          className="panel workflow-panel"
          aria-labelledby="workflow-title"
        >
          <header className="panel-heading">
            <div>
              <h2 id="workflow-title">Offer-to-Lead workflow</h2>
              <p>
                The planned path from a real offer to a reviewed prospect list.
              </p>
            </div>
          </header>
          <ol className="workflow-list">
            {workflowStages.map((stage) => (
              <li className="workflow-stage" key={stage.title}>
                <span className="stage-mark" aria-hidden="true" />
                <div>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="side-rail" aria-label="Project readiness">
          <section className="panel readiness-panel">
            <header className="panel-heading">
              <div>
                <h2>Foundation readiness</h2>
                <p>No customer data or external providers are connected.</p>
              </div>
            </header>
            <dl className="readiness-list">
              {readiness.map(([label, status]) => (
                <div className="readiness-row" key={label}>
                  <dt>{label}</dt>
                  <dd>{status}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="panel decisions-panel">
            <header className="panel-heading">
              <h2>Architecture decisions</h2>
            </header>
            <ul className="decision-list">
              <li>One PostgreSQL transactional store</li>
              <li>Tenant-scoped server operations</li>
              <li>No campaign sending without human approval</li>
            </ul>
            <Link className="text-link" href="/roadmap">
              Read the MVP boundaries
            </Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
