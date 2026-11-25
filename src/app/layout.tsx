import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';
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
  themeColor: '#0D0E11',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-app text-text-primary min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
