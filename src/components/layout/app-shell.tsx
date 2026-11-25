'use client';

import React from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppTopbar } from '@/components/layout/app-topbar';
import { CommandPalette } from '@/components/layout/command-palette';
import { NotificationDrawer } from '@/components/layout/notification-drawer';
import { UpgradePlansModal } from '@/components/layout/upgrade-plans-modal';
import { ToastContainer } from '@/components/ui/toast';
import { PrototypeNotice } from '@/components/layout/prototype-notice';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-app text-text-primary flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <PrototypeNotice />
        <main className="mx-auto w-full max-w-[1560px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Global Overlays */}
      <CommandPalette />
      <NotificationDrawer />
      <UpgradePlansModal />
      <ToastContainer />
    </div>
  );
}
