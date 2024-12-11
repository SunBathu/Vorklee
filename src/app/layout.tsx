// src/app/layout.tsx

'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import TopMessageBar from '@/components/TopMessageBar';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden">
        <SessionProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <TopMessageBar />
            <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
