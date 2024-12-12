'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const planType = searchParams.get('plan'); // e.g., 'basic', 'standard', 'premium'
  const subPlanName = searchParams.get('subPlan'); // e.g., 'Free Trial', 'Individual', 'Company'
  const quantity = Number(searchParams.get('quantity')) || 1; // Get quantity, default to 1
  const router = useRouter();
  const { data: session } = useSession();

  const hasCreatedRecord = useRef(false);

  useEffect(() => {
    const createPurchaseRecord = async () => {
      try {
        if (hasCreatedRecord.current) return;
        hasCreatedRecord.current = true;

        // Auto-increment purchaseId (this can be managed server-side for production)
        const purchaseId = `PUR-${Date.now()}`;

        // Product details based on selection
        const product = {
          id: planType === 'notes' ? 2 : 1, // 1 for Screenshot Capture App, 2 for Notes App
          name: planType === 'notes' ? 'Notes App' : 'Screenshot Capture App',
          version: '1.0',
        };

        // Pricing details based on sub-plan selection
const priceMap: { [key: string]: number } = {
  'Free Trial': 0,
  Individual: planType === 'basic' ? 2 : planType === 'standard' ? 4 : 6,
  Company: planType === 'basic' ? 4 : planType === 'standard' ? 8 : 12,
};

const unitPriceUSD = priceMap[subPlanName ?? 'Free Trial'] ?? 0;
        const totalPriceUSD = unitPriceUSD * quantity;

        // Determine plan expiry date
        const currentDate = new Date();
        const planExpiryDate = new Date(currentDate);
        if (subPlanName === 'Free Trial') {
          planExpiryDate.setDate(currentDate.getDate() + 3); // 3 days for free trial
        } else {
          planExpiryDate.setFullYear(currentDate.getFullYear() + 1); // 1 year for paid plans
        }

await fetch('/api/purchases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    purchaseId,
    adminEmail: session?.user?.email || 'unknown@example.com',
    adminId: session?.user?.id || 'unknown',
    isAllowedUser: true,
    productId: product.id,
    productName: product.name,
    productVersion: product.version,
    planName: planType
      ? planType.charAt(0).toUpperCase() + planType.slice(1)
      : 'Unknown Plan',
    subPlanName,
    quantity,
    canUseInThisManyPC: quantity,
    unitPriceUSD,
    totalPriceUSD,
    paymentMethod: subPlanName === 'Free Trial' ? 'N/A' : 'Card',
    paymentStatus: subPlanName === 'Free Trial' ? 'Free' : 'Paid',
    vendorId: 'vendor123',
    vendorName: 'Vorklee Inc.',
    orderStatus: 'Completed',
    planPurchaseDate: currentDate,
    planStartDate: currentDate,
    planExpiryDate,
    autoRenewal: subPlanName !== 'Free Trial',
    remarks: 'Nil',
  }),
});
      } catch (error) {
        console.error('Error creating purchase record:', error);
      }
    };

    createPurchaseRecord();
  }, [planType, subPlanName, quantity, session]);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">
          {subPlanName === 'Free Trial'
            ? 'Registration Successful!'
            : 'Payment Successful!'}
        </h1>
        <p className="mb-6">
          {subPlanName === 'Free Trial'
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
    </div>
  );
}
