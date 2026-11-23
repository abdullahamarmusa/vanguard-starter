import React from 'react';
import { Suspense } from 'react';
import { AnalyzeEntryView } from '@/features/analyze/analyze-entry-view';

async function AnalyzeContent({ searchParams }: PageProps<'/analyze'>) {
  const { input } = await searchParams;
  const initialInput = Array.isArray(input) ? input[0] : input;
  return <AnalyzeEntryView initialInput={initialInput} />;
}

export default function AnalyzePage(props: PageProps<'/analyze'>) {
  return (
    <Suspense
      fallback={<div className="rounded-card bg-surface h-64 animate-pulse" />}
    >
      <AnalyzeContent {...props} />
    </Suspense>
  );
}
