import type { Metadata } from 'next';
import { PwaControls } from '@/components/pwa-controls';

export const metadata: Metadata = {
  title: 'AI Business Intelligence & Revenue Operations',
  description:
    'Turn business offers into evidence-backed opportunities. Discover relevant companies, evaluate buyer fit, and prepare intelligent outreach with VANGUARD.',
};

export default function LandingPage() {
  return (
    <>
      <main className="fixed inset-0 z-50 bg-[#0D0E11]">
        <iframe
          title="VANGUARD marketing landing page"
          src="/landing/index.html"
          className="block h-[100dvh] w-full border-0"
        />
      </main>
      <PwaControls showControls={false} />
    </>
  );
}
