'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

interface PurchaseRecord {
  purchaseId: string;
  apptName: string;
  appVersion: string;
  planName: string;
  planTiers: string;
  quantity: number;
  canUseInThisManyPC: number;
  unitPrice: number;
  totalPrice: number;
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

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/purchases');
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };

    fetchPurchases();
  }, []);

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
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
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
                <td className="p-3">${purchase.unitPrice}</td>
                <td className="p-3">${purchase.totalPrice}</td>
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
                <td
                  className={`p-3 ${
                    purchase.autoRenewal ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {purchase.autoRenewal ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
