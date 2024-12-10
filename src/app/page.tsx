import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-4xl font-bold mb-6">Welcome to Vorklee</h1>
        <p className="text-lg mb-4">
          Manage your settings and dashboard efficiently.
        </p>

        <div className="space-x-4">
          <Link href="/dashboard">
            <span className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer">
              Go to Dashboard
            </span>
          </Link>

          <Link href="/settings">
            <span className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 cursor-pointer">
              Manage Settings
            </span>
          </Link>
        </div>

        <div className="mt-6">
          <Image
            src="/welcome-image.jpg"
            alt="Welcome"
            width={500}
            height={300}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
