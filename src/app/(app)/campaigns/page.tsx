import React, { Suspense } from 'react';
import { CampaignsWorkspace } from '@/features/campaigns/campaigns-workspace';

export default function CampaignsPage() {
  return (
    <Suspense
      fallback={<div className="rounded-card bg-surface h-64 animate-pulse" />}
    >
      <CampaignsWorkspace />
    </Suspense>
  );
}
