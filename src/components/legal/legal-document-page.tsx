import Link from 'next/link';
import { BrandMark } from '@/components/ui/brand-mark';
import { legalDocuments, legalLinks } from '@/content/legal';

export function LegalDocumentPage({ id }: { id: keyof typeof legalDocuments }) {
  const document = legalDocuments[id];
  return <div className="light min-h-screen bg-[#f7f7f5] text-[#111318]">
    <header className="border-b border-[#e4e6e8] bg-white"><div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5 px-5 sm:px-8"><Link href="/" className="flex items-center gap-2.5"><BrandMark className="h-8 w-8" /><span className="font-display text-sm font-bold tracking-[.14em]">VANGUARD</span></Link><nav aria-label="Main" className="flex items-center gap-4"><Link href="/" className="text-sm text-[#586276] hover:text-[#111318]">Home</Link><Link href="/sign-in" className="text-sm font-medium text-[#111318]">Sign in</Link></nav></div></header>
    <main className="mx-auto grid max-w-7xl gap-12 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[230px_minmax(0,760px)] lg:justify-center">
      <aside className="lg:sticky lg:top-8 lg:h-fit"><p className="text-xs font-semibold tracking-[.14em] text-[#0e7490] uppercase">{document.eyebrow}</p><h2 className="mt-3 text-sm font-semibold">VANGUARD policies</h2><nav aria-label="Legal documents" className="mt-3 flex flex-wrap gap-x-3 gap-y-1 lg:flex-col lg:gap-0">{legalLinks.map(([label, href]) => <Link key={href} href={href} className="min-h-9 py-2 text-sm text-[#586276] underline-offset-4 hover:text-[#111318] hover:underline">{label}</Link>)}</nav></aside>
      <article>
        <p className="text-xs font-semibold tracking-[.16em] text-[#0e7490] uppercase">VANGUARD · {document.eyebrow}</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">{document.title}</h1>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#586276]"><p>Effective: <strong className="text-[#111318]">[Set before publication]</strong></p><p>Last updated: <strong className="text-[#111318]">[Set before publication]</strong></p></div>
        <p className="mt-6 border-l-2 border-[#e3a319] bg-white px-4 py-3 text-sm leading-relaxed text-[#465064]">{document.intro}</p>
        <nav aria-label="On this page" className="mt-8 rounded-xl border border-[#e4e6e8] bg-white p-5"><h2 className="text-sm font-semibold">On this page</h2><ol className="mt-3 grid gap-2 sm:grid-cols-2">{document.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`} className="text-sm text-[#586276] underline-offset-4 hover:text-[#111318] hover:underline">{section.heading}</a></li>)}</ol></nav>
        <div className="mt-10 space-y-9">{document.sections.map((section, index) => <section key={section.heading} id={`section-${index + 1}`} className="scroll-mt-8"><h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{section.heading}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-3 text-[15px] leading-7 text-[#394253]">{paragraph}</p>)}{section.bullets && <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#394253]">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}</div>
        <p className="mt-12 border-t border-[#e4e6e8] pt-5 text-sm text-[#586276]">Questions? Contact <span className="font-medium text-[#111318]">[legal contact email]</span>.</p>
      </article>
    </main>
    <footer className="border-t border-[#e4e6e8] bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-sm text-[#586276] sm:px-8 md:flex-row md:items-center md:justify-between"><p>© 2026 VANGUARD · Legal draft awaiting review</p><nav aria-label="Legal footer" className="flex flex-wrap gap-x-4 gap-y-2">{legalLinks.map(([label, href]) => <Link key={href} href={href} className="hover:text-[#111318]">{label}</Link>)}</nav></div></footer>
  </div>;
}
