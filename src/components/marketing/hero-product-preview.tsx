import {
  Check,
  FileText,
  LayoutDashboard,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { BrandMark } from '@/components/ui/brand-mark';

const previewNavigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Analyze', icon: Sparkles },
  { label: 'Prospects', icon: Users, active: true },
  { label: 'Campaigns', icon: Send },
  { label: 'Reports', icon: FileText },
  { label: 'Settings', icon: Settings },
];

const workflowStages = [
  'Offer',
  'ICP',
  'Discovery',
  'Qualification',
  'Contacts',
  'Outreach',
];

const qualificationReasons = [
  'Matches selected ICP criteria.',
  'Relevant business requirements identified.',
  'Company profile aligns with the submitted offer.',
];

function stageState(index: number) {
  if (index < 3) return 'complete';
  if (index === 3) return 'current';
  return 'upcoming';
}

/**
 * Illustrative product window for the hero's right column.
 *
 * This is intentionally static sample data. It is hidden from assistive
 * technology as a decorative composite and described by the figcaption, so a
 * screen reader is not read a fake account record as if it were live data.
 */
export function HeroProductPreview() {
  return (
    <figure className="hero-preview">
      <div className="hero-preview__frame" aria-hidden="true">
        <div className="hero-preview__chrome">
          <span className="hero-preview__dots">
            <span className="hero-preview__dot" />
            <span className="hero-preview__dot" />
            <span className="hero-preview__dot hero-preview__dot--amber" />
          </span>
          <span className="hero-preview__route">
            workspace / prospects / qualified
          </span>
          <span className="hero-preview__sample">Illustrative preview</span>
        </div>

        <div className="hero-preview__body">
          <aside className="hero-preview__sidebar">
            <div className="hero-preview__brand">
              <BrandMark className="hero-preview__brandmark" />
              <span className="hero-preview__brand-name">VANGUARD</span>
            </div>

            <div className="hero-preview__nav">
              {previewNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <span
                    key={item.label}
                    className={
                      item.active
                        ? 'hero-preview__nav-item hero-preview__nav-item--active'
                        : 'hero-preview__nav-item'
                    }
                  >
                    <Icon aria-hidden="true" />
                    {item.label}
                  </span>
                );
              })}
            </div>

            <p className="hero-preview__side-note">
              <span>
                <i className="hero-preview__pulse" />
                Preview workspace
              </span>
              Sample data only
            </p>
          </aside>

          <div className="hero-preview__main">
            <div className="hero-preview__main-head">
              <div>
                <p className="hero-preview__kicker">Prospect review</p>
                <p className="hero-preview__title">Qualified Opportunities</p>
              </div>
              <span className="hero-preview__result">1 match</span>
            </div>

            <ol className="hero-preview__stages">
              {workflowStages.map((stage, index) => (
                <li
                  key={stage}
                  className={`hero-preview__stage hero-preview__stage--${stageState(index)}`}
                >
                  <span className="hero-preview__stage-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="hero-preview__stage-label">{stage}</span>
                </li>
              ))}
            </ol>

            <div className="hero-preview__record">
              <div className="hero-preview__record-top">
                <div className="hero-preview__company">
                  <span className="hero-preview__avatar">NS</span>
                  <div className="hero-preview__company-copy">
                    <p className="hero-preview__company-name">
                      Northstar Software Group
                    </p>
                    <p className="hero-preview__industry">
                      Software &amp; Technology
                    </p>
                  </div>
                </div>
                <span className="hero-preview__match">
                  <ShieldCheck aria-hidden="true" />
                  Strong Match
                </span>
              </div>

              <div className="hero-preview__score">
                <span>Fit score</span>
                <span className="hero-preview__score-track">
                  <span
                    className="hero-preview__score-fill"
                    style={{ width: '92%' }}
                  />
                </span>
                <strong>
                  92<span>/100</span>
                </strong>
              </div>

              <div className="hero-preview__details">
                <section className="hero-preview__panel">
                  <p className="hero-preview__panel-label">
                    Qualification reasons
                  </p>
                  <ul className="hero-preview__reasons">
                    {qualificationReasons.map((reason) => (
                      <li className="hero-preview__reason" key={reason}>
                        <Check aria-hidden="true" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="hero-preview__panel">
                  <div className="hero-preview__panel-head">
                    <p className="hero-preview__panel-label">Evidence</p>
                    <span className="hero-preview__verify">Human review</span>
                  </div>
                  <p className="hero-preview__evidence-source">
                    Source · Company careers page
                  </p>
                  <p className="hero-preview__evidence-summary">
                    Cloud platform hiring and recent integration work align with
                    the submitted offer.
                  </p>
                  <div className="hero-preview__evidence-meta">
                    <span>Confidence · High</span>
                    <span>Sample data only</span>
                  </div>
                </section>
              </div>

              <div className="hero-preview__record-foot">
                <span>
                  <i />
                  Next step · Human review
                </span>
                <span>No outreach sent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="sr-only">
        Illustrative VANGUARD workspace preview showing a strong-match software
        company record with a 92 out of 100 fit score, qualification reasons, an
        evidence source awaiting human review, and the six-stage offer-to-lead
        workflow. All record data is sample data.
      </figcaption>
    </figure>
  );
}
