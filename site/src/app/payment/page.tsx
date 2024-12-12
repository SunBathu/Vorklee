'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  agreement: boolean;
}

export default function PaymentPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const planType = searchParams.get('plan');
  const subPlan = searchParams.get('subPlan');
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (subPlan === 'Free Trial') {
        /*alert('You have successfully registered for the Free Trial!');*/
        router.push('/success?plan=free');
      } else {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planType, subPlan }),
        });

        const result = await response.json();

        if (response.ok) {
          window.location.href = result.url;
        } else {
          alert('Error: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      {subPlan === 'Free Trial' ? (
        <h1 className="text-2xl font-bold mb-4">
          {planType?.toUpperCase()} Plan
        </h1>
      ) : (
        <h1 className="text-2xl font-bold mb-4">
          {planType?.toUpperCase()} Plan
        </h1>
      )}

      <h2 className="text-lg font-semibold mb-6">Selected Option: {subPlan}</h2>

      <p className="text-lg mb-4">
        {subPlan === 'Free Trial'
          ? 'You have selected the Free Trial. No payment is required.'
          : ``}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          disabled={loading}
        >
          {loading
            ? 'Processing...'
            : subPlan === 'Free Trial'
            ? 'Start with Free Plan'
            : 'Proceed to Payment'}
        </button>
      </form>
    </div>
  );
}