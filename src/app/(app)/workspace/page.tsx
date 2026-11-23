import React, { Suspense } from 'react';
import { WorkspaceView } from '@/features/workspace/workspace-view';

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={<div className="rounded-card bg-surface h-64 animate-pulse" />}
    >
      <WorkspaceView />
    </Suspense>
  );
}
