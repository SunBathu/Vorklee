// src/app/products/page.tsx

import Image from 'next/image';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center space-y-12">
      <h1 className="text-4xl font-bold mb-12">
        Vorklee Products and Pricing Plans
      </h1>

      {/* Screenshot Capture App */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center py-10 rounded-lg">
          <h2 className="text-3xl font-bold mb-2">Screenshot Capture App</h2>
          <p className="text-lg">
            A powerful tool to capture and manage your kids & employees
            screenshots effortlessly. Choose the best plan for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-center">
          {/* Product Image */}
          <div className="md:col-span-1 flex justify-center">
            <Image
              src="/images/PgProductScreenshot.png"
              alt="Screenshot Capture App"
              width={200}
              height={200}
              className="rounded-lg shadow-md"
            />
          </div>
          {/* Plans */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {renderPlanCard('Basic Plan', 'basic', '$2', '$4', '$2')}
            {renderPlanCard('Standard Plan', 'standard', '$4', '$8', '$4')}
            {renderPlanCard('Premiem Plan', 'premiem', '$6', '$12', '$6')}
          </div>
        </div>
      </div>

      {/* Notes App */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center py-10 rounded-lg">
          <h2 className="text-3xl font-bold mb-2">Notes App</h2>
          <p className="text-lg">
            A powerful tool to manage your notes online. Choose the best plan for your needs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-center">
          {/* Product Image */}
          <div className="md:col-span-1 flex justify-center">
            <Image
              src="/images/PgProductNotes.png"
              alt="Notes App"
              width={200}
              height={200}
              className="rounded-lg shadow-md"
            />
          </div>
          {/* Plans */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {renderPlanCard('Basic Plan', 'basic', '$10', '$20', '$10')}
            {renderPlanCard('Standard Plan', 'standard', '$20', '$40', '$20')}
            {renderPlanCard('Premiem Plan', 'premiem', '$30', '$60', '$30')}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderPlanCard(
  title: string,
  planType: string,
  price: string,
  oldPrice: string,
  newPrice: string,
) {
  const gradientColors = {
    basic: 'from-purple-500 to-purple-300',
    standard: 'from-blue-500 to-blue-300',
    premiem: 'from-pink-500 to-pink-300',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden text-center flex flex-col relative">
      {/* 50% Off Badge */}
      <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-br-lg z-10">
        50% Off. Limited Period Offer
      </div>

      {/* Gradient Header */}
      <div
        className={`bg-gradient-to-r ${gradientColors[planType]} relative py-16`}
      >
        <h3 className="text-2xl font-bold text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
          {title}
        </h3>
      </div>

      {/* Price Badge */}
      <div className="relative mt-4 mb-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md mx-auto">
          <p className="text-4xl font-bold text-gray-800">{price}</p>
        </div>
      </div>

      {/* Features and Buttons */}
      <div className="px-6 pb-6 text-left">
        <ul className="space-y-4 text-gray-700 mb-6">
          <li>✅ Lorem ipsum dolor sit amet</li>
          <li>✅ Consectetur adipiscing elit</li>
          <li>✅ Eiusmod tincidunt ut</li>
          <li>✅ Ut wisi enim ad minim</li>
        </ul>
        <div className="flex flex-col space-y-2">
          <button className="bg-gray-500 text-white py-2 rounded-full hover:bg-gray-600 transition">
            Free Trial $0
          </button>
          <button className="bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition">
            Buy for - Individual{' '}
            <span className="line-through mr-2">{oldPrice}</span> {newPrice}
          </button>
          <button className="bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition">
            Buy for - Company <span className="line-through mr-2">$80</span> $40
          </button>
        </div>
        <p className="text-gray-500 mt-6 text-sm">
          All plans pricing are per month (billed annually).
        </p>
      </div>
    </div>
  );
}
