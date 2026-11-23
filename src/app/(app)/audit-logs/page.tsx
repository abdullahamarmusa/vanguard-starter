'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockVanguardAdapter } from '@/lib/data-access/mock-adapter';

export default function AuditLogsPage() {
  const logs = mockVanguardAdapter.getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="default" className="mb-2">
          Organization
        </Badge>
        <h1 className="text-text-primary text-2xl font-bold">Audit Logs</h1>
        <p className="text-text-secondary mt-1 text-sm">
          Organization-scoped audit events tracking analyses, exports, human
          approvals, and permission checks (illustrative).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security &amp; Operations Events</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-border-subtle text-text-secondary border-b">
                <th className="py-2.5 pr-4 font-semibold">Timestamp</th>
                <th className="py-2.5 pr-4 font-semibold">Actor</th>
                <th className="py-2.5 pr-4 font-semibold">Action</th>
                <th className="py-2.5 pr-4 font-semibold">Resource</th>
                <th className="py-2.5 font-semibold">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {logs.map((entry) => (
                <tr key={entry.id} className="hover:bg-hover/40">
                  <td className="text-text-secondary py-3 pr-4 font-mono whitespace-nowrap">
                    {entry.timestamp}
                  </td>
                  <td className="text-text-primary py-3 pr-4 font-medium whitespace-nowrap">
                    {entry.actor}
                  </td>
                  <td className="text-info py-3 pr-4 font-mono whitespace-nowrap">
                    {entry.action}
                  </td>
                  <td className="text-text-secondary py-3 pr-4">
                    {entry.resource}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <Badge
                      variant={
                        entry.status === 'Denied'
                          ? 'danger'
                          : entry.status === 'Approved'
                            ? 'success'
                            : 'default'
                      }
                    >
                      {entry.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
