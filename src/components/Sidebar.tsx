'use client';

import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileHeader from '@/components/ProfileHeader';

export default function Sidebar() {
  const { data: session } = useSession();

  const handleProtectedClick = (e: React.MouseEvent, path: string) => {
    if (!session) {
      e.preventDefault();
      signIn('google');
    }
  };

  return (
    <div className="h-screen w-64 min-w-[200px] bg-gray-900 text-white flex flex-col justify-between">
      <div className="p-6 bg-gray-800">
        <div className="flex items-center text-2xl font-bold">
          <Image
            src="/images/VorkleeLogo.png"
            alt="Vorklee Logo"
            width={30}
            height={30}
            className="mr-2"
          />
          Vorklee
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6 bg-gray-900">
        <ul className="space-y-4">
          <li>
            <Link
              href="/dashboard"
              onClick={(e) => handleProtectedClick(e, '/dashboard')}
              className="text-lg block hover:text-blue-400 transition-colors cursor-pointer"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/screenshotsettings"
              onClick={(e) => handleProtectedClick(e, '/screenshotsettings')}
              className="text-lg block hover:text-blue-400 transition-colors cursor-pointer"
            >
              Screenshot settings
            </Link>
          </li>
          <li>
            <Link
              href="/notes"
              onClick={(e) => handleProtectedClick(e, '/notes')}
              className="text-lg block hover:text-blue-400 transition-colors cursor-pointer"
            >
              Notes
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className="text-lg block hover:text-blue-400 transition-colors cursor-pointer"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              href="/purchases"
              onClick={(e) => handleProtectedClick(e, '/purchases')}
              className="text-lg block hover:text-blue-400 transition-colors cursor-pointer"
            >
              Purchases
            </Link>
          </li>
        </ul>
      </nav>

      {/* Bottom Section with User Profile */}
      <div className="p-4 bg-gray-800">
        <ProfileHeader />
      </div>
    </div>
  );
}
