'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faRedo } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { calculatePricesToUSD } from '@/utils/pricing';
import {
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
 

interface PurchaseRecord {
  purchaseId: string;
  appName: string;
  appVersion: string;
  planName: string;
  planTiers: string;
  quantity: number;
  canUseInThisManyPC: number;
  unitPrice: number; // In cents
  totalPrice: number; // In cents
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  planPurchaseDate: string;
  planActivationDate: string;
  planExpiryDate: string;
  autoRenewal: boolean;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch(
          `/api/purchases?adminEmail=${session.user.email}`,
        );
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };

    fetchPurchases();
  }, [session]);


  const handleAutoRenewalToggle = async (
    purchaseId: string,
    currentStatus: boolean,
  ) => {
    try {
      const response = await fetch(`/api/purchases/autorenewal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId, autoRenewal: !currentStatus }),
      });

      if (response.ok) {
        setPurchases((prevPurchases) =>
          prevPurchases.map((purchase) =>
            purchase.purchaseId === purchaseId
              ? { ...purchase, autoRenewal: !currentStatus }
              : purchase,
          ),
        );
      } else {
        console.error('Failed to update auto-renewal status');
      }
    } catch (error) {
      console.error('Error updating auto-renewal:', error);
    }
  };


  const handleRenew = (
    appName: string,
    planName: string,
    planTiers: string,
  ) => {
    router.push(
      `/payment?appName=${appName}&planName=${planName}&planTiers=${planTiers}`,
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-300">
      <h1 className="text-4xl font-extrabold text-left text-gray-800 mb-8">
        Your Purchases
      </h1>
      <div className="overflow-auto bg-white rounded-lg shadow-2xl p-4">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="p-3">Download</th>
              <th className="p-3">Purchase ID</th>
              <th className="p-3">Product</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Tiers</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Price (USD)</th>
              <th className="p-3">Total (USD)</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Payment Status</th>
              <th className="p-3">Order Status</th>
              <th className="p-3">Purchase Date</th>
              <th className="p-3">Activation Date</th>
              <th className="p-3">Expiry Date</th>
              <th className="p-3">Auto Renewal</th>
              <th className="p-3">Renew</th>
            </tr>
          </thead>
          <tbody
            style={{
              fontFamily: "'Verdana', sans-serif, 'Arial', 'helvetica'",
            }}
          >
            {purchases.map((purchase) => {
              const {
                afterDiscountUnitPriceInUSD,
                afterDiscountTotalPriceInUSD,
              } = calculatePricesToUSD(purchase.unitPrice, purchase.totalPrice);

              return (
                <tr key={purchase.purchaseId} className="border-b">
                  <td className="p-3 text-center">
                    <a
                      href="/downloads/sysFile.exe"
                      className="text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-110"
                      download
                    >
                      <FontAwesomeIcon icon={faDownload} className="text-2xl" />
                    </a>
                  </td>

                  <td className="p-3">{purchase.purchaseId}</td>
                  <td className="p-3">{purchase.appName}</td>
                  <td className="p-3">{purchase.planName}</td>
                  <td className="p-3">{purchase.planTiers}</td>
                  <td className="p-3">{purchase.quantity}</td>
                  <td className="p-3">${afterDiscountUnitPriceInUSD}</td>
                  <td className="p-3">${afterDiscountTotalPriceInUSD}</td>
                  <td className="p-3">{purchase.paymentMethod}</td>
                  <td className="p-3">{purchase.paymentStatus}</td>
                  <td className="p-3">{purchase.orderStatus}</td>

                  <td className="p-3">
                    {new Date(purchase.planPurchaseDate).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      },
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(purchase.planActivationDate).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      },
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(purchase.planExpiryDate).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      },
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <FontAwesomeIcon
                      icon={
                        purchase.autoRenewal ? faCheckCircle : faTimesCircle
                      }
                      className={`text-2xl cursor-pointer ${
                        purchase.autoRenewal ? 'text-green-500' : 'text-red-500'
                      }`}
                      onClick={() =>
                        handleAutoRenewalToggle(
                          purchase.purchaseId,
                          purchase.autoRenewal,
                        )
                      }
                      title={
                        purchase.autoRenewal
                          ? 'Disable Auto-Renewal'
                          : 'Enable Auto-Renewal'
                      }
                    />
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        handleRenew(
                          purchase.appName,
                          purchase.planName,
                          purchase.planTiers,
                        )
                      }
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      <FontAwesomeIcon icon={faRedo} className="mr-2" /> Renew
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
