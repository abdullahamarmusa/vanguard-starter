'use client';

import React from 'react';
import {
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, extractDomainOrLabel, getMatchScoreTone } from '@/lib/utils';
import type { ProspectCompany } from '@/types/vanguard';

interface CompanyCompareModalProps {
  open: boolean;
  companies: ProspectCompany[];
  onClose: () => void;
  onInspectCompany: (company: ProspectCompany) => void;
  onToggleSave: (companyId: string) => void;
}

export function CompanyCompareModal({
  open,
  companies,
  onClose,
  onInspectCompany,
  onToggleSave,
}: CompanyCompareModalProps) {
  if (!open || companies.length < 2) return null;

  const bestScore = Math.max(...companies.map((c) => c.matchScore));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Side-by-Side Qualification Comparison (${companies.length} Companies)`}
      description="Compare explainable fit scores, evidence coverage, gaps, and next actions across shortlisted organizations."
      size="xl"
    >
      <div
        className={cn(
          'grid gap-4',
          companies.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3',
        )}
      >
        {companies.map((company) => {
          const tone = getMatchScoreTone(company.matchScore);
          const verifiedCount = company.evidence.filter(
            (e) => e.verification === 'verified',
          ).length;
          const isLeader = company.matchScore === bestScore;

          return (
            <div
              key={company.id}
              className={cn(
                'rounded-card flex flex-col justify-between border p-4',
                isLeader
                  ? 'border-teal-brand/50 bg-teal-soft/10'
                  : 'border-border-subtle bg-app/50',
              )}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="border-border-subtle flex items-start justify-between gap-2 border-b pb-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{ backgroundColor: company.logoColor }}
                    >
                      {company.logoText}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-text-primary truncate text-sm font-bold">
                          {company.name}
                        </p>
                        {isLeader && <Badge variant="teal">Top Fit</Badge>}
                      </div>
                      <p className="text-text-secondary truncate text-[11px]">
                        {extractDomainOrLabel(company.website)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fit Score & Confidence */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-btn border-border-subtle bg-surface border p-2.5">
                    <span className="text-text-disabled block text-[10px] uppercase">
                      Fit Score
                    </span>
                    <span className="text-text-primary mt-0.5 block text-lg font-bold tabular-nums">
                      {company.matchScore}%
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
                        tone.className,
                      )}
                    >
                      {tone.label}
                    </span>
                  </div>
                  <div className="rounded-btn border-border-subtle bg-surface border p-2.5">
                    <span className="text-text-disabled block text-[10px] uppercase">
                      Evidence
                    </span>
                    <span className="text-text-primary mt-0.5 block text-lg font-bold tabular-nums">
                      {company.evidence.length}
                    </span>
                    <span className="text-teal-brand inline-flex items-center gap-1 text-[10px]">
                      <ShieldCheck className="h-3 w-3" />
                      {verifiedCount} verified
                    </span>
                  </div>
                </div>

                {/* Firmographics */}
                <dl className="space-y-1.5 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-text-secondary">Industry</dt>
                    <dd className="text-text-primary text-right font-medium">
                      {company.industry}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-text-secondary">Size</dt>
                    <dd className="text-text-primary text-right font-medium">
                      {company.employeeRange}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-text-secondary">Revenue</dt>
                    <dd className="text-text-primary text-right font-medium">
                      {company.annualRevenue}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-text-secondary">Region</dt>
                    <dd className="text-text-primary text-right font-medium">
                      {company.region}
                    </dd>
                  </div>
                </dl>

                {/* Fit Rubric Breakdown */}
                <div className="border-border-subtle space-y-2 border-t pt-3">
                  <p className="text-text-disabled text-[10px] font-semibold tracking-wider uppercase">
                    Qualification Rubric
                  </p>
                  {company.fitFactors.slice(0, 3).map((factor) => (
                    <div key={factor.label} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-text-secondary truncate">
                          {factor.label}
                        </span>
                        <span className="text-text-primary font-mono font-semibold">
                          {factor.score}
                        </span>
                      </div>
                      <div className="bg-surface h-1.5 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-teal-brand h-full rounded-full"
                          style={{ width: `${factor.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top Why Match + Missing Info */}
                <div className="border-border-subtle space-y-2 border-t pt-3 text-[11px]">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="text-teal-brand mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <p className="text-text-primary leading-snug">
                      {company.whyMatch[0]}
                    </p>
                  </div>
                  {company.missingInfo && company.missingInfo.length > 0 && (
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="text-warning mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <p className="text-text-secondary leading-snug">
                        Gap: {company.missingInfo[0]}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="border-border-subtle mt-4 flex items-center gap-2 border-t pt-3">
                <Button
                  size="xs"
                  className="flex-1"
                  onClick={() => {
                    onClose();
                    onInspectCompany(company);
                  }}
                >
                  Open Drawer
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => onToggleSave(company.id)}
                  aria-label={
                    company.saved
                      ? `Unsave ${company.name}`
                      : `Save ${company.name}`
                  }
                >
                  {company.saved ? (
                    <BookmarkCheck className="text-brand h-3.5 w-3.5" />
                  ) : (
                    <Bookmark className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
