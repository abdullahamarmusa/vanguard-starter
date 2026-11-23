import type { ReactNode } from 'react';
import { AppShell as DashboardShell } from '@/components/layout/app-shell';
import { PrototypeProvider } from '@/store/prototype-context';
import { PwaControls } from './pwa-controls';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <PrototypeProvider>
      <DashboardShell>{children}</DashboardShell>
      <div className="shell-pwa-controls">
        <PwaControls />
      </div>
    </PrototypeProvider>
  );
}
