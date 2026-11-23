'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  CheckCircle2,
  Link2,
  Megaphone,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/ui/brand-mark';
import { analyzeSubmissionSchema } from '@/lib/validation';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn } from '@/lib/utils';

const EXAMPLE_PROMPTS = [
  'SaaS for remote teams',
  'E-commerce tool',
  'AI productivity app',
  'Marketing agency',
];

const QUICK_ACTIONS = [
  {
    label: 'View Recent Reports',
    href: '/reports',
    icon: BarChart3,
    iconColor: 'text-text-primary bg-elevated border-border-subtle',
  },
  {
    label: 'Manage Campaigns',
    href: '/campaigns',
    icon: Megaphone,
    iconColor: 'text-text-primary bg-elevated border-border-subtle',
  },
  {
    label: 'Open Workspace',
    href: '/workspace',
    icon: Briefcase,
    iconColor: 'text-text-primary bg-elevated border-border-subtle',
  },
  {
    label: 'Explore AI Agents',
    href: '/agents',
    icon: Bot,
    iconColor: 'text-brand bg-brand-soft border-brand-border',
  },
];

export function QuickAnalyzeHero() {
  const router = useRouter();
  const { user, activeOrg } = usePrototypeStore();
  const [activeTab, setActiveTab] = useState<
    'analyze' | 'prospects' | 'campaign'
  >('analyze');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (activeTab === 'prospects') {
      const q = inputValue.trim();
      router.push(q ? `/prospects?q=${encodeURIComponent(q)}` : '/prospects');
      return;
    }

    if (activeTab === 'campaign') {
      router.push('/campaigns?create=1');
      return;
    }

    const parsed = analyzeSubmissionSchema.safeParse({ inputValue });
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ??
          'Please provide a valid URL, offer, or idea.',
      );
      return;
    }

    if (/^https?:\/\//i.test(parsed.data.inputValue)) {
      try {
        const url = new URL(parsed.data.inputValue);
        if (!url.hostname.includes('.')) throw new Error('Invalid hostname');
      } catch {
        setError('Enter a valid website URL or describe your offer.');
        return;
      }
    }

    setError(null);
    setSubmitting(true);
    router.push(`/analyze?input=${encodeURIComponent(parsed.data.inputValue)}`);
  };

  return (
    <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-12">
      {/* Welcome + Quick Analyze Panel */}
      <div className="vanguard-hero-surface rounded-panel border-border-subtle shadow-card relative overflow-hidden border p-5 sm:p-6 xl:col-span-9">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-[30px] sm:leading-[1.18]">
                Welcome back,{' '}
                <span className="text-brand">{user.firstName}!</span>
              </h1>
              <span className="border-border-subtle bg-elevated text-text-secondary rounded-full border px-2.5 py-0.5 text-[11px] font-medium">
                {activeOrg.name}
              </span>
            </div>
            <p className="text-text-secondary mt-1.5 text-sm">
              Turn ideas into qualified business opportunities with VANGUARD.
            </p>

            {/* Compact Quick Analyze Container */}
            <div className="rounded-card border-border-subtle bg-app/75 mt-5 border p-4">
              {/* Mini Mode Tabs */}
              <div className="border-border-subtle mb-3 flex flex-wrap items-center gap-1 border-b pb-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('analyze');
                    setError(null);
                  }}
                  className={cn(
                    'rounded-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors',
                    activeTab === 'analyze'
                      ? 'bg-brand-soft text-brand border-brand-border border'
                      : 'text-text-secondary hover:bg-hover hover:text-text-primary',
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Analyze an Offer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('prospects');
                    setError(null);
                  }}
                  className={cn(
                    'rounded-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                    activeTab === 'prospects'
                      ? 'bg-elevated text-text-primary border-border-strong border'
                      : 'text-text-secondary hover:bg-hover hover:text-text-primary',
                  )}
                >
                  <Search className="h-3.5 w-3.5" />
                  Find Prospects
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('campaign');
                    setError(null);
                  }}
                  className={cn(
                    'rounded-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
                    activeTab === 'campaign'
                      ? 'bg-elevated text-text-primary border-border-strong border'
                      : 'text-text-secondary hover:bg-hover hover:text-text-primary',
                  )}
                >
                  <Megaphone className="h-3.5 w-3.5" />
                  Launch Campaign
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="quick-analyze-input" className="sr-only">
                  Website URL, offer description, or business idea
                </label>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <div className="relative flex-1">
                    <Link2 className="text-text-disabled pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <input
                      id="quick-analyze-input"
                      type="text"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder={
                        activeTab === 'analyze'
                          ? 'Paste a website URL, describe your offer, or share a business idea...'
                          : activeTab === 'prospects'
                            ? 'Search companies by name, industry, or location...'
                            : 'Ready to organize outreach? Launch the campaign builder...'
                      }
                      aria-invalid={Boolean(error)}
                      className={cn(
                        'rounded-btn bg-surface text-text-primary placeholder:text-text-disabled h-11 w-full border pr-3 pl-9 text-sm',
                        'focus:ring-brand/40 focus:border-brand focus:ring-2 focus:outline-none',
                        error ? 'border-danger' : 'border-border-subtle',
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    loading={submitting}
                    className="h-11 shrink-0 px-5"
                  >
                    <span>
                      {activeTab === 'analyze'
                        ? 'Start Analysis'
                        : activeTab === 'prospects'
                          ? 'Search Prospects'
                          : 'Open Builder'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="text-danger mt-2 text-xs font-medium"
                  >
                    {error}
                  </p>
                )}

                {activeTab === 'analyze' && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-text-disabled mr-1 text-[11px]">
                      Try examples:
                    </span>
                    {EXAMPLE_PROMPTS.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => {
                          setInputValue(example);
                          setError(null);
                        }}
                        className="border-border-subtle bg-surface text-text-secondary hover:border-brand-border hover:text-text-primary rounded-full border px-2.5 py-1 text-[11px] transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Brand Value Pillar (Subtle & Enterprise) */}
          <div className="rounded-card border-border-subtle/80 bg-app/55 hidden shrink-0 flex-col items-start justify-between border p-4 lg:flex lg:w-56">
            <div className="flex items-center gap-3">
              <BrandMark className="h-10 w-10" />
              <div>
                <p className="text-text-primary text-xs font-semibold">
                  Offer-to-Lead
                </p>
                <p className="text-text-secondary text-[11px]">
                  Intelligence Engine
                </p>
              </div>
            </div>
            <ul className="text-text-primary mt-4 space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-teal-brand h-4 w-4 shrink-0" />
                <span>Discover Ideal Companies</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-teal-brand h-4 w-4 shrink-0" />
                <span>Qualify with Evidence</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-teal-brand h-4 w-4 shrink-0" />
                <span>Human-Approved Outreach</span>
              </li>
            </ul>
            <Link
              href="/analyze"
              className="text-brand mt-4 inline-flex items-center gap-1 text-xs font-medium hover:underline"
            >
              Open full Analyze workspace
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="rounded-panel border-border-subtle bg-surface shadow-card flex flex-col justify-between border p-5 xl:col-span-3">
        <div>
          <div className="mb-3.5 flex items-center gap-2">
            <Zap className="text-brand h-4 w-4" />
            <h2 className="text-text-primary text-sm font-semibold">
              Quick Actions
            </h2>
          </div>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-btn border-border-subtle bg-app/50 text-text-primary hover:border-border-strong hover:bg-hover flex items-center justify-between border px-3 py-2.5 text-xs font-medium transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-lg border',
                        action.iconColor,
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span>{action.label}</span>
                  </span>
                  <ArrowRight className="text-text-disabled group-hover:text-text-primary h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
