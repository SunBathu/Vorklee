'use client';

import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-6">
        Thank you for your purchase. You can now download the SysFile
        application.
      </p>
      <button
        onClick={() => router.push('/products')}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Go to Product Page
      </button>
    </div>
  );
}
