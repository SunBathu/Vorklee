// src/app/metadata.ts

import type { Metadata } from 'next';

export const metadata = {
  title: 'Vorklee - Your Admin Dashboard',
  description:
    'Manage your screenshotssettings and dashboard efficiently with Vorklee.',
  keywords: ['Vorklee', 'Dashboard', 'Admin', 'Settings'],
  robots: 'index, follow',
  openGraph: {
    title: 'Vorklee - Your Admin Dashboard',
    description: 'Efficiently manage your settings and dashboard with Vorklee.',
    url: 'http://localhost:3000',
    siteName: 'Vorklee',
    images: [
      {
        url: '/welcome-image.jpg',
        width: 800,
        height: 600,
        alt: 'Welcome to Vorklee',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};
