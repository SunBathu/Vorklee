// /mnt/data/page.tsx

'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageSlider from '@/components/ImageSlider';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [totalPCCount, setTotalPCCount] = useState<number | null>(null);
  const [nextExpiringPlan, setNextExpiringPlan] = useState<{
    name: string;
    date: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('google', { callbackUrl: '/dashboard' });
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status !== 'authenticated') {
          throw new Error('User is not authenticated');
        }

        const adminEmail = session?.user?.email;
        if (!adminEmail) {
          throw new Error('Admin email is not available');
        }

        const res = await fetch(
          `/api/purchases?adminEmail=${encodeURIComponent(adminEmail)}`,
          { method: 'GET' },
        );
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch purchase data: ${errorText}`);
        }
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format returned from API');
        }

        const totalPCCount = data.reduce(
          (sum: number, purchase: any) =>
            sum + (purchase.canUseInThisManyPC || 0),
          0,
        );
        setTotalPCCount(totalPCCount);

        const today = new Date();
        const sortedPlans = data
          .filter(
            (purchase: any) =>
              purchase.expiryDate && new Date(purchase.expiryDate) > today,
          )
          .sort(
            (a: any, b: any) =>
              new Date(a.expiryDate).getTime() -
              new Date(b.expiryDate).getTime(),
          );

        if (sortedPlans.length > 0) {
          setNextExpiringPlan({
            name: sortedPlans[0].productName || 'Unknown Plan',
            date: new Date(sortedPlans[0].expiryDate).toLocaleDateString(),
          });
        } else {
          setNextExpiringPlan({ name: 'No Plans', date: 'N/A' });
        }
      } catch (err: any) {
        console.error('Fetch data error:', err);
        setError(err.message || 'Error fetching data');
      }
    };

    if (status === 'authenticated') {
      fetchData();
    }
  }, [session, status]);

  if (status === 'loading') return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (totalPCCount === null || nextExpiringPlan === null)
    return <p>Loading data...</p>;

  return (
    <div className="min-h-screen flex items-start justify-start bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start p-6 max-w-4xl w-full">
        <div className="col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome,{' '}
            <span className="text-4xl">{session?.user?.email || 'User'}</span>
          </h1>

          <div className="bg-blue-100 p-6 rounded shadow">
            <h2 className="font-semibold text-lg">Total PC Count</h2>
            <p>{totalPCCount}</p>
          </div>

          <div className="bg-green-100 p-6 rounded shadow">
            <h2 className="font-semibold text-lg">Next Expiring Plan</h2>
            <p>
              {nextExpiringPlan.name} (Expires on: {nextExpiringPlan.date})
            </p>
          </div>

          <div className="bg-yellow-100 p-6 rounded shadow">
            <h2 className="font-semibold text-lg">Plan Usage</h2>
            <p>85% utilization</p>
          </div>

          <div className="bg-orange-200 p-6 rounded shadow">
            <h2 className="font-semibold text-lg">App</h2>
            <p>Screenshot Capture</p>
          </div>

          <div className="bg-red-100 p-6 rounded shadow">
            <h2 className="font-semibold text-lg">Agreement</h2>
            <div>
              <Link
                href="/agreement.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-indigo-400 text-white px-4 py-2 rounded hover:bg-purple-600 transition">
                  View Agreement
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex justify-left items-start md:ml-12 lg:ml-16 mt-12">
          <ImageSlider width="40vw" height="600px" />
        </div>
      </div>
    </div>
  );
}
