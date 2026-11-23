import React from 'react';
import { LiveAnalysisWorkspace } from '@/features/analyze/live-analysis-workspace';

export const instant = false;

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = await params;
  return <LiveAnalysisWorkspace analysisId={analysisId} />;
}
