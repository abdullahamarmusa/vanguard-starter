'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Megaphone,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrototypeStore } from '@/store/prototype-context';

export function RecentActivityCard() {
  const { recentActivity } = usePrototypeStore();

  const iconMeta = (category: string) => {
    switch (category) {
      case 'campaign':
        return {
          icon: <Megaphone className="text-ai h-4 w-4" />,
          bg: 'bg-ai/15 border-ai/25',
        };
      case 'prospect':
        return {
          icon: <CheckCircle2 className="text-teal-brand h-4 w-4" />,
          bg: 'bg-teal-soft border-teal-brand/30',
        };
      case 'analysis':
        return {
          icon: <Sparkles className="text-info h-4 w-4" />,
          bg: 'bg-info/15 border-info/25',
        };
      case 'report':
        return {
          icon: <BarChart3 className="text-brand h-4 w-4" />,
          bg: 'bg-brand-soft border-brand-border',
        };
      default:
        return {
          icon: <FileText className="text-text-secondary h-4 w-4" />,
          bg: 'bg-elevated border-border-subtle',
        };
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <Link
          href="/audit-logs"
          className="text-info inline-flex items-center gap-1 text-xs font-medium hover:underline"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivity.slice(0, 5).map((item) => {
            const meta = iconMeta(item.category);
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group rounded-btn hover:bg-hover flex items-start gap-3 p-2 transition-colors"
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${meta.bg}`}
                >
                  {meta.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-text-primary group-hover:text-brand truncate text-xs font-semibold">
                    {item.title}
                  </p>
                  <p className="text-text-secondary mt-0.5 line-clamp-2 text-[11px]">
                    {item.detail}
                  </p>
                  <p className="text-text-disabled mt-1 text-[10px]">
                    {item.timestamp}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
