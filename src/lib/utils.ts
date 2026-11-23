import type { VerificationStatus } from '@/types/vanguard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function extractDomainOrLabel(input: string, maxLen = 42): string {
  const trimmed = input.trim();
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(trimmed)
        ? `https://${trimmed}`
        : null;
    if (withProtocol) {
      const parsed = new URL(withProtocol);
      return parsed.hostname.replace(/^www\./i, '');
    }
  } catch {
    // fallback to clean truncated label
  }
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen - 1)}…` : trimmed;
}

export function getMatchScoreTone(score: number): {
  label: string;
  className: string;
} {
  if (score >= 90) {
    return {
      label: 'High Fit',
      className: 'bg-success/15 text-success border-success/30',
    };
  }
  if (score >= 80) {
    return {
      label: 'Strong Fit',
      className: 'bg-teal-brand/15 text-teal-brand border-teal-brand/30',
    };
  }
  if (score >= 70) {
    return {
      label: 'Medium Fit',
      className: 'bg-brand/15 text-brand border-brand/30',
    };
  }
  return {
    label: 'Low Fit',
    className: 'bg-elevated text-text-secondary border-border-subtle',
  };
}

export function getVerificationMeta(status: VerificationStatus): {
  label: string;
  className: string;
  description: string;
} {
  switch (status) {
    case 'verified':
      return {
        label: 'Verified Fact',
        className: 'bg-success/15 text-success border-success/30',
        description:
          'Directly corroborated from an authoritative primary source.',
      };
    case 'provider_sourced':
      return {
        label: 'Provider-Sourced',
        className: 'bg-teal-brand/15 text-teal-brand border-teal-brand/30',
        description:
          'Retrieved from an authorized B2B enrichment data provider.',
      };
    case 'inferred':
      return {
        label: 'Inferred Signal',
        className: 'bg-warning/15 text-warning border-warning/30',
        description: 'Derived by correlating multiple public business signals.',
      };
    case 'ai_recommendation':
      return {
        label: 'AI Recommendation',
        className: 'bg-elevated text-text-primary border-border-strong',
        description:
          'Generated synthesis for operator review — not a verified fact.',
      };
    case 'unverified':
    default:
      return {
        label: 'Unverified',
        className: 'bg-elevated text-text-secondary border-border-subtle',
        description: 'Missing primary verification; confirm before outreach.',
      };
  }
}

export function detectAnalyzeInputType(
  input: string,
): 'url' | 'offer' | 'idea' {
  const trimmed = input.trim();
  if (/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(trimmed)) {
    return 'url';
  }
  if (trimmed.length > 48) {
    return 'offer';
  }
  return 'idea';
}

export function downloadTextFile(
  filename: string,
  content: string,
  mimeType = 'text/plain;charset=utf-8',
) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function toCsv(
  headers: string[],
  rows: (string | number | boolean)[][],
): string {
  const escape = (val: string | number | boolean) => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  return [
    headers.map(escape).join(','),
    ...rows.map((r) => r.map(escape).join(',')),
  ].join('\n');
}
