// src/components/Sidebar.tsx

import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed top-0 left-0">
      <h2 className="text-2xl font-bold p-4">Vorklee</h2>
      <nav className="flex flex-col p-4 space-y-2">
        <Link href="/" className="hover:bg-gray-700 p-2 rounded">
          Home
        </Link>
        <Link href="/dashboard" className="hover:bg-gray-700 p-2 rounded">
          Dashboard
        </Link>
        <Link
          href="/screenshotsettings" className="hover:bg-gray-700 p-2 rounded">
          Screenshot Settings
        </Link>
        <Link href="/products" className="hover:bg-gray-700 p-2 rounded">
          Products
        </Link>
        <Link href="/purchases" className="hover:bg-gray-700 p-2 rounded">
          Purchases
        </Link>
      </nav>
    </div>
  );
}
