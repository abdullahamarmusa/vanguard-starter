import type { Metadata } from 'next';
import '@fontsource-variable/ibm-plex-sans';
import { AppShell } from '@/components/app-shell';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'VANGUARD',
    template: '%s · VANGUARD',
  },
  description:
    'Business intelligence and revenue operations for independent software teams.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
