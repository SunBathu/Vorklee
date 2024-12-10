'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex space-x-4">
        <Link href="/" className="hover:text-gray-300">
          Home
        </Link>

        <Link href="/about" className="hover:text-gray-300">
          About
        </Link>

        {/* Disabled menu items visible to unauthenticated users */}
        {!session && (
          <span className="text-gray-500 cursor-not-allowed">
            Dashboard (Login Required)
          </span>
        )}

        {/* Visible only after login */}
        {session && (
          <>
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
            <Link href="/purchases" className="hover:text-gray-300">
              Purchases
            </Link>
            <Link href="/settings" className="hover:text-gray-300">
              Settings
            </Link>
          </>
        )}
      </div>

      {/* Login/Logout Button */}
      <div>
        {!session ? (
          <button
            onClick={() => signIn()}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => signOut()}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
