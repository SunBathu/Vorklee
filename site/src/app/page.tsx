'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleProtectedRoute = (path: string) => {
    if (session) {
      router.push(path);
    } else {
      signIn('google');
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center">
      <div className="flex flex-col items-center justify-center p-1">
        <h1 className="text-4xl font-bold mb-1 mt-0">Welcome to Vorklee</h1>
        <p className="text-lg mb-8">
          Hi, Manage your dashboard and settings efficiently.
        </p>

        <div className="space-x-4">
          <button
            onClick={() => handleProtectedRoute('/dashboard')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer transition-transform transform hover:scale-105"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => handleProtectedRoute('/products')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 cursor-pointer transition-transform transform hover:scale-105"
          >
            Buy Products
          </button>
          <button
            onClick={() => handleProtectedRoute('/purchases')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 cursor-pointer transition-transform transform hover:scale-105"
          >
            Manage Purchases
          </button>
        </div>

        <div className="mt-8 mb-0">
          <Image
            src="/images/welcome.png"
            alt="Welcome"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
 
