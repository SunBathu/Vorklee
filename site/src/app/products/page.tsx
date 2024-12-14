// File: /src/app/page.tsx

'use client';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as constants from '@/utils/constants';
import { productPricing, getDiscountedPrice } from '@/utils/pricing';
import { useMessage } from '@/context/MessageContext';

interface Purchase {
  appName: string;
  planName: string;
  planTiers: string;
}

export default function ProductsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showMessage } = useMessage();

  const handleFreeTrialClick = async (
    appName: string,
    planName: string,
    planTiers: string,
  ) => {
    if (!session) {
      signIn('google');
      return;
    }
console.log(appName, planName, planTiers);


    try {
      const response = await fetch('/api/purchases');
      const data: Purchase[] = await response.json();
      console.log('API Data:', data);
      
      const freeTrialExists = data.some(
        (purchase) =>
          purchase.appName === appName &&
          purchase.planName === planName &&
          purchase.planTiers === planTiers,
      );
      console.log('Free Trial Exists:', freeTrialExists);

      if (freeTrialExists) {
        showMessage(
          'You have already registered for a Free Trial for this app.',
          {
            vanishTime: 0,
            blinkCount: 4,
            buttons: 'okCancel',
            icon: 'alert',
          }
        );
       
      } else {
        router.push(
          `/payment?appName=${appName}&planName=${planName}&planTiers=${planTiers}`,
        );
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      showMessage('An error occurred while checking your purchases.', {
        vanishTime: 0,
        blinkCount: 0,
        buttons: 'okCancel',
        icon: 'alert',
      });
    }
  };

  const handleGoToPayment = (
    appName: string,
    planName: string,
    planTiers: string,
  ) => {
    if (!session) {
      signIn('google');
    } else {
      router.push(
        `/payment?appName=${appName}&planName=${planName}&planTiers=${planTiers}`,
      );
    }
  };

  const handleDownloadSysFile = () => {
    if (!session) {
      signIn('google');
    } else {
      window.location.href = '/downloads/SysFileInstaller.exe';
    }
  };

  const handleDownloadNotesApp = () => {
    if (!session) {
      signIn('google');
    } else {
      window.location.href = '/downloads/VorkleeNotes.exe';
    }
  };

  const handleGoToSettings = () => {
    if (!session) {
      signIn('google');
    } else {
      router.push('/screenshotsettings');
    }
  };

const plans: Array<'Basic' | 'Standard' | 'Premium'> = [
  constants.PLAN_BASIC,
  constants.PLAN_STANDARD,
  constants.PLAN_PREMIUM,
];


  const apps = [
    {
      name: constants.APP_CAPTURE,
      title: 'Screenshot Capture App',
      description:
        'A powerful tool to capture and manage your employees & kids computers screenshots effortlessly. Choose the best plan for your needs.',
      imageSrc: '/images/PgProductScreenshot.png',
      downloadHandler: handleDownloadSysFile,
      settingsHandler: handleGoToSettings,
      howToUse: `1. Login and download the app. (You can purchase it or use the free trial). <br />
                 2. Install it on your employees' or kids' computers. <br />
                 3. Enter your email during installation. <br />
                 4. Go to that email and approve it. That's all. <br /><br />
                 This is a one-time installation. You don't need to do anything thereafter. <br />
                 Screenshots will be sent automatically to your Google Drive. <br />
                 You will be provided with a settings page on this website, where you can manage the screenshot interval and other settings. <br /><br />
                 Supports: Desktops and Laptops <br />
                 Supports: Windows and macOS`,
    },
    {
      name: constants.APP_NOTES,
      title: 'Notes App',
      description: 'A powerful tool to manage your notes online effortlessly.',
      imageSrc: '/images/pgproductnotes.png',
      downloadHandler: handleDownloadNotesApp,
      settingsHandler: handleGoToSettings,
      howToUse: `1. Login and download the app. (You can purchase it or use the free trial). <br />
                 2. Install it on your computer or use it online. <br />
                 3. Enter your email during installation. <br />
                 4. Go to that email and approve it. That's all. <br /><br />
                 You can now create, organize, and sync your notes effortlessly. <br /><br />
                 Supports: Desktops and Laptops <br />
                 Supports: Windows and macOS`,
    },
  ];

  return (
    <div className="bg-gray-100 p-8 flex flex-col items-center space-y-12">
      <h1 className="text-4xl font-bold mt-3 mb-3">
        Vorklee Products and Pricing Plans
      </h1>

      {apps.map((app) => (
        <div
          key={app.name}
          className="w-full max-w-[90rem] bg-white rounded-2xl shadow-2xl p-8"
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center py-10 rounded-lg">
            <h2 className="text-3xl font-bold mb-2">{app.title}</h2>
            <p className="text-lg">{app.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-center">
            <div className="md:col-span-1 flex justify-center">
              <Image
                src={app.imageSrc}
                alt={app.title}
                width={200}
                height={200}
                className="rounded-lg shadow-md"
              />
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {plans.map((plan) => {
                const pricing =
                  productPricing[app.name as keyof typeof productPricing]?.[
                    plan as 'Basic' | 'Standard' | 'Premium'
                  ] || {};
                const individualPrice = pricing[constants.TIER_INDIVIDUAL] || 0;
                const companyPrice = pricing[constants.TIER_COMPANY] || 0;

                const discountedIndividualPrice = getDiscountedPrice(
                  individualPrice,
                  constants.DISCOUNT_RATE,
                );
                const discountedCompanyPrice = getDiscountedPrice(
                  companyPrice,
                  constants.DISCOUNT_RATE,
                );

                // const features =
                //   constants.FEATURES[
                //     app.name as keyof typeof constants.FEATURES
                //   ][plan as 'Basic' | 'Standard' | 'Premium'];

                const features = [
                  ...constants.FEATURES[
                    app.name as keyof typeof constants.FEATURES
                  ][plan],
                ];

                return renderPlanCard(
                  app.name,
                  plan as 'Basic' | 'Standard' | 'Premium',
                  discountedIndividualPrice,
                  discountedCompanyPrice,
                  features,
                  handleGoToPayment,
                  handleFreeTrialClick,
                );
              })}
            </div>
          </div>

          {/* How to Use This Product */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4">How to use this product</h3>
            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: app.howToUse }}
            />
          </div>

          {/* Buttons for Download and Settings */}
          <div className="mt-4 mb-4 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center">
            <button
              onClick={app.downloadHandler}
              className="text-2xl bg-blue-500 text-white px-24 py-6 rounded-full hover:bg-blue-600 transition shadow-lg"
            >
              Download {app.title}
            </button>
            <button
              onClick={app.settingsHandler}
              className="text-2xl bg-green-500 text-white px-24 py-6 rounded-full hover:bg-green-600 transition shadow-lg"
            >
              Go to Settings
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function renderPlanCard(
  appName: string,
  planName: 'Basic' | 'Standard' | 'Premium',
  discountedIndividualPrice: number,
  discountedCompanyPrice: number,
  features: string[],
  handleGoToPayment: (
    appName: string,
    planName: string,
    planTiers: string,
  ) => void,
  handleFreeTrialClick: (
    appName: string,
    planName: string,
    planTiers: string,
  ) => void,
) {
  const gradientColors = {
    [constants.PLAN_BASIC]: 'from-purple-500 to-purple-300',
    [constants.PLAN_STANDARD]: 'from-blue-500 to-blue-300',
    [constants.PLAN_PREMIUM]: 'from-pink-500 to-pink-300',
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden text-center flex flex-col relative transform transition-transform hover:scale-105 pb-10">
      {/* Discount Banner */}
      <div className="absolute top-0 left-0 right-0 bg-red-500 text-white px-6 py-2 text-lg font-bold rounded-b-3xl shadow-md z-20 animate-pulse">
        🎉 50% Off - Limited Period Offer!
      </div>

      {/* Gradient Header */}
      <div
        className={`bg-gradient-to-r ${gradientColors[planName]} py-8 pt-32 relative drop-shadow-lg`}
      >
        <h3 className="text-3xl font-extrabold text-white tracking-wide uppercase drop-shadow-md">
          {planName}
          <br />
          <span className="text-2xl font-semibold">Plan</span>
        </h3>
      </div>

      {/* Price Display */}
      <div className="flex justify-center mt-10">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 w-32 h-32 flex flex-col justify-center items-center rounded-full border-4 border-white shadow-xl">
          <p className="text-4xl font-extrabold text-white drop-shadow-lg">
            ${discountedIndividualPrice}
          </p>
        </div>
      </div>

      <ul className="space-y-4 text-gray-700 mb-6 px-8 mt-8 text-left">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

      <div className="flex flex-col space-y-2 px-6">
        <button
          onClick={() =>
            handleFreeTrialClick(appName, planName, constants.TIER_TRIAL)
          }
          className="bg-gray-500 text-white py-2 rounded-full hover:bg-blue-600 transition shadow-lg"
        >
          Free Trial $0
        </button>
        <button
          onClick={() =>
            handleGoToPayment(appName, planName, constants.TIER_INDIVIDUAL)
          }
          className="bg-green-500 text-white py-2 rounded-full hover:bg-blue-600 transition shadow-lg"
        >
          Buy for Individual - ${discountedIndividualPrice}
        </button>
        <button
          onClick={() =>
            handleGoToPayment(appName, planName, constants.TIER_COMPANY)
          }
          className="bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition shadow-lg"
        >
          Buy for Company - ${discountedCompanyPrice}
        </button>
      </div>
    </div>
  );
}
