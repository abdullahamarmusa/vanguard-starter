'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePrototypeStore } from '@/store/prototype-context';

export default function SettingsPage() {
  const { activeOrg, theme, toggleTheme, pushToast } = usePrototypeStore();
  const [orgName, setOrgName] = useState(activeOrg.name);
  const [defaultThreshold, setDefaultThreshold] = useState('80');

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Badge variant="default" className="mb-2">
          Organization
        </Badge>
        <h1 className="text-text-primary text-2xl font-bold">
          Workspace Settings
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          Configure organization identity, qualification defaults, and
          appearance preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Organization Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              pushToast({
                title: 'Settings updated (Prototype)',
                description:
                  'Connect to your organization server action during repository integration.',
                variant: 'success',
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-text-secondary mb-1 block text-xs font-medium">
                Organization Name
              </label>
              <Input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-text-secondary mb-1 block text-xs font-medium">
                Default Qualification Threshold (%)
              </label>
              <Input
                type="number"
                min={50}
                max={99}
                value={defaultThreshold}
                onChange={(e) => setDefaultThreshold(e.target.value)}
              />
            </div>
            <div className="rounded-btn border-border-subtle bg-app/60 flex items-center justify-between border px-3.5 py-3">
              <div>
                <p className="text-text-primary text-xs font-semibold">
                  Interface Theme
                </p>
                <p className="text-text-secondary text-[11px]">
                  Currently using{' '}
                  {theme === 'dark' ? 'VANGUARD Dark (Onyx)' : 'VANGUARD Light'}
                  .
                </p>
              </div>
              <Button variant="secondary" size="xs" onClick={toggleTheme}>
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </Button>
            </div>
            <Button type="submit" size="sm">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
