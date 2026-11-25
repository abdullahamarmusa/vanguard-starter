'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { BrandMark } from '@/components/ui/brand-mark';
import { cn } from '@/lib/utils';

const navigation = [
  { label: 'How it works', href: '#workflow' },
  { label: 'Evidence', href: '#evidence' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        open
          ? 'border-b border-white/[0.08] bg-[#08090C]'
          : scrolled
            ? 'border-b border-white/[0.08] bg-[#08090C]/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="marketing-shell grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-3 justify-self-start no-underline"
          aria-label="VANGUARD home"
          onClick={() => setOpen(false)}
        >
          <BrandMark className="h-9 w-9" />
          <span className="font-display text-[15px] font-bold tracking-[0.16em] text-white">
            VANGUARD
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-full px-3 text-[13px] font-medium text-white/[0.68] transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          <Link
            href="/dashboard"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-[#F59E0B] px-4 text-sm font-semibold text-[#08090C] transition-colors hover:bg-[#FBBF24] focus-visible:outline-[#F8FAFC] sm:inline-flex lg:px-5"
          >
            Explore preview
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:bg-white/[0.12] lg:hidden"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full max-h-[calc(100svh-80px)] overflow-y-auto border-b border-white/10 bg-[#0A0C11] py-4 lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="marketing-shell flex flex-col"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center rounded-lg px-3 text-base font-medium text-white/[0.86] transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-5 text-sm font-semibold text-[#08090C] transition-colors hover:bg-[#FBBF24]"
              >
                Explore preview
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
