'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const planType = searchParams.get('plan');
  const router = useRouter();

  // Use a ref to prevent the function from running multiple times
  const hasCreatedRecord = useRef(false);

  useEffect(() => {
    const createPurchaseRecord = async () => {
      try {
        if (hasCreatedRecord.current) return; // Prevent double execution
        hasCreatedRecord.current = true;

        await fetch('/api/purchases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            purchaseId: `PUR-${Date.now()}`,
            adminEmail: 'user@example.com', // Replace with actual admin email
            adminId: 'admin123', // Replace with actual admin ID
            productId: 'SYSFILE001',
            productName: 'SysFile',
            productVersion: '1.0.0',
            planName: planType === 'free' ? 'Free Trial' : `${planType} Plan`,
            quantity: 1,
            canUseInThisManyPC: 1,
            unitPriceUSD: planType === 'free' ? 0 : 5, // Replace with actual price
            totalPriceUSD: planType === 'free' ? 0 : 5,
            paymentMethod: planType === 'free' ? 'N/A' : 'Card',
            paymentStatus: planType === 'free' ? 'Free' : 'Paid',
            vendorId: 'vendor123',
            vendorName: 'Vorklee Inc.',
            orderStatus: 'Completed',
            planPurchaseDate: new Date(),
            planStartDate: new Date(),
            planExpiryDate: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1),
            ),
            autoRenewal: planType !== 'free',
            remarks: '',
          }),
        });
      } catch (error) {
        console.error('Error creating purchase record:', error);
      }
    };

    createPurchaseRecord();
  }, [planType]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-bold mb-4">
        {planType === 'free'
          ? 'Registration Successful!'
          : 'Payment Successful!'}
      </h1>
      <p className="mb-6">
        {planType === 'free'
          ? 'Thank you for registering for the Free Plan.'
          : `Thank you for purchasing the ${planType?.toUpperCase()} Plan.`}
      </p>
      <p className="mb-6">Go to the purchases page to download the app.</p>
      <button
        onClick={() => router.push('/purchases')}
        className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition"
      >
        Go to Purchases Page
      </button>
    </div>
  );
}
