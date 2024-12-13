'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { productPricing } from '@/utils/pricing';
import { capitalizeFirstLetter } from '@/utils/stringUtils';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const productName =
  searchParams.get('productName') || 'Screenshot Capture App'; // Default product
  const planType = searchParams.get('plan'); // e.g., 'basic', 'standard', 'premium'
  const planTiers = searchParams.get('planTiers'); // e.g., 'Free Trial', 'Individual', 'Company'
  const quantity = Number(searchParams.get('quantity')) || 1;
  const router = useRouter();
  const { data: session } = useSession();
  const hasCreatedRecord = useRef(false);

 useEffect(() => {
   const createPurchaseRecord = async () => {
     try {
       if (hasCreatedRecord.current) return;
       hasCreatedRecord.current = true;

       const purchaseId = `PUR-${Date.now()}`;

       const product = {
         id: productName === 'Notes App' ? 2 : 1,
         name: productName,
         version: 1,
       };

       // Define valid types for planType and planTiers
       type PlanType = 'basic' | 'standard' | 'premium';
       type PlanTier = 'Free Trial' | 'Individual' | 'Company';

       const validPlanType = (planType as PlanType) || 'basic';
       const validPlanTier = (planTiers as PlanTier) || 'Free Trial'; // Ensure this reflects the correct selection

       // Ensure safe access to productPricing using type assertion
       const productPricingForProduct =
         productPricing[productName as keyof typeof productPricing];
       if (!productPricingForProduct) {
         console.error(`No pricing found for product: ${productName}`);
         return;
       }

       const unitPrice =
         productPricingForProduct[validPlanType]?.[validPlanTier] ?? 0;
       const totalPrice = unitPrice * quantity;

       const currentDate = new Date();
       const planExpiryDate = new Date(currentDate);
       if (validPlanTier === 'Free Trial') {
         planExpiryDate.setDate(currentDate.getDate() + 3);
       } else {
         planExpiryDate.setFullYear(currentDate.getFullYear() + 1);
       }

       const response = await fetch('/api/purchases', {
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
           planName: capitalizeFirstLetter(validPlanType),
           planTiers: validPlanTier,
           quantity,
           canUseInThisManyPC: quantity,
           unitPrice,
           totalPrice,
           currency: 'USD',
           paymentMethod: validPlanTier === 'Free Trial' ? 'N/A' : 'Card',
           paymentStatus: validPlanTier === 'Free Trial' ? 'Free' : 'Paid',
           vendorId: 'VL1',
           vendorName: 'Vorklee Inc.',
           orderStatus: 'Completed',
           planPurchaseDate: currentDate,
           planActivationDate: currentDate,
           planExpiryDate,
           autoRenewal: validPlanTier !== 'Free Trial',
           remarks: 'Nil',
         }),
       });

       console.log('Sending data:', {
         purchaseId,
         adminEmail: session?.user?.email || 'unknown@example.com',
         adminId: session?.user?.id || 'unknown',
         isAllowedUser: true,
         productId: product.id,
         productName: product.name,
         productVersion: product.version,
         planName: capitalizeFirstLetter(validPlanType),
         planTiers: validPlanTier,
         quantity,
         canUseInThisManyPC: quantity,
         unitPrice,
         totalPrice,
         paymentMethod: validPlanTier === 'Free Trial' ? 'N/A' : 'Card',
         paymentStatus: validPlanTier === 'Free Trial' ? 'Free' : 'Paid',
         vendorId: 'VL1',
         vendorName: 'Vorklee Inc.',
         orderStatus: 'Completed',
         planPurchaseDate: currentDate,
         planActivationDate: currentDate,
         planExpiryDate,
         autoRenewal: validPlanTier !== 'Free Trial',
         remarks: 'Nil',
       });

       if (!response.ok) {
         const errorText = await response.text();
         console.error(
           'Error response:',
           response.status,
           response.statusText,
           errorText,
         );
       } else {
         console.log('Purchase record created successfully');
       }
     } catch (error) {
       console.error('Network or server error:', error);
     }
   };

   createPurchaseRecord();
 }, [productName, planType, planTiers, quantity, session]);



  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">
          {planTiers === 'Free Trial'
            ? 'Registration Successful!'
            : 'Payment Successful!'}
        </h1>
        <p className="mb-6">
          {planTiers === 'Free Trial'
            ? 'Thank you for registering for the Free Plan.'
            : `Thank you for purchasing the ${capitalizeFirstLetter(planType)} Plan.`}
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
