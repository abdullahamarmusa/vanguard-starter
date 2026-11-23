'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrototypeStore } from '@/store/prototype-context';
import { formatNumber } from '@/lib/utils';

export default function BillingPage() {
  const { activeOrg, creditsRemaining, setPlansModalOpen } =
    usePrototypeStore();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Badge variant="default" className="mb-2">
          Organization
        </Badge>
        <h1 className="text-text-primary text-2xl font-bold">
          Billing &amp; Usage
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Illustrative subscription and AI credit quota overview for{' '}
          {activeOrg.name}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="text-brand h-4 w-4" />
            <CardTitle>Current Subscription</CardTitle>
          </div>
          <Badge variant="brand">{activeOrg.plan} Plan</Badge>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-btn border-border-subtle bg-app/55 border p-3.5">
              <p className="text-text-secondary">AI Credits Remaining</p>
              <p className="text-text-primary mt-1 text-xl font-bold tabular-nums">
                {formatNumber(creditsRemaining)}
              </p>
            </div>
            <div className="rounded-btn border-border-subtle bg-app/55 border p-3.5">
              <p className="text-text-secondary">Billing Status</p>
              <p className="text-success mt-1 text-xl font-bold">
                Prototype Preview
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => setPlansModalOpen(true)}>
            Compare Plans &amp; Quotas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
