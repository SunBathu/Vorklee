'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMessage } from '@/context/MessageContext';
import Link from 'next/link';

interface Settings {
  storageUsed: number;
  captureInterval: number;
  pcName: string;
  osVersion: string;
  ipAddress: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { message, options, showMessage } = useMessage();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('google', { callbackUrl: '/dashboard' });
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboardSettings', { method: 'GET' });
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data: Settings = await res.json();
        setSettings(data);
      } catch (err) {
        setError('Error fetching settings');
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  if (status === 'loading' || !settings) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {session?.user?.name || 'Guest'}
        {session?.user?.image && (
          <img
            src={session.user.image}
            alt="Profile Picture"
            className="h-10 w-10 rounded-full inline ml-2"
          />
        )}
      </h1>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="font-semibold">Storage Used</h2>
          <p>{settings.storageUsed || 0} MB</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="font-semibold">Capture Interval</h2>
          <p>{settings.captureInterval || 0} seconds</p>
        </div>
      </div>

      {/* New Button to Agreement Page */}
      <div className="flex gap-4 mb-6">
        <Link href="/agreement.html">
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition">
            View Agreement
          </button>
        </Link>
      </div>

      {/* Placeholder for an Elegant Graph */}
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">User Statistics</h2>
        <div className="h-64">
          {/* You can replace this with a real graph component */}
          <img
            src="/images/graph-placeholder.png"
            alt="Graph Placeholder"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}