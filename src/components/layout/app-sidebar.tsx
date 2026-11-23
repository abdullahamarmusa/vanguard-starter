'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  FileSearch,
  Home,
  Megaphone,
  ScrollText,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { BrandMark } from '@/components/ui/brand-mark';
import { usePrototypeStore } from '@/store/prototype-context';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const PRIMARY_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Analyze', href: '/analyze', icon: Sparkles, badge: 'Flagship' },
  { label: 'Prospects', href: '/prospects', icon: FileSearch },
  { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { label: 'Workspace', href: '/workspace', icon: Briefcase },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'AI Agents', href: '/agents', icon: Bot },
];

const ORG_NAV: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Members', href: '/members', icon: Users },
  { label: 'Billing', href: '/billing', icon: CreditCard },
  { label: 'Audit Logs', href: '/audit-logs', icon: ScrollText },
];

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const {
    organizations,
    activeOrg,
    setActiveOrgById,
    user,
    setPlansModalOpen,
  } = usePrototypeStore();
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const orgMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!orgMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (
        orgMenuRef.current &&
        !orgMenuRef.current.contains(e.target as Node)
      ) {
        setOrgMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOrgMenuOpen(false);
    };
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [orgMenuOpen]);

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="bg-sidebar text-text-primary flex h-full flex-col">
      {/* Brand Header */}
      <div
        className={cn(
          'border-border-subtle flex h-16 shrink-0 items-center border-b px-4',
          collapsed ? 'justify-center px-2' : 'gap-2.5',
        )}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5 focus-visible:outline-none"
          title="VANGUARD — AI Business Intelligence"
        >
          <BrandMark className="h-8 w-8" />
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="text-text-primary text-[15px] font-bold tracking-wider">
                VANGUARD
              </div>
              <div className="text-text-secondary truncate text-[10px] font-medium">
                AI Business Intelligence
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav aria-label="Primary navigation" className="space-y-1">
          {PRIMARY_NAV.map((item) => {
            const active = isActiveRoute(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group rounded-btn ease-vanguard relative flex items-center text-[13px] font-medium transition-all duration-150',
                  collapsed
                    ? 'justify-center p-2.5'
                    : 'justify-between px-3 py-2',
                  active
                    ? 'border-brand-border bg-brand-soft text-brand border'
                    : 'text-text-secondary hover:bg-hover hover:text-text-primary border border-transparent',
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0',
                      active
                        ? 'text-brand'
                        : 'text-text-secondary group-hover:text-text-primary',
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </span>
                {!collapsed && item.badge && (
                  <span className="bg-info/20 text-info rounded-full px-2 py-0.5 text-[10px] font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Compact Organization Section (Fix 06) */}
        <div className="border-border-subtle mt-5 border-t pt-3.5">
          {/* Compact Organization Switcher Popover */}
          <div ref={orgMenuRef} className="relative mb-2">
            <button
              type="button"
              onClick={() => setOrgMenuOpen((prev) => !prev)}
              aria-expanded={orgMenuOpen}
              aria-label={`Organization: ${activeOrg.name} (${activeOrg.plan})`}
              title={
                collapsed
                  ? `Organization: ${activeOrg.name} (${activeOrg.plan})`
                  : undefined
              }
              className={cn(
                'rounded-btn border-border-subtle bg-surface/75 text-text-primary hover:border-border-strong hover:bg-hover flex w-full items-center border text-left text-xs font-medium transition-colors duration-150',
                collapsed
                  ? 'justify-center p-2'
                  : 'justify-between px-2.5 py-2',
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Building2 className="text-text-secondary h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate font-semibold">
                      {activeOrg.name}
                    </span>
                    <span className="border-brand-border bg-brand-soft py-0.2 text-brand shrink-0 rounded-full border px-1.5 text-[10px] font-semibold">
                      {activeOrg.plan}
                    </span>
                  </span>
                )}
              </span>
              {!collapsed && (
                <ChevronDown
                  className={cn(
                    'text-text-secondary h-3.5 w-3.5 shrink-0 transition-transform duration-150',
                    orgMenuOpen && 'rotate-180',
                  )}
                />
              )}
            </button>

            {orgMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setOrgMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className={cn(
                    'rounded-card border-border-strong bg-elevated shadow-elevated absolute z-30 border p-1.5',
                    collapsed
                      ? 'top-0 left-full ml-2 w-56'
                      : 'right-0 left-0 mt-1.5',
                  )}
                >
                  <p className="text-text-secondary px-2 py-1 text-[10px] font-semibold tracking-wider uppercase">
                    Switch Organization
                  </p>
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => {
                        setActiveOrgById(org.id);
                        setOrgMenuOpen(false);
                      }}
                      className="rounded-btn text-text-primary hover:bg-hover flex w-full items-center justify-between px-2 py-1.5 text-left text-xs"
                    >
                      <span className="truncate">
                        {org.name}
                        <span className="text-text-secondary ml-1.5 text-[10px]">
                          ({org.plan})
                        </span>
                      </span>
                      {org.id === activeOrg.id && (
                        <Check className="text-brand h-3.5 w-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <nav aria-label="Organization administration" className="space-y-0.5">
            {ORG_NAV.map((item) => {
              const active = isActiveRoute(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-btn flex items-center text-[13px] font-medium transition-colors duration-150',
                    collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-1.5',
                    active
                      ? 'border-brand-border bg-brand-soft text-brand border'
                      : 'text-text-secondary hover:bg-hover hover:text-text-primary',
                  )}
                >
                  <Icon className="h-[16px] w-[16px] shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Promo Card (Hidden when collapsed) */}
        {!collapsed && (
          <div className="rounded-card border-brand-border/50 from-brand/15 via-surface to-surface mt-6 border bg-gradient-to-br p-3.5">
            <div className="bg-brand/20 text-brand mb-2 flex h-7 w-7 items-center justify-center rounded-lg">
              <Sparkles className="h-4 w-4" />
            </div>
            <p className="text-text-primary text-xs font-semibold">
              Upgrade to Pro
            </p>
            <p className="text-text-secondary mt-0.5 text-[11px] leading-relaxed">
              Unlock higher analysis quotas, custom agents, and team governance.
            </p>
            <button
              type="button"
              onClick={() => setPlansModalOpen(true)}
              className="rounded-btn bg-brand hover:bg-brand-hover mt-3 flex w-full items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0D0E11] transition-colors"
            >
              <span>View Plans</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom User Strip */}
      <div className="border-border-subtle shrink-0 border-t p-3">
        <Link
          href="/settings"
          onClick={onNavigate}
          title={collapsed ? `${user.name} (${user.role})` : undefined}
          className={cn(
            'rounded-btn hover:bg-hover flex items-center p-1.5 transition-colors',
            collapsed ? 'justify-center' : 'gap-2.5',
          )}
        >
          <div className="border-border-strong bg-elevated text-text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
            {user.initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-text-primary truncate text-xs font-semibold">
                {user.name}
              </p>
              <p className="text-text-secondary truncate text-[11px]">
                {user.role}
              </p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const { sidebarCollapsed, mobileNavOpen, setMobileNavOpen } =
    usePrototypeStore();

  useEffect(() => {
    if (!mobileNavOpen) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileNavOpen, setMobileNavOpen]);

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside
        className={cn(
          'border-border-subtle ease-vanguard hidden shrink-0 border-r transition-[width] duration-200 lg:block',
          sidebarCollapsed ? 'w-[72px]' : 'w-[240px]',
        )}
      >
        <div className="sticky top-0 h-screen">
          <SidebarContent collapsed={sidebarCollapsed} />
        </div>
      </aside>

      {/* Mobile slide-in navigation drawer */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-[2px]"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <div className="border-border-subtle shadow-elevated relative z-10 flex h-full w-[264px] flex-col border-r">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation menu"
              className="rounded-btn text-text-secondary hover:bg-hover hover:text-text-primary absolute top-4 right-3 z-20 p-1.5"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              collapsed={false}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
