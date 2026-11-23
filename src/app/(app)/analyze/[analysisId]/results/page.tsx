import React from 'react';
import { AnalysisResultsView } from '@/features/analyze/analysis-results-view';

export const instant = false;

export default async function AnalysisResultsPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = await params;
  return <AnalysisResultsView analysisId={analysisId} />;
}
