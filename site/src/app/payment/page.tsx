'use client';

import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  mobile: string;
  country: string;
  accept_agreement: boolean;
}

export default function PaymentPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register('name', { required: 'Name is required' })}
        placeholder="Name"
        className="w-full p-2 border rounded"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <input
        {...register('mobile', { required: 'Mobile is required' })}
        placeholder="Mobile"
        className="w-full p-2 border rounded"
      />
      {errors.mobile && <p className="text-red-500">{errors.mobile.message}</p>}

      <input
        {...register('country', { required: 'Country is required' })}
        placeholder="Country"
        className="w-full p-2 border rounded"
      />
      {errors.country && (
        <p className="text-red-500">{errors.country.message}</p>
      )}

      <label className="flex items-center">
        <input
          type="checkbox"
          {...register('accept_agreement', {
            required: 'You must agree to the terms',
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
      {errors.accept_agreement && (
        <p className="text-red-500">{errors.accept_agreement.message}</p>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Submit
      </button>
    </form>
  );
}
