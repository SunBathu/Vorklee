'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FormData {
  agreement: boolean;
  quantity: number;
}

export default function PaymentPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const searchParams = useSearchParams();
  const planType = searchParams.get('plan'); // e.g., 'basic', 'standard', 'premium'
  const subPlanName = searchParams.get('subPlan'); // e.g., 'Free Trial', 'Individual', 'Company'
  const router = useRouter();

  // Pricing details based on sub-plan selection
  const priceMap: { [key: string]: number } = {
    'Free Trial': 0,
    Individual: planType === 'basic' ? 2 : planType === 'standard' ? 4 : 6,
    Company: planType === 'basic' ? 4 : planType === 'standard' ? 8 : 12,
  };

  useEffect(() => {
    const price = priceMap[subPlanName || 'Free Trial'];
    setUnitPrice(price);
    setTotalPrice(price); // Default quantity is 1
  }, [planType, subPlanName]);

  const handleQuantityChange = (quantity: number) => {
    setTotalPrice(unitPrice * quantity);
  };

  const onSubmit = async (data: FormData) => {
    router.push(
      `/success?plan=${planType}&subPlan=${subPlanName}&quantity=${data.quantity}`,
    );
  };
  return (
    <div className="flex items-center justify-center bg-white">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-2xl text-center overflow-y-auto">
        <div className="space-y-6">
          <div className="text-3xl font-bold text-blue-600">
            {subPlanName === 'Free Trial'
              ? `${planType?.toUpperCase()} Plan`
              : `Payment for ${planType?.toUpperCase()} Plan`}
          </div>
          <div className="text-3xl font-bold text-blue-600">{subPlanName}</div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="font-semibold">Unit Price:</label>
              <span className="text-gray-700">${unitPrice.toFixed(2)}</span>
            </div>

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
              <label className="font-semibold">Total Price:</label>
              <span className="text-gray-700">${totalPrice.toFixed(2)}</span>
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
              </span>
            </label>
            {errors.agreement && (
              <p className="text-red-500">{errors.agreement.message}</p>
            )}

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition"
            >
              {subPlanName === 'Free Trial'
                ? 'Start with Free Plan'
                : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
