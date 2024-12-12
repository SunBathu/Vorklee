// src/app/products/page.tsx

'use client';

import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleDownloadSysFile = () => {
    if (!session) {
      signIn('google');
    } else {
      // Replace with the actual download link for SysFile
      window.location.href = '/downloads/SysFileInstaller.exe';
    }
  };

  const handleGoToSettings = () => {
    if (!session) {
      signIn('google');
    } else {
      router.push('/screenshotsettings');
    }
  };return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center space-y-12">
      <h1 className="text-4xl font-bold mb-12">
        Vorklee Products and Pricing Plans
      </h1>

      {/* Screenshot Capture App - Plans */}
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center py-10 rounded-lg">
          <h2 className="text-3xl font-bold mb-2">Screenshot Capture App</h2>
          <p className="text-lg">
            A powerful tool to capture and manage your employees & kids
            computers screenshots effortlessly. Choose the best plan for your
            needs.
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
            {renderPlanCard(
              'Basic Plan',
              'basic',
              '$2',
              '$4',
              '$2',
              '$8',
              '$4',
              [
                '✅ Capture interval 5 minutes to 10 hours',
                '✅ Save up to 100 screenshots/day',
                '✅ Image quality Max:500 Kb',
                '✅ On/Off client notification',
                '✅ Remote On/Off capture',
                '✅ Folder date format',
                '❌ Save under nickname',
                '❌ Last captured time',
                '❌ Storage used info',
                '❌ Save as video',
                '❌ Video length N/A',
                '❌ 2 Step authentication',
                '❌ Email support',
              ],
            )}
            {renderPlanCard(
              'Standard Plan',
              'standard',
              '$4',
              '$8',
              '$4',
              '$16',
              '$8',
              [
                '✅ Capture interval 2 minutes to 10 hours',
                '✅ Save up to 300 screenshots/day',
                '✅ Image quality Max:1 Mb',
                '✅ On/Off client notification',
                '✅ Remote On/Off capture',
                '✅ Folder date format',
                '✅ Save under nickname',
                '✅ Last captured time',
                '✅ Storage used info',
                '❌ Save as video',
                '❌ Video length N/A',
                '❌ 2 Step authentication',
                '❌ Email support',
              ],
            )}
            {renderPlanCard(
              'Premium Plan',
              'premium',
              '$6',
              '$12',
              '$6',
              '$24',
              '$12',
              [
                '✅ Capture interval 1 second to 10 hours',
                '✅ Save up to 50000 screenshots/day',
                '✅ Image quality Max:5 Mb',
                '✅ On/Off client notification',
                '✅ Remote On/Off capture',
                '✅ Folder date format',
                '✅ Save under nickname',
                '✅ Last captured time',
                '✅ Storage used info',
                '✅ Save as video',
                '✅ Video length 2-20 sec',
                '✅ 2 Step authentication',
                '✅ Email support',
              ],
            )}
          </div>
        </div>

        {/* How to Use This Product */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">How to use this product</h3>
          <p className="text-gray-700">
            1. Login and download the app. (You can purchase it or use the free
            trial). <br />
            2. Install it on your employees' or kids' computers. <br />
            3. Enter your email during installation. <br />
            4. Go to that email and approve it. That's all. <br /> <br />
            This is a one-time installation. You don't need to do anything
            thereafter. <br />
            Screenshots will be sent automatically to your Google Drive
            hereafter. <br />
            Now, your employees' or kids' computer screenshots can be viewed in
            your Google Drive. <br />
            You will be provided with a settings page on this website, where you
            can manage the screenshot interval and other settings. <br /> <br />
            Supports: Desktops and Laptops <br />
            Supports: Windows and macOS
          </p>
        </div>

        {/* Buttons for Download and Settings */}
        <div className="mt-4 mb-4 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center">
          <button
            onClick={handleDownloadSysFile}
            className="text-2xl bg-blue-500 text-white px-24 py-6 rounded-full hover:bg-blue-600 transition shadow-lg"
          >
            Download SysFile (Screenshot App)
          </button>
          <button
            onClick={handleGoToSettings}
            className="text-2xl bg-green-500 text-white px-24 py-6 rounded-full hover:bg-green-600 transition shadow-lg"
          >
            Go to Screenshot Settings
          </button>
        </div>
      </div>
    </div>
  );
}

function renderPlanCard(
  title: string,
  planType: 'basic' | 'standard' | 'premium',
  priceAppCaptureDisplay: string,
  priceAppCaptureIndividualOld: string,
  priceAppCaptureIndividualNew: string,
  priceAppCaptureCompanyOld: string,
  priceAppCaptureCompanyNew: string,
  features: string[],
) {
  const gradientColors = {
    basic: 'from-purple-500 to-purple-300',
    standard: 'from-blue-500 to-blue-300',
    premium: 'from-pink-500 to-pink-300',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden text-center flex flex-col relative">
      {/* 50% Off Badge */}
      <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-br-lg z-10">
        50% Off. Limited Period Offer!
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
        <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center drop-shadow-2xl mx-auto">
          <p className="text-4xl font-bold text-gray-800">
            {priceAppCaptureDisplay}
          </p>
        </div>
      </div>

      {/* Features and Buttons */}
      <div className="px-6 pb-6 text-left">
        <ul className="space-y-4 text-gray-700 mb-6">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <div className="flex flex-col space-y-2">
          <button className="bg-gray-500 text-white py-2 rounded-full hover:bg-gray-600 transition">
            Free Trial $0
          </button>
          <button className="bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition">
            Buy for - Individual{' '}
            <span className="line-through mr-2">
              {priceAppCaptureIndividualOld}
            </span>{' '}
            {priceAppCaptureIndividualNew}
          </button>
          <button className="bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition">
            Buy for - Company{' '}
            <span className="line-through mr-2">
              {priceAppCaptureCompanyOld}
            </span>{' '}
            {priceAppCaptureCompanyNew}
          </button>
        </div>
        <p className="text-gray-500 mt-6 text-sm">
          All plans pricing are per month (billed annually).
        </p>
      </div>
    </div>
  );
}
