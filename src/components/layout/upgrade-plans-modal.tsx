'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrototypeStore } from '@/store/prototype-context';

const PLANS = [
  {
    name: 'Starter',
    price: '$79',
    period: '/mo',
    description:
      'For independent studios running focused offer-to-lead discovery.',
    features: [
      '15 Offer Analyses / month',
      '500 Enriched Prospects',
      '2 Active Outreach Campaigns',
      'Human-in-the-loop approval gates',
    ],
    current: false,
  },
  {
    name: 'Pro',
    price: '$249',
    period: '/mo',
    description:
      'For growing software agencies scaling intelligence & campaigns.',
    features: [
      '75 Offer Analyses / month',
      '5,000 Enriched Prospects',
      'Unlimited Campaigns & Custom AI Agents',
      'Evidence exports (PDF / CSV) & Audit Logs',
    ],
    current: true,
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description:
      'Dedicated data provider quotas, SSO, and custom RLS governance.',
    features: [
      'Unlimited Analyses & Organization Seats',
      'Custom Enrichment Provider Connectors',
      'Dedicated SLA & Compliance Controls',
      'Custom Agent Execution Quotas',
    ],
    current: false,
  },
];

export function UpgradePlansModal() {
  const { plansModalOpen, setPlansModalOpen, pushToast } = usePrototypeStore();

  return (
    <Modal
      open={plansModalOpen}
      onClose={() => setPlansModalOpen(false)}
      title="VANGUARD Plans"
      description="Illustrative SaaS packaging preview — billing connects to your existing billing provider."
      size="xl"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-card flex flex-col border p-4 ${
              plan.recommended
                ? 'border-brand-border bg-brand-soft/30'
                : 'border-border-subtle bg-elevated/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-text-primary text-base font-semibold">
                {plan.name}
              </h3>
              {plan.recommended && <Badge variant="brand">Current</Badge>}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-text-primary text-2xl font-bold">
                {plan.price}
              </span>
              <span className="text-text-secondary text-xs">{plan.period}</span>
            </div>
            <p className="text-text-secondary mt-2 text-xs">
              {plan.description}
            </p>

            <ul className="text-text-primary mt-4 flex-1 space-y-2 text-xs">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2">
                  <Check className="text-teal-brand mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.recommended ? 'secondary' : 'primary'}
              size="sm"
              className="mt-5 w-full"
              onClick={() => {
                setPlansModalOpen(false);
                pushToast({
                  title: `${plan.name} plan selected (Prototype)`,
                  description:
                    'No live billing charge occurs in UI prototype mode.',
                  variant: 'info',
                });
              }}
            >
              {plan.current ? 'Active Workspace Plan' : `Select ${plan.name}`}
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
