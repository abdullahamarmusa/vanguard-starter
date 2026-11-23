'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Drawer } from '@/components/ui/drawer';
import { ProgressRing } from '@/components/ui/progress-ring';
import { createAgentSchema } from '@/lib/validation';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn, formatNumber } from '@/lib/utils';
import type {
  AgentCategory,
  AgentDefinition,
  AgentExecution,
} from '@/types/vanguard';

const AGENT_ACCENTS: Record<AgentDefinition['accent'], string> = {
  blue: 'bg-info/15 text-info border-info/30',
  purple: 'bg-ai/15 text-ai border-ai/30',
  teal: 'bg-teal-soft text-teal-brand border-teal-brand/30',
  orange: 'bg-brand-soft text-brand border-brand-border',
  green: 'bg-success/15 text-success border-success/30',
  violet: 'bg-ai/15 text-ai border-ai/30',
};

function AgentIcon({ category }: { category: AgentCategory }) {
  switch (category) {
    case 'Research':
      return <Search className="h-5 w-5" />;
    case 'Qualification':
      return <Building2 className="h-5 w-5" />;
    case 'Outreach':
      return <Mail className="h-5 w-5" />;
    case 'Analysis':
      return <BarChart3 className="h-5 w-5" />;
    case 'Content':
      return <FileText className="h-5 w-5" />;
    case 'Analytics':
      return <TrendingUp className="h-5 w-5" />;
  }
}

