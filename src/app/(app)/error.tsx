'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AppErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('VANGUARD view error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-md p-6 text-center">
        <div className="border-danger/35 bg-danger/10 text-danger mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h1 className="text-text-primary text-lg font-bold">
          Something went wrong
        </h1>
        <p className="text-text-secondary mt-1.5 text-xs leading-relaxed">
          This VANGUARD workspace encountered an unexpected rendering error.
          Your prototype session state remains intact.
        </p>
        {error.digest && (
          <p className="text-text-disabled mt-2 font-mono text-[10px]">
            Ref: {error.digest}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button size="sm" onClick={() => reset()}>
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">
              <Home className="h-3.5 w-3.5" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
