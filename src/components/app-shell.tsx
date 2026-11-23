'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, type ReactNode } from 'react';

const navigation = [
  { href: '/', label: 'Overview' },
  { href: '/roadmap', label: 'Roadmap' },
];

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="primary-nav">
      {navigation.map((item) => {
        const current = pathname === item.href;

        return (
          <Link
            aria-current={current ? 'page' : undefined}
            className="nav-link"
            href={item.href}
            key={item.href}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function BrandMark() {
  return (
    <span aria-hidden="true" className="brand-mark">
      <svg fill="none" viewBox="0 0 24 24">
        <path
          d="M4.5 5.5 12 19l7.5-13.5"
          stroke="currentColor"
          strokeLinecap="square"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  const closeMobileMenu = () => mobileMenu.current?.removeAttribute('open');

  return (
    <div className="app-shell">
      <aside aria-label="VANGUARD navigation" className="sidebar">
        <Link aria-label="VANGUARD overview" className="brand" href="/">
          <BrandMark />
          <span>VANGUARD</span>
        </Link>
        <p className="brand-caption">
          Intelligence for independent software teams
        </p>
        <Navigation />
        <footer className="sidebar-footer">
          <p>Development foundation</p>
          <p>No customer data connected</p>
        </footer>
      </aside>

      <div className="workspace-frame">
        <header className="topbar">
          <Link
            aria-label="VANGUARD overview"
            className="mobile-brand"
            href="/"
          >
            <BrandMark />
            <span>VANGUARD</span>
          </Link>
          <p className="topbar-scope">Offer-to-Lead Intelligence</p>
          <p className="environment-note">Local foundation</p>
          <details className="mobile-menu" ref={mobileMenu}>
            <summary>Menu</summary>
            <div className="mobile-menu__panel">
              <div className="mobile-menu__header">
                <Link
                  aria-label="VANGUARD overview"
                  className="brand"
                  href="/"
                  onClick={closeMobileMenu}
                >
                  <BrandMark />
                  <span>VANGUARD</span>
                </Link>
                <button onClick={closeMobileMenu} type="button">
                  Close
                </button>
              </div>
              <Navigation onNavigate={closeMobileMenu} />
            </div>
          </details>
        </header>
        {children}
      </div>
    </div>
  );
}