export function AgentsView() {
  const {
    agents,
    agentExecutions,
    creditsRemaining,
    runAgentSimulation,
    createCustomAgent,
    setPlansModalOpen,
  } = usePrototypeStore();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [selectedAgent, setSelectedAgent] = useState<AgentDefinition | null>(
    null,
  );
  const [runPrompt, setRunPrompt] = useState('');
  const [inspectExecution, setInspectExecution] =
    useState<AgentExecution | null>(null);
  const [docsOpen, setDocsOpen] = useState(false);

  // Create custom agent modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<AgentCategory>('Research');
  const [newDesc, setNewDesc] = useState('');
  const [newApproval, setNewApproval] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return agents.filter((ag) => {
      if (category !== 'All' && ag.category !== category) return false;
      if (
        q &&
        !ag.name.toLowerCase().includes(q) &&
        !ag.description.toLowerCase().includes(q) &&
        !ag.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
      return true;
    });
  }, [agents, search, category]);

  const usagePercent = Math.min(
    99,
    Math.round(((12900 - creditsRemaining) / 12900) * 100),
  );

  const handleRunAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    const promptToRun = runPrompt.trim() || selectedAgent.defaultPromptHint;
    const exec = runAgentSimulation(selectedAgent.id, promptToRun);
    setSelectedAgent(null);
    setRunPrompt('');
    if (exec) setInspectExecution(exec);
  };

  const handleCreateCustomAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = createAgentSchema.safeParse({
      name: newName,
      category: newCategory,
      description: newDesc,
      requiresApproval: newApproval,
    });
    if (!parsed.success) {
      setFormError(
        parsed.error.issues[0]?.message ?? 'Please complete required fields.',
      );
      return;
    }
    setFormError(null);
    createCustomAgent(parsed.data);
    setNewName('');
    setNewDesc('');
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="vanguard-hero-surface rounded-panel border-border-subtle shadow-card border p-6">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <Badge variant="ai" className="mb-3">
              <Bot className="h-3 w-3" />
              AI Agents · Shared Execution Framework
            </Badge>
            <h1 className="text-text-primary text-2xl font-bold tracking-tight sm:text-[32px]">
              AI Agents for <span className="text-brand">Smarter Growth</span>
            </h1>
            <p className="text-text-secondary mt-2 max-w-2xl text-sm leading-relaxed">
              Automate market research, qualify prospects, and draft
              evidence-backed outreach with specialized agents running on one
              governed, organization-scoped execution engine.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create Custom Agent
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" onClick={() => setDocsOpen(true)}>
                <BookOpen className="h-4 w-4" />
                View Documentation
              </Button>
            </div>
          </div>

          <div className="rounded-card border-border-subtle bg-app/60 border p-5 lg:col-span-4">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="border-brand-border bg-brand-soft text-brand flex h-9 w-9 items-center justify-center rounded-xl border">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-text-primary text-xs font-semibold">
                  Governed Intelligence
                </p>
                <p className="text-text-secondary text-[11px]">
                  Tenant-scoped &amp; auditable
                </p>
              </div>
            </div>
            <ul className="text-text-primary space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-teal-brand h-4 w-4" />
                <span>Save Time on Account Research</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-teal-brand h-4 w-4" />
                <span>Find Better, Evidence-Backed Leads</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="text-teal-brand h-4 w-4" />
                <span>Grow Faster with Human Approval Gates</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Available Agents Header + Search/Category Controls */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-text-primary text-lg font-semibold">
              Available Agents
            </h2>
            <p className="text-text-secondary text-xs">
              Specialized configurations powered by VANGUARD&apos;s unified
              agent runtime.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="text-text-disabled pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agents..."
                className="rounded-btn border-border-subtle bg-surface text-text-primary placeholder:text-text-disabled focus:border-brand h-9 w-full border pr-3 pl-8 text-xs focus:outline-none"
              />
            </div>
            <select
              aria-label="Filter agents by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-btn border-border-subtle bg-surface text-text-primary h-9 border px-3 text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Research">Research</option>
              <option value="Qualification">Qualification</option>
              <option value="Outreach">Outreach</option>
              <option value="Analysis">Analysis</option>
              <option value="Content">Content</option>
              <option value="Analytics">Analytics</option>
            </select>
          </div>
        </div>

        {/* 6 Agent Cards Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="flex flex-col justify-between p-5">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <span
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
                        AGENT_ACCENTS[agent.accent],
                      )}
                    >
                      <AgentIcon category={agent.category} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-text-primary text-sm font-semibold">
                          {agent.name}
                        </h3>
                        {agent.active && (
                          <Badge variant="success">Active</Badge>
                        )}
                      </div>
                      <p className="text-text-secondary mt-1 text-xs leading-relaxed">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {agent.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                  {agent.requiresApproval && (
                    <Badge variant="brand">Approval Gate</Badge>
                  )}
                </div>
              </div>

              <div className="border-border-subtle mt-5 flex items-center justify-between border-t pt-3.5">
                <span className="text-text-secondary inline-flex items-center gap-1.5 text-xs">
                  <Clock className="text-text-disabled h-3.5 w-3.5" />
                  {agent.estimatedDuration}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedAgent(agent);
                    setRunPrompt(agent.defaultPromptHint);
                  }}
                >
                  Run Agent
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom 2-Column Section: Agent Activity + Your AI Usage */}
      <section className="grid min-w-0 gap-5 xl:grid-cols-12">
        <Card className="min-w-0 xl:col-span-7">
          <CardHeader>
            <div>
              <CardTitle>Agent Activity</CardTitle>
              <p className="text-text-secondary mt-0.5 text-xs">
                Recent AI agent executions across your workspace (click any run
                to inspect evidence).
              </p>
            </div>
            <Badge variant="default">{agentExecutions.length} Runs</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {agentExecutions.map((exec) => (
              <button
                key={exec.id}
                type="button"
                onClick={() => setInspectExecution(exec)}
                className="rounded-btn border-border-subtle bg-app/50 hover:border-border-strong hover:bg-hover/60 flex w-full items-center justify-between gap-3 border p-3 text-left transition-colors"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
                      AGENT_ACCENTS[exec.accent],
                    )}
                  >
                    <Bot className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-text-primary truncate text-xs font-semibold">
                        {exec.agentName}
                      </p>
                      <Badge
                        variant={
                          exec.status === 'Completed'
                            ? 'success'
                            : exec.status === 'Awaiting Approval'
                              ? 'brand'
                              : 'info'
                        }
                      >
                        {exec.status}
                      </Badge>
                    </div>
                    <p className="text-text-secondary mt-0.5 truncate text-[11px]">
                      {exec.summary}
                    </p>
                  </div>
                </div>
                <span className="text-text-disabled shrink-0 text-[11px]">
                  {exec.timestamp}
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="min-w-0 xl:col-span-5">
          <CardHeader>
            <div>
              <CardTitle>Your AI Usage</CardTitle>
              <p className="text-text-secondary mt-0.5 text-xs">
                Track workspace AI agent quota and remaining credits
                (illustrative).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPlansModalOpen(true)}
              className="text-info inline-flex items-center gap-1 text-xs font-medium hover:underline"
            >
              View Details <ArrowRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="rounded-card border-border-subtle bg-app/55 flex flex-col items-center justify-between gap-6 border p-5 sm:flex-row">
              <ProgressRing
                value={usagePercent}
                size={124}
                strokeWidth={11}
                label={`${usagePercent}%`}
                sublabel="Used"
                accent="teal"
              />
              <div className="flex-1 text-center sm:text-left">
                <p className="text-text-secondary text-xs">Credits Remaining</p>
                <p className="text-text-primary mt-1 text-2xl font-bold tabular-nums">
                  {formatNumber(creditsRemaining)}
                </p>
                <p className="text-text-secondary mt-1 text-xs">
                  ≈ {Math.floor(creditsRemaining / 50)} offer analyses remaining
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => setPlansModalOpen(true)}
                >
                  Buy More Credits
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Run Agent Configuration & Approval Drawer */}
      <Drawer
        open={Boolean(selectedAgent)}
        onClose={() => setSelectedAgent(null)}
        title={
          selectedAgent ? `Configure & Run: ${selectedAgent.name}` : 'Run Agent'
        }
        description="Runs on VANGUARD's shared organization-scoped execution framework (prototype simulation)."
        widthClass="max-w-lg"
      >
        {selectedAgent && (
          <form onSubmit={handleRunAgent} className="space-y-5">
            <p className="text-text-secondary text-xs leading-relaxed">
              {selectedAgent.description}
            </p>

            <div>
              <p className="text-text-primary mb-2 text-xs font-semibold">
                Agent Capabilities
              </p>
              <ul className="text-text-secondary space-y-1.5 text-xs">
                {selectedAgent.capabilities.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <CheckCircle2 className="text-teal-brand mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedAgent.requiresApproval && (
              <div className="rounded-card border-brand-border bg-brand-soft/30 text-text-primary flex items-start gap-2.5 border p-3 text-xs">
                <ShieldCheck className="text-brand mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  <strong>Human Approval Required:</strong> Any external
                  outreach or publishable artifact generated by this agent
                  pauses in review until explicitly approved.
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="agent-prompt"
                className="text-text-primary mb-1.5 block text-xs font-semibold"
              >
                Execution Objective / Parameters
              </label>
              <Textarea
                id="agent-prompt"
                rows={4}
                value={runPrompt}
                onChange={(e) => setRunPrompt(e.target.value)}
              />
              <p className="text-text-disabled mt-1.5 text-[11px]">
                Estimated credit cost: ~25 credits · Estimated duration:{' '}
                {selectedAgent.estimatedDuration}
              </p>
            </div>

            <div className="border-border-subtle flex justify-end gap-2 border-t pt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedAgent(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                <Play className="h-3.5 w-3.5" />
                Execute Prototype Run
              </Button>
            </div>
          </form>
        )}
      </Drawer>

      {/* Execution Inspection Modal */}
      <Modal
        open={Boolean(inspectExecution)}
        onClose={() => setInspectExecution(null)}
        title={inspectExecution?.agentName ?? 'Execution Details'}
        description={
          inspectExecution
            ? `Status: ${inspectExecution.status} · ${inspectExecution.creditsUsed} credits used`
            : undefined
        }
      >
        {inspectExecution && (
          <div className="space-y-4 text-xs">
            <div className="rounded-btn border-border-subtle bg-app/60 border p-3">
              <p className="text-text-disabled text-[10px] font-semibold uppercase">
                Prompt / Input
              </p>
              <p className="text-text-primary mt-1">
                {inspectExecution.inputPrompt}
              </p>
            </div>

            <div>
              <p className="text-text-primary mb-1.5 font-semibold">Findings</p>
              <ul className="text-text-secondary space-y-1.5">
                {inspectExecution.findings.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="text-teal-brand mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-text-primary mb-1.5 font-semibold">
                Evidence Sources Inspected
              </p>
              <div className="flex flex-wrap gap-1.5">
                {inspectExecution.evidenceSources.map((src) => (
                  <Badge key={src} variant="info">
                    {src}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Custom Agent Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Custom Agent Configuration"
        description="Adds a new specialized profile onto VANGUARD's shared governed agent runtime."
        size="sm"
      >
        <form onSubmit={handleCreateCustomAgent} className="space-y-4">
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Agent Name *
            </label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Enterprise RFP Qualifier"
            />
          </div>
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Category *
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as AgentCategory)}
              className="rounded-btn border-border-subtle bg-app text-text-primary h-10 w-full border px-3 text-sm"
            >
              <option value="Research">Research</option>
              <option value="Qualification">Qualification</option>
              <option value="Outreach">Outreach</option>
              <option value="Analysis">Analysis</option>
              <option value="Content">Content</option>
              <option value="Analytics">Analytics</option>
            </select>
          </div>
          <div>
            <label className="text-text-secondary mb-1 block text-xs font-medium">
              Description *
            </label>
            <Textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Describe the agent's scope, evidence sources, and expected output..."
            />
          </div>
          <label className="text-text-primary flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={newApproval}
              onChange={(e) => setNewApproval(e.target.checked)}
              className="accent-brand h-4 w-4"
            />
            Require human approval before external actions
          </label>
          {formError && <p className="text-danger text-xs">{formError}</p>}
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Agent
            </Button>
          </div>
        </form>
      </Modal>

      {/* Documentation Drawer */}
      <Drawer
        open={docsOpen}
        onClose={() => setDocsOpen(false)}
        title="VANGUARD Agent Architecture"
        description="Governance and integration notes for your engineering repository."
        widthClass="max-w-md"
      >
        <div className="text-text-secondary space-y-4 text-xs leading-relaxed">
          <p className="text-text-primary font-semibold">
            Shared Execution Runtime
          </p>
          <p>
            This screen uses isolated illustrative agent simulations. It does
            not call an AI provider or the production workspace orchestration
            service.
          </p>
          <p className="text-text-primary font-semibold">
            Tenant Isolation &amp; Auditability
          </p>
          <p>
            The production implementation must scope each run to a verified
            Auth.js session and PostgreSQL RLS tenant context. External
            outreach must require an explicit human approval before dispatch.
          </p>
        </div>
      </Drawer>
    </div>
  );
}
