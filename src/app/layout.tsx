'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import TopMessageBar from '@/components/TopMessageBar';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          <Sidebar />
          <div className="flex-1 ml-64">
            <TopMessageBar />
            <main className="p-4 mt-12">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
