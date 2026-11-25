import type { ReactNode } from 'react';
import { Globe } from 'lucide-react';
import type { WorkflowStageId } from './workflow-data';

interface PreviewFrameProps {
  title: string;
  contextLabel: string;
  description: string;
  children: ReactNode;
}

/**
 * A visual stand-in for a VANGUARD product surface.
 *
 * The frame is exposed as a single image to assistive technology so sample
 * records and visual-only controls are never announced as real application
 * state. Visible labels still make the illustrative status clear.
 */
function PreviewFrame({
  title,
  contextLabel,
  description,
  children,
}: PreviewFrameProps) {
  return (
    <div className="workflow-preview" role="img" aria-label={description}>
      <div className="workflow-preview__bar">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="workflow-preview__dot" aria-hidden="true" />
          <span className="truncate text-xs font-medium text-white">
            {title}
          </span>
        </div>
        <span className="font-mono text-[10.5px] text-slate-300">
          {contextLabel}
        </span>
      </div>
      <div className="workflow-preview__body">{children}</div>
    </div>
  );
}

interface PreviewFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

function PreviewField({ label, children, className }: PreviewFieldProps) {
  return (
    <div className={className}>
      <p className="text-[10.5px] font-semibold tracking-[0.07em] text-[#586276] uppercase">
        {label}
      </p>
      <div className="mt-1 text-xs leading-relaxed text-[#111318]">
        {children}
      </div>
    </div>
  );
}

function OfferAnalysisPreview() {
  return (
    <PreviewFrame
      title="Offer profile extraction"
      contextLabel="Illustrative preview · Sample offer"
      description={
        'Illustrative offer profile preview with a sample URL, offer summary, target audience, value proposition, and key outcomes.'
      }
    >
      <div className="space-y-3.5 text-left">
        <div className="border-b border-[#e2e8f0] pb-3">
          <p className="text-[10.5px] font-semibold tracking-[0.07em] text-[#586276] uppercase">
            Offer URL input
          </p>
          <div className="mt-1.5 flex min-w-0 items-center gap-2.5 rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs text-[#111318]">
            <Globe
              className="h-3.5 w-3.5 shrink-0 text-[#0f766e]"
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate font-mono text-[11px]">
              https://arclight-revenue.example
            </span>
            <span className="shrink-0 font-mono text-[10px] text-[#586276]">
              Sample URL
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <PreviewField label="Offer summary">
            Revenue intelligence workspace for B2B software revenue teams.
          </PreviewField>
          <PreviewField label="Target audience">
            VP Revenue Operations and Sales leaders at 50–500 person software
            companies.
          </PreviewField>
        </div>

        <div className="border-t border-[#e2e8f0] pt-3">
          <PreviewField label="Value proposition">
            Connects offer context, account evidence, and human review in one
            qualification workflow.
          </PreviewField>
        </div>

        <div className="border-t border-[#e2e8f0] pt-3">
          <PreviewField label="Key outcomes">
            <ul className="space-y-1">
              <li className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] text-[#b45309]">01</span>
                <span>A consistent qualification framework</span>
              </li>
              <li className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] text-[#b45309]">02</span>
                <span>Evidence a reviewer can inspect and approve</span>
              </li>
            </ul>
          </PreviewField>
        </div>
      </div>
    </PreviewFrame>
  );
}

