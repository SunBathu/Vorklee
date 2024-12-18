// site\src\app\payment\page.tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { productPricing } from '@/utils/pricing';
import * as constants from '@/utils/constants';
import { useMessage } from '@/context/MessageContext';
// import { constants as bufferConstants } from 'buffer';


interface FormData {
  agreement: boolean;
  quantity: number;
}

export default function PaymentPage() {
  const { message, options, showMessage } = useMessage();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const searchParams = useSearchParams();
  const appName = searchParams.get('appName') as keyof typeof productPricing;
  const planName = searchParams.get('planName') as keyof typeof productPricing[typeof appName];
  const planTiers = searchParams.get('planTiers') as keyof typeof productPricing[typeof appName][typeof planName];
  const router = useRouter();

  useEffect(() => {
    if (appName && planName && planTiers) {
      const price = (productPricing[appName]?.[planName]?.[planTiers] ?? 0) * constants.DISCOUNT_RATE;
      setUnitPrice(price);
      setTotalPrice(price);
    }
  }, [appName, planName, planTiers]);

const handleQuantityChange = (quantity: number) => {
  setTotalPrice(unitPrice * quantity);
};

const yearlyTotalPrice = totalPrice * 12;

  const onSubmit = async (data: FormData) => {
      if (appName === constants.APP_NOTES) {
         showMessage('The Notes App is currently unavailable for purchase. Please check back later.', {vanishTime: 0, blinkCount: 2, button: constants.MSG.BUTTON.OK, icon: 'important'})
         return;
      }
      router.push(
      `/success?appName=${appName}&planName=${planName}&planTiers=${planTiers}&quantity=${data.quantity}`,
    );
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-2xl text-center overflow-y-auto">
        <div className="space-y-2">
          <div className="text-4xl font-bold text-blue-600">{appName}</div>

          <div className="text-3xl font-bold text-blue-600">
            {planName} <span className="normal-case">Plan</span>
          </div>

          <div className="text-3xl font-bold text-blue-600 border-b-8 border-blue-400 pb-4">
            <span className="normal-case">[For</span> {planTiers}
            <span className="normal-case">]</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <label className="font-semibold">
                Number of computers for installation:
              </label>
              <Controller
                name="quantity"
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleQuantityChange(Number(e.target.value));
                    }}
                    className="border p-2 rounded w-24"
                  >
                    {[
                      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50,
                      100,
                    ].map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold">
                Unit Price (After Discount):
              </label>
              <span className="text-gray-700">${unitPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <label className="font-semibold">
                Total Price (After Discount):
              </label>
              <span className="text-gray-700">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="font-semibold">Yearly Total Price:</label>
              <span className="text-gray-700">
                ${yearlyTotalPrice.toFixed(2)}
              </span>
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('agreement', {
                  required: 'You must agree to the terms and conditions',
                })}
              />
              <span className="ml-2">
                I agree to the{' '}
                <a
                  href="/agreement.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  terms and conditions
                </a>
                <span> (MUST READ BEFORE USE)</span>
              </span>
            </label>
            {errors.agreement && (
              <p className="text-red-500">{errors.agreement.message}</p>
            )}

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition"
            >
              {planTiers === constants.TIER_TRIAL
                ? 'Start with Free Plan'
                : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
