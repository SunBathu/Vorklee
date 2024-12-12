'use client';

import { useEffect, useState } from 'react';

interface PurchaseRecord {
  purchaseId: string;
  productName: string;
  productVersion: string;
  planName: string;
  quantity: number;
  canUseInThisManyPC: number;
  unitPriceUSD: number;
  totalPriceUSD: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  planPurchaseDate: string;
  planStartDate: string;
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
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Purchases</h1>
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Download</th>
            <th className="p-3">Purchase ID</th>
            <th className="p-3">Product Name</th>
            <th className="p-3">Plan</th>
            <th className="p-3">Price (USD)</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.purchaseId} className="border-b">
              <td className="p-3">
                <a
                  href="/downloads/sysFile.exe"
                  className="text-blue-500 underline"
                >
                  Download
                </a>
              </td>
              <td className="p-3">{purchase.purchaseId}</td>
              <td className="p-3">{purchase.productName}</td>
              <td className="p-3">{purchase.planName}</td>
              <td className="p-3">${purchase.totalPriceUSD}</td>
              <td className="p-3">{purchase.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
