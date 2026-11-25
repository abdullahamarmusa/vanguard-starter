'use client';

import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockVanguardAdapter } from '@/lib/data-access/mock-adapter';
import { usePrototypeStore } from '@/store/prototype-context';

export default function MembersPage() {
  const { pushToast } = usePrototypeStore();
  const [members, setMembers] = useState(() =>
    mockVanguardAdapter.getMembers(),
  );
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setMembers((prev) => [
      ...prev,
      {
        id: `mem_${Date.now()}`,
        name: inviteEmail.split('@')[0] ?? 'New Member',
        email: inviteEmail.trim(),
        role: 'Analyst',
        status: 'Invited',
        lastActive: 'Pending invite',
      },
    ]);
    pushToast({
      title: 'Invitation preview added',
      description: `No email was sent to ${inviteEmail}.`,
      variant: 'info',
    });
    setInviteEmail('');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Badge variant="default" className="mb-2">
          Organization
        </Badge>
        <h1 className="text-text-primary text-2xl font-bold">
          Members &amp; Roles
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Manage organization access. In production, role checks enforce Auth.js
          + PostgreSQL RLS policies.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview a team invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleInvite}
            className="flex flex-col gap-2.5 sm:flex-row"
          >
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="teammate@company.com"
            />
            <Button type="submit" size="md" className="shrink-0">
              <UserPlus className="h-4 w-4" />
              Preview invitation
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent className="divide-border-subtle divide-y">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
            >
              <div>
                <p className="text-text-primary font-semibold">{m.name}</p>
                <p className="text-text-secondary">{m.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="brand">{m.role}</Badge>
                <Badge variant={m.status === 'Active' ? 'success' : 'default'}>
                  {m.status}
                </Badge>
                <span className="text-text-disabled">{m.lastActive}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
