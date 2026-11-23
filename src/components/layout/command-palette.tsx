'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  FileSearch,
  Home,
  Megaphone,
  Search,
  Sparkles,
} from 'lucide-react';
import { usePrototypeStore } from '@/store/prototype-context';

interface CommandEntry {
  id: string;
  group: string;
  label: string;
  meta: string;
  href: string;
  icon: React.ReactNode;
}

export function CommandPalette() {
  const router = useRouter();
  const {
    commandOpen,
    setCommandOpen,
    prospects,
    campaigns,
    agents,
    analyses,
  } = usePrototypeStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!commandOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCommandOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [commandOpen, setCommandOpen]);

  const entries = useMemo<CommandEntry[]>(() => {
    const pages: CommandEntry[] = [
      {
        id: 'p_dash',
        group: 'Navigation',
        label: 'Dashboard',
        meta: 'Business intelligence overview',
        href: '/dashboard',
        icon: <Home className="text-brand h-4 w-4" />,
      },
      {
        id: 'p_analyze',
        group: 'Navigation',
        label: 'Analyze an Offer',
        meta: 'Start a new URL or idea analysis',
        href: '/analyze',
        icon: <Sparkles className="text-brand h-4 w-4" />,
      },
      {
        id: 'p_prospects',
        group: 'Navigation',
        label: 'Prospects',
        meta: 'Discover & qualify companies',
        href: '/prospects',
        icon: <FileSearch className="text-info h-4 w-4" />,
      },
      {
        id: 'p_campaigns',
        group: 'Navigation',
        label: 'Campaigns',
        meta: 'Outreach & human approvals',
        href: '/campaigns',
        icon: <Megaphone className="text-ai h-4 w-4" />,
      },
      {
        id: 'p_workspace',
        group: 'Navigation',
        label: 'Workspace',
        meta: 'Offers, ICPs, research & resources',
        href: '/workspace',
        icon: <Briefcase className="text-teal-brand h-4 w-4" />,
      },
      {
        id: 'p_reports',
        group: 'Navigation',
        label: 'Reports',
        meta: 'Performance, funnel & saved reports',
        href: '/reports',
        icon: <BarChart3 className="text-brand h-4 w-4" />,
      },
      {
        id: 'p_agents',
        group: 'Navigation',
        label: 'AI Agents',
        meta: 'Specialized agent library',
        href: '/agents',
        icon: <Bot className="text-ai h-4 w-4" />,
      },
    ];

    const prospectEntries: CommandEntry[] = prospects.slice(0, 5).map((p) => ({
      id: `pr_${p.id}`,
      group: 'Prospects (Illustrative)',
      label: p.name,
      meta: `${p.industry} · ${p.matchScore}% Match`,
      href: `/prospects?selected=${p.id}`,
      icon: <Building2 className="text-teal-brand h-4 w-4" />,
    }));

    const campaignEntries: CommandEntry[] = campaigns.slice(0, 4).map((c) => ({
      id: `cm_${c.id}`,
      group: 'Campaigns',
      label: c.name,
      meta: `${c.status} · ${c.qualifiedLeads} qualified leads`,
      href: `/campaigns?selected=${c.id}`,
      icon: <Megaphone className="text-brand h-4 w-4" />,
    }));

    const analysisEntries: CommandEntry[] = analyses.slice(0, 3).map((a) => ({
      id: `an_${a.id}`,
      group: 'Analyses',
      label: a.inputValue,
      meta: `${a.status} · ${a.matchesFound} matches`,
      href:
        a.status === 'completed'
          ? `/analyze/${a.id}/results`
          : `/analyze/${a.id}`,
      icon: <Sparkles className="text-ai h-4 w-4" />,
    }));

    const agentEntries: CommandEntry[] = agents.slice(0, 3).map((ag) => ({
      id: `ag_${ag.id}`,
      group: 'AI Agents',
      label: ag.name,
      meta: `${ag.category} · ${ag.estimatedDuration}`,
      href: `/agents`,
      icon: <Bot className="text-info h-4 w-4" />,
    }));

    return [
      ...pages,
      ...analysisEntries,
      ...prospectEntries,
      ...campaignEntries,
      ...agentEntries,
    ];
  }, [prospects, campaigns, agents, analyses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.meta.toLowerCase().includes(q) ||
        e.group.toLowerCase().includes(q),
    );
  }, [entries, query]);

  if (!commandOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Global command palette"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={() => setCommandOpen(false)}
        aria-hidden="true"
      />
      <div className="rounded-modal border-border-strong bg-surface shadow-elevated relative z-10 w-full max-w-xl overflow-hidden border">
        <div className="border-border-subtle flex items-center gap-3 border-b px-4 py-3">
          <Search className="text-text-secondary h-4 w-4" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a screen, company, campaign, analysis, or AI agent..."
            className="text-text-primary placeholder:text-text-disabled w-full bg-transparent text-sm focus:outline-none"
          />
          <kbd className="rounded-control border-border-subtle bg-elevated text-text-secondary border px-1.5 py-0.5 font-mono text-[10px]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-text-secondary py-10 text-center text-sm">
              No matching routes or resources found for &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCommandOpen(false);
                    router.push(item.href);
                  }}
                  className="rounded-btn hover:bg-hover flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="border-border-subtle bg-elevated flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-text-primary truncate text-sm font-medium">
                        {item.label}
                      </p>
                      <p className="text-text-secondary truncate text-xs">
                        {item.group} · {item.meta}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="text-text-disabled h-3.5 w-3.5 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