function IcpDefinitionPreview() {
  return (
    <PreviewFrame
      title="ICP qualification framework"
      contextLabel="Illustrative preview · Workspace criteria"
      description={
        'Illustrative ideal-customer-profile preview with industry, company size, geography, qualification preferences, and inclusion and exclusion criteria.'
      }
    >
      <div className="space-y-3.5 text-left">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-[#e2e8f0] pb-3 sm:grid-cols-3">
          <PreviewField label="Industry profile">
            B2B software &amp; technology
          </PreviewField>
          <PreviewField label="Company size">
            <span className="font-mono tabular-nums">50–500</span> employees
          </PreviewField>
          <PreviewField
            label="Geography"
            className="col-span-2 sm:col-span-1"
          >
            North America
          </PreviewField>
        </div>

        <div className="border-b border-[#e2e8f0] pb-3">
          <PreviewField label="Qualification preferences">
            Evidence-backed fit · Human review before outreach · Named account
            owner
          </PreviewField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.07em] text-[#0f766e] uppercase">
              Inclusion criteria
            </p>
            <ul className="mt-1.5 space-y-1.5 text-xs text-[#111318]">
              <li className="border-b border-[#e2e8f0]/70 pb-1">
                Subscription software with a defined ICP
              </li>
              <li>Active revenue operations function</li>
            </ul>
          </div>

          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.07em] text-[#b45309] uppercase">
              Exclusion criteria
            </p>
            <ul className="mt-1.5 space-y-1.5 text-xs text-[#4a5365]">
              <li className="border-b border-[#e2e8f0]/70 pb-1">
                Agencies and consultancies
              </li>
              <li>Consumer-only mobile applications</li>
            </ul>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

const SAMPLE_COMPANIES = [
  {
    name: 'Northstar Software Group',
    industry: 'Software & Technology',
    location: 'Austin, TX',
    source: 'Workspace directory',
    status: 'Ready to evaluate',
    statusClassName: 'text-[#0f766e]',
  },
  {
    name: 'Meridian Data Systems',
    industry: 'Data infrastructure',
    location: 'Columbus, OH',
    source: 'Imported CSV',
    status: 'Pending review',
    statusClassName: 'text-[#b45309]',
  },
  {
    name: 'Halcyon Cloud Works',
    industry: 'B2B SaaS',
    location: 'Indianapolis, IN',
    source: 'Manual entry',
    status: 'Needs context',
    statusClassName: 'text-[#586276]',
  },
] as const;

function CompanyDiscoveryPreview() {
  return (
    <PreviewFrame
      title="Candidate company directory"
      contextLabel="Illustrative preview · Sample records"
      description={
        'Illustrative candidate company list with three sample accounts, locations, discovery sources, and review statuses. No live provider is connected.'
      }
    >
      <div className="space-y-3 text-left">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0] pb-2.5 text-[11px] text-[#586276]">
          <span>
            Showing{' '}
            <strong className="font-mono font-medium text-[#111318] tabular-nums">
              3
            </strong>{' '}
            illustrative candidate accounts
          </span>
          <span className="font-mono text-[10.5px]">
            No live provider connected
          </span>
        </div>

        <div className="divide-y divide-[#e2e8f0]">
          {SAMPLE_COMPANIES.map((company) => (
            <div
              key={company.name}
              className="grid gap-1 py-2.5 sm:grid-cols-[1.45fr_1fr_1fr] sm:items-center sm:gap-3"
            >
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-[#111318]">
                  {company.name}
                </div>
                <div className="truncate text-[11px] text-[#586276]">
                  {company.industry}
                </div>
              </div>

              <div className="text-[11px] text-[#111318]">
                <div>{company.location}</div>
                <div className="text-[#586276]">{company.source}</div>
              </div>

              <div
                className={`text-[11px] font-medium sm:text-right ${company.statusClassName}`}
              >
                {company.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PreviewFrame>
  );
}

const FIT_FACTORS = [
  {
    factor: 'ICP & industry alignment',
    weight: '35%',
    score: '33 / 35',
    confidence: 'High',
  },
  {
    factor: 'Company size & geography',
    weight: '25%',
    score: '23 / 25',
    confidence: 'High',
  },
  {
    factor: 'Revenue operations signal',
    weight: '20%',
    score: '17 / 20',
    confidence: 'Moderate',
  },
  {
    factor: 'Evidence completeness',
    weight: '20%',
    score: '19 / 20',
    confidence: 'Partial',
  },
] as const;

function EvidenceQualificationPreview() {
  return (
    <PreviewFrame
      title="Explainable fit assessment"
      contextLabel="Illustrative preview · Report anl_example_01"
      description={
        'Illustrative qualification report for Northstar Software Group with a 92 out of 100 sample fit score, four weighted factors, one evidence record, and a noted information gap.'
      }
    >
      <div className="space-y-3.5 text-left">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e2e8f0] pb-2.5">
          <div>
            <div className="text-xs font-semibold text-[#111318]">
              Northstar Software Group
            </div>
            <div className="text-[11px] text-[#586276]">
              Assessment confidence: Moderate-High · Illustrative sample
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10.5px] tracking-[0.06em] text-[#586276] uppercase">
              Fit score{' '}
            </span>
            <span className="font-mono text-base font-semibold text-[#111318] tabular-nums">
              92
            </span>
            <span className="font-mono text-xs text-[#586276]"> / 100</span>
          </div>
        </div>

        <div className="divide-y divide-[#e2e8f0]/80">
          {FIT_FACTORS.map((item) => (
            <div
              key={item.factor}
              className="flex items-center justify-between gap-3 py-1.5 text-xs"
            >
              <span className="min-w-0 truncate text-[#111318]">
                {item.factor}
              </span>
              <div className="flex shrink-0 items-center gap-3 font-mono text-[10.5px] tabular-nums">
                <span className="text-[#586276]">Wt {item.weight}</span>
                <span className="font-medium text-[#111318]">{item.score}</span>
                <span className="hidden text-[#0f766e] sm:inline">
                  {item.confidence}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 border-t border-[#e2e8f0] pt-3 sm:grid-cols-2">
          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.07em] text-[#586276] uppercase">
              Supporting evidence &amp; source
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#111318]">
              <span className="font-mono text-[#0f766e]">EV-01</span> Operates a
              40-person revenue operations team across two US offices.{' '}
              <span className="text-[#586276]">
                (Source: Imported company brief)
              </span>
            </p>
          </div>
          <div>
            <p className="text-[10.5px] font-semibold tracking-[0.07em] text-[#b45309] uppercase">
              Missing information
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#111318]">
              Current CRM vendor and contract renewal window are unconfirmed.
            </p>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

function OutreachPreparationPreview() {
  return (
    <PreviewFrame
      title="Contextual outreach draft"
      contextLabel="Illustrative preview · Pending approval"
      description={
        'Illustrative outreach draft for Northstar Software Group with company context, an unconfirmed contact, evidence references, and a pending human approval state. Outbound sending is not connected.'
      }
    >
      <div className="space-y-3.5 text-left">
        <div className="grid gap-3 border-b border-[#e2e8f0] pb-3 sm:grid-cols-2">
          <PreviewField label="Company context">
            Northstar Software Group · 220 employees · Austin, TX
          </PreviewField>
          <PreviewField label="Contact context">
            VP Revenue Operations{' '}
            <span className="text-[#586276]">· Direct email unconfirmed</span>
          </PreviewField>
        </div>

        <div className="rounded-lg border border-[#e2e8f0] bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0] pb-2 text-xs">
            <span className="font-medium text-[#111318]">
              Subject: A qualification workflow for Northstar’s revenue team
            </span>
            <span className="font-mono text-[10.5px] font-medium text-[#b45309]">
              Awaiting human approval
            </span>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-[#111318]">
            Noticed Northstar’s revenue operations team is scaling across two US
            offices{' '}
            <span className="font-mono text-[10.5px] text-[#0f766e]">
              [EV-01]
            </span>
            . Teams at that stage often need one place to review account fit and
            the evidence behind it{' '}
            <span className="font-mono text-[10.5px] text-[#0f766e]">
              [Offer-02]
            </span>
            . Worth comparing notes before the next planning cycle?
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-[#586276]">
          <span>
            Evidence references:{' '}
            <span className="font-mono text-[#111318]">EV-01</span>,{' '}
            <span className="font-mono text-[#111318]">Offer-02</span>
          </span>
          <span>Draft only · No outbound send connected</span>
        </div>
      </div>
    </PreviewFrame>
  );
}

const AUDIT_ENTRIES = [
  {
    time: '10:42',
    actor: 'Elena Vance',
    action: 'Reviewed evidence report anl_example_01 and noted the CRM gap',
  },
  {
    time: '10:45',
    actor: 'Elena Vance',
    action: 'Approved qualification status: Qualified for outreach',
  },
  {
    time: '10:47',
    actor: 'Elena Vance',
    action: 'Assigned contact verification before campaign handoff',
  },
] as const;

function HumanReviewPreview() {
  return (
    <PreviewFrame
      title="Accountable decision & audit log"
      contextLabel="Illustrative preview · Human review record"
      description={
        'Illustrative human review record with a qualification decision, named reviewer, approval-state example, and three activity-history entries.'
      }
    >
      <div className="space-y-3.5 text-left">
        <div className="grid gap-3 border-b border-[#e2e8f0] pb-3 sm:grid-cols-2">
          <PreviewField label="Qualification decision">
            <span className="font-semibold text-[#0f766e]">
              Qualified for outreach
            </span>
            <div className="mt-0.5 text-[11px] text-[#586276]">
              3 supporting records · 1 noted gap
            </div>
          </PreviewField>

          <PreviewField label="Responsible reviewer">
            <span className="font-medium">Elena Vance · Commercial Lead</span>
            <div className="mt-0.5 text-[11px] text-[#586276]">
              Human decision recorded
            </div>
          </PreviewField>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0] pb-3">
          <span className="text-[10.5px] font-semibold tracking-[0.07em] text-[#586276] uppercase">
            Outreach approval state (preview)
          </span>
          <div className="inline-flex items-center rounded-md border border-[#e2e8f0] bg-white p-0.5 text-[10.5px]">
            <span className="rounded-sm bg-[#111318] px-2.5 py-1 font-medium text-white">
              Approved
            </span>
            <span className="px-2.5 py-1 text-[#586276]">Revise</span>
            <span className="px-2.5 py-1 text-[#586276]">Hold</span>
          </div>
        </div>

        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.07em] text-[#586276] uppercase">
            Activity history
          </p>
          <ul className="mt-1.5 divide-y divide-[#e2e8f0]/80">
            {AUDIT_ENTRIES.map((entry) => (
              <li
                key={`${entry.time}-${entry.action}`}
                className="flex items-baseline gap-3 py-1.5 text-[11px]"
              >
                <span className="shrink-0 font-mono text-[#586276] tabular-nums">
                  {entry.time}
                </span>
                <span className="min-w-0 text-[#111318]">
                  <strong className="font-medium">{entry.actor}</strong> —{' '}
                  {entry.action}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PreviewFrame>
  );
}

export function WorkflowStagePreview({ stageId }: { stageId: WorkflowStageId }) {
  switch (stageId) {
    case 'offer':
      return <OfferAnalysisPreview />;
    case 'icp':
      return <IcpDefinitionPreview />;
    case 'discovery':
      return <CompanyDiscoveryPreview />;
    case 'evidence':
      return <EvidenceQualificationPreview />;
    case 'outreach':
      return <OutreachPreparationPreview />;
    case 'review':
      return <HumanReviewPreview />;
  }
}
