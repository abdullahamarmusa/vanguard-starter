import Link from 'next/link';

const pages = [['Profile','/settings/profile'],['Organization','/settings/organization'],['Team','/settings/team'],['Security','/settings/security'],['Preferences','/settings/preferences']];
export function SettingsNav({ active }: { active: string }) { return <nav aria-label="Settings" className="border-border-subtle flex gap-2 overflow-x-auto border-b pb-3">{pages.map(([label, href]) => <Link key={href} href={href} aria-current={active === href ? 'page' : undefined} className={`rounded-lg px-3 py-2 text-sm whitespace-nowrap ${active === href ? 'bg-brand-soft text-brand' : 'text-text-secondary hover:bg-hover'}`}>{label}</Link>)}</nav>; }
