import Image from 'next/image';
import { useSession } from 'next-auth/react';

const ProfileHeader = () => {
  const { data: session } = useSession();

  return (
    <div className="p-4 bg-gray-800 text-gray-300 flex items-center space-x-4">
      <Image
        src={session?.user?.image || '/images/defaultProfile.png'}
        alt="User Profile"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div>
        <p className="text-sm">{session?.user?.email || 'Not signed in'}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
