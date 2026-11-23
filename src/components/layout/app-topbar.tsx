'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  ChevronDown,
  FlaskConical,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sun,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn } from '@/lib/utils';

export function AppTopbar() {
  const {
    user,
    activeOrg,
    theme,
    toggleTheme,
    sidebarCollapsed,
    setSidebarCollapsed,
    setMobileNavOpen,
    setCommandOpen,
    setNotificationsOpen,
    unreadNotificationCount,
    isEmptyWorkspace,
    toggleEmptyWorkspace,
  } = usePrototypeStore();

  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="border-border-subtle bg-app/90 sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 backdrop-blur-md lg:px-6">
      {/* Left controls: Sidebar toggle + Global Search */}
      <div className="flex flex-1 items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation menu"
          className="rounded-btn border-border-subtle bg-surface text-text-secondary hover:bg-hover hover:text-text-primary inline-flex h-9 w-9 items-center justify-center border lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="rounded-btn border-border-subtle bg-surface text-text-secondary hover:bg-hover hover:text-text-primary hidden h-9 w-9 items-center justify-center border transition-colors lg:inline-flex"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="rounded-btn border-border-subtle bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary flex h-10 w-full max-w-md items-center justify-between gap-3 border px-3 text-left text-sm transition-colors"
          aria-label="Open global search and command palette"
        >
          <span className="flex items-center gap-2.5 truncate">
            <Search className="text-text-disabled h-4 w-4 shrink-0" />
            <span className="truncate text-[13px]">
              Search anything... (prospects, campaigns, agents)
            </span>
          </span>
          <kbd className="rounded-control border-border-subtle bg-elevated text-text-secondary hidden shrink-0 border px-1.5 py-0.5 font-mono text-[11px] sm:inline-block">
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* Right controls: Preview Mode pill, Empty-state toggle, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2">
        {/* Honest Illustrative Prototype indicator + Empty State inspection toggle */}
        <button
          type="button"
          onClick={toggleEmptyWorkspace}
          title="Toggle between illustrative populated data and first-time user empty states"
          className={cn(
            'preview-mode-toggle hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors md:inline-flex',
            isEmptyWorkspace
              ? 'border-brand-border bg-brand-soft text-brand'
              : 'border-border-subtle bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary',
          )}
        >
          <FlaskConical className="text-brand h-3.5 w-3.5" />
          <span>
            {isEmptyWorkspace ? 'Empty State Mode' : 'Illustrative Preview'}
          </span>
          {isEmptyWorkspace ? (
            <ToggleRight className="text-brand h-4 w-4" />
          ) : (
            <ToggleLeft className="text-text-disabled h-4 w-4" />
          )}
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="rounded-btn border-border-subtle bg-surface text-text-secondary hover:bg-hover hover:text-text-primary inline-flex h-9 w-9 items-center justify-center border transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => setNotificationsOpen(true)}
          aria-label={`Open notifications (${unreadNotificationCount} unread)`}
          title="Notifications"
          className="rounded-btn border-border-subtle bg-surface text-text-secondary hover:bg-hover hover:text-text-primary relative inline-flex h-9 w-9 items-center justify-center border transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationCount > 0 && (
            <span className="bg-danger absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            className="rounded-btn border-border-subtle bg-surface hover:border-border-strong hover:bg-hover flex items-center gap-2.5 border py-1 pr-2.5 pl-1.5 text-left transition-colors"
          >
            <div className="bg-brand-soft text-brand border-brand-border flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold">
              {user.initials}
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-text-primary text-xs font-semibold">
                {user.name}
              </p>
              <p className="text-text-secondary text-[10px]">
                {user.role} · {activeOrg.name}
              </p>
            </div>
            <ChevronDown className="text-text-secondary h-3.5 w-3.5" />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
                aria-hidden="true"
              />
              <div className="rounded-card border-border-strong bg-elevated shadow-elevated absolute right-0 z-20 mt-2 w-60 border p-2">
                <div className="border-border-subtle border-b px-2.5 py-2">
                  <p className="text-text-primary text-xs font-semibold">
                    {user.name}
                  </p>
                  <p className="text-text-secondary text-[11px]">
                    {user.email}
                  </p>
                </div>
                <div className="mt-1 space-y-0.5">
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="rounded-btn text-text-primary hover:bg-hover flex items-center gap-2 px-2.5 py-1.5 text-xs"
                  >
                    <Settings className="text-text-secondary h-3.5 w-3.5" />
                    Workspace Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      toggleEmptyWorkspace();
                      setProfileOpen(false);
                    }}
                    className="rounded-btn text-text-primary hover:bg-hover flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs"
                  >
                    <FlaskConical className="text-brand h-3.5 w-3.5" />
                    {isEmptyWorkspace
                      ? 'Show Populated Preview'
                      : 'Preview Empty Onboarding'}
                  </button>
                </div>
                <div className="border-border-subtle mt-1.5 border-t px-2.5 pt-2">
                  <p className="text-text-disabled text-[10px] leading-relaxed">
                    Prototype account · Auth.js session is not configured yet.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
