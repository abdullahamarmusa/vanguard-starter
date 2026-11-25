import { WorkflowCard } from './workflow-card';
import { WORKFLOW_INTRO, WORKFLOW_STAGES } from './workflow-data';

export function MarketingWorkflow() {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-heading"
      className="workflow-section"
    >
      <div className="workflow-container">
        <div className="flex flex-col gap-6 border-b border-[#e2e8f0] pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pb-11">
          <div className="max-w-[700px]">
            <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.1em] text-[#b45309] uppercase">
              <span
                className="h-[2px] w-5 shrink-0 bg-[#f59e0b]"
                aria-hidden="true"
              />
              <span>{WORKFLOW_INTRO.eyebrow}</span>
            </p>

            <h2
              id="workflow-heading"
              className="font-display mt-4 text-[clamp(34px,4.2vw,54px)] leading-[1.02] font-semibold tracking-[-0.04em] text-[#111318] [text-wrap:balance]"
            >
              {WORKFLOW_INTRO.heading}
            </h2>

            <p className="mt-4 max-w-[640px] text-base leading-relaxed text-[#4a5365] sm:text-lg">
              {WORKFLOW_INTRO.description}
            </p>
          </div>

          <div className="max-w-[380px] space-y-1.5 text-[11.5px] leading-relaxed text-[#586276] lg:pb-1 lg:text-right">
            <p className="font-medium text-[#111318]">
              {WORKFLOW_INTRO.supportingLine}
            </p>
            <p>{WORKFLOW_INTRO.disclosure}</p>
          </div>
        </div>

        <ol className="workflow-stack">
          {WORKFLOW_STAGES.map((stage, index) => (
            <WorkflowCard key={stage.id} stage={stage} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
