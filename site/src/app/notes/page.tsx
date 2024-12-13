'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function NotesPage() {
  const router = useRouter();

  const handlePurchaseClick = () => {
    router.push('/products');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-3xl font-extrabold text-red-500 mb-4">
          You have not purchased this app
        </h2>
        <p className="text-gray-700 mb-6">
          Please purchase the app to access the Notes feature and manage your
          notes efficiently.
        </p>
        <button
          onClick={handlePurchaseClick}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-md"
        >
          Purchase Now
        </button>
      </div>
    </div>
  );
}
