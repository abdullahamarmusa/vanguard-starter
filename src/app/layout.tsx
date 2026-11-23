import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/ibm-plex-sans';
import { AppShell } from '@/components/app-shell';
import './globals.css';

export const metadata: Metadata = {
  applicationName: 'VANGUARD',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VANGUARD',
  },
  title: {
    default: 'VANGUARD',
    template: '%s · VANGUARD',
  },
  description:
    'Business intelligence and revenue operations for independent software teams.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1b6c80',
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
