import React, { Suspense } from 'react';
import { ProspectsWorkspace } from '@/features/prospects/prospects-workspace';

export default function ProspectsPage() {
  return (
    <Suspense
      fallback={<div className="rounded-card bg-surface h-64 animate-pulse" />}
    >
      <ProspectsWorkspace />
    </Suspense>
  );
}
