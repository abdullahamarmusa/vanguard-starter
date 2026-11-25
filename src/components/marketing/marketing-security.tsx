import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeCheck,
  Eye,
  LockKeyhole,
  UserCheck,
} from 'lucide-react';

const controls = [
  {
    title: 'Evidence transparency',
    description:
      'Inspect weighted factors, source type, source links, verification status, confidence, and known gaps beside each qualification record.',
    status: 'Visible in the prototype',
    icon: Eye,
  },
  {
    title: 'Human approval',
    description:
      'Keep qualification and exclusion decisions with a reviewer. The workflow prepares context; it does not authorize autonomous action.',
    status: 'Required operating control',
    icon: UserCheck,
  },
  {
    title: 'Data handling',
    description:
      'The preview uses illustrative records. Production retention, deletion, access, and processing terms are not yet published.',
    status: 'Production policy pending',
    icon: LockKeyhole,
  },
  {
    title: 'Outreach controls',
    description:
      'Campaign delivery, suppression lists, and unsubscribe enforcement are not implemented. No message is sent from the prototype.',
    status: 'Required before production',
    icon: BadgeCheck,
  },
];

export function MarketingSecurity() {
  return (
    <section
      id="security"
      className="marketing-section bg-[#111318] text-white"
    >
      <div className="marketing-container grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
        <div>
          <h2 className="font-display max-w-[480px] text-[clamp(36px,4.4vw,58px)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Clear evidence. Human control.
          </h2>
          <p className="mt-6 max-w-[460px] text-lg leading-relaxed text-[#cbd5e1]">
            Qualification should make the decision easier to inspect, not remove
            the person responsible for it.
          </p>
          <Link
            href="/roadmap"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#fbbf24] hover:underline"
          >
            Review the product roadmap
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {controls.map((control) => {
            const Icon = control.icon;
            return (
              <article
                key={control.title}
                className="rounded-card bg-[#1a1d24] p-6"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="h-5 w-5 shrink-0 text-[#fbbf24]"
                    aria-hidden="true"
                  />
                  <h3 className="text-lg font-semibold">{control.title}</h3>
                </div>
                <p className="mt-4 text-base leading-relaxed text-[#cbd5e1]">
                  {control.description}
                </p>
                <p className="mt-5 text-sm font-semibold text-[#fbbf24]">
                  {control.status}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
