'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { productPricing } from '@/utils/pricing';
import * as constants from '@/utils/constants';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const appName = searchParams.get('appName') || constants.APP_CAPTURE; // Default product
  const planName = searchParams.get('planName'); // e.g., 'basic', 'standard', 'premium'
  const planTiers = searchParams.get('planTiers'); // e.g., 'Free Trial', 'Individual', 'Company'
  const quantity = Number(searchParams.get('quantity')) || 1;
  const router = useRouter();
  const { data: session } = useSession();
  const hasCreatedRecord = useRef(false);

  useEffect(() => {
    const createPurchaseRecord = async () => {
      if (hasCreatedRecord.current) return;
      hasCreatedRecord.current = true;

      try {
        const purchaseId = `PUR-${Date.now()}`;
        const product = {
          id: appName === constants.APP_CAPTURE ? 1 : 2,
          name: appName,
          version: 1,
        };

        type PlanName = 'Basic' | 'Standard' | 'Premium';
        type PlanTier = 'Free Trial' | 'Individual' | 'Company';

        const validPlanType = (planName as PlanName) || constants.PLAN_BASIC;
        const validPlanTier = (planTiers as PlanTier) || constants.TIER_TRIAL;

        // Ensure safe access to productPricing
        const productPricingForProduct =
          productPricing[appName as keyof typeof productPricing];
        if (!productPricingForProduct) {
          console.error(`No pricing found for product: ${appName}`);
          return;
        }

        const unitPrice =
          productPricingForProduct[validPlanType]?.[validPlanTier] ?? 0;
        const totalPrice = unitPrice * quantity;

        const currentDate = new Date();
        const planExpiryDate = new Date(currentDate);
        if (validPlanTier === constants.TIER_TRIAL) {
          planExpiryDate.setDate(currentDate.getDate() + 3);
        } else {
          planExpiryDate.setFullYear(currentDate.getFullYear() + 1);
        }


        console.log('Data being sent to API:', {
          purchaseId,
          adminEmail: session?.user?.email || 'unknown@example.com',
          adminId: session?.user?.id || 'unknown',
          isAllowedUser: true,
          appId: product.id,
          appName: product.name,
          appVersion: product.version,
          planName: validPlanType,
          planTiers: validPlanTier,
          quantity,
          canUseInThisManyPC: quantity,
          unitPrice,
          totalPrice,
          currency: constants.CURRENCY_USD,
          paymentMethod:
            validPlanTier === constants.TIER_TRIAL ? 'N/A' : 'Card',
          paymentStatus:
            validPlanTier === constants.TIER_TRIAL
              ? 'Free'
              : constants.STATUS_PAID,
          vendorId: 'VL1',
          vendorName: 'Vorklee Inc.',
          orderStatus: constants.STATUS_COMPLETED,
          planPurchaseDate: new Date(),
          planActivationDate: new Date(),
          planExpiryDate,
          autoRenewal: validPlanTier !== constants.TIER_TRIAL,
          remarks: 'Nil',
        });

        
        const response = await fetch('/api/purchases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            purchaseId: purchaseId || 'UNKNOWN_ID',
            adminEmail: session?.user?.email || 'unknown@example.com',
            adminId: session?.user?.id || 'unknown',
            isAllowedUser: true,
            appId: product.id,
            appName: product.name,
            appVersion: product.version,
            planName: validPlanType,
            planTiers: validPlanTier,
            quantity: quantity || 1,
            canUseInThisManyPC: quantity || 1,
            unitPrice: unitPrice || 0,
            totalPrice: totalPrice || 0,
            currency: constants.CURRENCY_USD,
            paymentMethod:
              validPlanTier === constants.TIER_TRIAL ? 'N/A' : 'Card',
            paymentStatus:
              validPlanTier === constants.TIER_TRIAL
                ? 'Free'
                : constants.STATUS_PAID,
            vendorId: 'VL1',
            vendorName: 'Vorklee Inc.',
            orderStatus: constants.STATUS_COMPLETED,
            planPurchaseDate: new Date(),
            planActivationDate: new Date(),
            planExpiryDate: planExpiryDate,
            autoRenewal: validPlanTier !== constants.TIER_TRIAL,
            remarks: 'Nil',
          }),
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
  }, [appName, planName, planTiers, quantity, session]);

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">
          {planTiers === constants.TIER_TRIAL
            ? 'Registration Successful!'
            : 'Payment Successful!'}
        </h1>
        <p className="mb-6">
          {planTiers === constants.TIER_TRIAL
            ? 'Thank you for registering for the Free Plan.'
            : `Thank you for purchasing the ${planName} Plan.`}
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
