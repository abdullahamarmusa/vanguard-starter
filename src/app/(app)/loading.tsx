import React from 'react';

export default function AppLoadingSkeleton() {
  return (
    <div
      className="animate-pulse space-y-6"
      aria-busy="true"
      aria-label="Loading VANGUARD view"
    >
      {/* Header shimmer */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="rounded-control bg-elevated h-4 w-32" />
          <div className="rounded-btn bg-elevated h-8 w-64" />
        </div>
        <div className="flex gap-2">
          <div className="rounded-btn bg-elevated h-9 w-28" />
          <div className="rounded-btn bg-elevated h-9 w-36" />
        </div>
      </div>

      {/* KPI row shimmer */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-card border-border-subtle bg-surface h-32 border p-4"
          >
            <div className="bg-elevated h-3.5 w-24 rounded" />
            <div className="bg-elevated mt-4 h-7 w-28 rounded" />
            <div className="bg-elevated mt-4 h-3 w-20 rounded" />
          </div>
        ))}
      </div>

      {/* Primary content panel shimmer */}
      <div className="grid gap-5 xl:grid-cols-12">
        <div className="rounded-card border-border-subtle bg-surface h-80 border p-5 xl:col-span-8">
          <div className="bg-elevated h-4 w-44 rounded" />
          <div className="rounded-btn bg-elevated/60 mt-6 h-56" />
        </div>
        <div className="rounded-card border-border-subtle bg-surface h-80 border p-5 xl:col-span-4">
          <div className="bg-elevated h-4 w-36 rounded" />
          <div className="mt-5 space-y-3">
            <div className="rounded-btn bg-elevated/60 h-12" />
            <div className="rounded-btn bg-elevated/60 h-12" />
            <div className="rounded-btn bg-elevated/60 h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
