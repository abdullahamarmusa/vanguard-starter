'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bot, CheckCheck, FileSearch, Megaphone, Sparkles } from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn } from '@/lib/utils';

export function NotificationDrawer() {
  const router = useRouter();
  const {
    notificationsOpen,
    setNotificationsOpen,
    notifications,
    unreadNotificationCount,
    markAllNotificationsRead,
    markNotificationRead,
  } = usePrototypeStore();

  const iconFor = (type: string) => {
    switch (type) {
      case 'analysis':
        return <Sparkles className="text-brand h-4 w-4" />;
      case 'campaign':
        return <Megaphone className="text-ai h-4 w-4" />;
      case 'agent':
        return <Bot className="text-teal-brand h-4 w-4" />;
      default:
        return <FileSearch className="text-info h-4 w-4" />;
    }
  };

  return (
    <Drawer
      open={notificationsOpen}
      onClose={() => setNotificationsOpen(false)}
      title="Notifications"
      description={`${unreadNotificationCount} unread · Organization-scoped updates (illustrative)`}
      widthClass="max-w-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-text-secondary text-xs">
          Recent workspace alerts
        </span>
        <Button
          variant="ghost"
          size="xs"
          onClick={markAllNotificationsRead}
          disabled={unreadNotificationCount === 0}
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read
        </Button>
      </div>

      <div className="space-y-2.5">
        {notifications.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              markNotificationRead(item.id);
              setNotificationsOpen(false);
              if (item.href) router.push(item.href);
            }}
            className={cn(
              'rounded-card hover:bg-hover flex w-full items-start gap-3 border p-3.5 text-left transition-colors',
              item.read
                ? 'border-border-subtle bg-surface'
                : 'border-brand-border/60 bg-elevated',
            )}
          >
            <div className="border-border-subtle bg-app mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
              {iconFor(item.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-text-primary text-xs font-semibold">
                  {item.title}
                </p>
                {!item.read && (
                  <span className="bg-brand h-2 w-2 shrink-0 rounded-full" />
                )}
              </div>
              <p className="text-text-secondary mt-1 text-xs leading-relaxed">
                {item.description}
              </p>
              <p className="text-text-disabled mt-1.5 text-[11px]">
                {item.timestamp}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Drawer>
  );
}
